<script lang="ts">
	import { onMount } from 'svelte';

	let count = 0;

	onMount(() => {
		count++;
	});
</script>

{count}