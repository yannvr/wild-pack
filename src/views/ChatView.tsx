import React from 'react';
import { Layout, Chat } from '../components';

export const ChatView: React.FC = () => {
  return (
    <Layout>
      <div className="h-full">
        <Chat />
      </div>
    </Layout>
  );
}; 