import React from 'react';
import styles from './css/FeaturesSection.module.css';

const FeaturesSection = () => {
  return (
    <section className={styles.featuresSection} aria-labelledby="features-heading">
      {/* Left Content */}
      <div className={styles.leftContent}>
        <div className={styles.featuresLabel} aria-hidden="true">FEATURES</div>
        <div className={styles.titleContainer}>
          <div className={styles.accentLine} aria-hidden="true"></div>
          <h2 id="features-heading" className={styles.sectionTitle}>
            We are platform for<br />
            everyone
          </h2>
        </div>
        <button className={styles.ctaButton} aria-label="Start your journey with our intergenerational platform">
          Start Your Journey
        </button>
      </div>

      {/* Main Visual Area */}
      <div className={styles.visualArea} role="img" aria-label="Interactive feature showcase highlighting platform capabilities and membership benefits">
        {/* Radial Grid Background */}
        <div className={styles.radialGrid} aria-hidden="true">
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
        <div className={styles.decorativeSphere1} aria-hidden="true"></div>
        <div className={styles.decorativeSphere2} aria-hidden="true"></div>
        <div className={styles.decorativeSphere3} aria-hidden="true"></div>
        <div className={styles.decorativeSphere4} aria-hidden="true"></div>

        {/* Feature Bubbles */}
        {/* Top Right - Lounge */}
        <article className={`${styles.featureBubble} ${styles.bubbleTopRight}`} aria-labelledby="lounge-feature">
          <div className={styles.imageContainer}>
            <div className={styles.imageLounge} role="img" aria-label="Modern lounge interior with comfortable seating">
              <div className={styles.loungeBackground} aria-hidden="true"></div>
              <div className={styles.loungeElements} aria-hidden="true">
                <div className={styles.loungeSeating} aria-hidden="true"></div>
                <div className={styles.loungeAccent} aria-hidden="true"></div>
                <div className={styles.loungeWindow} aria-hidden="true"></div>
              </div>
            </div>
          </div>
          <p id="lounge-feature" className={styles.caption}>
            Easy-to-use platform designed for everyone, regardless of tech experience.
          </p>
        </article>

        {/* Top Center - 3D Object */}
        <article className={`${styles.featureBubble} ${styles.bubbleTopCenter}`} aria-labelledby="keycard-feature">
          <div className={styles.imageContainer}>
            <div className={styles.image3DObject} role="img" aria-label="Animated 3D rotating discs representing digital membership card">
              <div className={`${styles.disc} ${styles.disc1}`} aria-hidden="true"></div>
              <div className={`${styles.disc} ${styles.disc2}`} aria-hidden="true"></div>
              <div className={`${styles.disc} ${styles.disc3}`} aria-hidden="true"></div>
              <div className={styles.discGlow} aria-hidden="true"></div>
            </div>
          </div>
          <p id="keycard-feature" className={styles.caption}>
            Your exclusive JenGen.ai membership access.
          </p>
        </article>

        {/* Bottom Right - AI Illustration */}
        <article className={`${styles.featureBubble} ${styles.bubbleBottomRight}`} aria-labelledby="ai-feature">
          <div className={styles.imageContainer}>
            <div className={styles.imageNFT} role="img" aria-label="Abstract AI-powered learning visualization">
              <div className={styles.nftBackground} aria-hidden="true"></div>
              <div className={styles.nftShape1} aria-hidden="true"></div>
              <div className={styles.nftShape2} aria-hidden="true"></div>
              <div className={styles.nftShape3} aria-hidden="true"></div>
              <div className={styles.nftGlow} aria-hidden="true"></div>
            </div>
          </div>
          <p id="ai-feature" className={styles.caption}>
            AI-powered learning journeys personalized for you.
          </p>
        </article>

        {/* Bottom Left - Network */}
        <article className={`${styles.featureBubble} ${styles.bubbleBottomLeft}`} aria-labelledby="network-feature">
          <div className={styles.imageContainer}>
            <div className={styles.imageTunnel} role="img" aria-label="Network connections visualization with pulsing elements">
              <div className={styles.tunnelRings} aria-hidden="true">
                <div className={`${styles.tunnelRing} ${styles.ring1}`} aria-hidden="true"></div>
                <div className={`${styles.tunnelRing} ${styles.ring2}`} aria-hidden="true"></div>
                <div className={`${styles.tunnelRing} ${styles.ring3}`} aria-hidden="true"></div>
                <div className={`${styles.tunnelRing} ${styles.ring4}`} aria-hidden="true"></div>
              </div>
              <div className={styles.tunnelGlow} aria-hidden="true"></div>
              <div className={styles.tunnelParticles} aria-hidden="true"></div>
            </div>
          </div>
          <p id="network-feature" className={styles.caption}>
            Exclusive access to our private mentorship network.
          </p>
        </article>
      </div>
    </section>
  );
};

export default FeaturesSection;