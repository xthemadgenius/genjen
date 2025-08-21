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
  navigationItems[1], // Inbox  
  navigationItems[2], // Courses
  navigationItems[3], // Tasks
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