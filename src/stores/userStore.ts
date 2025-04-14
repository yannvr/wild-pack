import { create } from 'zustand';
import { sync } from '@tonk/keepsync';

export type LocationVisibility = 'exact' | 'city' | 'hidden';

export interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
  visibility: LocationVisibility;
}

export interface User {
  id: string;
  name: string;
  location: UserLocation;
  online: boolean;
}

interface UserState {
  currentUser: User | null;
  users: Record<string, User>;
  setCurrentUser: (user: User) => void;
  updateLocation: (
    userId: string,
    location: Partial<UserLocation>
  ) => void;
  setLocationVisibility: (userId: string, visibility: LocationVisibility) => void;
  setUserOnline: (userId: string, online: boolean) => void;
}

export const useUserStore = create<UserState>(
  sync(
    (set) => ({
      currentUser: null,
      users: {},
      
      setCurrentUser: (user) => {
        set((state) => ({
          currentUser: user,
          users: {
            ...state.users,
            [user.id]: user
          }
        }));
      },
      
      updateLocation: (userId, location) => {
        set((state) => {
          const user = state.users[userId];
          if (!user) return state;
          
          return {
            ...state,
            users: {
              ...state.users,
              [userId]: {
                ...user,
                location: {
                  ...user.location,
                  ...location,
                }
              }
            }
          };
        });
      },
      
      setLocationVisibility: (userId, visibility) => {
        set((state) => {
          const user = state.users[userId];
          if (!user) return state;
          
          return {
            ...state,
            users: {
              ...state.users,
              [userId]: {
                ...user,
                location: {
                  ...user.location,
                  visibility
                }
              }
            }
          };
        });
      },
      
      setUserOnline: (userId, online) => {
        set((state) => {
          const user = state.users[userId];
          if (!user) return state;
          
          return {
            ...state,
            users: {
              ...state.users,
              [userId]: {
                ...user,
                online
              }
            }
          };
        });
      }
    }),
    {
      docId: 'users',
      initTimeout: 30000,
      onInitError: (error) => console.error('User sync initialization error:', error)
    }
  )
); 