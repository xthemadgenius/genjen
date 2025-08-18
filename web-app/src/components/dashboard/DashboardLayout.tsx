'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import styles from './css/DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    fullName: string;
    email: string;
    avatar?: string;
  };
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
      />
      
      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Dashboard Header */}
        <DashboardHeader 
          user={user}
          onToggleSidebar={toggleSidebar}
        />
        
        {/* Dashboard Content */}
        <main className={styles.dashboardContent}>
          {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;