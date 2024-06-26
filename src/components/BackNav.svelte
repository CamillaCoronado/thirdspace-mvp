<script lang="ts">
    import { browser } from '$app/environment';
    
    function goBack() {
      if (browser) {
        window.history.back();
      }
    }
    </script>

<button on:click={goBack} class="inline-block absolute top-[70px] left-[16px]">
    <img 
    src="../src/assets/back-nav.png" 
    alt="back-nav"
    class= "w-28 h-28"/>
</button>