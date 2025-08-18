'use client';

import React from 'react';
import styles from './css/AnalyticsBlock.module.css';

interface AnalyticsData {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  color: 'purple' | 'blue' | 'green' | 'orange';
}

interface AnalyticsBlockProps {
  analytics?: AnalyticsData[];
}

const defaultAnalytics: AnalyticsData[] = [
  {
    label: 'Total Courses',
    value: 24,
    change: 12,
    icon: 'courses',
    color: 'purple'
  },
  {
    label: 'Hours Learned',
    value: '156h',
    change: 8.5,
    icon: 'time',
    color: 'blue'
  },
  {
    label: 'Certificates',
    value: 8,
    change: 25,
    icon: 'certificate',
    color: 'green'
  },
  {
    label: 'Avg. Score',
    value: '92%',
    change: 5.2,
    icon: 'score',
    color: 'orange'
  }
];

const AnalyticsBlock: React.FC<AnalyticsBlockProps> = ({ analytics = defaultAnalytics }) => {
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'courses':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        );
      case 'time':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path fill="currentColor" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        );
      case 'certificate':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'score':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return {
          background: styles.purpleBackground,
          icon: styles.purpleIcon,
          accent: styles.purpleAccent
        };
      case 'blue':
        return {
          background: styles.blueBackground,
          icon: styles.blueIcon,
          accent: styles.blueAccent
        };
      case 'green':
        return {
          background: styles.greenBackground,
          icon: styles.greenIcon,
          accent: styles.greenAccent
        };
      case 'orange':
        return {
          background: styles.orangeBackground,
          icon: styles.orangeIcon,
          accent: styles.orangeAccent
        };
      default:
        return {
          background: styles.purpleBackground,
          icon: styles.purpleIcon,
          accent: styles.purpleAccent
        };
    }
  };

  return (
    <section className={styles.analyticsBlock}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Your Analytics</h2>
        <button className={styles.viewDetailsBtn}>
          View Details
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/>
          </svg>
        </button>
      </div>

      <div className={styles.analyticsGrid}>
        {analytics.map((item, index) => {
          const colorClasses = getColorClasses(item.color);
          const isPositiveChange = item.change > 0;
          
          return (
            <div key={index} className={styles.analyticsCard}>
              <div className={`${styles.cardHeader} ${colorClasses.background}`}>
                <div className={`${styles.iconWrapper} ${colorClasses.icon}`}>
                  {renderIcon(item.icon)}
                </div>
                <div className={styles.changeIndicator}>
                  <svg 
                    viewBox="0 0 24 24" 
                    width="14" 
                    height="14"
                    className={isPositiveChange ? styles.positiveArrow : styles.negativeArrow}
                  >
                    {isPositiveChange ? (
                      <path fill="currentColor" d="M7 14l5-5 5 5z"/>
                    ) : (
                      <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                    )}
                  </svg>
                  <span className={isPositiveChange ? styles.positiveChange : styles.negativeChange}>
                    {Math.abs(item.change)}%
                  </span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.analyticsValue}>{item.value}</div>
                <div className={styles.analyticsLabel}>{item.label}</div>
                
                {/* Mini progress indicator */}
                <div className={styles.miniProgress}>
                  <div className={`${styles.miniProgressBar} ${colorClasses.accent}`}>
                    <div 
                      className={styles.miniProgressFill}
                      style={{ width: `${Math.min(item.change + 50, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Insights */}
      <div className={styles.quickInsights}>
        <div className={styles.insightItem}>
          <div className={styles.insightIcon}>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className={styles.insightText}>
            <span className={styles.insightLabel}>Best Performance</span>
            <span className={styles.insightValue}>Frontend Development</span>
          </div>
        </div>

        <div className={styles.insightItem}>
          <div className={styles.insightIcon}>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
            </svg>
          </div>
          <div className={styles.insightText}>
            <span className={styles.insightLabel}>Learning Streak</span>
            <span className={styles.insightValue}>5 days</span>
          </div>
        </div>

        <div className={styles.insightItem}>
          <div className={styles.insightIcon}>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className={styles.insightText}>
            <span className={styles.insightLabel}>Next Achievement</span>
            <span className={styles.insightValue}>Expert Badge</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsBlock;