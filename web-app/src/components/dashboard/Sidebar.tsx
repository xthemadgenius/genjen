'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './css/Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    fullName: string;
    email: string;
    avatar?: string;
  };
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', path: '/dashboard/inbox' },
  { id: 'lesson', label: 'Lesson', icon: 'lesson', path: '/dashboard/lessons' },
  { id: 'task', label: 'Task', icon: 'task', path: '/dashboard/tasks' },
  { id: 'group', label: 'Group', icon: 'group', path: '/dashboard/groups' }
];

const friends = [
  { name: 'Prashant', role: 'Software Developer' },
  { name: 'Prashant', role: 'Software Developer' },
  { name: 'Prashant', role: 'Software Developer' }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    // Handle logout logic
    router.push('/');
  };

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'dashboard':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
        );
      case 'inbox':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19 3H4.99c-1.11 0-1.99.89-1.99 2L3 19c0 1.1.88 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H5V5h14v10z"/>
          </svg>
        );
      case 'lesson':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        );
      case 'task':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        );
      case 'group':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1H4zm0-9.5C4 7.12 5.12 6 6.5 6S9 7.12 9 8.5 7.88 11 6.5 11 4 9.88 4 8.5zm11 4.5c1.33 0 4 .67 4 2v1h-4v-1c0-.82-.84-1.55-2-1.82.74-.5 1.42-1.07 2-1.18z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>J</div>
            <span className={styles.logoText}>JENGEN</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className={styles.navigationSection}>
          <h3 className={styles.sectionTitle}>OVERVIEW</h3>
          <nav className={styles.navigation}>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`${styles.navItem} ${pathname === item.path ? styles.navItemActive : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={styles.navIcon}>
                  {renderIcon(item.icon)}
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Friends Section */}
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

        {/* Settings Section */}
        <div className={styles.settingsSection}>
          <h3 className={styles.sectionTitle}>SETTINGS</h3>
          <nav className={styles.navigation}>
            <button
              className={styles.navItem}
              onClick={() => handleNavigation('/dashboard/settings')}
            >
              <span className={styles.navIcon}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
              </span>
              <span className={styles.navLabel}>Settings</span>
            </button>
            
            <button
              className={styles.navItem}
              onClick={handleLogout}
            >
              <span className={styles.navIcon}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
              </span>
              <span className={styles.navLabel}>Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;