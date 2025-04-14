import React, { useState, useRef, useEffect } from 'react';
import { useChatStore, useUserStore } from '../stores';
import { Send, MapPin, Users } from 'lucide-react';

export const Chat: React.FC = () => {
  const { conversations, activeConversationId, sendMessage, markConversationAsRead, setActiveConversation } = useChatStore();
  const { currentUser, users } = useUserStore();
  const [messageText, setMessageText] = useState('');
  const [attachLocation, setAttachLocation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // List of conversations
  const conversationList = Object.values(conversations);
  
  // Set first conversation as active if none is selected
  useEffect(() => {
    if (!activeConversationId && conversationList.length > 0) {
      setActiveConversation(conversationList[0].id);
    }
  }, [activeConversationId, conversationList, setActiveConversation]);
  
  const activeConversation = activeConversationId
    ? conversations[activeConversationId]
    : null;
    
  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages.length]);
  
  // Mark conversation as read when viewing it
  useEffect(() => {
    if (activeConversationId && currentUser) {
      markConversationAsRead(activeConversationId, currentUser.id);
    }
  }, [activeConversationId, currentUser, markConversationAsRead]);
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !currentUser || !activeConversationId) return;
    
    let locationData;
    if (attachLocation && currentUser.location) {
      locationData = {
        latitude: currentUser.location.latitude,
        longitude: currentUser.location.longitude
      };
    }
    
    sendMessage(activeConversationId, {
      senderId: currentUser.id,
      text: messageText,
      location: locationData
    });
    
    setMessageText('');
    setAttachLocation(false);
  };
  
  if (conversationList.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No conversations yet. Start one with your crew!
      </div>
    );
  }
  
  if (!activeConversation || !currentUser) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a chat to start messaging.
      </div>
    );
  }
  
  // Get conversation participants
  const participants = activeConversation.participants
    .map(id => users[id]?.name || 'Unknown')
    .filter(name => name !== currentUser?.name);
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="bg-white border-b p-3 flex items-center">
        <div className="bg-blue-100 text-blue-500 p-2 rounded-full mr-3">
          <Users size={20} />
        </div>
        <div>
          <h2 className="font-semibold">
            {activeConversation.name || participants.join(', ')}
          </h2>
          <p className="text-xs text-gray-500">
            {participants.length} participants
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeConversation.messages.map((message) => {
          const isCurrentUser = message.senderId === currentUser.id;
          const sender = users[message.senderId];
          
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {!isCurrentUser && sender && (
                  <div className="text-xs font-semibold mb-1">{sender.name}</div>
                )}
                <div>{message.text}</div>
                
                {message.location && (
                  <div className="mt-2 flex items-center text-xs">
                    <MapPin size={12} className="mr-1" />
                    <span>
                      Location: {message.location.latitude.toFixed(6)}, {message.location.longitude.toFixed(6)}
                    </span>
                  </div>
                )}
                
                <div className="text-xs opacity-70 mt-1 text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAttachLocation(!attachLocation)}
            className={`p-2 rounded-full ${
              attachLocation ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <MapPin size={20} />
          </button>
          
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          
          <button
            onClick={handleSendMessage}
            className="p-3 bg-blue-500 text-white rounded-full"
            disabled={!messageText.trim()}
          >
            <Send size={18} />
          </button>
        </div>
        
        {attachLocation && (
          <div className="mt-2 text-xs text-blue-500 flex items-center">
            <MapPin size={12} className="mr-1" />
            Your current location will be shared with this message
          </div>
        )}
      </div>
    </div>
  );
}; 