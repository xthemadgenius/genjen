'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import HeroBanner from '@/components/dashboard/HeroBanner';
import CourseProgress from '@/components/dashboard/CourseProgress';
import ContinueWatching from '@/components/dashboard/ContinueWatching';
import ProfileCard from '@/components/dashboard/ProfileCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import MentorList from '@/components/dashboard/MentorList';
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
    <DashboardLayout user={user}>
      <div className={styles.dashboardContent}>
        {/* Hero Banner */}
        <HeroBanner />
        
        {/* Course Progress Chips */}
        <CourseProgress />
        
        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column - Primary Content */}
          <div className={styles.leftColumn}>
            <ContinueWatching />
            <TaskList />
          </div>

          {/* Right Column - Profile & Progress */}
          <div className={styles.rightColumn}>
            <ProfileCard user={user} />
            <ProgressChart />
            <MentorList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;