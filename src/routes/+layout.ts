import { auth } from '$lib/utils/firebaseSetup';
import { user } from '$lib/stores/authStore';
import { onAuthStateChanged } from 'firebase/auth';
import type { LayoutLoad } from './$types';


export const load: LayoutLoad = async () => {
  return new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      user.set(currentUser);
      resolve();
      unsubscribe();
    });
  });
};