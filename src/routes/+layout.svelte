<script>
  import '../app.css';
  import { currentPage } from '$lib/stores/pageStore';
  import { page } from '$app/stores';

$: $currentPage = $page.url.pathname.split('/').pop() || 'Home';
</script>

<main>
    <slot></slot>
</main>