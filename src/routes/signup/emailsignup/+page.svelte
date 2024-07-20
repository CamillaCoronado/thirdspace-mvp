<script lang="ts">
    import Button from '../../../components/Button.svelte';
    import TextInput from "../../../components/TextInput.svelte";
    import LogoColor from "../../../components/LogoColor.svelte";
    import BackNav from "../../../components/BackNav.svelte";
    import { currentPage } from '$lib/stores/pageStore';
    import { navigateTo } from '../../../lib/navigation';
    import { onMount } from 'svelte';
    import { setAuthAction,
             handleEmailAuth
     } from '$lib/utils/auth';
     import DatePicker from '../../../components/DatePicker.svelte';

    let email = '';
    let password = '';
    let passwordVerification = '';
    let month: string;
    let day: number;
    let year: number;

    onMount(() => {
        setAuthAction('CreateAccount');
    });

    function handleSubmit() {
        handleEmailAuth(email, password, passwordVerification, month, day, year);
    }
</script>

<div class="flex items-center justify-center mx-16">
    <div class="w-full bg-color-white">
        <BackNav pageName={$currentPage}></BackNav>
        <LogoColor/>
        <h1 class= "mb-16 text-center">Sign up</h1>
        <form on:submit|preventDefault={handleSubmit} class="flex flex-col">
            <TextInput
                name= "email"
                dataInputName= "email"
                type="email"
                autocomplete="email"
                placeholder="Email"
                bind:value={email}
                isRequired={true}>
            </TextInput>
            <DatePicker
                bind:month={month}
                bind:day={day}
                bind:year={year}>
            </DatePicker>
            <TextInput 
                name= "password"
                dataInputName= "password"
                type="password"
                autocomplete="password"
                placeholder="password"
                bind:value={password}
                isRequired={true}>
            </TextInput>
            <TextInput 
                name= "passwordVerification"
                dataInputName= "password-verification"
                type="password"
                autocomplete="password"
                placeholder="retype password"
                bind:value={passwordVerification}
                isRequired={true}>
        </TextInput>
        <a href="/signup/emaillogin" on:click|preventDefault={() => navigateTo('EmailLogin')}>Already have an account? Log in</a>
        <div>
            <Button text="Create account" buttonType ="submit"></Button>
        </div>
        </form>
    </div>
</div>
