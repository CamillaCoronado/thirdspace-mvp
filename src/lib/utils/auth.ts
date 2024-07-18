import { get, writable } from 'svelte/store';
import { navigateTo } from '../navigation';
import {  
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider 
} from 'firebase/auth';
import { auth } from '$lib/utils/firebaseSetup';
import { customValidatePassword, displayError, validateEmail } from './form-utils';
import type { Auth } from 'firebase/auth';
import { validateDateFields } from '$lib/utils/form-utils';

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

export async function validateEmailAndPassword(email: string, password: string, action: AuthAction, auth: Auth): Promise<boolean> {
  console.log("validating email and password");
  const isEmailValid = validateEmail(email);
  const isPasswordValid = await customValidatePassword(password, auth, action);
  console.log();
  return isEmailValid && isPasswordValid;
}

export async function handleEmailAuth(email: string, password: string, month?: string, day?: number, year?: number) {
  console.log("handling email auth");
  const action = get(authAction);
  authLoading.set(true);
  authError.set(null);

  try {
    const isValid = await validateEmailAndPassword(email, password, action, auth);
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
        handleError(inputName, errorMessage);
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

export async function handleSocialLogin(platform: 'Facebook' | 'Google' | 'Apple') {
  authLoading.set(true);
  authError.set(null);

  try {
    await socialLogin(platform);
    navigateTo('Dashboard');
  } catch (error: any) {
    console.error('Social login error:', error);
    handleError(error, inputName);
  } finally {
    authLoading.set(false);
  }
}

async function socialLogin(platform: 'Facebook' | 'Google' | 'Apple'): Promise<void> {
  const providers = {
    'Google': new GoogleAuthProvider(),
    'Facebook': new FacebookAuthProvider(),
    'Apple': new OAuthProvider('apple.com')
  };
  
  const provider = providers[platform];
  await signInWithPopup(auth, provider);
}

export function handleError(error: Error, inputName: string): void {
  console.log("handling error: " + error);
  const errorMessage = error ? error.message : String(error);
  console.log("error message: " + error.message);  
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