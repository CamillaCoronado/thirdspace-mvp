<script lang="ts">
    import Button from "../../components/Button.svelte"
    import BackNav from "../../components/BackNav.svelte";
    import { currentPage } from "$lib/stores/pageStore";
    import { navigate } from "$lib/navigation";

    function handleContinue() {
        navigate('OnboardingMeet', 'forward');
    }
</script>

<div class="flex flex-col items-center bg-medium-green p-6 onboarding">
    <BackNav pageName={$currentPage}></BackNav>
    <h1 class="text-white text-2xl font-bold mt-4 mb-32">Meet and Share</h1>

    <div class="mb-32">
        <img 
        src="../src/assets/share-meet-icon.png" 
        alt="share-meet-icon"
        class= "w-140 h-170"/>
    </div>

    <p class="text-white mb-32 text-lg">
        Meet your new connections in secure, public places to ensure safety. After your meetup, your feedback is used to enhance and improve future experiences.
    </p>
    <Button on:click={handleContinue} text="Start your journey" bgColor="bg-color-white" borderColor="border-color-white" color="text-dark-yellow"/>
</div>
