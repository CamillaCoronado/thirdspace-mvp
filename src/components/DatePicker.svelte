<script lang="ts">
  import { months } from "../lib/utils/dateUtils"
  import { validateDateFields } from "$lib/utils/form-utils";
  import { clearErrors } from "$lib/utils/form-utils";
  import { handleError } from "$lib/utils/auth";

    // Calculate the default date
    const today = new Date();
    const defaultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  
    let month = defaultDate.toLocaleString('default', { month: 'long' });
    let day = defaultDate.getDate();
    let year = defaultDate.getFullYear();

  function handleDateChange(event: Event) {
    if (event.target instanceof HTMLSelectElement) {
      month = event.target.value;
    }
    try {
      const result = validateDateFields(month, +day, +year);
      if (!result.isValid) {
        const errorMessage = result.errors.map(err => err.message).join('; ');
        throw new Error(errorMessage);
      } else {
        clearErrors(['date']);
      }
    } catch (error: any) {
      console.error("Date validation error:", error);
      handleError(error, "date");
    }
}
  
</script>
   
<style lang="postcss">
  input, select, label {
    @apply border-medium-gray border py-8 px-4 rounded text-left text-sm;
  }
</style>

<div class="flex flex-wrap max-w-100% mb-16 text-medium-gray">
  <div class="flex flex-1 flex-col">
    <label for="month">Month</label>
    <select 
      on:input={handleDateChange}
      id="month"
      bind:value={month}
      data-input-name="date">
      {#each months as m}
        <option value={m}>{m}</option>
      {/each}
    </select>
  </div>
  <div class="flex flex-0.5 px-8 flex-col">
    <label for="day">Day</label>
    <input 
      on:change={handleDateChange} 
      type="number" id="day" 
      data-input-name="date" 
      min="1" 
      max="31" 
      bind:value={day}/>
  </div>
  <div class="flex flex-1 flex-col">
    <label for="year">Year</label>
    <input 
      on:change={handleDateChange}
      type="number" id="year"
      data-input-name="date"
      bind:value={year} />
  </div>
</div>
<div class="error-message" data-error-for="date"></div>
  