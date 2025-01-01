<script lang="ts">
    import { MessageCircle, Music, Users, Sparkles } from 'lucide-svelte';
    import { messages, sendMessage } from '$lib/stores/chatStore';
    import { auth } from '$lib/utils/firebaseSetup';
    import { afterUpdate } from 'svelte';
    import Button from '../../components/Button.svelte';
    import { handleSignOut } from '$lib/utils/auth';
    import { doc, getDoc } from "firebase/firestore";
    import { firestore } from '$lib/utils/firebaseSetup';
    import { onMount } from 'svelte';
    import { ref, onValue, set } from "firebase/database";
    import { db } from '$lib/utils/firebaseSetup'; 
    import { onAuthStateChanged } from 'firebase/auth';
    
    let message: string = '';
    let chatContainer: HTMLDivElement;
    let activeUsers: number = 0;
    let isLoading = true;
    let description = '';

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
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
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

</script>
<div class="flex h-screen max-h-screen bg-medium-indigo">
    <div class= "sidebar">
asdsds
    </div>
    <div class= "bg-purple-gradient w-full flex flex-col h-screen max-h-screen">
         <!-- Atmosphere Bar -->
    <div class="p-32 flex items-center justify-between">
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
            <div class="bg-white/10 text-white text-sm backdrop-blur rounded-lg p-2 flex items-center gap-2">
                <button 
                    on:click|preventDefault={() => handleSignOut()}
                >
                    log out
            </button>
            </div>
            
        </div>
        <div class="bg-white/10 backdrop-blur rounded-lg p-2 flex items-center gap-2">
            <Music class="text-white" size={20} />
            <span class="text-white text-sm">Lofi Beats</span>
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
            {#each $messages as msg}
            <div 
                class="flex gap-3 items-end {msg.user.name !== auth.currentUser?.displayName ? 'justify-end' : ''}">
                
                <!-- for current user's messages -->
                {#if msg.user.name === auth.currentUser?.displayName}
                    <div class="w-8 h-8 rounded-full bg-white/20 flex-shrink-0 backdrop-blur"></div>
                {/if}

                <div class="{msg.user.name !== auth.currentUser?.displayName ? 'text-right' : 'text-left'}">
                    <div 
                        class="flex items-center gap-2 mb-1 {msg.user.name !== auth.currentUser?.displayName ? 'justify-end' : ''}">
                        <span class="text-white/80 text-xs">
                            {msg.user.name} • {msg.user.city}
                        </span>
                    </div>

                    <!-- Message bubble -->
                    <div 
                        class="backdrop-blur rounded-2xl break-words p-5 text-white
                            {msg.user.name !== auth.currentUser?.displayName 
                                ? 'bg-indigo rounded-tr-sm' 
                                : 'bg-violet-700 rounded-tl-sm'}">
                        <p>{msg.content}</p>
                    </div>
                </div>

                <!-- for other users' messages -->
                {#if msg.user.name !== auth.currentUser?.displayName}
                    <div class="w-8 h-8 rounded-full bg-white/20 flex-shrink-0 backdrop-blur"></div>
                {/if}
            </div>
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
                class="gap-2 flex items-center justify-center h-full bg-white p-32"
                on:submit|preventDefault={handleSubmit}
            >
                <input 
                    type="text"
                    bind:value={message}
                    placeholder="Add to the conversation..."
                    class="flex-1 h-full border-indigo border-2 text-indigo placeholder-white/50 px-4 focus:outline-none bg-white/10 backdrop-blur rounded-full p-1"
                />
                <div class= "w-52 mb-[-16px]">
                    <Button 
                        text="Send" 
                        bgColor="bg-indigo" 
                        color="text-white" 
                        buttonType="submit" 
                        border="border-none" 
                        borderWidth="0"
                    />
                </div>
                
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