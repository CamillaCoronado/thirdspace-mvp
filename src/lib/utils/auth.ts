import { get, writable } from 'svelte/store';
import { page } from '$app/stores';
import { navigateTo } from '../navigation';

export const authAction = writable<'CreateAccount' | 'SignIn'>('CreateAccount');

export function initiateAuth(action: 'CreateAccount' | 'SignIn') {
  authAction.set(action);
  navigateTo('Signup');
}

export function handleEmailAuth() {
  const action = get(authAction);
  const targetPage = action === 'SignIn' ? 'EmailLogin' : 'EmailSignup';
  navigateTo(targetPage);
}

export function getAuthAction(): 'CreateAccount' | 'SignIn' {
  const pathname = get(page).url.pathname;
  if (pathname.includes('emailsignup')) {
    return 'CreateAccount';
  } else if (pathname.includes('emaillogin')) {
    return 'SignIn';
  } else {
    // Default to the current authAction if not on a specific auth page
    return get(authAction);
  }
}

export function isCreateAccount(): boolean {
  return getAuthAction() === 'CreateAccount';
}

// Mock social login functions
export function handleSocialLogin(platform: 'Facebook' | 'Google' | 'Apple') {
  const mockUsernames = {
    Facebook: 'facebookUser',
    Google: 'googleUser',
    Apple: 'appleUser',
  };

  return { status: 'success', user: { username: mockUsernames[platform] } };
}