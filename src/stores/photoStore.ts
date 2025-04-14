import { create } from 'zustand';
import { sync } from '@tonk/keepsync';

export interface Photo {
  id: string;
  userId: string;
  dataUrl: string;
  caption?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  viewedBy: Record<string, boolean>;
}

interface PhotoState {
  photos: Record<string, Photo>;
  uploading: boolean;
  
  addPhoto: (photoData: Omit<Photo, 'id' | 'timestamp' | 'viewedBy'>) => void;
  markPhotoAsViewed: (photoId: string, userId: string) => void;
  getUnviewedCount: (userId: string) => number;
  setUploading: (uploading: boolean) => void;
}

export const usePhotoStore = create<PhotoState>(
  sync(
    (set, get) => ({
      photos: {},
      uploading: false,
      
      addPhoto: (photoData) => {
        const photoId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        const newPhoto: Photo = {
          ...photoData,
          id: photoId,
          timestamp: Date.now(),
          viewedBy: { [photoData.userId]: true }
        };
        
        set((state) => ({
          photos: {
            ...state.photos,
            [photoId]: newPhoto
          }
        }));
      },
      
      markPhotoAsViewed: (photoId, userId) => {
        set((state) => {
          const photo = state.photos[photoId];
          if (!photo) return state;
          
          return {
            ...state,
            photos: {
              ...state.photos,
              [photoId]: {
                ...photo,
                viewedBy: {
                  ...photo.viewedBy,
                  [userId]: true
                }
              }
            }
          };
        });
      },
      
      getUnviewedCount: (userId) => {
        const { photos } = get();
        
        return Object.values(photos).filter(
          photo => !photo.viewedBy[userId] && photo.userId !== userId
        ).length;
      },
      
      setUploading: (uploading) => {
        set({ uploading });
      }
    }),
    {
      docId: 'photos',
      initTimeout: 30000,
      onInitError: (error) => console.error('Photo sync initialization error:', error)
    }
  )
); 