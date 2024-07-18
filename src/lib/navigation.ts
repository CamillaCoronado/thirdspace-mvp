// navigation.ts
import { goto } from '$app/navigation';
import { navigationMap } from './navigationMap';
import { getAuthAction } from './utils/auth';

export function navigateTo(pageOrPath: string) {
  const path = navigationMap[pageOrPath]?.path || pageOrPath;
  goto(path);
}

export function navigate(currentPage: string, direction: 'back' | 'forward') {
  const lowercasePage = currentPage.toLowerCase();
  
  const matchingKey = Object.keys(navigationMap)
    .find(key => key.toLowerCase() === lowercasePage);
  
  const targetPage = matchingKey ? navigationMap[matchingKey][direction] : undefined;
  
  if (targetPage) {
    navigateTo(targetPage);
  } else {
    console.warn(`No ${direction} navigation defined for ${currentPage}. Staying on current page.`);
  }
}

export function navigateToAuthPage() {
  const action = getAuthAction();
  
  if (action === 'SignIn') {
    navigateTo('EmailLogin');
  } else {
    navigateTo('EmailSignup');
  }
}