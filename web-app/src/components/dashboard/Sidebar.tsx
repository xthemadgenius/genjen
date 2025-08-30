'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import NavItem, { NavItemData } from './NavItem';
import { useDeviceType } from './hooks/useMediaQuery';
import styles from './css/Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const navigationItems: NavItemData[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
      </svg>
    )
  },
  {
    id: 'inbox',
    label: 'Inbox',
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M19 3H4.99c-1.11 0-1.99.89-1.99 2L3 19c0 1.1.88 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H5V5h14v10z"/>
      </svg>
    ),
    badge: (
      <div className={styles.sandTimerBadge}>
        <svg viewBox="0 0 24 24" width="10" height="10" fill="white">
          <path d="M6,2V8H6.15L4,10.15V14.85L6.15,17H6V22H18V17H17.85L20,14.85V10.15L17.85,8H18V2H6M16,16.5L12,12.5L8,16.5V17H16V16.5M12,11.5L16,7.5V7H8V7.5L12,11.5M8,4H16V6H8V4M8,20V18H16V20H8Z"/>
        </svg>
      </div>
    )
  },
  {
    id: 'courses',
    label: 'Courses',
    path: '/dashboard/courses',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    )
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
    badge: (
      <div className={styles.sandTimerBadge}>
        <svg viewBox="0 0 24 24" width="10" height="10" fill="white">
          <path d="M6,2V8H6.15L4,10.15V14.85L6.15,17H6V22H18V17H17.85L20,14.85V10.15L17.85,8H18V2H6M16,16.5L12,12.5L8,16.5V17H16V16.5M12,11.5L16,7.5V7H8V7.5L12,11.5M8,4H16V6H8V4M8,20V18H16V20H8Z"/>
        </svg>
      </div>
    )
  },
  {
    id: 'groups',
    label: 'Groups',
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1H4zm0-9.5C4 7.12 5.12 6 6.5 6S9 7.12 9 8.5 7.88 11 6.5 11 4 9.88 4 8.5zm11 4.5c1.33 0 4 .67 4 2v1h-4v-1c0-.82-.84-1.55-2-1.82.74-.5 1.42-1.07 2-1.18z"/>
      </svg>
    ),
    badge: (
      <div className={styles.sandTimerBadge}>
        <svg viewBox="0 0 24 24" width="10" height="10" fill="white">
          <path d="M6,2V8H6.15L4,10.15V14.85L6.15,17H6V22H18V17H17.85L20,14.85V10.15L17.85,8H18V2H6M16,16.5L12,12.5L8,16.5V17H16V16.5M12,11.5L16,7.5V7H8V7.5L12,11.5M8,4H16V6H8V4M8,20V18H16V20H8Z"/>
        </svg>
      </div>
    )
  }
];

const friends = [
  { name: 'Lee', role: 'Global Leader' },
  { name: 'Kirstine', role: 'Mind Master' },
  { name: 'Peter', role: 'Professor' }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  isCollapsed, 
  onClose, 
  onToggleCollapse
}) => {
  const router = useRouter();
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const deviceType = useDeviceType();
  const shouldAutoCollapse = deviceType === 'tablet';

  const handleNavItemClick = () => {
    if (deviceType === 'mobile' || deviceType === 'tablet') {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Disconnect from WalletConnect/AppKit
      if (isConnected) {
        try {
          // Open account view for manual disconnect
          await open({ view: 'Account' });
        } catch (disconnectError) {
          console.log('Wallet disconnect handled by user or already disconnected');
        }
      }
      
      // Clear all local and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('✅ Logout successful, redirecting to home...');
      
      // Redirect to home page
      router.push('/');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear storage and redirect even if API fails
      localStorage.clear();
      sessionStorage.clear();
      router.push('/');
    }
  };

  const effectiveCollapsed = isCollapsed || shouldAutoCollapse;

  const settingsItems: NavItemData[] = [
    {
      id: 'settings',
      label: 'Settings',
      path: '/dashboard/settings',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
      )
    }
  ];

  return (
    <>
      <div 
        className={`
          ${styles.sidebar} 
          ${isOpen ? styles.sidebarOpen : ''} 
          ${effectiveCollapsed ? styles.sidebarCollapsed : ''}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>J</div>
            {!effectiveCollapsed && (
              <span className={styles.logoText}>JENGEN</span>
            )}
          </div>
          
          {/* Collapse Toggle - Desktop Only */}
          {deviceType === 'desktop' && (
            <button
              className={styles.collapseToggle}
              onClick={onToggleCollapse}
              aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!effectiveCollapsed}
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path 
                  fill="currentColor" 
                  d={effectiveCollapsed 
                    ? "M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"
                    : "M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z"
                  }
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className={styles.navigationSection}>
          {!effectiveCollapsed && (
            <h3 className={styles.sectionTitle}>OVERVIEW</h3>
          )}
          <nav className={styles.navigation} role="menu">
            {navigationItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                variant="sidebar"
                collapsed={effectiveCollapsed}
                onClick={handleNavItemClick}
              />
            ))}
          </nav>
        </div>

        {/* Friends Section - Hidden when collapsed */}
        {!effectiveCollapsed && (
          <div className={styles.friendsSection}>
            <h3 className={styles.sectionTitle}>FRIENDS</h3>
            <div className={styles.friendsList}>
              {friends.map((friend, index) => (
                <div key={index} className={styles.friendItem}>
                  <div className={styles.friendAvatar}>
                    <span>{friend.name.charAt(0)}</span>
                  </div>
                  <div className={styles.friendInfo}>
                    <span className={styles.friendName}>{friend.name}</span>
                    <span className={styles.friendRole}>{friend.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Section */}
        <div className={styles.settingsSection}>
          {!effectiveCollapsed && (
            <h3 className={styles.sectionTitle}>SETTINGS</h3>
          )}
          <nav className={styles.navigation} role="menu">
            {settingsItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                variant="sidebar"
                collapsed={effectiveCollapsed}
                onClick={handleNavItemClick}
              />
            ))}
            
            <button
              className={`${styles.logoutButton} ${effectiveCollapsed ? styles.collapsed : ''}`}
              onClick={handleLogout}
              aria-label="Logout"
              title={effectiveCollapsed ? 'Logout' : undefined}
            >
              <span className={styles.logoutIcon}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
              </span>
              {!effectiveCollapsed && (
                <span className={styles.logoutLabel}>Logout</span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
export { navigationItems };