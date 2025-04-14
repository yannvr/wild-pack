import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, MessageSquare, Image, Bell } from 'lucide-react';
import { useNotificationStore, useUserStore } from '../stores';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useUserStore();
  const getUnreadCount = useNotificationStore(state => state.getUnreadCount);
  
  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0;

  const navItems = [
    { icon: MapPin, label: 'Map', path: '/' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Image, label: 'Photos', path: '/photos' },
    { 
      icon: Bell, 
      label: 'Notifications',
      path: '/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 overflow-auto pb-16">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center p-2 relative ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
              
              {item.badge && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}; 