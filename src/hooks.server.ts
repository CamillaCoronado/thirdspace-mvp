import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/utils/firebaseSetup';
import { navigationMap } from '$lib/navigationMap';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  const user = auth.currentUser;

  const protectedRoutes = ['Dashboard', 'Profile', 'Settings'];
  const currentPath = event.url.pathname;

  const isProtectedRoute = protectedRoutes.some(route => 
    currentPath.startsWith(navigationMap[route].path)
  );

  if (isProtectedRoute && !session && !user) {
    return Response.redirect(`${event.url.origin}${navigationMap['Signup'].path}`);
  }

  return resolve(event);
};