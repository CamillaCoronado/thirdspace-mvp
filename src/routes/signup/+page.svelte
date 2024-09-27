<!--  src/routes/signup/+page.svelte -->

<script lang="ts">
  import { onMount } from 'svelte';
  import LogoColor from '../../components/LogoColor.svelte';
  import Button from '../../components/Button.svelte';
  import BackNav from "../../components/BackNav.svelte";
  import { currentPage } from '$lib/stores/pageStore';
  import { signInWithApple, signInWithGoogle, signInWithFacebook, handleRedirectResult } from '../../lib/utils/auth';
  import { navigateToAuthPage } from '../../lib/navigation';

  onMount(async () => {
    console.log("onMount triggered");
    await handleRedirectResult();
  });
</script>

<style>
  .btn-apple span {
    line-height: 1rem;
  }
</style>

<div class="flex flex-col mx-16">
  <div>
    <BackNav pageName={$currentPage}></BackNav>
    <LogoColor />
    <h1 class="text-center mb-16">Join a chat!</h1>
    <Button text="Facebook" bgColor="bg-dark-blue" on:click={() => signInWithFacebook()}></Button>
    <Button text="Google" bgColor="bg-dark-cobalt" on:click={() => signInWithGoogle()}></Button>
    <button class="btn btn-apple border border-dark-charcoal text-dark-charcoal flex items-center justify-center" 
    on:click={() => signInWithApple()}>
      <span class="mr-2 text-2xl"></span> Continue with Apple
    </button>
    <Button text="Email" bgColor="bg-dark-charcoal" on:click={navigateToAuthPage}></Button>
  </div>
</div>
