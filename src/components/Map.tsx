import React, { useEffect, useRef } from 'react';
import { useUserStore } from '../stores';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issues with URL strings instead of imports
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

export const Map: React.FC = () => {
  const { currentUser, users, updateLocation } = useUserStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map on mount
  useEffect(() => {
    // Make sure we have the DOM element
    if (!mapRef.current) return;

    // Clean up previous map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Create new map instance
    const map = L.map(mapRef.current).setView([45.5017, -73.5673], 13);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Try to get user's location
    map.locate({ setView: true, maxZoom: 16 });
    map.on('locationfound', (e) => {
      if (currentUser) {
        updateLocation(currentUser.id, {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          timestamp: Date.now()
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when users or currentUser change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create new markers for visible users
    const visibleUsers = Object.values(users).filter(user => 
      user.location.visibility !== 'hidden'
    );

    const newMarkers = visibleUsers.map(user => {
      const marker = L.marker([
        user.location.latitude, 
        user.location.longitude
      ]).addTo(map);

      // Create popup content
      const popupContent = document.createElement('div');
      
      // Add user name
      const nameEl = document.createElement('div');
      nameEl.className = 'font-semibold mb-2';
      nameEl.textContent = user.name;
      popupContent.appendChild(nameEl);
      
      // Add visibility info
      const visibilityEl = document.createElement('div');
      visibilityEl.className = 'text-sm';
      visibilityEl.textContent = user.location.visibility === 'city' 
        ? 'Sharing city-level location' 
        : 'Sharing exact location';
      popupContent.appendChild(visibilityEl);
      
      // Add settings button for current user
      if (currentUser && user.id === currentUser.id) {
        const btnEl = document.createElement('button');
        btnEl.className = 'mt-2 px-2 py-1 bg-gray-100 rounded text-sm';
        btnEl.textContent = 'Privacy Settings';
        btnEl.onclick = () => {
          alert('Location sharing settings would open here');
        };
        popupContent.appendChild(btnEl);
      }
      
      marker.bindPopup(popupContent);
      return marker;
    });
    
    markersRef.current = newMarkers;
  }, [users, currentUser, updateLocation]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full" 
      style={{ zIndex: 0 }}
    />
  );
}; 