<script lang="ts">
    import LogoColor from '../../../components/LogoColor.svelte';
    import Button from '../../../components/Button.svelte';
    import BackNav from "../../../components/BackNav.svelte";
    import { currentPage } from '$lib/stores/pageStore';
    import { navigateTo } from '$lib/navigation';
    import TextInput from '../../../components/TextInput.svelte';
    import { doc, setDoc } from 'firebase/firestore';
    import { firestore } from '$lib/utils/firebaseSetup';
    import { auth } from '$lib/utils/firebaseSetup';
    
    let nickname = '';

  async function updateUserInfo(userId: string, data: { name?: string }) {
    const userRef = doc(firestore, 'users', userId);
    await setDoc(userRef, data, { merge: true });
  }
    
  async function handleNext() {
  if (!auth.currentUser) {
    console.error('No user found');
    return;
  }

  if (nickname.trim()) {
    try {
      await updateUserInfo(auth.currentUser.uid, { name: nickname.trim() });
      
      navigateTo('/allchat'); // finally go to chat since this is last step
    } catch (error) {
      console.error('Error saving name:', error);
      alert('Error saving name. Please try again.');
    }
  } else {
    alert('Please enter a nickname.');
  }
}
</script>

<div class="flex flex-col mx-16 wide-letter">
  <div>
    <BackNav pageName={$currentPage}></BackNav>
    <LogoColor />
    <h1 class="text-center mb-16">What should people call you?</h1>
    
    <div class="mb-8">
      <TextInput
        type="text"
        bind:value={nickname}
        placeholder="Nickname"
        maxLength={12}
      />
    </div>

    <Button
      text="next"
      bgColor="bg-indigo"
      color="text-white"
      on:click={handleNext}
    />
  </div>
</div>