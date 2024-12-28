<script lang="ts">
    import LogoColor from '../../../components/LogoColor.svelte';
    import Button from '../../../components/Button.svelte';
    import BackNav from "../../../components/BackNav.svelte";
    import { currentPage } from '$lib/stores/pageStore';
    import { navigateTo } from '$lib/navigation';
    import TextInput from '../../../components/TextInput.svelte';
    import { auth } from '$lib/utils/firebaseSetup';
    import { firestore } from '$lib/utils/firebaseSetup';
    import { doc, getDoc, setDoc } from 'firebase/firestore';
  
    let zipcode = '';
  
    function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace' && key !== 'Delete') {
        event.preventDefault();
    }
  }
  
    function handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      zipcode = target.value.replace(/\D/g, '');  // Keep only digits
    }

    async function updateUserInfo(userId: string, data: { zipcode?: string }) {
      const userRef = doc(firestore, 'users', userId);
      await setDoc(userRef, data, { merge: true });
  }
  
    async function handleNext() {
  if (!auth.currentUser) {
    console.error('No user found');
    return;
  }

  if (zipcode.length === 5) {
    try {
      await updateUserInfo(auth.currentUser.uid, { zipcode });
      // Check if they came from email signup (already have birthday)
      const userRef = doc(firestore, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      if (userData?.birthday) {
        navigateTo('/signup/name');
      } else {
        navigateTo('/signup/birthday');
      }
    } catch (error) {
      console.error('Error saving zipcode:', error);
      alert('Error saving zipcode. Please try again.');
    }
  } else {
    alert('Please enter a valid 5-digit zipcode.');
  }
}
</script>
<div class="flex flex-col mx-16 wide-letter">
  <div>
    <BackNav pageName={$currentPage}></BackNav>
    <LogoColor />
    <h1 class="text-center mb-16">Enter your zipcode</h1>
    <div class="mb-8">
      <TextInput
        type="text"
        value={zipcode}
        on:input={handleInput}
        on:keydown={handleKeyDown}
        placeholder="Zipcode"
      ></TextInput>
    </div>
    <Button
      text="Next"
      bgColor="bg-indigo"
      color="text-white"
      on:click={handleNext}
    />
  </div>
</div>