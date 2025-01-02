import { writable } from 'svelte/store';
import { db } from '$lib/utils/firebaseSetup';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';

export type Emoji = '🤩' | '❤️' | '😂' | '👍' | '😡' | '👎';

export type Reaction = {
  emoji: Emoji;
  userId: string;
};

interface ChatMessage {
  content: string;
  user: {
    name: string;
    city: string;
  };
  timestamp: number;
  id: string;
  reactions: Reaction[];
}
interface ChatUser {
    displayName: string | undefined;
    city: string;
}
export const messages = writable<ChatMessage[]>([]);
const messagesRef = ref(db, 'messages');
// listen for new messages
onValue(messagesRef, (snapshot) => {
  const data = snapshot.val() || {};
  const messageList = Object.entries(data).map(([key, value]) => ({
    ...value as ChatMessage,  // Explicitly cast value to ChatMessage
    id: key,  // Firebase generated ID (key) for each message
    reactions: (value as ChatMessage).reactions || []  // Ensure reactions are initialized
  }));

  messages.set(
    messageList
      .slice(-100)
      .sort((a, b) => a.timestamp - b.timestamp)
  );
});
export function sendMessage(content: string, user: ChatUser) {
  const newMessageRef = push(messagesRef, {
    content,
    user: {
      name: user.displayName || 'Anonymous',
      city: user.city
    },
    timestamp: serverTimestamp(),
    reactions: []
  });

    messages.update((currentMessages) => [
      ...currentMessages,
      {
        content,
        user: {
          name: user.displayName || 'Anonymous',
          city: user.city
        },
        timestamp: Date.now(),
        id: newMessageRef.key!,
        reactions: []
      }
    ]);
    const messageId = newMessageRef.key;
    console.log("Firebase generated message ID:", messageId);
    console.log("Message added to store:", { content, id: messageId });
  }