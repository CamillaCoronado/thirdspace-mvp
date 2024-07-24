<script>
  import '../app.css';
  import { currentPage } from '$lib/stores/pageStore';
  import { page } from '$app/stores';
  import { onMount, tick } from 'svelte';
  import { authLoading, user } from '$lib/stores/authStore';
  import { navigateBasedOnAuth, disableBackNavigation } from '$lib/navigation';
  import { afterNavigate } from '$app/navigation';

  $: $currentPage = $page.url.pathname.split('/').pop() || 'Home';

  let isReady = false;

  onMount(async () => {
    console.log('onMount: Initial authLoading:', $authLoading);
    await tick(); // Wait for the next DOM update
    const unsubscribe = user.subscribe(async ($user) => {
      console.log('User state changed:', $user ? 'logged in' : 'logged out');
      if (!$authLoading) {
        console.log('Auth state determined, navigating');
        await navigateBasedOnAuth();
        await tick(); // Wait for the navigation to complete
        isReady = true;
      }
    });

    return unsubscribe;
  });

  afterNavigate(async () => {
    console.log('afterNavigate: authLoading:', $authLoading, 'isReady:', isReady);
    if (isReady) {
      console.log('Navigating based on auth after route change');
      await navigateBasedOnAuth();
    }
  });

  $: if ($page.url.pathname === '/dashboard' && !$authLoading && $user) {
    console.log('Disabling back navigation on dashboard');
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