import React from 'react';
import styles from './css/FeaturesSection.module.css';

const FeaturesSection = () => {
  return (
    <section className={styles.featuresSection}>
      {/* Left Content */}
      <div className={styles.leftContent}>
        <div className={styles.featuresLabel}>FEATURES</div>
        <div className={styles.titleContainer}>
          <div className={styles.accentLine}></div>
          <h2 className={styles.sectionTitle}>
            We are platform for<br />
            everyone
          </h2>
        </div>
        <button className={styles.ctaButton}>
          Mint purpose
        </button>
      </div>

      {/* Main Visual Area */}
      <div className={styles.visualArea}>
        {/* Radial Grid Background */}
        <div className={styles.radialGrid}>
          <div className={`${styles.gridCircle} ${styles.circle1}`}></div>
          <div className={`${styles.gridCircle} ${styles.circle2}`}></div>
          <div className={`${styles.gridCircle} ${styles.circle3}`}></div>
          <div className={`${styles.gridCircle} ${styles.circle4}`}></div>
          <div className={`${styles.gridLine} ${styles.lineVertical}`}></div>
          <div className={`${styles.gridLine} ${styles.lineHorizontal}`}></div>
          <div className={`${styles.gridLine} ${styles.lineDiagonal1}`}></div>
          <div className={`${styles.gridLine} ${styles.lineDiagonal2}`}></div>
        </div>

        {/* Decorative 3D Spheres */}
        <div className={styles.decorativeSphere1}></div>
        <div className={styles.decorativeSphere2}></div>
        <div className={styles.decorativeSphere3}></div>
        <div className={styles.decorativeSphere4}></div>

        {/* Feature Bubbles */}
        {/* Top Right - Lounge */}
        <div className={`${styles.featureBubble} ${styles.bubbleTopRight}`}>
          <div className={styles.imageContainer}>
            <div className={styles.imageLounge}>
              <div className={styles.loungeBackground}></div>
              <div className={styles.loungeElements}>
                <div className={styles.loungeSeating}></div>
                <div className={styles.loungeAccent}></div>
                <div className={styles.loungeWindow}></div>
              </div>
            </div>
          </div>
          <div className={styles.caption}>
            You don&apos;t have to be a computer geek to buy NFTs.
          </div>
        </div>

        {/* Top Center - 3D Object */}
        <div className={`${styles.featureBubble} ${styles.bubbleTopCenter}`}>
          <div className={styles.imageContainer}>
            <div className={styles.image3DObject}>
              <div className={`${styles.disc} ${styles.disc1}`}></div>
              <div className={`${styles.disc} ${styles.disc2}`}></div>
              <div className={`${styles.disc} ${styles.disc3}`}></div>
              <div className={styles.discGlow}></div>
            </div>
          </div>
          <div className={styles.caption}>
            Your exclusive member keycard.
          </div>
        </div>

        {/* Bottom Right - NFT Illustration */}
        <div className={`${styles.featureBubble} ${styles.bubbleBottomRight}`}>
          <div className={styles.imageContainer}>
            <div className={styles.imageNFT}>
              <div className={styles.nftBackground}></div>
              <div className={styles.nftShape1}></div>
              <div className={styles.nftShape2}></div>
              <div className={styles.nftShape3}></div>
              <div className={styles.nftGlow}></div>
            </div>
          </div>
          <div className={styles.caption}>
            The exactly Token Economics is TBA.
          </div>
        </div>

        {/* Bottom Left - Tunnel */}
        <div className={`${styles.featureBubble} ${styles.bubbleBottomLeft}`}>
          <div className={styles.imageContainer}>
            <div className={styles.imageTunnel}>
              <div className={styles.tunnelRings}>
                <div className={`${styles.tunnelRing} ${styles.ring1}`}></div>
                <div className={`${styles.tunnelRing} ${styles.ring2}`}></div>
                <div className={`${styles.tunnelRing} ${styles.ring3}`}></div>
                <div className={`${styles.tunnelRing} ${styles.ring4}`}></div>
              </div>
              <div className={styles.tunnelGlow}></div>
              <div className={styles.tunnelParticles}></div>
            </div>
          </div>
          <div className={styles.caption}>
            50% Discount on trading fees for keycard holders.
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;