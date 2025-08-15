import React from 'react';
import styles from './css/CollectionSection.module.css';

const CollectionSection = () => {
  return (
    <section className={styles.collectionSection}>
      <div className={styles.container}>
        {/* Header Content */}
        <div className={styles.headerContent}>
          <h2 className={styles.sectionTitle}>
            Explore the Traits That Make Each <span className={styles.titleAccent}>Wisdom Token</span> Special
          </h2>
          <p className={styles.subtitle}>
            Each token is uniquely generated from 100+ rare attributes representing different aspects 
            of generational wisdom, making every piece truly one of a kind.
          </p>
        </div>

        {/* Featured NFT Cards Display */}
        <div className={styles.nftShowcase}>
          <div className={styles.nftCard}>
            <div className={styles.cardContent}>
              <div className={styles.cardImage}>
                <div className={styles.nftArt}>
                  <div className={styles.wisdomSymbol1}></div>
                  <div className={styles.wisdomSymbol2}></div>
                  <div className={styles.cardGlow}></div>
                </div>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.nftName}>Elder Wisdom #1</h3>
                <p className={styles.collectionName}>JenGen Collection</p>
              </div>
            </div>
          </div>

          <div className={`${styles.nftCard} ${styles.featuredCard}`}>
            <div className={styles.cardContent}>
              <div className={styles.cardImage}>
                <div className={styles.nftArt}>
                  <div className={styles.cosmicBackground}></div>
                  <div className={styles.wisdomOrb}></div>
                  <div className={styles.cardGlow}></div>
                </div>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.nftName}>Bridge Builder #2</h3>
                <p className={styles.collectionName}>JenGen Collection</p>
              </div>
            </div>
          </div>

          <div className={styles.nftCard}>
            <div className={styles.cardContent}>
              <div className={styles.cardImage}>
                <div className={styles.nftArt}>
                  <div className={styles.techPattern}></div>
                  <div className={styles.generationRing}></div>
                  <div className={styles.cardGlow}></div>
                </div>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.nftName}>Future Legacy #3</h3>
                <p className={styles.collectionName}>JenGen Collection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Info Banner */}
        <div className={styles.infoBanner}>
          <h3 className={styles.bannerTitle}>
            A collection of unique generative wisdom tokens representing the bridge between generations
          </h3>
          <div className={styles.bannerButtons}>
            <button className={styles.bannerButton}>
              <span className={styles.badge}>Most Popular</span>
              Explore Collection
            </button>
            <button className={styles.bannerButtonSecondary}>
              View Traits
            </button>
            <button className={styles.bannerButtonSecondary}>
              Rarity Guide
            </button>
            <button className={styles.bannerButtonSecondary}>
              Mint Now
            </button>
          </div>
        </div>

        {/* Traits Grid */}
        <div className={styles.traitsGrid}>
          <div className={styles.traitCard}>
            <div className={styles.traitIcon}>
              <div className={styles.traitWisdom}></div>
              <div className={styles.iconGlow}></div>
            </div>
            <h4 className={styles.traitTitle}>Ancient Wisdom</h4>
            <p className={styles.traitDescription}>
              Traditional knowledge patterns representing centuries of accumulated experience.
            </p>
            <div className={styles.rarityBadge}>Rarity: 12%</div>
          </div>

          <div className={styles.traitCard}>
            <div className={styles.traitIcon}>
              <div className={styles.traitTech}></div>
              <div className={styles.iconGlow}></div>
            </div>
            <h4 className={styles.traitTitle}>Future Innovation</h4>
            <p className={styles.traitDescription}>
              Cutting-edge technological elements that represent forward-thinking approaches.
            </p>
            <div className={styles.rarityBadge}>Rarity: 8%</div>
          </div>

          <div className={styles.traitCard}>
            <div className={styles.traitIcon}>
              <div className={styles.traitBridge}></div>
              <div className={styles.iconGlow}></div>
            </div>
            <h4 className={styles.traitTitle}>Generation Bridge</h4>
            <p className={styles.traitDescription}>
              Unique connective elements that symbolize the bond between different generations.
            </p>
            <div className={styles.rarityBadge}>Rarity: 15%</div>
          </div>

          <div className={styles.traitCard}>
            <div className={styles.traitIcon}>
              <div className={styles.traitCosmic}></div>
              <div className={styles.iconGlow}></div>
            </div>
            <h4 className={styles.traitTitle}>Cosmic Heritage</h4>
            <p className={styles.traitDescription}>
              Rare cosmic-themed backgrounds that represent timeless universal wisdom.
            </p>
            <div className={styles.rarityBadge}>Rarity: 5%</div>
          </div>

          <div className={styles.traitCard}>
            <div className={styles.traitIcon}>
              <div className={styles.traitCommunity}></div>
              <div className={styles.iconGlow}></div>
            </div>
            <h4 className={styles.traitTitle}>Community Spirit</h4>
            <p className={styles.traitDescription}>
              Collaborative elements that showcase the power of intergenerational cooperation.
            </p>
            <div className={styles.rarityBadge}>Rarity: 20%</div>
          </div>

          <div className={styles.traitCard}>
            <div className={styles.traitIcon}>
              <div className={styles.traitLegacy}></div>
              <div className={styles.iconGlow}></div>
            </div>
            <h4 className={styles.traitTitle}>Living Legacy</h4>
            <p className={styles.traitDescription}>
              Special attributes that represent the continuation of wisdom through time.
            </p>
            <div className={styles.rarityBadge}>Rarity: 3%</div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className={styles.ctaContainer}>
          <button className={styles.primaryCTA}>
            View All Traits
          </button>
          <button className={styles.secondaryCTA}>
            See Full Rarity Chart
          </button>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;