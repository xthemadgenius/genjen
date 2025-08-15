import React from 'react';
import styles from './css/InsightsSection.module.css';

const InsightsSection = () => {
  return (
    <>
      {/* Blog/Insights Section */}
      <section className={styles.insightsSection}>
        <div className={styles.container}>
          {/* Header Content */}
          <div className={styles.headerContent}>
            {/* Left - Title */}
            <div className={styles.titleArea}>
              <h2 className={styles.mainTitle}>
                Bridging Generations Through<br />
                <span className={styles.titleAccent}>Wisdom & Innovation</span><br />
                for the Future
              </h2>
            </div>

            {/* Right - Description & Button */}
            <div className={styles.contentArea}>
              <p className={styles.description}>
                JenGen AI connects the deep wisdom of elders with cutting-edge technology, 
                creating meaningful bridges between generations while preserving invaluable 
                knowledge for future innovators.
              </p>
              <button className={styles.seeMoreButton}>
                Explore more
              </button>
            </div>
          </div>

          {/* Blog Cards */}
          <div className={styles.blogCards}>
            {/* Card 1 */}
            <div className={styles.blogCard}>
              <div className={`${styles.tagDot} ${styles.blueDot}`}></div>
              <div className={styles.cardContent}>
                <div className={styles.readTime}>3 min read</div>
                <h3 className={styles.cardTitle}>
                  How Elder Wisdom Transforms Modern Technology
                </h3>
                <p className={styles.cardDescription}>
                  Discover how decades of experience and traditional knowledge 
                  can enhance AI development and create more meaningful...
                </p>
                <button className={styles.cardButton}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16667 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" 
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className={styles.blogCard}>
              <div className={`${styles.tagDot} ${styles.orangeDot}`}></div>
              <div className={styles.cardContent}>
                <div className={styles.readTime}>4 min read</div>
                <h3 className={styles.cardTitle}>
                  Building Bridges: The Future of Intergenerational AI
                </h3>
                <p className={styles.cardDescription}>
                  Explore innovative approaches to connecting different generations 
                  through technology while preserving cultural heritage and...
                </p>
                <button className={styles.cardButton}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16667 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" 
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className={styles.blogCard}>
              <div className={`${styles.tagDot} ${styles.purpleDot}`}></div>
              <div className={styles.cardContent}>
                <div className={styles.readTime}>6 min read</div>
                <h3 className={styles.cardTitle}>
                  Unlocking Hidden Potential: Stories from JenGen Community
                </h3>
                <p className={styles.cardDescription}>
                  Real stories of how our platform has enabled meaningful 
                  connections and knowledge transfer between generations...
                </p>
                <button className={styles.cardButton}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16667 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" 
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            Ready to bridge generations?
          </h2>
          <button className={styles.getStartedButton}>
            Join the Community
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4.16667 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>
    </>
  );
};

export default InsightsSection;