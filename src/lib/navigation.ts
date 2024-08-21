// navigation.ts
import { goto } from '$app/navigation';
import { navigationMap } from './navigationMap';
import { getAuthAction } from './utils/auth';
import { get } from 'svelte/store';
import { user } from '$lib/stores/authStore';
import { browser } from '$app/environment';
import { pushState } from '$app/navigation';
import { authLoading } from '$lib/stores/authStore';
import { isPublicOnlyRoute } from './utils/routeConfig';
import { isProtectedRoute } from './utils/routeConfig';

let isNavigating = false;

export async function navigateTo(
  pageOrPath: string,
  options: { replace?: boolean } = {}
) {
  if (isNavigating) return;
  isNavigating = true;
  const path = navigationMap[pageOrPath]?.path || pageOrPath;
  await goto(path, { replaceState: options.replace });
  isNavigating = false;
}

export async function navigate(
  currentPage: string,
  direction: 'back' | 'forward'
) {
  console.log("current page: " + currentPage);
  console.log("direction: " + direction);
  const lowercasePage = currentPage.toLowerCase();
  console.log(lowercasePage);

  const matchingKey = Object.keys(navigationMap).find(
    (key) => key.toLowerCase() === lowercasePage
  );

  const targetPage = matchingKey
    ? navigationMap[matchingKey][direction]
    : undefined;

  if (targetPage) {
    await navigateTo(targetPage);
  } else {
    console.warn(
      `No ${direction} navigation defined for ${currentPage}. Staying on current page.`
    );
  }
}

export async function navigateToAuthPage() {
  const action = getAuthAction();

  if (action === 'SignIn') {
    await navigateTo('EmailLogin', { replace: true });
  } else {
    await navigateTo('EmailSignup', { replace: true });
  }
}

export async function navigateBasedOnAuth() {
  if (get(authLoading)) return;

  const currentUser = get(user);
  const currentPath = window.location.pathname;

  if (currentUser && isPublicOnlyRoute(currentPath)) {
    return goto(navigationMap['Dashboard'].path, { replaceState: true });
  } else if (!currentUser && isProtectedRoute(currentPath)) {
    return goto(navigationMap['Signup'].path, { replaceState: true });
  }
}

export function disableBackNavigation() {
  if (browser) {
    pushState('', '');
    window.addEventListener('popstate', () => {
      pushState('', '');
    });
  }
}
