import { get, writable } from 'svelte/store';
import { page } from '$app/stores';
import { navigateTo } from '../navigation';

const authAction = writable<'CreateAccount' | 'SignIn'>('CreateAccount');

export function initiateAuth(action: 'CreateAccount' | 'SignIn') {
  authAction.set(action);
  navigateTo('/signup');
}

export function handleEmailAuth() {
  const action = get(authAction);
  const targetPage = action === 'SignIn' ? '/signup/emaillogin' : '/signup/emailsignup';
  navigateTo(targetPage);
}

export function getAuthAction(): 'CreateAccount' | 'SignIn' {
  return (get(page).url.searchParams.get('action') as 'CreateAccount' | 'SignIn') || 'CreateAccount';
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
