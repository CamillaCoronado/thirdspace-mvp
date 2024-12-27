<script lang="ts">
    import LogoColor from '../../../components/LogoColor.svelte';
    import Button from '../../../components/Button.svelte';
    import BackNav from "../../../components/BackNav.svelte";
    import { currentPage } from '$lib/stores/pageStore';
    import { navigateTo } from '$lib/navigation';
  
    let zipcode = '';
  
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;
      // Allow only numeric characters (0-9) and backspace
      if (!/^\d$/.test(key) && key !== 'Backspace' && key !== 'Delete') {
        event.preventDefault();
      }
    }
  
    function handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      zipcode = target.value.replace(/\D/g, '');  // Keep only digits
    }
  
    function handleNext() {
      if (zipcode.length === 5) {
        navigateTo('/next-page');
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
    <div class="flex justify-center mb-8">
      <input
        type="text"
        value={zipcode}
        on:input={handleInput}
        on:keydown={handleKeyDown}
        placeholder="Zipcode"
        class="border border-gray-300 rounded-full px-4 py-2 w-full max-w-xs focus:outline-indigo"
      />
    </div>
    <Button
      text="Next"
      bgColor="bg-indigo"
      color="white"
      on:click={handleNext}
    />
  </div>
</div>
