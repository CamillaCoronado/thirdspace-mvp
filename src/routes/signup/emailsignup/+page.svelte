<script lang="ts">
    import Button from '../../../components/Button.svelte';
    import TextInput from "../../../components/TextInput.svelte";
    import LogoColor from "../../../components/LogoColor.svelte";
    import BackNav from "../../../components/BackNav.svelte";
    import DatePicker from "../../../components/DatePicker.svelte";
    import { goto } from '$app/navigation';

    function navigateToSignup() {
        console.log("in function");
        goto('/signup/emaillogin');
    }
</script>

<div class="flex items-center justify-center mx-16">
    <div class="w-full bg-color-white">
        <BackNav></BackNav>
        <LogoColor/>
        <h1 class= "mb-16 text-center">Sign up</h1>
        <form class="flex flex-col">
            <TextInput
                name= "email"
                type="email"
                autocomplete="email"
                placeholder="Email"
                isRequired={true}>
            </TextInput>
            <DatePicker></DatePicker>
            <TextInput 
                name= "password"
                type="text"
                autocomplete="password"
                placeholder="password"
                isRequired={true}>
            </TextInput>
            <TextInput 
            name= "password verification"
            type="text"
            autocomplete="password"
            placeholder="retype password"
            isRequired={true}>
        </TextInput>
        <a href="/signup/emailsignup" on:click|preventDefault={navigateToSignup}>Already have an account? Log in</a>
        <div>
            <Button text="Create account" buttonType ="submit"></Button>
        </div>
        </form>
    </div>
</div>
