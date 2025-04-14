import React, { useState, useEffect } from 'react';
import { Layout } from '../components';
import { Map } from '../components/Map';

export const MapView: React.FC = () => {
  // Add key state to force remounting when needed
  const [mapKey, setMapKey] = useState(Date.now());
  
  // If the component unmounts and remounts, regenerate the key
  useEffect(() => {
    return () => {
      // This will execute when the component unmounts
      setMapKey(Date.now());
    };
  }, []);
  
  return (
    <Layout>
      <div className="h-full">
        {/* Use key to ensure proper remounting */}
        <Map key={mapKey} />
      </div>
    </Layout>
  );
}; 