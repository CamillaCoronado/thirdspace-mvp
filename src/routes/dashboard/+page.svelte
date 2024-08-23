<script>
    import Button from '../../components/Button.svelte';
    import { handleSignOut } from '$lib/utils/auth';

    let step1Completed = true;
    let step2InProgress = true;
</script>

<header class="bg-white p-4 flex flex-col items-center mx-16">
    <div class="flex justify-between w-full items-center mb-32">
      <img 
      src="../src/assets/profile-icon.png" 
      alt="profile icon"
      class= "w-[37px] h-[37px]"/>
      <img 
      src="../src/assets/gear-icon.png" 
      alt="settings icon"
      class= "w-[25px] h-[25px]"/>
    </div>
  <nav class= "w-full mb-32">
    <ul class="flex items-center justify-between w-full">
      <li><button class="bg-dark-yellow text-white py-8 px-32 rounded-full">Home</button></li>
      <li><button class="dark-charcoal">Chat</button></li>
      <li><button class="dark-charcoal">Meetup</button></li>
    </ul>
  </nav>
    
  </header>

  <main class="flex-grow p-4 mx-16">
    <h1 class="text-xl font-medium mb-32">hey camilla!<br/>you have a beautiful smile :)</h1>
    <div class="space-y-4">
      <div class="mb-32">
        <div class="flex items-center">
          <div class={`w-7 h-7 rounded-full ${step1Completed ? 'bg-medium-green' : 'bg-gray-300'} mr-16`}></div>
          <span class="text-medium-gray text-base mr-16">STEP 1</span>
          <span class="mr-16 text-base font-medium">Take Quiz</span>
          <span class="mr-16 text-medium-green text-xs font-medium">Completed</span>
        </div>
        <span class= "h-[30px] block w-[3px] ml-[12px] my-8 bg-medium-green "></span>
        <div class="flex items-center">
          <div class={`w-7 h-7 rounded-full ${step2InProgress ? 'bg-dark-pink' : 'bg-gray-300'} mr-16`}></div>
          <span class="text-medium-gray text-base mr-16">STEP 2</span>
          <span class="text-base mr-16 font-medium">Pic Verification</span>
          <span class="text-dark-pink text-xs font-medium">In Progress</span>
        </div>
      </div>
      
      <div class="bg-white px-16 py-32 rounded-lg shadow">
        <span class="text-center mb-16 text-xl font-medium">Embark on a journey where your choices reveal insights about you.</span>
        <Button bgColor= bg-dark-yellow color= "white" text="Take Quiz" buttonType =""></Button>
      </div>

      <div class="bg-white px-16 py-32 rounded-lg shadow">
        <p class="text-center mb-4">Verify your profile picture to continue.</p>
        <Button bgColor= bg-dark-yellow color= "white" text="Pic Verification" buttonType =""></Button>
      </div>
    </div>
  </main>
  <Button text="sign out" on:click={() => handleSignOut()} ></Button>