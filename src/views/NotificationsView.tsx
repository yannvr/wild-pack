import React from 'react';
import { Layout, Notifications } from '../components';

export const NotificationsView: React.FC = () => {
  return (
    <Layout>
      <div className="h-full">
        <Notifications />
      </div>
    </Layout>
  );
}; 