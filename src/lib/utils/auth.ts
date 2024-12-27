import { get, writable } from 'svelte/store';
import { navigateTo } from '../navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { auth } from '$lib/utils/firebaseSetup';
import {
  customValidatePassword,
  displayError,
  validateEmail,
} from './form-utils';
import type { Auth } from 'firebase/auth';
import { validateDateFields } from '$lib/utils/form-utils';
import { signOut } from 'firebase/auth';
import { user } from '$lib/stores/authStore';

export const currentInputName = writable<string | null>(null);

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
  const isEmailValid = validateEmail(email);
  const isPasswordValid = await customValidatePassword(
    password,
    auth,
    action,
    passwordVerification
  );
  return isEmailValid && isPasswordValid;
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
    if (!isValid) {
      return; // Exit early if validation fails
    }

    let success = false;
    if (action === 'SignIn') {
      await signInWithEmailAndPassword(auth, email, password);
      success = true;
    } else {
      const missingFields = [];
      if (!month) missingFields.push('month');
      if (!day) missingFields.push('day');
      if (!year) missingFields.push('year');

      if (missingFields.length > 0) {
        const missingFieldsStr = missingFields.join(', ');
        const errorMessage = `Missing date information: ${missingFieldsStr}`;
        console.error(errorMessage);
        const inputName = get(currentInputName) || missingFields[0];
        handleError(new Error(errorMessage), inputName);
        return;
      }

      success = await createAccount(
        email,
        password,
        month ?? '',
        day ?? 1,
        year ?? new Date().getFullYear()
      );
    }

    if (success) {
      if (action === 'SignIn') {
        navigateTo('Dashboard');
      } else {
        navigateTo('Onboarding');
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
    await socialLogin(platform);
    navigateTo('Dashboard');
  } catch (error: unknown) {
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

async function socialLogin(
  platform: 'Facebook' | 'Google' | 'Apple'
): Promise<void> {
  const providers = {
    Google: new GoogleAuthProvider(),
    Facebook: new FacebookAuthProvider(),
    Apple: new OAuthProvider('apple.com'),
  };

  const provider = providers[platform];
  await signInWithPopup(auth, provider);
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

async function createAccount(
  email: string,
  password: string,
  month: string,
  day: number,
  year: number
) {
  const isDateValid = validateDateFields(month, day, year);
  if (!isDateValid) {
    return false;
  }

  await createUserWithEmailAndPassword(auth, email, password);
  // Here you might want to store the date of birth information in your user profile
  // For example: await updateUserProfile(auth.currentUser, { dateOfBirth: `${year}-${month}-${day}` });
  return true;
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
