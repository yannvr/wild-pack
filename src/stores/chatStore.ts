import { create } from 'zustand';
import { sync } from '@tonk/keepsync';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  read: Record<string, boolean>;
}

export interface Conversation {
  id: string;
  name?: string;
  participants: string[];
  messages: Message[];
  lastReadTimestamp: Record<string, number>;
}

interface ChatState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  unreadCount: number;
  
  createConversation: (conversation: Omit<Conversation, 'messages' | 'lastReadTimestamp'>) => void;
  sendMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  markConversationAsRead: (conversationId: string, userId: string) => void;
  setActiveConversation: (conversationId: string | null) => void;
  getUnreadCount: (userId: string) => number;
}

export const useChatStore = create<ChatState>(
  sync(
    (set, get) => ({
      conversations: {},
      activeConversationId: null,
      unreadCount: 0,
      
      createConversation: (conversation) => {
        const newConversation: Conversation = {
          ...conversation,
          messages: [],
          lastReadTimestamp: Object.fromEntries(
            conversation.participants.map(p => [p, Date.now()])
          )
        };
        
        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversation.id]: newConversation
          }
        }));
      },
      
      sendMessage: (conversationId, messageData) => {
        set((state) => {
          const conversation = state.conversations[conversationId];
          if (!conversation) return state;
          
          const message: Message = {
            ...messageData,
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            timestamp: Date.now(),
            read: { [messageData.senderId]: true }
          };
          
          return {
            ...state,
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                messages: [...conversation.messages, message]
              }
            }
          };
        });
      },
      
      markConversationAsRead: (conversationId, userId) => {
        set((state) => {
          const conversation = state.conversations[conversationId];
          if (!conversation) return state;
          
          // Mark all messages as read for this user
          const updatedMessages = conversation.messages.map(msg => ({
            ...msg,
            read: { ...msg.read, [userId]: true }
          }));
          
          // Update last read timestamp
          const lastReadTimestamp = {
            ...conversation.lastReadTimestamp,
            [userId]: Date.now()
          };
          
          return {
            ...state,
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                messages: updatedMessages,
                lastReadTimestamp
              }
            }
          };
        });
      },
      
      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId });
      },
      
      getUnreadCount: (userId) => {
        const { conversations } = get();
        
        return Object.values(conversations).reduce((count, conversation) => {
          const unreadMessages = conversation.messages.filter(
            msg => !msg.read[userId] && msg.senderId !== userId
          );
          return count + unreadMessages.length;
        }, 0);
      }
    }),
    {
      docId: 'chats',
      initTimeout: 30000,
      onInitError: (error) => console.error('Chat sync initialization error:', error)
    }
  )
); 