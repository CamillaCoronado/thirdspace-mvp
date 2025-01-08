<script lang="ts">
    import { MessageCircle, Music, Users, Sparkles } from 'lucide-svelte';
    import { handleSignOut } from '$lib/utils/auth';
    import { doc, getDoc } from "firebase/firestore";
    import { onMount, afterUpdate } from 'svelte';
    import { ref, onValue, set, update } from "firebase/database";
    import { db, firestore, auth } from '$lib/utils/firebaseSetup'; 
    import { onAuthStateChanged } from 'firebase/auth';
    import type { Emoji, Reaction } from '$lib/stores/chatStore';
    import { featuredMessages, messages, sendMessage, getTopReactedMessages } from '$lib/stores/chatStore';
    import PhotoPromptModal from '../../components/PhotoPromptModal.svelte';
    import { hasPhoto } from '$lib/stores/photoStore';
    import { writable } from 'svelte/store';

    let message: string = '';
    let chatContainer: HTMLDivElement;
    let activeUsers: number = 0;
    let isLoading = true;
    let description = '';
    let blockRef: HTMLElement;

    let showReactions: boolean[] = [];
    let prevMessageCount = $messages.length;
    let interval;
    let showModal = false;
    

    type Action = "Take Photo" | "Upload Photo" | "Cancel";

    
    const emojis: Emoji[] = ['🤩', '❤️', '😂', '👍', '😡', '👎'];

    export const isOpen = writable(false);

    const toggleMenu = () => {
        isOpen.update(value => !value);
    };

    onMount(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
        getTopReactedMessages();  // Initial call to load featured messages

    // Set up an interval to call the function every 5 minutes (300,000 ms)
        interval = setInterval(getTopReactedMessages, 5 * 60 * 1000); 
        let currentUserRef: any = null;
        // Listen for authentication state changes
        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
            // Store ref for cleanup
            currentUserRef = ref(db, `users/${user.uid}/presence`);
            set(currentUserRef, true);
            } else if (currentUserRef) {
            // Only update if we have a stored ref
            set(currentUserRef, false);
            }
        });

        // Listen for the number of online users
        const onlineCountRef = ref(db, 'users');
        const presenceUnsubscribe = onValue(onlineCountRef, (snapshot) => {
            let onlineCount = 0;
            snapshot.forEach(childSnapshot => {
            if (childSnapshot.val().presence) onlineCount++;
            });
            activeUsers = onlineCount;
            isLoading = false;
            console.log(`Online users: ${onlineCount}`);
        });

        // Cleanup listeners when the component is destroyed
        return () => {
            authUnsubscribe();
            presenceUnsubscribe();
            window.removeEventListener("resize", handleResize);
        };
    });

    function handleResize() {
        isOpen.set(window.innerWidth >= 640);
    }

    async function handleSubmit(): Promise<void> {
        if (!message.trim()) return;

        const userRef = doc(firestore, 'users', auth.currentUser?.uid || '');
        const userSnap = await getDoc(userRef);
        let displayName = 'Anonymous';

        let city = 'Not Found! ERROR'; // default value if city isn't found
        if (userSnap.exists()) {
            city = userSnap.data().city || 'Not Found! ERROR'; // use the city from Firestore, fallback to 'SLC'
            const name = userSnap.data().name || 'Anonymous';
            displayName = name;
        } 


        sendMessage(message, {
            displayName: displayName,
            city: city
        });
        message = '';
    }
    afterUpdate(() => {
    if ($messages.length > prevMessageCount) {
        // New message was added, so scroll to the bottom
        if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
    // Update the previous message count to the current length
    prevMessageCount = $messages.length;
    });

    function getTimeBasedDescription() {
        const hours = new Date().getHours();
        
        if (hours >= 0 && hours < 4) return "Night Owl Hours";
        if (hours >= 4 && hours < 6) return "Early Bird Special";
        if (hours >= 6 && hours < 9) return "Morning Rush";
        if (hours >= 9 && hours < 12) return "Productivity Peak";
        if (hours >= 12 && hours < 14) return "Lunch Break Vibes";
        if (hours >= 14 && hours < 17) return "Afternoon Grind";
        if (hours >= 17 && hours < 20) return "Evening Wind-Down";
        if (hours >= 20 && hours < 22) return "Night Mode Activated";
        return "Midnight Madness";
    }

  // Initial description
  description = getTimeBasedDescription();

  // Update description every hour (for example)
  setInterval(() => {
    description = getTimeBasedDescription();
  }, 3600000);

  // handle user reaction to a message
  function handleReaction(messageId: string, emoji: Emoji, userId: string) {
    const message = $messages.find(msg => msg.id === messageId);

    if (message) {
        // Find the index of the existing reaction (if any)
        const existingReactionIndex = message.reactions.findIndex(
            reaction => reaction.userId === userId && reaction.emoji === emoji
        );

        if (existingReactionIndex !== -1) {
            message.reactions[existingReactionIndex] = { emoji, userId };
        } else {
            // If no reaction found, add the new reaction
            message.reactions.push({ emoji, userId });
        }

        // Update the reaction in the backend
        sendReactionToBackend(messageId, emoji, userId);
    }
}


function sendReactionToBackend(messageId: string, emoji: Emoji, userId: string) {
    const message = $messages.find(msg => msg.id === messageId);
    if (message) {
        message.reactions = [
            ...message.reactions.filter(reaction => reaction.userId !== userId),
            { emoji, userId }
        ];

        
        update(ref(db, `messages/${messageId}`), { reactions: message.reactions })
            .then(() => console.log(`Reactions updated for message ${messageId}`))
            .catch((error) => console.error('Error updating reactions:', error));
    }
}


function getReactionCount(reactions: Reaction[], emoji: Emoji): number {
    return reactions.filter(reaction => reaction.emoji === emoji).length;
}

</script>

<div class="flex h-screen max-h-screen">
    <div
    class={`transition-transform duration-500 overflow-y-auto bg-indigo scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent ease-in-out w-full ${
        $isOpen
          ? 'pointer-events-auto z-[100] fixed top-0 left-0 bottom-0 translate-x-0'
          : 'pointer-events-none z-[100] fixed top-0 left-0 bottom-0 -translate-x-full'
      } sm:pointer-events-auto sm:z-auto sm:static sm:translate-x-0 sm:max-w-2/5`}
      >
        <!--<img class= "inline-block w-5 h-5" src={profilePhoto} alt="add emoji">//add this later-->
        <div class="p-32">
            <div class="flex justify-center mb-32 mt-64 sm:mt-32">
                <div class="bg-white/10 rounded-lg p-3.5 max-w-md w-full">
                    <div class="text-white text-center mb-3">
                        <span class="font-medium">Community Challenge</span>
                        <p class="text-sm opacity-80">Share a song that describes your mood today!</p>
                    </div>
                    <div class="flex justify-center">
                        <button class="bg-white/20 rounded-lg px-4 py-2 text-white text-sm hover:bg-white/30 transition-colors">
                            Share your song
                        </button>
                    </div>
                </div>
            </div>
            <div class= "featured-messages mb-2">
                <h3 class= "text-white text-center font-medium mb-16">Featured Messages</h3>
                {#each $featuredMessages as message}
                <div class="bg-white p-4 rounded-lg shadow-md mb-3 flex flex-col space-y-2">
                  <div class="flex items-center space-x-2">
                    <span class="font-semibold text-gray-800">{message.user.name}</span>
                    <span class="text-sm text-gray-500">• {new Date(message.timestamp).toLocaleTimeString()}</span> <!-- Timestamp (optional) -->
                  </div>
                  <p class="text-gray-900">{message.content}</p>
                  
                  <!-- Reactions -->
                  <div class="flex space-x-4 text-sm text-gray-600">
                    {#each message.reactions as { emoji, userId }, index (emoji)} 
                      <div class="flex items-center space-x-1">
                        <span>{emoji}</span>
                        <span class="text-xs">{message.reactions.filter(reaction => reaction.emoji === emoji).length}</span> <!-- Reaction count -->
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
            <div class="mb-2 bg-white/10 hover:bg-white/20 transition text-white text-sm rounded-lg p-2 flex items-center gap-2">
                <button 
                >
                    settings
                </button>
            </div>
            <div class="mb-2 bg-white/10 hover:bg-white/20 transition text-white text-sm rounded-lg p-2 flex items-center gap-2">
                <button 
                    on:click|preventDefault={() => handleSignOut()}
                >
                    log out
                </button>
            </div>
        </div>
        
        
    </div>
    <div class= "bg-purple-gradient w-full flex flex-col h-screen max-h-screen">
         <!-- Atmosphere Bar -->
    <div class="p-32 flex items-center justify-between bg-medium-purple-gradient h-[100px]">
        <div class="block sm:hidden z-[101]">
            <!-- hamburger icon -->
            <button
              class="block p-2 focus:outline-none"
              on:click={toggleMenu}
              aria-label="Toggle Menu"
            >
              <div class="w-6 h-1 bg-white my-1 transition-transform duration-300" 
                   class:rotate-45={$isOpen} 
                   class:translate-y-2.5={$isOpen}></div>
              <div class="w-6 h-1 bg-white my-1 transition-opacity duration-300" 
                   class:opacity-0={$isOpen}></div>
              <div class="w-6 h-1 bg-white my-1 transition-transform duration-300" 
                   class:-rotate-45={$isOpen} 
                   class:-translate-y-2.5={$isOpen}
                   class:translate-y-[-6px]={$isOpen}></div>
            </button>
          </div>
        <div class="flex items-center gap-3">
            <div class="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                <MessageCircle class="text-white" size={20} />
                <span class="text-white text-sm">
                    {description}
                </span>
            </div>
            <div class="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                <Users class="text-white" size={20} /><span class="text-white text-sm"> {activeUsers}</span>
            </div>
        </div>
        <div class="bg-white/10 rounded-lg p-2 flex items-center gap-2">
            <Music class="text-white" size={20} />
        </div>
    </div>
    <!-- Main Chat Space -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <div 
            bind:this={chatContainer}
            class="flex-1 mb-5 overflow-y-auto p-32 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <!-- Current Vibe Indicator -->
            <div class="flex justify-center">
                <div class="bg-white/10 rounded-lg px-4 py-2 text-white text-sm flex items-center gap-2">
                    <Sparkles size={16} />
                    The chat is buzzing! 12 new people just joined
                </div>
            </div>
            <!-- Chat Messages -->
            {#each $messages as msg, index}
            {#if msg?.user?.name}
                <div 
                class="pt-7 flex gap-3 items-end {msg.user.name !== auth.currentUser?.displayName ? 'justify-end' : ''}">
        
                <!-- for current user's messages -->
                {#if msg.user.name === auth.currentUser?.displayName}
                    <div class="w-8 h-8 rounded-full bg-white/20 flex-shrink-0"></div>
                {/if}

                <div class="{msg.user.name !== auth.currentUser?.displayName ? 'text-right' : 'text-left'} relative">
                    <div 
                        class="flex items-center gap-2 mb-1 {msg.user.name !== auth.currentUser?.displayName ? 'justify-end' : ''}">
                        <span class="text-white/80 text-xs">
                            {msg.user.name} • {msg.user.city}
                        </span>
                    </div>

                    <!-- message bubble -->
                    <div 
                        class="rounded-2xl break-words px-5 py-3 w-3/4 text-left text-black inline-block
                            {msg.user.name !== auth.currentUser?.displayName 
                                ? 'bg-[#EFD5FC] rounded-tr-sm' 
                                : 'bg-white rounded-tl-sm'}">
                        <p class="inline">{msg.content}</p>
                    </div>

                    <!-- emoji reactions -->
                    <div class="mt-2">
                        {#each emojis as emoji}
                        {#if getReactionCount(msg.reactions, emoji) > 0}
                        <div class="bg-white/10 p-2 rounded-md inline-block">
                                {#if getReactionCount(msg.reactions, emoji) > 0}
                                    <div class="flex items-center gap-2">
                                    <span>{emoji}</span>
                                    <span>{getReactionCount(msg.reactions, emoji)}</span>
                                    </div>
                                {/if}
                        </div>
                        {/if}
                        {/each}
                        {#if showReactions[index]}
                            <div
                            class="grid bg-indigo absolute p-3 gap-2 mt-2 grid-cols-3 z-[100] rounded-md bottom-[8px] left-[22px] w-36"
                            on:blur={() => showReactions[index] = false}
                            tabindex="-1"
                            bind:this={blockRef}>
                                {#each emojis as emoji}
                                <button 
                                    on:click={() => {
                                        handleReaction(msg.id, emoji, auth.currentUser?.uid || 'default-user-id');
                                        showReactions[index] = false; 
                                    }}
                                    class="h-9 w-9 p-1 rounded-full bg-white/10 text-sm text-white hover:bg-white/20 transition">
                                    <span>{emoji}</span>
                                </button>
                                {/each}
                            </div>
                        {/if}
                        <button 
                            class="rounded-full inline-block align-middle"
                            on:click={() => showReactions[index] = !showReactions[index]}>
                            <img class= "inline-block w-5 h-5" src="/add.png" alt="add emoji">
                        </button>
                        
                    </div>
                </div>
                <!-- for other users' messages -->
                {#if msg.user.name !== auth.currentUser?.displayName}
                    <div class="w-8 h-8 rounded-full bg-white/20 flex-shrink-0"></div>
                {/if}
            </div>
            {/if}
        {/each}

        </div>
        <!-- Input Area -->
        <div>
            <form
                class="gap-2 flex items-center justify-center h-full bg-[#FBF4FF] p-32"
                on:submit|preventDefault={handleSubmit}
            ><label class= "text-indigo text-2xl">☺</label>
                <input 
                    type="text"
                    bind:value={message}
                    placeholder="Send a message"
                    on:click={() => (hasPhoto() ? (showModal = false) : (showModal = true))}
                    class="flex-1 h-full text-black placeholder-black px-4 focus:outline-none bg-white/10 rounded-full p-1"
                />
                
            </form>
        </div>
        <PhotoPromptModal bind:isOpen={showModal}
        />
        </div>
    </div>
</div>
<style lang="postcss">
    /* Custom scrollbar for WebKit browsers */
    .scrollbar-thin {
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.2) transparent;
    }
    .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
        background-color: rgba(255,255,255,0.2);
        border-radius: 3px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
    }

</style>