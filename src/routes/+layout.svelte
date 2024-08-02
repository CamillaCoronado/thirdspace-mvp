<script lang=ts>
  import '../app.css';
  import { currentPage } from '$lib/stores/pageStore';
  import { page } from '$app/stores';
  import { onMount, tick } from 'svelte';
  import { authLoading, user } from '$lib/stores/authStore';
  import { navigateBasedOnAuth, disableBackNavigation } from '$lib/navigation';
  import { afterNavigate } from '$app/navigation';
  import { handleRedirectResult } from '$lib/utils/auth';

  $: $currentPage = $page.url.pathname.split('/').pop() || 'Home';

  let isReady = false;

  onMount(() => {
  // Handle redirect result immediately
  handleRedirectResult().then((redirectUser) => {
    if (redirectUser) {
      user.set(redirectUser);
    }
  }).catch((error) => {
    console.error('Error handling redirect:', error);
  });

  // Set up user subscription
  const unsubscribe = user.subscribe(async ($user) => {
    await tick(); // Wait for the next DOM update
    if (!$authLoading) {
      await navigateBasedOnAuth();
      await tick(); // Wait for the navigation to complete
      isReady = true;
    }
  });

  return unsubscribe;
});

  afterNavigate(async () => {
    if (isReady) {
      await navigateBasedOnAuth();
    }
  });

  $: if ($page.url.pathname === '/dashboard' && !$authLoading && $user) {
    disableBackNavigation();
  }
</script>

{#if isReady}
  <main>
    <slot></slot>
  </main>
{:else}
  <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background-color: white;">
    Loading...
  </div>
{/if}