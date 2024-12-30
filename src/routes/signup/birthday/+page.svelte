<script lang="ts">
    import LogoColor from '../../../components/LogoColor.svelte';
    import Button from '../../../components/Button.svelte';
    import BackNav from "../../../components/BackNav.svelte";
    import { currentPage } from '$lib/stores/pageStore';
    import { navigateTo } from '$lib/navigation';
    import DatePicker from '../../../components/DatePicker.svelte';
    import { doc, setDoc } from 'firebase/firestore';
    import { firestore } from '$lib/utils/firebaseSetup';
    import { auth } from '$lib/utils/firebaseSetup';
    
    let month: string;
    let day: number;
    let year: number;

    async function updateUserInfo(userId: string, data: { birthday?: string }) {
  const userRef = doc(firestore, 'users', userId);
  await setDoc(userRef, data, { merge: true });
}

async function handleNext() {
  if (!auth.currentUser) {
    console.error('No user found');
    return;
  }

  if (month && day && year) {
    try {
      await updateUserInfo(auth.currentUser.uid, {
        birthday: `${year}-${month}-${day}`
      });
      navigateTo('/signup/name');
    } catch (error) {
      console.error('Error saving birthday:', error);
      alert('Error saving birthday. Please try again.');
    }
  } else {
    alert('Please enter a valid birthday.');
  }
}
</script>
    
    <div class="flex flex-col mx-16 wide-letter">
      <div>
        <BackNav pageName={$currentPage}></BackNav>
        <LogoColor />
        <h1 class="text-center mb-16">When is your birthday?</h1>
        <DatePicker bind:month bind:day bind:year />
        <Button
          text="next"
          bgColor="bg-indigo"
          color="text-white"
          on:click={handleNext}
        />
      </div>
    </div>