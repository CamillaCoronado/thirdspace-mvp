<script lang="ts">
    import Button from '../../../components/Button.svelte';
    import TextInput from "../../../components/TextInput.svelte";
    import LogoColor from "../../../components/LogoColor.svelte";
    import BackNav from "../../../components/BackNav.svelte";
    import { goto } from '$app/navigation';
    import { currentPage } from '$lib/stores/pageStore';


    function navigateToSignin() {
        goto('/signup/emailsignup');
    }
</script>

<div class="flex items-center justify-center">
    <div class="w-full bg-color-white mx-16">
        <BackNav pageName={$currentPage}></BackNav>
        <LogoColor/>
        <h1 class= "mb-16 text-center">Email log in</h1>
        <form>
            <TextInput 
                name= "name"
                type="text"
                autocomplete="name"
                placeholder="Name"
                isRequired={true}>
            </TextInput>
            <TextInput
                name= "email"
                type="email"
                autocomplete="email"
                placeholder="Email"
                isRequired={true}>
            </TextInput>
            <div class="w-full flex justify-between">
                <a href="#">Forgot password?</a>
                <a href="/signup/emaillogin" on:click|preventDefault={navigateToSignin}>Create account</a>
            </div>
            <div>
                <Button text="Log in" buttonType ="submit"></Button>
            </div>
        </form>
    </div>
</div>
