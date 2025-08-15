import React from 'react';
import styles from './css/ProcessSection.module.css';

const ProcessSection = () => {
  return (
    <section className={styles.processSection} aria-labelledby="process-heading">
      {/* Header Section */}
      <header className={styles.header}>
        <h2 id="process-heading" className={styles.headerTitle}>
          There's Genius <span className={styles.headerTitleArt}>Elders Haven't Tapped</span>
        </h2>
      </header>

      {/* Container */}
      <div className={styles.container}>
        {/* Floating Testimonial Badges */}
        <div className={styles.testimonialLeft}>
          <div className={styles.testimonialCard}>
            <div className={`${styles.testimonialAvatar} ${styles.avatarAnna}`}></div>
            <div className={styles.testimonialInfo}>
              <h3>Anna May</h3>
              <p>Donated $100</p>
            </div>
          </div>
        </div>

        <div className={styles.testimonialRight}>
          <div className={styles.testimonialCard}>
            <div className={`${styles.testimonialAvatar} ${styles.avatarJane}`}></div>
            <div className={styles.testimonialInfo}>
              <h3>Jane Holand</h3>
              <p>Donated $500</p>
            </div>
          </div>
        </div>

        {/* Connection Lines */}
        <div className={styles.connectionLines}>
          <div className={styles.dashedLine}></div>
          <div className={styles.dashedLine}></div>
        </div>

        {/* Process Cards Grid */}
        <div className={styles.processGrid}>
          {/* Create Card */}
          <div className={styles.processCard}>
            {/* Gradient sphere accent */}
            <div className={styles.gradientSphere1}></div>
            
            {/* Collection Icon */}
            <div className={styles.cardIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            
            <h3 className={styles.cardTitle}>Create</h3>
            <p className={styles.cardDescription}>
              Click My Collections and set up your collection. Add a description, 
              profile & banner images, and set a secondary sales fee.
            </p>
            <button className={styles.cardButton}>
              Create
            </button>
          </div>

          {/* Instant Payment Card */}
          <div className={styles.processCard}>
            {/* Gradient sphere accent */}
            <div className={styles.gradientSphere2}></div>
            
            {/* Payment/Clock Icon */}
            <div className={styles.cardIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className={styles.cardTitle}>Instant payment</h3>
            <p className={styles.cardDescription}>
              Put NFTs on sale or on auction. Get paid for your digital collectables
            </p>
            <button className={styles.cardButton}>
              Sale now
            </button>
          </div>

          {/* Set up Wallet Card */}
          <div className={styles.processCard}>
            {/* Gradient sphere accent */}
            <div className={styles.gradientSphere3}></div>
            
            {/* Wallet Icon */}
            <div className={styles.cardIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            
            <h3 className={styles.cardTitle}>Set up your wallet</h3>
            <p className={styles.cardDescription}>
              Once you&apos;ve set up your wallet of choice, connect it by clicking 
              the wallet icon in the top right corner.
            </p>
            <button className={styles.cardButton}>
              Connect
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;