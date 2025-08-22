'use client';

import React from 'react';
import styles from './css/CourseTabs.module.css';

type TabType = 'about' | 'details' | 'review' | 'resources';

interface CourseTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const CourseTabs: React.FC<CourseTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'about', label: 'About' },
    { id: 'details', label: 'Details' },
    { id: 'review', label: 'Review' },
    { id: 'resources', label: 'Resources' }
  ];

  return (
    <div className={styles.courseTabs}>
      <div className={styles.tabsList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabIndicator} />
    </div>
  );
};

export default CourseTabs;