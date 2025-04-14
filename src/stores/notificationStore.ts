import { create } from 'zustand';
import { useChatStore } from './chatStore';
import { usePhotoStore } from './photoStore';

interface NotificationState {
  lastViewedTimestamp: number;
  getUnreadCount: (userId: string) => number;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  lastViewedTimestamp: Date.now(),
  
  getUnreadCount: (userId: string) => {
    const unreadMessages = useChatStore.getState().getUnreadCount(userId);
    const unviewedPhotos = usePhotoStore.getState().getUnviewedCount(userId);
    
    return unreadMessages + unviewedPhotos;
  },
  
  markAllAsRead: () => {
    set({ lastViewedTimestamp: Date.now() });
  }
})); 