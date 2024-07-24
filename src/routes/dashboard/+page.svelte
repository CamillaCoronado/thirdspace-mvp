<script>
    import Button from '../../components/Button.svelte';
    import { handleSignOut } from '$lib/utils/auth';
</script>

<h1>dashboard</h1>
<Button text="sign out" on:click={() => handleSignOut()} ></Button>