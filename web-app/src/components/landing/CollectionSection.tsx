import React from 'react';
import styles from './css/CollectionSection.module.css';

const CollectionSection = () => {
  return (
    <section className={styles.collectionSection}>
      <div className={styles.container}>
        {/* Header Content */}
        <div className={styles.headerContent}>
          <h2 className={styles.sectionTitle}>
            About Your Unique <span className={styles.titleAccent}>Wisdom Collection</span>
          </h2>
          <p className={styles.subtitle}>
            Each token is uniquely generated from 100+ rare attributes representing different aspects 
            of generational wisdom, making every piece truly one of a kind.
          </p>
        </div>

        {/* Collection Info Banner */}
        <div className={styles.infoBanner}>
          <h3 className={styles.bannerTitle}>
            A collection of unique generative 10,000 collectible wisdom tokens with randomly generated set of attributes.
          </h3>
          <div className={styles.bannerButtons}>
            <button className={styles.bannerButton}>
              <span className={styles.badge}>Most Popular</span>
              Get from JenGenAI
            </button>
            <button className={styles.bannerButtonSecondary}>
              Get from JenGenAI
            </button>
            <button className={styles.bannerButtonSecondary}>
              Get from JenGenAI
            </button>
            <button className={styles.bannerButtonSecondary}>
              Get from JenGenAI
            </button>
          </div>
        </div>

        {/* Featured NFT Cards Display */}
        <div className={styles.nftShowcase}>
          <div className={styles.nftCard}>
            <div className={styles.cardImage}>
              <div className={styles.nftArt}>
                <div className={styles.wisdomBackground}></div>
                <div className={styles.wisdomSymbol}></div>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <h3 className={styles.nftName}>Wisdom Token</h3>
              <p className={styles.collectionName}>Collection name</p>
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
              <h3 className={styles.nftName}>Wisdom Token</h3>
              <p className={styles.collectionName}>Collection name</p>
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
              <h3 className={styles.nftName}>Wisdom Token</h3>
              <p className={styles.collectionName}>Collection name</p>
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className={styles.ctaContainer}>
          <button className={styles.primaryCTA}>
            View All Traits
          </button>
          <button className={styles.secondaryCTA}>
            See Full Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;