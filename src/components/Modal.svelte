<script lang="ts">
    export let isOpen: boolean = false;
    export let title: string = "Modal Title";
    export let content: string = "Modal Content";
    export let buttons: { label: string; class?: string; onClick: () => void }[] = [];
  </script>
  
  {#if isOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-purple-100 rounded-lg shadow-xl max-w-md p-6">
        <h2 class="text-lg font-semibold text-purple-800">{title}</h2>
        <p class="mt-2 text-sm text-purple-600">{content}</p>
        <div class="mt-4 flex justify-end space-x-3">
          {#each buttons as button}
            <button
              class={button.class || "bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"}
              on:click={button.onClick}
            >
              {button.label}
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
  