import { get, writable } from 'svelte/store';
import { page } from '$app/stores';
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

const authAction = writable<'CreateAccount' | 'SignIn'>('CreateAccount');
const authError = writable<string | null>(null);
const authLoading = writable<boolean>(false);

interface SocialLoginResult {
  status: 'success' | 'failure';
  user?: {
    username: string;
    email: string;
  };
}

export function initiateAuth(action: 'CreateAccount' | 'SignIn') {
  authAction.set(action);
  authError.set(null);
  navigateTo('/signup');
}

export async function handleEmailAuth(email: string, password: string) {
  const action = get(authAction);
  authLoading.set(true);
  authError.set(null);

  try {
    if (action === 'SignIn') {
      await signInWithEmail(email, password);
    } else {
      await createAccountWithEmail(email, password);
    }
    navigateTo('/dashboard');
  } catch (error: unknown) {
    authError.set(error instanceof Error ? error.message : String(error));
  } finally {
    authLoading.set(false);
  }
}

async function signInWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

async function createAccountWithEmail(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(auth, email, password);
}

export function getAuthAction(): 'CreateAccount' | 'SignIn' {
  return (get(page).url.searchParams.get('action') as 'CreateAccount' | 'SignIn') || 'CreateAccount';
}

export function isCreateAccount(): boolean {
  return getAuthAction() === 'CreateAccount';
}

export async function handleSocialLogin(platform: 'Facebook' | 'Google' | 'Apple') {
  authLoading.set(true);
  authError.set(null);

  try {
    const result = await socialLogin(platform);
    console.log("Success: " + result);
    if (result.status === 'success') {
      navigateTo('Dashboard');
    } else {
      throw new Error(`${platform} login failed`);
    }
  } catch (error) {
    authError.set(error instanceof Error ? error.message : String(error));
  } finally {
    authLoading.set(false);
  }
}

async function socialLogin(platform: 'Facebook' | 'Google' | 'Apple'): Promise<SocialLoginResult> {
  let provider;
  switch (platform) {
    case 'Google':
      provider = new GoogleAuthProvider();
      break;
    case 'Facebook':
      provider = new FacebookAuthProvider();
      break;
    case 'Apple':
      provider = new OAuthProvider('apple.com');
      break;
  }

  try {
    const result = await signInWithPopup(auth, provider);
    return {
      status: 'success',
      user: {
        username: result.user.displayName || '',
        email: result.user.email || '',
      }
    };
  } catch (error) {
    console.error("Error during social login:", error);
    return { status: 'failure' };
  }
}

export function getAuthError(): string | null {
  return get(authError);
}

export function isAuthLoading(): boolean {
  return get(authLoading);
}


