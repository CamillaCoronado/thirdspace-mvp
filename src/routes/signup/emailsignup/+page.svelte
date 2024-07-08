<script lang="ts">
    import Button from '../../../components/Button.svelte';
    import TextInput from "../../../components/TextInput.svelte";
    import LogoColor from "../../../components/LogoColor.svelte";
    import BackNav from "../../../components/BackNav.svelte";
    import DatePicker from "../../../components/DatePicker.svelte";
    import { currentPage } from '$lib/stores/pageStore';
    import { navigateTo } from '../../../lib/navigation';
</script>

<div class="flex items-center justify-center mx-16">
    <div class="w-full bg-color-white">
        <BackNav pageName={$currentPage}></BackNav>
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
        <a href="/signup/emailsignup" on:click|preventDefault={() => navigateTo('EmailSignup')}>Already have an account? Log in</a>
        <div>
            <Button text="Create account" buttonType ="submit"></Button>
        </div>
        </form>
    </div>
</div>
