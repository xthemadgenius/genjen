'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileCard from '@/components/dashboard/profile/ProfileCard';
import styles from './profile.module.css';

const ProfilePage = () => {
  // Mock user data - in real app this would come from authentication/context
  const user = {
    fullName: 'Lee Johnson',
    email: 'lee@example.com',
    avatar: '/imgs/lee.png'
  };

  return (
    <DashboardLayout>
      <div className={styles.profileContent}>
        <div className={styles.profileContainer}>
          <ProfileCard user={user} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;