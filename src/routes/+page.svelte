<script lang="ts">
  import { initiateAuth } from '../lib/utils/auth';
</script>

<div
  class="px-16 flex flex-col items-center justify-between h-screen w-full bg-dark-yellow text-white text-center"
>
  <div class="relative h-12 w-52" style="top: 25%;">
    <img
      src="../src/assets/logo.png"
      alt="Logo"
      class="w-[210px] h-[48px] object-contain"
    />
  </div>
  <section class="relative text-center w-full" style="bottom: 10%;">
    <h2 class="mb-64">Just common<br /> enough to click</h2>
    <div class="w-full">
      <button
        class="btn w-full border-solid border-2 border-white rounded-full py-12 mb-16"
        on:click={() => initiateAuth('CreateAccount')}>Create account</button
      >
      <button
        class="btn w-full border-solid border-2 border-white rounded-full py-12 mb-16"
        on:click={() => initiateAuth('SignIn')}>Sign In</button
      >
    </div>
  </section>
</div>
