<script lang="ts">
    import LogoColor from '../../../components/LogoColor.svelte';
    import Button from '../../../components/Button.svelte';
    import BackNav from "../../../components/BackNav.svelte";
    import { currentPage } from '$lib/stores/pageStore';
    import { navigateTo } from '$lib/navigation';
    import TextInput from '../../../components/TextInput.svelte';
    
    let month = '';
    let day = '';
    let year = '';
    
    function handleNext() {
      if (month && day && year) {
        const inputDate = new Date(`${month} ${day}, ${year}`);
        const now = new Date();
        const minAge = 18; // typical minimum age requirement
        
        const lastValidDate = new Date(
          now.getFullYear() - minAge,
          now.getMonth(),
          now.getDate()
        );
        
        if (inputDate <= lastValidDate) {
          navigateTo('/next-page');
        } else {
          alert(`You must be at least ${minAge} years old to continue.`);
        }
      } else {
        alert('Please enter a valid date.');
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace' && key !== 'Delete') {
        event.preventDefault();
    }
}
    </script>
    
    <div class="flex flex-col mx-16 wide-letter">
      <div>
        <BackNav pageName={$currentPage}></BackNav>
        <LogoColor />
        <h1 class="text-center mb-16">When is your birthday?</h1>
        <div class="flex justify-between mb-8">
          <select 
            bind:value={month}
            class="mb-16 text-sm block w-full px-8 py-8 border border-medium-gray rounded-md focus:outline-indigo"
          >
            <option value="">Month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
          <div class="mx-8">
            <TextInput
            type="text"
            bind:value={day}
            placeholder="Day"
            on:keydown={handleKeyDown}
            maxLength={2}
          />
          </div>
          
          <TextInput
            type="text"
            bind:value={year}
            placeholder="Year"
            on:keydown={handleKeyDown}
            maxLength={4}
          />
        </div>
        <Button
          text="next"
          bgColor="bg-indigo"
          color="text-white"
          on:click={handleNext}
        />
      </div>
    </div>