// auth.ts

import { get, writable } from 'svelte/store';
import { navigateTo } from '../navigation';
import {  
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect, 
  GoogleAuthProvider,  
  OAuthProvider,
  FacebookAuthProvider,
  getRedirectResult,
  getAuth,
  signOut
} from 'firebase/auth';
import type { AuthProvider } from 'firebase/auth';
import { auth } from '$lib/utils/firebaseSetup';
import { customValidatePassword, displayError, validateEmail } from './form-utils';
import type { Auth } from 'firebase/auth';
import { validateDateFields } from '$lib/utils/form-utils';
import { user } from '$lib/stores/authStore';
import type { ErrorItem } from '$lib/utils/form-utils';

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

export async function validateEmailAndPassword(email: string, password: string, action: AuthAction, auth: Auth, passwordVerification?: string): Promise<boolean> {
  const isEmailValid = validateEmail(email);
  const isPasswordValid = await customValidatePassword(password, auth, action, passwordVerification);
  return isEmailValid && isPasswordValid;
}

export async function handleEmailAuth(email: string, password: string, passwordVerification?: string, month?: string, day?: number, year?: number) {
  const action = get(authAction);
  authLoading.set(true);
  authError.set(null);
  try {
    const isValid = await validateEmailAndPassword(email, password, action, auth, passwordVerification);
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
      navigateTo('Dashboard');
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    const inputName: string = get(currentInputName) || 'unknown';
    handleError(error, inputName);
  } finally {
    authLoading.set(false);
  }
}

export function getAuthAction(): AuthAction {
  return get(authAction);
}

// Function to check if the device is mobile
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

// Function to handle sign-in with a provider, choosing between popup or redirect
async function signInWithProvider(provider: AuthProvider) {
  try {
    if (isMobileDevice()) {
      // Use redirect for mobile devices
      await signInWithRedirect(auth, provider);
    } else {
      // Use popup for desktop
      const result = await signInWithPopup(auth, provider);

      // Check if the provider is a GoogleAuthProvider
      if (provider instanceof GoogleAuthProvider) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log('Google Access Token:', token);
      } 
      // Check if the provider is an OAuthProvider (like Apple)
      else if (provider instanceof OAuthProvider) {
        const credential = OAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log('OAuth Access Token:', token);
      }

      const userInfo = result.user;
      console.log('User signed in:', userInfo);
    }
  } catch (error: any) {
    console.error("Error during sign-in:", error);
    handleAuthError(error, provider.providerId);
  }
}


// Separate function to handle the redirect result
export async function handleRedirectResult() {
  try {
    console.log("Attempting to get redirect result...");
    const result = await getRedirectResult(auth);
    
    if (result) {
      console.log("Redirect result received:", result);
      
      // Get the ID token of the user
      const idToken = await result.user.getIdToken();
      console.log("User ID Token:", idToken);
      
      let providerName: string;
      
      // Determine the provider that was used for the sign-in
      if (result.providerId === GoogleAuthProvider.PROVIDER_ID) {
        providerName = 'google';
        console.log("Provider: Google");
      } else if (result.providerId === 'apple.com') {
        providerName = 'apple';
        console.log("Provider: Apple");
      } else {
        throw new Error('Unsupported provider');
      }

      // Send the token to your backend server
      const response = await fetch(`/api/auth/${providerName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with server');
      }
      
      console.log("Authentication with server successful");

      // Handle successful authentication
      return result.user;
    } else {
      // No redirect result, user hasn't completed sign-in yet
      console.log("No redirect result found");
    }
  } catch (error) {
    console.error("Error handling redirect result:", error);
    throw error;
  }
}


// Usage examples:
export function signInWithGoogle() {
  const googleProvider = new GoogleAuthProvider();
  signInWithProvider(googleProvider);
}

export function signInWithApple() {
  const appleProvider = new OAuthProvider('apple.com');
  signInWithProvider(appleProvider);
}

// Add this function to handle Facebook sign-in
export function signInWithFacebook() {
  const facebookProvider = new FacebookAuthProvider();
  signInWithProvider(facebookProvider); // Uses popup or redirect based on device
}



export function handleAuthError(error: any, platform?: string): { status: number, message: string } {
  const errorMessages: { [key: string]: string } = {
    'auth/popup-closed-by-user': 'Oops! It looks like the sign-in window closed too soon. Please try signing in again.',
    'auth/cancelled-popup-request': 'We can only open one sign-in window at a time. Please close any other sign-in windows and try again.',
    'auth/operation-not-allowed': `We're sorry, but signing in with ${platform} isn't available right now. Please try a different sign-in method or contact support for assistance.`,
    'auth/account-exists-with-different-credential': 'An account with this email address already exists. Please try signing in with the method you used when you first created your account.'
  };

  const message = errorMessages[error.code] || 'An error occurred during sign-in. Please try again.';
  
  console.error(`Social login error with ${platform}:`, error);

  // Determine appropriate status code
  let status = 400; // Default to Bad Request
  if (error.code === 'auth/operation-not-allowed') {
    status = 403; // Forbidden
  } else if (error.code === 'auth/account-exists-with-different-credential') {
    status = 409; // Conflict
  }

  // Display the error to the user
  displayError([{ inputName: 'auth', message: message }]);

  return { status, message };
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

async function createAccount(email: string, password: string, month: string, day: number, year: number) {
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