<script lang="ts">
    import LogoColor from '../../../components/LogoColor.svelte';
    import Button from '../../../components/Button.svelte';
    import BackNav from "../../../components/BackNav.svelte";
    import { currentPage } from '$lib/stores/pageStore';
    import { navigateTo } from '$lib/navigation';
    import TextInput from '../../../components/TextInput.svelte';
    
    let nickname = '';
    
    function handleNext() {
      if (nickname.trim()) {
        navigateTo('/birthday');
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