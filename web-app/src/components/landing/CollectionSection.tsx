import React from 'react';
import styles from './css/CollectionSection.module.css';

const CollectionSection = () => {
  return (
    <section className={styles.collectionSection} aria-labelledby="collection-heading">
      <div className={styles.container}>
        {/* Header Content */}
        <header className={styles.headerContent}>
          <h2 id="collection-heading" className={styles.sectionTitle}>
            Your <span className={styles.titleAccent}>JenGen.ai Membership</span> Benefits
          </h2>
          <p className={styles.subtitle}>
            Each membership provides access to AI-powered storytelling, smart matching, custom learning journeys, 
            and our exclusive private network connecting generations.
          </p>
        </header>

        {/* Collection Info Banner */}
        <div className={styles.infoBanner}>
          <h3 className={styles.bannerTitle}>
            Choose your membership tier and unlock personalized intergenerational experiences designed to bridge wisdom across generations.
          </h3>
          <div className={styles.bannerButtons}>
            <div className={styles.buttonWithBadge}>
              <span className={styles.badge}>Most Popular</span>
              <button className={styles.bannerButton}>
                Join Premium
              </button>
            </div>
            <button className={styles.bannerButtonSecondary}>
              Join Standard
            </button>
            <button className={styles.bannerButtonSecondary}>
              Join Basic
            </button>
            <button className={styles.bannerButtonSecondary}>
              Learn More
            </button>
          </div>
        </div>

        {/* Featured Membership Benefits Display */}
        <div className={styles.nftShowcase}>
          <div className={styles.nftCard}>
            <div className={styles.cardImage}>
              <div className={styles.nftArt}>
                <div className={styles.wisdomBackground}></div>
                <div className={styles.wisdomSymbol}></div>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <h3 className={styles.nftName}>AI-Powered Storytelling</h3>
              <p className={styles.collectionName}>Premium Feature</p>
            </div>
          </div>

          <div className={styles.nftCard}>
            <div className={styles.cardImage}>
              <div className={styles.nftArt}>
                <div className={styles.cosmicBackground}></div>
                <div className={styles.cosmicOrb}></div>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <h3 className={styles.nftName}>Smart Matching</h3>
              <p className={styles.collectionName}>All Memberships</p>
            </div>
          </div>

          <div className={styles.nftCard}>
            <div className={styles.cardImage}>
              <div className={styles.nftArt}>
                <div className={styles.techBackground}></div>
                <div className={styles.techElement}></div>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <h3 className={styles.nftName}>Private Network</h3>
              <p className={styles.collectionName}>Premium & Standard</p>
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className={styles.ctaContainer}>
          <button className={styles.primaryCTA}>
            View All Benefits
          </button>
          <button className={styles.secondaryCTA}>
            Compare Memberships
          </button>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;