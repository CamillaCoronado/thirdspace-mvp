// core imports
import { get, writable } from 'svelte/store';
import { navigateTo } from '../navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { user } from '$lib/stores/authStore';
import { signInWithCredential } from 'firebase/auth';

// firebase auth imports
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider, 
  OAuthProvider
} from 'firebase/auth';

// local imports
import { auth, firestore } from '$lib/utils/firebaseSetup';
import {
  customValidatePassword,
  displayError,
  validateEmail,
  validateDateFields
} from '$lib/utils/form-utils';

// types
import type { Auth } from 'firebase/auth';

export const currentInputName = writable<string | null>(null);

type UserData = {
  zipcode?: string;
  name?: string;
  birthday?: string;
  createdAt?: string;
}

async function upsertUserDoc(userId: string, data: Partial<UserData>) {
  const userRef = doc(firestore, 'users', userId);
  const docSnap = await getDoc(userRef);
  const isNewUser = !docSnap.exists();
  
  const docData: UserData = {
    ...data,
    ...(isNewUser ? { createdAt: new Date().toISOString() } : {})
  };

  return setDoc(userRef, docData, { merge: !isNewUser });
}

async function checkMissingUserInfo(userId: string): Promise<string | null> {
  const userRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userRef);
  const data = userDoc.data() as UserData;

  // ordered by signup flow priority
  const checks: [keyof UserData, string][] = [
    ['zipcode', '/signup/zipcode'],
    ['birthday', '/signup/birthday'],
    ['name', '/signup/name']
  ];

  for (const [field, route] of checks) {
    if (!data?.[field]) return route;
  }
  
  return null;
}

type AuthAction = 'CreateAccount' | 'SignIn';

const authAction = writable<AuthAction>('CreateAccount');
const authError = writable<string | null>(null);
const authLoading = writable<boolean>(false);

export function setAuthAction(action: AuthAction) {
  authAction.set(action);
}

export function initiateAuth(action: AuthAction) {
  authAction.set(action);
  authError.set(null);
  navigateTo('/signup');
}

export async function validateEmailAndPassword(
  email: string,
  password: string,
  action: AuthAction,
  auth: Auth,
  passwordVerification?: string
): Promise<boolean> {
  const [isEmailValid, isPasswordValid] = await Promise.all([
    validateEmail(email),
    customValidatePassword(password, auth, action, passwordVerification)
  ])
  return isEmailValid && isPasswordValid
}

export async function handleEmailAuth(
  email: string,
  password: string,
  passwordVerification?: string,
  month?: string,
  day?: number,
  year?: number
) {
  const action = get(authAction);
  authLoading.set(true);
  authError.set(null);
  
  try {
    const isValid = await validateEmailAndPassword(
      email,
      password,
      action,
      auth,
      passwordVerification
    );
    if (!isValid) return;

    if (action === 'CreateAccount') {
      if (!month || !day || !year) {
        const errorMessage = 'Missing birthday information';
        console.error(errorMessage);
        handleError(new Error(errorMessage), 'birthday');
        return;
      }

      const success = await createAccountWithEmail(email, password, month, day, year);
      
      if (success) {
        if (!auth.currentUser) {
          throw new Error('No user found after account creation');
        }

        const nextPage = await checkMissingUserInfo(auth.currentUser.uid);
        navigateTo(nextPage || 'AllChat');
      }
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      if (!auth.currentUser) {
        throw new Error('No user found after signin');
      }
    }
  } catch (error: unknown) {
    console.error('Auth error:', error);
    const inputName: string = get(currentInputName) || 'unknown';
    if (error instanceof Error) {
      handleError(error, inputName);
    } else {
      handleError(new Error('An unknown error occurred'), inputName);
    }
  } finally {
    authLoading.set(false);
  }
}

export function getAuthAction(): AuthAction {
  return get(authAction);
}

export async function handleSocialLogin(
  platform: 'Facebook' | 'Google' | 'Apple'
) {
  authLoading.set(true);
  authError.set(null);

  try {
    const providers = {
      Google: new GoogleAuthProvider(),
      Facebook: new FacebookAuthProvider(),
      Apple: new OAuthProvider('apple.com'),
    };

    const provider = providers[platform];
    
    try {
      // Try popup first
      await signInWithPopup(auth, provider);
    } catch (popupError) {
      console.log("Popup failed, falling back to redirect:", popupError);
      // If popup fails, fallback to redirect
      const result = await getRedirectResult(auth);
      if (result?.user) {
        const nextPage = await checkMissingUserInfo(result.user.uid);
        navigateTo(nextPage || 'AllChat');
        return;
      }
      await signInWithRedirect(auth, provider);
      return;
    }

    // If popup succeeded, handle navigation
    if (!auth.currentUser) {
      console.error('No user found after social login');
      return;
    }
    await createAccountWithSocial();
    const nextPage = await checkMissingUserInfo(auth.currentUser.uid);
    navigateTo(nextPage || 'AllChat');
  } catch (error: unknown) {
    const inputName: string = get(currentInputName) || 'unknown';
    console.error('Social login error:', error);
    if (error instanceof Error) {
      handleError(error, inputName);
    } else {
      handleError(new Error('An unknown error occurred'), inputName);
    }
  } finally {
    authLoading.set(false);
  }
}

export function handleError(error: Error, inputName: string): void {
  const errorMessage = error ? error.message : String(error);
  authError.set(errorMessage);
  displayError([{ inputName, message: errorMessage }]);
}

export function getAuthError(): string | null {
  return get(authError);
}

export function isAuthLoading(): boolean {
  return get(authLoading);
}

async function waitForAuthState() {
  return new Promise<void>((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      unsubscribe();
      resolve();
    });

    setTimeout(() => {
      unsubscribe();
      reject(new Error('Auth state timeout'));
    }, 3000);
  });
}

async function createAccountWithSocial() {
  try {
    if (!auth.currentUser) {
      console.error('No authenticated user found');
      return false;
    }

    await waitForAuthState();

    // Upsert user document in Firestore
    await upsertUserDoc(auth.currentUser.uid, {});

    return true;
  } catch (error) {
    console.error('Error during account creation process:', error);
    return false;
  }
}


async function createAccountWithEmail(
  email: string,
  password: string,
  month: string,
  day: number,
  year: number
) {
  try {
    // Validate date if provided
    if (month && day && year) {
      const isDateValid = validateDateFields(month, day, year);
      if (!isDateValid) {
        console.error('Invalid date fields provided:', { month, day, year });
        return false;
      }
    }

    // Create user with email and password
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    // Wait for auth state to settle
    await waitForAuthState();

    // Optional: birthday field
    const birthday = month && day && year ? `${year}-${month}-${day}` : null;

    // Upsert user document in Firestore
    await upsertUserDoc(userCred.user.uid, { birthday: birthday || undefined });

    return true;
  } catch (error) {
    console.error('Error during account creation process:', error);
    return false;
  }
}



export async function handleSignOut() {
  try {
    authLoading.set(true);
    await signOut(auth);
    user.set(null);
    navigateTo('Home');
  } catch (error) {
    console.error('Error signing out:', error);
  } finally {
    authLoading.set(false);
  }
}
