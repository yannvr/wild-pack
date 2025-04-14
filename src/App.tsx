import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { 
  HelloWorld, 
  MapView, 
  ChatView, 
  PhotosView, 
  NotificationsView 
} from "./views";
import { Onboarding } from "./components";
import { useUserStore, useChatStore, usePhotoStore } from "./stores";

// Initialize sample data for demo
const initializeSampleData = (currentUserId: string) => {
  // User store setup
  const userStore = useUserStore.getState();
  
  // Add some sample friends
  const sampleUsers = [
    {
      id: "user_sample_1",
      name: "Alex Hiker",
      location: {
        latitude: 45.5017 + (Math.random() * 0.01 - 0.005),
        longitude: -73.5673 + (Math.random() * 0.01 - 0.005),
        timestamp: Date.now(),
        visibility: "exact" as const
      },
      online: true
    },
    {
      id: "user_sample_2",
      name: "Taylor Crew",
      location: {
        latitude: 45.5017 + (Math.random() * 0.01 - 0.005),
        longitude: -73.5673 + (Math.random() * 0.01 - 0.005),
        timestamp: Date.now(),
        visibility: "city" as const
      },
      online: true
    }
  ];
  
  sampleUsers.forEach(user => {
    userStore.users[user.id] = user;
  });
  
  // Chat store setup
  const chatStore = useChatStore.getState();
  
  // Create a group conversation
  const conversationId = "conv_sample_1";
  chatStore.createConversation({
    id: conversationId,
    name: "Crew Chat",
    participants: [currentUserId, ...sampleUsers.map(u => u.id)]
  });
  
  // Add some sample messages
  chatStore.sendMessage(conversationId, {
    senderId: sampleUsers[0].id,
    text: "Hey everyone! Who's up for a hike this weekend?",
  });
  
  chatStore.sendMessage(conversationId, {
    senderId: sampleUsers[1].id,
    text: "I'm in! Weather looks perfect.",
  });
  
  // Photo store setup
  const photoStore = usePhotoStore.getState();
  
  // Add a sample photo
  photoStore.addPhoto({
    userId: sampleUsers[0].id,
    dataUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1000",
    caption: "Beautiful trail from last weekend!",
    location: {
      latitude: 45.5030,
      longitude: -73.5700
    }
  });
};

const App: React.FC = () => {
  const { currentUser } = useUserStore();
  const [showOnboarding, setShowOnboarding] = useState(!currentUser);
  const [dataInitialized, setDataInitialized] = useState(false);
  
  // Check if user is set up
  useEffect(() => {
    setShowOnboarding(!currentUser);
    
    // Initialize sample data once when user is set up
    if (currentUser && !dataInitialized) {
      initializeSampleData(currentUser.id);
      setDataInitialized(true);
    }
  }, [currentUser, dataInitialized]);
  
  // Show onboarding if no user is set up
  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<MapView />} />
      <Route path="/chat" element={<ChatView />} />
      <Route path="/photos" element={<PhotosView />} />
      <Route path="/notifications" element={<NotificationsView />} />
      <Route path="/hello" element={<HelloWorld />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
