import React from 'react';
import styles from './css/InsightsSection.module.css';

const InsightsSection = () => {
  return (
    <>
      {/* Blog/Insights Section */}
      <section className={styles.insightsSection} aria-labelledby="insights-heading">
        <div className={styles.container}>
          {/* Header Content */}
          <div className={styles.headerContent}>
            {/* Left - Title */}
            <div className={styles.titleArea}>
              <h2 id="insights-heading" className={styles.mainTitle}>
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
              <button className={styles.seeMoreButton} aria-label="Explore more insights about bridging generations">
                Explore more
              </button>
            </div>
          </div>

          {/* Blog Cards */}
          <div className={styles.blogCards} role="list" aria-label="Featured insights and articles">
            {/* Card 1 */}
            <article className={styles.blogCard} role="listitem">
              <div className={`${styles.tagDot} ${styles.blueDot}`} aria-hidden="true"></div>
              <div className={styles.cardContent}>
                <div className={styles.readTime}>Premium Membership</div>
                <h3 className={styles.cardTitle}>
                  AI-Powered Storytelling
                </h3>
                <p className={styles.cardDescription}>
                  Transform personal experiences into compelling narratives with AI assistance. 
                  Create lasting legacies through personalized story creation tools...
                </p>
                <button className={styles.cardButton} aria-label="Read full article: Wisdom Transformers">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4.16667 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" 
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </article>

            {/* Card 2 */}
            <div className={styles.blogCard}>
              <div className={`${styles.tagDot} ${styles.orangeDot}`}></div>
              <div className={styles.cardContent}>
                <div className={styles.readTime}>Standard Membership</div>
                <h3 className={styles.cardTitle}>
                  Smart Matching & Learning
                </h3>
                <p className={styles.cardDescription}>
                  Connect with mentors and mentees through intelligent matching algorithms. 
                  Access custom learning journeys tailored to your goals and interests...
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
                <div className={styles.readTime}>Basic Membership</div>
                <h3 className={styles.cardTitle}>
                  Community Access
                </h3>
                <p className={styles.cardDescription}>
                  Join our growing community of intergenerational learners. 
                  Participate in discussions and connect with wisdom seekers worldwide...
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