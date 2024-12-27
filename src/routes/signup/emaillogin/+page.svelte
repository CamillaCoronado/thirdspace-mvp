<script lang="ts">
  import Button from '../../../components/Button.svelte';
  import TextInput from '../../../components/TextInput.svelte';
  import LogoColor from '../../../components/LogoColor.svelte';
  import BackNav from '../../../components/BackNav.svelte';
  import { currentPage } from '$lib/stores/pageStore';
  import { navigateTo } from '../../../lib/navigation';
  import { handleEmailAuth } from '$lib/utils/auth';
  import { onMount } from 'svelte';
  import { setAuthAction } from '$lib/utils/auth';

  let email = '';
  let password = '';

  onMount(() => {
    setAuthAction('SignIn');
  });

  function handleSubmit() {
    handleEmailAuth(email, password);
  }
</script>

<div class="flex items-center justify-center">
  <div class="w-full bg-color-white mx-16">
    <BackNav pageName={$currentPage}></BackNav>
    <LogoColor />
    <h1 class="mb-16 text-center">Email log in</h1>
    <form on:submit|preventDefault={handleSubmit}>
      <TextInput
        name="email"
        type="email"
        autocomplete="email"
        placeholder="Email"
        bind:value={email}
        isRequired={true}
      ></TextInput>
      <TextInput
        name="password"
        type="password"
        autocomplete="password"
        placeholder="Password"
        bind:value={password}
        isRequired={true}
      ></TextInput>
      <div class="w-full flex justify-between">
        <a href="">Forgot password?</a>
        <a
          href="/signup/emailsignup"
          on:click|preventDefault={() => navigateTo('EmailSignup')}
          >Create account</a
        >
      </div>
      <div>
        <Button text="Log in" buttonType="submit"></Button>
      </div>
    </form>
  </div>
</div>
