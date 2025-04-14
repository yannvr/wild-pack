import React, { useRef, useState } from 'react';
import { usePhotoStore, useUserStore } from '../stores';
import { Camera, MapPin, X, Upload } from 'lucide-react';

export const PhotoFeed: React.FC = () => {
  const { photos, addPhoto, markPhotoAsViewed, uploading, setUploading } = usePhotoStore();
  const { currentUser, users } = useUserStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [attachLocation, setAttachLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !currentUser) return;
    
    try {
      setUploading(true);
      
      // Convert file to data URL
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onload = () => {
        const dataUrl = reader.result as string;
        
        // Prepare location data if enabled
        let locationData;
        if (attachLocation && currentUser.location) {
          locationData = {
            latitude: currentUser.location.latitude,
            longitude: currentUser.location.longitude
          };
        }
        
        // Add the photo to the store
        addPhoto({
          userId: currentUser.id,
          dataUrl,
          caption,
          location: locationData
        });
        
        // Reset form
        setSelectedFile(null);
        setCaption('');
        setAttachLocation(false);
        setUploading(false);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      setUploading(false);
    }
  };
  
  const handleCancel = () => {
    setSelectedFile(null);
    setCaption('');
    setAttachLocation(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Sort photos by timestamp (newest first)
  const sortedPhotos = Object.values(photos).sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold mb-4">Photos</h1>
        
        <div className="flex flex-col space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          
          {!selectedFile ? (
            <button
              onClick={handleUploadClick}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-lg"
            >
              <Camera size={20} />
              Share a Photo
            </button>
          ) : (
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Selected: {selectedFile.name}</span>
                <button onClick={handleCancel} className="text-gray-500">
                  <X size={20} />
                </button>
              </div>
              
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="flex items-center">
                <button
                  onClick={() => setAttachLocation(!attachLocation)}
                  className={`flex items-center mr-3 ${
                    attachLocation ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  <MapPin size={18} className="mr-1" />
                  <span className="text-sm">Add Location</span>
                </button>
                
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex items-center gap-1 ml-auto bg-blue-500 text-white px-3 py-1 rounded"
                >
                  {uploading ? 'Uploading...' : (
                    <>
                      <Upload size={16} />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {sortedPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Camera size={48} className="mb-2 opacity-50" />
            <p>No photos shared yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedPhotos.map((photo) => {
              const photoUser = users[photo.userId];
              const isCurrentUser = currentUser && photo.userId === currentUser.id;
              
              // Mark photo as viewed if it's not the current user's photo
              if (currentUser && !isCurrentUser && !photo.viewedBy[currentUser.id]) {
                markPhotoAsViewed(photo.id, currentUser.id);
              }
              
              return (
                <div key={photo.id} className="border rounded-lg overflow-hidden bg-white">
                  <img 
                    src={photo.dataUrl} 
                    alt={photo.caption || "Shared photo"} 
                    className="w-full object-cover h-48"
                  />
                  
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {photoUser ? photoUser.name : 'Unknown user'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(photo.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {photo.caption && (
                      <p className="text-gray-700 mb-2">{photo.caption}</p>
                    )}
                    
                    {photo.location && (
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin size={12} className="mr-1" />
                        Location: {photo.location.latitude.toFixed(6)}, {photo.location.longitude.toFixed(6)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}; 