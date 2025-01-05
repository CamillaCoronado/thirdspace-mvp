import { writable } from "svelte/store";
import { get } from "svelte/store";
import { setDoc, doc } from "firebase/firestore";
import { firestore } from "$lib/utils/firebaseSetup";

// Photo management store
export const photoStore = writable({
  tempPhotoUrl: "", // Temporary session photo
  verifiedPhotoUrl: "", // Permanent verified photo
});

// Utility functions
export const setTempPhotoUrl = async (userId: string, url: string): Promise<void> => {
    photoStore.update((state) => ({ ...state, tempPhotoUrl: url }));
    await setDoc(doc(firestore, "users", userId), { tempPhotoUrl: url }, { merge: true });
};
  
export const setVerifiedPhotoUrl = async (userId: string, url: string): Promise<void> => {
photoStore.update((state) => ({ ...state, verifiedPhotoUrl: url }));
await setDoc(doc(firestore, "users", userId), { verifiedPhotoUrl: url }, { merge: true });
};

export const resetPhotoUrls = () => {
  photoStore.set({ tempPhotoUrl: "", verifiedPhotoUrl: "" });
};

export const hasVerifiedPhoto = (): boolean => {
    const state = get(photoStore);
    return !!state?.verifiedPhotoUrl;
};

export const hasPhoto = (): boolean => {
    const state = get(photoStore);
    return !!state?.verifiedPhotoUrl || !!state?.tempPhotoUrl; 
};
