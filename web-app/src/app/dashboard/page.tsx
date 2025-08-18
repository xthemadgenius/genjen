'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import HeroBanner from '@/components/dashboard/HeroBanner';
import CourseProgress from '@/components/dashboard/CourseProgress';
import ContinueWatching from '@/components/dashboard/ContinueWatching';
import ProfileCard from '@/components/dashboard/ProfileCard';
import TaskList from '@/components/dashboard/TaskList';
import styles from './dashboard.module.css';

const DashboardPage = () => {
  // Mock user data - in real app this would come from authentication/context
  const user = {
    fullName: 'Prashant Kumar Singh',
    email: 'prashant@example.com',
    avatar: undefined // This would typically be a URL to user's profile image
  };

  return (
    <DashboardLayout>
      <div className={styles.dashboardContent}>
        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column - Primary Content */}
          <div className={styles.leftColumn}>
            {/* Hero Banner */}
            <HeroBanner />
            {/* Course Progress Chips */}
            <CourseProgress />
            <ContinueWatching />
            <TaskList />
          </div>

          {/* Right Column - Profile & Progress */}
          <div className={styles.rightColumn}>
            <ProfileCard user={user} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;