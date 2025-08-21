'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Tabbar from './Tabbar';
import DashboardHeader from './DashboardHeader';
import ProfileCard from './ProfileCard';
import { useDeviceType, useIsMobile } from './hooks/useMediaQuery';
import styles from './css/DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  
  const deviceType = useDeviceType();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const profilePanelRef = useRef<HTMLDivElement>(null);
  
  // Check if we're on the profile page
  const isProfilePage = pathname === '/dashboard/profile';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleProfileCard = () => {
    setIsProfileCardOpen(!isProfileCardOpen);
  };

  const closeProfileCard = () => {
    setIsProfileCardOpen(false);
  };

  // Handle outside clicks for profile card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileCardOpen && profilePanelRef.current && !profilePanelRef.current.contains(event.target as Node)) {
        closeProfileCard();
      }
    };

    if (isProfileCardOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileCardOpen]);

  // Determine layout based on device type
  const shouldShowSidebar = !isMobile;
  const shouldShowTabbar = isMobile;
  const shouldShowMobileOverlay = (deviceType === 'tablet' || deviceType === 'mobile') && isSidebarOpen;
  const shouldShowProfilePanel = !isMobile || !isProfilePage;

  return (
    <div className={`
      ${styles.dashboardLayout} 
      ${isMobile ? styles.mobileLayout : ''}
      ${isSidebarCollapsed && !isMobile ? styles.collapsedLayout : ''}
      ${isProfileCardOpen ? styles.profileCardOpen : ''}
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
          onToggleProfileCard={toggleProfileCard}
          showProfileButton={shouldShowProfilePanel}
        />
        
        {/* Dashboard Content */}
        <main className={`
          ${styles.dashboardContent}
          ${shouldShowTabbar ? styles.withTabbar : ''}
        `}>
          {children}
        </main>
      </div>
      
      {/* Profile Card Panel - Hidden on mobile when on profile page */}
      {shouldShowProfilePanel && (
        <div 
          ref={profilePanelRef}
          className={`${styles.profilePanel} ${isProfileCardOpen ? styles.profilePanelOpen : ''}`}
        >
          <ProfileCard 
            user={{
              fullName: "Lee Johnson",
              email: "lee@example.com",
              avatar: "/imgs/lee.png"
            }} 
          />
        </div>
      )}

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