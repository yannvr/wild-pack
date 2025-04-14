import React from 'react';
import { Layout, PhotoFeed } from '../components';

export const PhotosView: React.FC = () => {
  return (
    <Layout>
      <div className="h-full">
        <PhotoFeed />
      </div>
    </Layout>
  );
}; 