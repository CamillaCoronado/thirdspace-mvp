<script lang="ts">
  import LogoColor from '../../components/LogoColor.svelte';
  import Button from '../../components/Button.svelte';
  import BackNav from "../../components/BackNav.svelte";
  import { currentPage } from '$lib/stores/pageStore';

  import {
    handleSocialLogin,
    handleEmailAuth
  } from '../../lib//utils/auth';

</script>

<style>
  .btn-apple span {
    line-height: 1rem;
  }
</style>

<div class="flex flex-col mx-16">
  <div>
    <BackNav pageName={$currentPage}></BackNav>
    <LogoColor/>
    <h1 class="text-center mb-16">Join a chat!</h1>
    <Button text="Facebook" bgColor="bg-dark-blue" on:click={() => handleSocialLogin('Facebook')}></Button>
    <Button text="Google" bgColor="bg-dark-cobalt" on:click={() => handleSocialLogin('Google')}></Button>
    <button class="btn btn-apple border border-dark-charcoal text-dark-charcoal flex items-center justify-center" 
    on:click={() => handleSocialLogin('Apple')}>
      <span class="mr-2 text-2xl"></span> Continue with Apple
    </button>
    <Button text="Email" bgColor="bg-dark-charcoal" on:click={handleEmailAuth}></Button>
  </div>
</div>