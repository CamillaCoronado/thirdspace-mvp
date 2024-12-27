<script lang="ts">
    import Button from "../../components/Button.svelte";
    import { navigate } from "$lib/navigation";

    function handleContinue() {
        navigate('Onboarding', 'forward');
    }
</script>

<div class="flex flex-col items-center bg-medium-green p-6 onboarding">
    <h1 class="text-white text-2xl font-bold mt-4 mb-32">Discover through Play</h1>

    <div class="mb-32">
        <img 
        src="../src/assets/quiz-icon.png" 
        alt="quiz-icon"
        class= "w-140 h-170"/>
    </div>

    <p class="text-white mb-32 text-lg">
        Begin with a fun quiz to tell us what you like. Each choice helps us find the best people for you, focusing on just common enough interests to spark genuine connections.
    </p>
    <Button on:click={handleContinue} text="Next: Connect" bgColor="bg-color-white" borderColor="border-color-white" color="text-dark-yellow"/>
</div>
