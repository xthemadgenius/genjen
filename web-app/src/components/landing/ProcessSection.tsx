import React from 'react';
import styles from './css/ProcessSection.module.css';

const ProcessSection = () => {
  return (
    <section className={styles.processSection} aria-labelledby="process-heading">
      {/* Header Section */}
      <header className={styles.header}>
        <h2 id="process-heading" className={styles.headerTitle}>
          There&apos;s Genius <span className={styles.headerTitleArt}>Elders Haven&apos;t Tapped</span>
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
            
            <h3 className={styles.cardTitle}>Create Profile</h3>
            <p className={styles.cardDescription}>
              Set up your personal profile to share your story, experiences, and 
              interests with our intergenerational community.
            </p>
            <button className={styles.cardButton}>
              Get Started
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
            
            <h3 className={styles.cardTitle}>Smart Matching</h3>
            <p className={styles.cardDescription}>
              Our AI instantly connects you with compatible mentors or mentees 
              based on shared interests and learning goals.
            </p>
            <button className={styles.cardButton}>
              Find Matches
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
            
            <h3 className={styles.cardTitle}>Join Community</h3>
            <p className={styles.cardDescription}>
              Access our private network of wisdom seekers and share knowledge 
              through meaningful conversations and connections.
            </p>
            <button className={styles.cardButton}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;