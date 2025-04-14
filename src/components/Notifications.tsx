import React, { useEffect } from 'react';
import { useUserStore, useChatStore, usePhotoStore, useNotificationStore } from '../stores';
import { MessageSquare, Image, User as UserIcon } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { currentUser, users } = useUserStore();
  const { conversations } = useChatStore();
  const { photos } = usePhotoStore();
  const { markAllAsRead } = useNotificationStore();
  
  // Mark all notifications as read when this component mounts
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);
  
  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Sign in to view notifications
      </div>
    );
  }
  
  // Get unread messages
  const unreadMessages = Object.values(conversations).flatMap(conversation => 
    conversation.messages.filter(message => 
      message.senderId !== currentUser.id && !message.read[currentUser.id]
    )
  );
  
  // Get unviewed photos
  const unviewedPhotos = Object.values(photos).filter(photo => 
    photo.userId !== currentUser.id && !photo.viewedBy[currentUser.id]
  );
  
  // Sort all activities by timestamp (newest first)
  const activities = [
    ...unreadMessages.map(msg => ({ type: 'message', data: msg, timestamp: msg.timestamp })),
    ...unviewedPhotos.map(photo => ({ type: 'photo', data: photo, timestamp: photo.timestamp }))
  ].sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <div className="h-full overflow-auto p-4">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p>No new notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const sender = users[
              activity.type === 'message' 
                ? activity.data.senderId 
                : activity.data.userId
            ];
            
            return (
              <div 
                key={`${activity.type}_${index}`}
                className="bg-white p-4 rounded-lg border shadow-sm"
              >
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    {activity.type === 'message' ? (
                      <MessageSquare size={20} className="text-blue-500" />
                    ) : (
                      <Image size={20} className="text-purple-500" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-medium mr-2">
                        {sender ? sender.name : 'Unknown user'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    {activity.type === 'message' ? (
                      <p className="text-gray-700">
                        Sent a message: {activity.data.text}
                      </p>
                    ) : (
                      <div>
                        <p className="text-gray-700 mb-2">
                          Shared a photo
                          {activity.data.caption ? `: "${activity.data.caption}"` : ''}
                        </p>
                        <img 
                          src={activity.data.dataUrl} 
                          alt="Shared photo"
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}; 