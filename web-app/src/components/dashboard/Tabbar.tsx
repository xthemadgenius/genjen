'use client';

import React from 'react';
import NavItem, { NavItemData } from './NavItem';
import { navigationItems } from './Sidebar';
import styles from './css/Tabbar.module.css';

interface TabbarProps {
  className?: string;
}

// Select key navigation items for mobile tabbar
const mobileNavItems: NavItemData[] = [
  navigationItems[0], // Dashboard
  {
    id: 'inbox',
    label: 'Inbox',
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24">
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
  navigationItems[2], // Courses
  {
    id: 'tasks',
    label: 'Tasks', 
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24">
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
    id: 'profile',
    label: 'Profile',
    path: '/dashboard/profile',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    )
  }
];

const Tabbar: React.FC<TabbarProps> = ({ className = '' }) => {
  return (
    <nav 
      className={`${styles.tabbar} ${className}`}
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className={styles.tabbarContent}>
        {mobileNavItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            variant="tabbar"
          />
        ))}
      </div>
    </nav>
  );
};

export default Tabbar;