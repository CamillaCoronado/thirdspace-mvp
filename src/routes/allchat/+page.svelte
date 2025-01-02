<script lang="ts">
    import { MessageCircle, Music, Users, Sparkles } from 'lucide-svelte';
    import { messages, sendMessage } from '$lib/stores/chatStore';
    import { auth } from '$lib/utils/firebaseSetup';
    import { afterUpdate } from 'svelte';
    import { handleSignOut } from '$lib/utils/auth';
    import { doc, getDoc } from "firebase/firestore";
    import { firestore } from '$lib/utils/firebaseSetup';
    import { onMount } from 'svelte';
    import { ref, onValue, set } from "firebase/database";
    import { db } from '$lib/utils/firebaseSetup'; 
    import { onAuthStateChanged } from 'firebase/auth';
    import type { Emoji, Reaction } from '$lib/stores/chatStore';
    import { update } from 'firebase/database';


    
    let message: string = '';
    let chatContainer: HTMLDivElement;
    let activeUsers: number = 0;
    let isLoading = true;
    let description = '';
    let blockRef: HTMLElement;

    let isOpen = false;
    let showReactions: boolean[] = [];
    let prevMessageCount = $messages.length;
    
    const emojis: Emoji[] = ['🤩', '❤️', '😂', '👍', '😡', '👎'];

    const toggleMenu = () => {
        isOpen = !isOpen;
    };

    onMount(() => {
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
        };
    });

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

        // Update reactions in the backend
        update(ref(db, `messages/${messageId}`), { reactions: message.reactions })
            .then(() => console.log(`Reactions updated for message ${messageId}`))
            .catch((error) => console.error('Error updating reactions:', error));
    }
}


    // get the count of a specific emoji for a message
function getReactionCount(reactions: Reaction[], emoji: Emoji): number {
    return reactions.filter(reaction => reaction.emoji === emoji).length;
}
</script>

<div class="flex h-screen max-h-screen bg-white">
    <div class= "w-2/5 relative">
        <div class="bg-indigo p-32 h-[100px] flex justify-between align-items-center">
            <figure class= "rounded-full p-3 bg-white h-32 w-32 block"></figure>
            <div>
                <!-- hamburger icon -->
                <button
                  class="block p-2 focus:outline-none"
                  on:click={toggleMenu}
                  aria-label="Toggle Menu"
                >
                  <div class="w-6 h-1 bg-white my-1 transition-transform duration-300" 
                       class:rotate-45={isOpen} 
                       class:translate-y-2.5={isOpen}></div>
                  <div class="w-6 h-1 bg-white my-1 transition-opacity duration-300" 
                       class:opacity-0={isOpen}></div>
                  <div class="w-6 h-1 bg-white my-1 transition-transform duration-300" 
                       class:-rotate-45={isOpen} 
                       class:-translate-y-2.5={isOpen}
                       class:translate-y-[-6px]={isOpen}></div>
                </button>
              
                <!-- menu items -->
                <div
                  class={`z-1 absolute top-[100px] right-0 bottom-0 w-full bg-medium-indigo shadow-md transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <a href="/" class="block px-4 py-2 text-white">Settings</a>
                </div>
              </div>
        </div>
        <div class="p-32 sidebar-section">
            <div class= "featured-messages">
                <h3 class= "text-indigo">Featured Messages</h3>
            </div>
        </div>
        
        
    </div>
    <div class= "bg-purple-gradient w-full flex flex-col h-screen max-h-screen">
         <!-- Atmosphere Bar -->
    <div class="p-32 flex items-center justify-between bg-medium-purple-gradient h-[100px]">
        <div class="flex items-center gap-3">
            <div class="bg-white/10 backdrop-blur rounded-lg p-2 flex items-center gap-2">
                <MessageCircle class="text-white" size={20} />
                <span class="text-white text-sm">
                    {description}
                </span>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-lg p-2 flex items-center gap-2">
                <Users class="text-white" size={20} />
                <span class="text-white text-sm"> {activeUsers} vibing</span>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-lg p-2 flex items-center gap-2">
                <Music class="text-white" size={20} />
                <span class="text-white text-sm">Lofi Beats</span>
            </div>
        </div>
        <div class="bg-white/10 hover:bg-white/20 transition text-white text-sm backdrop-blur rounded-lg p-2 flex items-center gap-2">
            <button 
                on:click|preventDefault={() => handleSignOut()}
            >
                log out
        </button>
        </div>
        
    </div>
    <!-- Main Chat Space -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <div 
            bind:this={chatContainer}
            class="flex-1 mb-5 overflow-y-auto p-32 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <!-- Current Vibe Indicator -->
            <div class="flex justify-center">
                <div class="bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-white text-sm flex items-center gap-2">
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
                    <div class="w-8 h-8 rounded-full bg-white/20 flex-shrink-0 backdrop-blur"></div>
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
                        class="backdrop-blur rounded-2xl break-words px-5 py-3 w-3/4 text-left text-black inline-block
                            {msg.user.name !== auth.currentUser?.displayName 
                                ? 'bg-[#EFD5FC] rounded-tr-sm' 
                                : 'bg-white rounded-tl-sm'}">
                        <p class="inline">{msg.content}</p>
                    </div>

                    <!-- emoji reactions -->
                    <div class="mt-2">
                        {#each emojis as emoji}
                        {#if getReactionCount(msg.reactions, emoji) > 0}
                        <div class="bg-white/10 backdrop-blur p-2 rounded-md inline-block">
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
                    <div class="w-8 h-8 rounded-full bg-white/20 flex-shrink-0 backdrop-blur"></div>
                {/if}
            </div>
            {/if}
        {/each}


            <!-- Global Mini-Event
            <div class="flex justify-center">
                <div class="bg-white/10 backdrop-blur rounded-lg p-4 max-w-md w-full">
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
            </div>  -->
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
                    class="flex-1 h-full text-black placeholder-black px-4 focus:outline-none bg-white/10 backdrop-blur rounded-full p-1"
                />
                
            </form>
        </div>
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