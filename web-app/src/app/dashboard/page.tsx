'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ContinueWatching from '@/components/dashboard/ContinueWatching';
import MentorList from '@/components/dashboard/MentorList';
import ProgressChart from '@/components/dashboard/ProgressChart';
import AnalyticsBlock from '@/components/dashboard/AnalyticsBlock';
import styles from './dashboard.module.css';

const DashboardPage = () => {
  // Mock user data - in real app this would come from authentication/context
  const user = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    avatar: undefined // This would typically be a URL to user's profile image
  };

  return (
    <DashboardLayout user={user}>
      <div className={styles.dashboardContent}>
        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column - Primary Content */}
          <div className={styles.leftColumn}>
            <ContinueWatching />
            <MentorList />
          </div>

          {/* Right Column - Analytics & Progress */}
          <div className={styles.rightColumn}>
            <AnalyticsBlock />
            <ProgressChart />
          </div>
        </div>

        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, {user.fullName.split(' ')[0]}! 👋
            </h1>
            <p className={styles.welcomeSubtitle}>
              Continue your learning journey and achieve your goals with JenGen AI
            </p>
            
            <div className={styles.quickStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>12</span>
                <span className={styles.statLabel}>Courses Enrolled</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>87%</span>
                <span className={styles.statLabel}>Average Score</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>156h</span>
                <span className={styles.statLabel}>Total Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;