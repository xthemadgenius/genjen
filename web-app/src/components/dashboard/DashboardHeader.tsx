'use client';

import React, { useState } from 'react';
import styles from './css/DashboardHeader.module.css';

interface DashboardHeaderProps {
  user: {
    fullName: string;
    email: string;
    avatar?: string;
  };
  onToggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user.fullName.split(' ')[0];

  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerLeft}>
        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {/* Search Bar */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search your course here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </form>
      </div>

      <div className={styles.headerRight}>
        {/* Notifications */}
        <button className={styles.notificationBtn} aria-label="Notifications">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          <span className={styles.notificationBadge}>3</span>
        </button>

        {/* User Profile */}
        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <span className={styles.greeting}>{getGreeting()} {firstName}</span>
            <span className={styles.subtitle}>Continue Your Journey And Achieve Your Target</span>
          </div>
          <div className={styles.userAvatar}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} />
            ) : (
              <span>{user.fullName.charAt(0)}</span>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <button className={styles.actionBtn} aria-label="Notifications">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </button>
            
            <button className={styles.actionBtn} aria-label="Messages">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </button>
            
            <button className={styles.actionBtn} aria-label="Calendar">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* More Options */}
        <button className={styles.moreOptionsBtn} aria-label="More options">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;