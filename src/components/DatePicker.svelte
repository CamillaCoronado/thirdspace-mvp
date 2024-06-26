<script lang="ts">
    // Calculate the default date
    const today = new Date();
    const defaultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  
    let month = defaultDate.toLocaleString('default', { month: 'long' });
    let day = defaultDate.getDate();
    let year = defaultDate.getFullYear();
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
</script>
   
<style>
  input, select, label {
    @apply border-medium-gray border py-8 rounded text-left text-sm;
  }
</style>

  <div class="flex mb-16 text-medium-gray">
    <div class="flex flex-col items-left">
      <label for="month">Month</label>
      <select id="month" bind:value={month} class="border-medium-gray border p-8 rounded text-left">
        {#each months as m}
          <option value={m}>{m}</option>
        {/each}
      </select>
    </div>
    <div class="flex flex-col items-left mx-8">
      <label for="day">Day</label>
      <input type="number" id="day" min="1" max="31" bind:value={day} class="border-medium-gray border rounded p-8 text-left" />
    </div>
    <div class="flex flex-col items-left">
      <label for="year">Year</label>
      <input type="number" id="year" bind:value={year} class="border-medium-gray border rounded p-8 text-left" />
    </div>
  </div>
  