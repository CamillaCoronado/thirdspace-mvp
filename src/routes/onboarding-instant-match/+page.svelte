<script lang="ts">
    import Button from "../../components/Button.svelte"
    import BackNav from "../../components/BackNav.svelte";
    import { currentPage } from "$lib/stores/pageStore";
    import { navigate } from "$lib/navigation";

    function handleContinue() {
        navigate('OnboardingMatch', 'forward');
    }
</script>

<div class="flex flex-col items-center bg-medium-green p-6 onboarding">
    <BackNav pageName={$currentPage}></BackNav>
    <h1 class="text-white text-2xl font-bold mt-4 mb-32">Instant Match</h1>

    <div class="mb-32">
        <img 
        src="../src/assets/instant-match-icon.png" 
        alt="quiz-icon"
        class= "w-140 h-170"/>
    </div>

    <p class="text-white mb-32 text-lg">
        After your quiz, get matched immediately for today or tomorrow - no scheduling needed. Your adventure is just a tap away!
    </p>
    <Button on:click={handleContinue} text="Next: Meetup" bgColor="bg-color-white" borderColor="border-color-white" color="text-dark-yellow"/>
</div>
