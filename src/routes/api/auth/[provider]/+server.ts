import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminAuth } from '$lib/server/firebase-admin';
import { handleAuthError } from '$lib/utils/auth';

export const POST: RequestHandler = async ({ request, params }) => {
  const { idToken } = await request.json();
  const { provider } = params;

  try {
    let firebaseToken;

    if (provider === 'google') {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      firebaseToken = await adminAuth.createCustomToken(decodedToken.uid);
    } else if (provider === 'apple') {
      // Apple's ID token can be used directly with Firebase
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      firebaseToken = await adminAuth.createCustomToken(decodedToken.uid);
    } else {
      throw error(400, 'Invalid provider');
    }

    return json({ firebaseToken });
  } catch (err) {
    console.error('Error verifying ID token:', err);
    const errorResponse = handleAuthError(err, provider);
    return new Response(JSON.stringify(errorResponse), {
        status: errorResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
  }
};