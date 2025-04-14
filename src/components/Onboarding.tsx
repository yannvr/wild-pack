import React, { useState } from 'react';
import { useUserStore } from '../stores';
import { User, MapPin, Lock, ChevronRight } from 'lucide-react';
import { LocationVisibility } from '../stores/userStore';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { setCurrentUser } = useUserStore();
  const [name, setName] = useState('');
  const [locationVisibility, setLocationVisibility] = useState<LocationVisibility>('exact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    // Create a new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Initialize with default location (will be updated when map loads)
    const newUser = {
      id: userId,
      name: name.trim(),
      location: {
        latitude: 45.5017,
        longitude: -73.5673,
        timestamp: Date.now(),
        visibility: locationVisibility
      },
      online: true
    };
    
    setCurrentUser(newUser);
    onComplete();
  };
  
  const visibilityOptions = [
    { value: 'exact', label: 'Exact Location', icon: MapPin, description: 'Show my precise location on the map' },
    { value: 'city', label: 'City Only', icon: MapPin, description: 'Only show my approximate city location' },
    { value: 'hidden', label: 'Hidden', icon: Lock, description: 'Hide my location from other users' }
  ];
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Wild Pack</h1>
          <p className="text-gray-600">Let's set up your profile to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Privacy
            </label>
            
            <div className="space-y-2">
              {visibilityOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      locationVisibility === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setLocationVisibility(option.value as LocationVisibility)}
                  >
                    <div className={`p-2 rounded-full mr-3 ${
                      locationVisibility === option.value
                        ? 'bg-blue-100 text-blue-500'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                    {locationVisibility === option.value && (
                      <div className="text-blue-500">
                        <ChevronRight size={20} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? 'Setting up...' : 'Get Started'}
          </button>
        </form>
        
        <p className="mt-6 text-xs text-center text-gray-500">
          By continuing, you agree to our Privacy Policy and Terms of Service.
          Wild Pack is privacy-focused and your data stays on your device.
        </p>
      </div>
    </div>
  );
}; 