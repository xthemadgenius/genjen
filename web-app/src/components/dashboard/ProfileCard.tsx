'use client';

import React from 'react';
import ProgressChart from './ProgressChart';
import MentorList from './MentorList';
import styles from './css/ProfileCard.module.css';

interface ProfileCardProps {
  user: {
    fullName: string;
    email: string;
    avatar?: string;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user.fullName.split(' ')[0];

  const quickActions = [
    {
      id: 'notifications',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
      ),
      label: 'Notifications'
    },
    {
      id: 'messages',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      ),
      label: 'Messages'
    },
    {
      id: 'calendar',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
        </svg>
      ),
      label: 'Calendar'
    }
  ];


  return (
    <aside className={styles.profileCard} role="complementary" aria-label="User Profile Information">
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.greeting}>
            {getGreeting()} {firstName}
          </div>
          <div className={styles.subtitle}>
            Continue Your Journey And Achieve Your Target
          </div>
        </div>
        
        <div className={styles.userAvatar}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.fullName} />
          ) : (
            <span>{user.fullName.charAt(0)}</span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        {quickActions.map((action) => (
          <button
            key={action.id}
            className={styles.actionButton}
            aria-label={`${action.label} (opens ${action.label.toLowerCase()})`}
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <ProgressChart />

      {/* Your Mentor List */}
      <MentorList />
    </aside>
  );
};

export default ProfileCard;