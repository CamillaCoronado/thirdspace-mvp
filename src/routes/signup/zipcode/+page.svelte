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
  
    let zipcode: string = '';
    let cityName: string | undefined = undefined;
  
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

    $: if (zipcode.length === 5) {
      lookupCity(zipcode).then(city => cityName = city || undefined);
    }

    async function updateUserInfo(userId: string, data: { zipcode?: string, city?: string }) {
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
      await updateUserInfo(auth.currentUser.uid, { zipcode, city: cityName });
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

export async function lookupCity(zipcode: string): Promise<string | null> {
  const API_KEY = import.meta.env.VITE_POSITIONSTACK_API_KEY;
  
  try {
    const response = await fetch(
      `http://api.positionstack.com/v1/forward?` + 
      `access_key=${API_KEY}&` +
      `query=${zipcode}&` +
      `country=US`
    );
    
    if (!response.ok) {
      throw new Error('Lookup failed');
    }

    const data = await response.json();
    console.log('Raw API response:', data); // for testing
    
    if (!data.data?.[0]) {
      return null;
    }

    return data.data[0].locality || null;
    
  } catch (error) {
    console.error('City lookup error:', error);
    return null;
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
        bind:value={zipcode}
        on:input={handleInput}
        on:keydown={handleKeyDown}
        placeholder="Zipcode"
        maxLength= {5}
      ></TextInput>
      {#if zipcode.length === 5}
        {#if cityName}
          <div class="text-sm mt-2">
            {cityName}
          </div>
        {:else}
          <div class="text-sm mt-2">
            Looking up location...
          </div>
        {/if}
      {/if}
    </div>
    <Button
      text="Next"
      bgColor="bg-indigo"
      color="text-white"
      on:click={handleNext}
    />
  </div>
</div>