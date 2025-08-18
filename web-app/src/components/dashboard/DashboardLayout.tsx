'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Tabbar from './Tabbar';
import DashboardHeader from './DashboardHeader';
import { useDeviceType, useIsMobile } from './hooks/useMediaQuery';
import styles from './css/DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const deviceType = useDeviceType();
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Determine layout based on device type
  const shouldShowSidebar = !isMobile;
  const shouldShowTabbar = isMobile;
  const shouldShowMobileOverlay = (deviceType === 'tablet' || deviceType === 'mobile') && isSidebarOpen;

  return (
    <div className={`
      ${styles.dashboardLayout} 
      ${isMobile ? styles.mobileLayout : ''}
      ${isSidebarCollapsed && !isMobile ? styles.collapsedLayout : ''}
    `}>
      {/* Sidebar - Hidden on Mobile */}
      {shouldShowSidebar && (
        <Sidebar 
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={closeSidebar}
          onToggleCollapse={toggleSidebarCollapse}
        />
      )}
      
      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Dashboard Header */}
        <DashboardHeader 
          onToggleSidebar={toggleSidebar}
        />
        
        {/* Dashboard Content */}
        <main className={`
          ${styles.dashboardContent}
          ${shouldShowTabbar ? styles.withTabbar : ''}
        `}>
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Tabbar */}
      {shouldShowTabbar && (
        <Tabbar />
      )}
      
      {/* Mobile/Tablet Overlay */}
      {shouldShowMobileOverlay && (
        <div 
          className={styles.mobileOverlay}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
export type { DashboardLayoutProps };