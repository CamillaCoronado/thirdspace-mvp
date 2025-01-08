<script lang="ts">
    export let isOpen: boolean = false;
    export let title: string = "Modal Title";
    export let content: string = "Modal Content";
    export let buttons: { label: string; class?: string; onClick: () => void }[] = [];
  </script>
  
  {#if isOpen}
    <div class="fixed z-[102] inset-0 flex items-center justify-center bg-purple-100 sm:bg-black sm:bg-opacity-50">
      <div class="bg-purple-100 pt-32 sm:pt-6 h-full text-center sm:h-auto rounded-lg sm:shadow-xl max-w-md p-6 relative">
        <button class="absolute w-6 h-6 top-[10px] right-[24px]"
        on:click={() => isOpen = false}>
            <div class="absolute w-6 h-1 bg-indigo my-1 transition-transform duration-300 rotate-45"></div>
            <div class="absolute w-6 h-1 bg-indigo my-1 transition-transform duration-300 -rotate-45"></div>
        </button>
        <h2 class="mb-2 text-lg font-semibold text-indigo">{title}</h2>
        <p class="mb-6 text-sm text-indigo inline-block">{content}</p>
        <div class="flex flex-col justify-end">
          {#each buttons as button}
            <button
              class={button.class || "bg-medium-indigo text-white px-5 py-5 mb-2 rounded hover:bg-indigo"}
              on:click={button.onClick}
            >
              {button.label}
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
  