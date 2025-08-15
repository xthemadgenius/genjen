import React from 'react';
import styles from './css/ProcessSection.module.css';

const ProcessSection = () => {
  return (
    <section className={styles.processSection}>
      {/* Header Section */}
      <div className={styles.header}>
        {/* Decorative elements */}
        <div className={styles.decorativeHeader}>
          <div className={styles.decorativeElements}>
            <div className={styles.orangeCircle}></div>
            <div className={styles.purpleCircle}></div>
          </div>
          <div className={styles.sparkle}>✨</div>
        </div>
        
        <h2 className={styles.headerTitle}>
          Let's make <span className={styles.headerTitleArt}>your art</span><br />
          into digital assets
        </h2>
      </div>

      {/* Container */}
      <div className={styles.container}>
        {/* Top Left Card */}
        <div className={styles.donationCardTopLeft}>
          <div className={styles.donationCard}>
            <div className={`${styles.donationAvatar} ${styles.avatarRed}`}></div>
            <div className={styles.donationInfo}>
              <h3>Anna May</h3>
              <p>Donated $100</p>
            </div>
          </div>
        </div>

        {/* Top Right Card */}
        <div className={styles.donationCardTopRight}>
          <div className={styles.donationCard}>
            <div className={`${styles.donationAvatar} ${styles.avatarBlue}`}></div>
            <div className={styles.donationInfo}>
              <h3>Jane Holand</h3>
              <p>Donated $500</p>
            </div>
          </div>
        </div>

        {/* Process Cards Grid */}
        <div className={styles.processGrid}>
          {/* Create Card */}
          <div className={`${styles.processCard} ${styles.createCard}`}>
            {/* Decorative elements */}
            <div className={styles.createDecoOrange}></div>
            <div className={styles.createDecoPurple}>
              <div className={styles.createDecoPurpleInner}></div>
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Create</h3>
              <p className={styles.cardDescription}>
                Click My Collections and set up your collection. Add a description, 
                profile & banner images, and set a secondary sales fee.
              </p>
              <button className={styles.cardButton}>
                Create
              </button>
            </div>
          </div>

          {/* Instant Payment Card */}
          <div className={`${styles.processCard} ${styles.paymentCard}`}>
            {/* Connection lines */}
            <div className={styles.paymentConnectionLeft}></div>
            <div className={styles.paymentConnectionRight}></div>
            
            {/* Decorative elements */}
            <div className={styles.paymentCenterIcon}>
              <div className={styles.paymentIconContainer}>
                <div className={styles.paymentIcon}></div>
              </div>
            </div>
            
            {/* Connection dots */}
            <div className={styles.paymentDotOrange}></div>
            <div className={styles.paymentDotBlue}></div>
            <div className={styles.paymentDotPurple}></div>
            
            <div className={`${styles.cardContent} ${styles.paymentCardContent}`}>
              <h3 className={styles.cardTitle}>Instant payment</h3>
              <p className={styles.cardDescription}>
                Put NFTs on sale or on auction. Get paid for your digital collectables
              </p>
              <button className={`${styles.cardButton} ${styles.paymentButton}`}>
                Sale now
              </button>
            </div>
          </div>

          {/* Set up Wallet Card */}
          <div className={`${styles.processCard} ${styles.walletCard}`}>
            {/* Decorative elements */}
            <div className={styles.walletDecoLarge}></div>
            <div className={styles.walletDecoPink}>
              <div className={styles.walletDecoPinkInner}></div>
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Set up your wallet</h3>
              <p className={styles.cardDescription}>
                Once you've set up your wallet of choice, connect it by clicking 
                the wallet icon in the top right corner.
              </p>
              <button className={styles.cardButton}>
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;