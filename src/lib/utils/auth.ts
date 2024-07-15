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

type AuthAction = 'CreateAccount' | 'SignIn';

const authAction = writable<AuthAction>('CreateAccount');
const authError = writable<string | null>(null);
const authLoading = writable<boolean>(false);

export function setAuthAction(action: AuthAction) {
  console.log('Setting auth action:', action);
  authAction.set(action);
}

export function initiateAuth(action: AuthAction) {
  console.log('Initiating auth:', action);
  authAction.set(action);
  authError.set(null);
  navigateTo('/signup');
}

export async function validateEmailAndPassword(email: string, password: string, action: AuthAction, auth: Auth): Promise<boolean> {
  console.log('Validating email and password');
  const isEmailValid = validateEmail(email);
  const isPasswordValid = await customValidatePassword(password, auth, action);
  return isEmailValid && isPasswordValid;
}

export async function handleEmailAuth(email: string, password: string) {
  const action = get(authAction);
  console.log('Handling email auth:', action);
  authLoading.set(true);
  authError.set(null);

  try {
    const isValid = await validateEmailAndPassword(email, password, action, auth);
    if (!isValid) {
      console.log('Validation failed');
      return; // Exit early if validation fails
    }

    if (action === 'SignIn') {
      console.log('Signing in');
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      console.log('Creating account');
      await createUserWithEmailAndPassword(auth, email, password);
    }

    console.log('Auth successful, navigating to Dashboard');
    navigateTo('Dashboard');
  } catch (error) {
    console.error('Auth error:', error);
    handleError(error);
  } finally {
    authLoading.set(false);
  }
}

export function getAuthAction(): AuthAction {
  return get(authAction);
}

export async function handleSocialLogin(platform: 'Facebook' | 'Google' | 'Apple') {
  console.log('Handling social login:', platform);
  authLoading.set(true);
  authError.set(null);

  try {
    await socialLogin(platform);
    console.log('Social login successful, navigating to Dashboard');
    navigateTo('Dashboard');
  } catch (error) {
    console.error('Social login error:', error);
    handleError(error);
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

function handleError(error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.log('Handling error:', errorMessage);
  authError.set(errorMessage);
  displayError([{ inputName: 'form', message: errorMessage }]);
}

export function getAuthError(): string | null {
  return get(authError);
}

export function isAuthLoading(): boolean {
  return get(authLoading);
}