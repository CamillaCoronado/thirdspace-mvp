<script lang="ts">
 import { navigate } from '../lib/navigation';

  export let pageName: string;

  function handleClick() {
    navigate(pageName, 'back');
  }
</script>

<button on:click={handleClick} class="inline-block absolute top-[70px] left-[16px]">
    <img 
    src="../src/assets/back-nav.png" 
    alt="back-nav"
    class= "w-28 h-28"/>
</button>