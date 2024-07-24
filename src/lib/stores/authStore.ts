import { writable } from 'svelte/store';
import { auth } from '$lib/utils/firebaseSetup';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

export const user = writable<User | null>(null);
export const authLoading = writable(true);

onAuthStateChanged(auth, (currentUser: User | null) => {
  user.set(currentUser);
  authLoading.set(false);
});