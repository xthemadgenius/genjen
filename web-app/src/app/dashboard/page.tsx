'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import HeroBanner from '@/components/dashboard/HeroBanner';
import CourseProgress from '@/components/dashboard/CourseProgress';
import ContinueWatching from '@/components/dashboard/ContinueWatching';
import TaskList from '@/components/dashboard/TaskList';
import styles from './dashboard.module.css';

const DashboardPage = () => {

  return (
    <DashboardLayout>
      <div className={styles.dashboardContent}>
        {/* Main Content - Full Width */}
        <div className={styles.mainContent}>
          {/* Hero Banner */}
          <HeroBanner />
          {/* Course Progress Chips */}
          <CourseProgress />
          <ContinueWatching />
          <TaskList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;