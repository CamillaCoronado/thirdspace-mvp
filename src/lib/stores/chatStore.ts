import { writable } from 'svelte/store';
import { db } from '$lib/utils/firebaseSetup';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
interface ChatMessage {
  content: string;
  user: {
    name: string;
    city: string;
  };
  timestamp: number;
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
  const messageList = Object.values(data) as ChatMessage[];
  messages.set(
    messageList
      .slice(-100)
      .sort((a, b) => a.timestamp - b.timestamp)
  );
});
export function sendMessage(content: string, user: ChatUser) {
    push(messagesRef, {
      content,
      user: {
        name: user.displayName || 'Anonymous',
        city: user.city
      },
      timestamp: serverTimestamp()
    });
  }