'use client';

import React from 'react';
import styles from './css/HeroBanner.module.css';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title = "Sharpen Your Skills With Professional Online Courses",
  subtitle = "ONLINE COURSE",
  ctaText = "Join Now",
  onCtaClick = () => console.log('Join Now clicked')
}) => {
  return (
    <main className={styles.heroBanner} role="banner" aria-label="Course promotion banner">
      <div className={styles.content}>
        <div className={styles.textContent}>
          <span className={styles.subtitle}>{subtitle}</span>
          <h1 className={styles.title}>{title}</h1>
          <button 
            className={styles.ctaButton}
            onClick={onCtaClick}
            aria-label={ctaText}
          >
            <span>{ctaText}</span>
            <div className={styles.playIcon}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </button>
        </div>
        
        {/* Decorative Elements */}
        <div className={styles.decorativeElements}>
          <div className={styles.sparkle1}>
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className={styles.sparkle2}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className={styles.sparkle3}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroBanner;