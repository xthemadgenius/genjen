'use client';

import React from 'react';
import { TabType } from './Courses';
import styles from './css/CourseTabs.module.css';

interface CourseTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'all' as TabType, label: 'All' },
  { id: 'active' as TabType, label: 'Active' },
  { id: 'completed' as TabType, label: 'Completed' }
];

const CourseTabs: React.FC<CourseTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList} role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseTabs;