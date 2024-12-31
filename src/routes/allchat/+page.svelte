<script lang="ts">
    import { MessageCircle, Music, Users, Sparkles } from 'lucide-svelte';
    import { messages, sendMessage } from '$lib/stores/chatStore';
    import { auth } from '$lib/utils/firebaseSetup';
    import { afterUpdate } from 'svelte';
    import Button from '../../components/Button.svelte';
    import { handleSignOut } from '$lib/utils/auth';
    import { doc, getDoc } from "firebase/firestore";
    import { firestore } from '$lib/utils/firebaseSetup';
    
    let message: string = '';
    let chatContainer: HTMLDivElement;
    
    async function handleSubmit(): Promise<void> {
        if (!message.trim()) return;

        const userRef = doc(firestore, 'users', auth.currentUser?.uid || '');
        const userSnap = await getDoc(userRef);

        let city = 'Not Found! ERROR'; // default value if city isn't found
        if (userSnap.exists()) {
            city = userSnap.data().city || 'Not Found! ERROR'; // use the city from Firestore, fallback to 'SLC'
        }

        sendMessage(message, {
            displayName: auth.currentUser?.displayName || 'Anonymous',
            city: city
        });
        message = '';
    }
    afterUpdate(() => {
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    });
</script>
<div class="flex flex-col h-screen max-h-screen bg-gradient-to-b from-violet-600 to-violet-700">
    <!-- Atmosphere Bar -->
    <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="bg-white/10 backdrop-blur rounded-lg p-2 flex items-center gap-2">
                <MessageCircle class="text-white" size={20} />
                <span class="text-white text-sm">Evening Hangout</span>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-lg p-2 flex items-center gap-2">
                <Users class="text-white" size={20} />
                <span class="text-white text-sm">423 vibing</span>
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
            class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <!-- Current Vibe Indicator -->
            <div class="flex justify-center">
                <div class="bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-white text-sm flex items-center gap-2">
                    <Sparkles size={16} />
                    The chat is buzzing! 12 new people just joined
                </div>
            </div>
            <!-- Chat Messages -->
            {#each $messages as msg}
                <div class="flex gap-3 items-end {msg.user.name === auth.currentUser?.displayName ? 'justify-end' : ''}">
                    {#if msg.user.name !== auth.currentUser?.displayName}
                        <div class="w-8 h-8 rounded-full bg-white/20 flex-shrink-0 backdrop-blur" />
                    {/if}
                    <div>
                        <div class="flex items-center gap-2 mb-1 {msg.user.name === auth.currentUser?.displayName ? 'justify-end' : ''}">
                            <span class="text-white/80 text-xs">{msg.user.name} • {msg.user.city}</span>
                        </div>
                        <div class="bg-white/10 backdrop-blur rounded-2xl {msg.user.name === auth.currentUser?.displayName ? 'rounded-tr-sm' : 'rounded-tl-sm'} p-3 text-white max-w-[80%]">
                            <p>{msg.content}</p>
                        </div>
                    </div>
                    {#if msg.user.name === auth.currentUser?.displayName}
                        <div class="w-8 h-8 rounded-full bg-white/20 flex-shrink-0 backdrop-blur" />
                    {/if}
                </div>
            {/each}
            <!-- Global Mini-Event -->
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
            </div>
        </div>
        <!-- Input Area -->
        <div class="p-4">
            <form 
                class="bg-white/10 backdrop-blur rounded-full p-1 flex gap-2"
                on:submit|preventDefault={handleSubmit}
            >
                <input 
                    type="text"
                    bind:value={message}
                    placeholder="Add to the conversation..."
                    class="flex-1 bg-transparent text-white placeholder-white/50 px-4 focus:outline-none"
                />
                <button 
                    type="submit"
                    class="bg-white text-violet-600 px-6 py-2 rounded-full hover:bg-white/90 transition-colors"
                >
                    Send
                </button>
            </form>
        </div>
    </div>
    <Button text="sign out" on:click={() => handleSignOut()} ></Button>
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