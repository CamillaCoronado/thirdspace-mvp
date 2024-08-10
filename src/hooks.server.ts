import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/utils/firebaseSetup';
import { navigationMap } from '$lib/navigationMap';
import { isPublicOnlyRoute, isProtectedRoute } from '$lib/utils/routeConfig';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  const user = auth.currentUser;
  const currentPath = event.url.pathname;

  if (isProtectedRoute(currentPath) && !session && !user) {
    return Response.redirect(
      `${event.url.origin}${navigationMap['Signup'].path}`,
      302
    );
  }

  if (isPublicOnlyRoute(currentPath) && (session || user)) {
    return Response.redirect(
      `${event.url.origin}${navigationMap['Dashboard'].path}`,
      302
    );
  }

  return resolve(event);
};
