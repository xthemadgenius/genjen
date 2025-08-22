import React from 'react';
import Image from 'next/image';
import styles from './css/PartnersSection.module.css';

const PartnersSection = () => {
  return (
    <section className={styles.partnersSection} aria-labelledby="partners-heading">
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.headerContent}>
          <h2 id="partners-heading" className={styles.sectionTitle}>
            Trusted by Leading <span className={styles.titleAccent}>Organizations</span>
          </h2>
          <p className={styles.subtitle}>
            Partnering with industry leaders to bridge generations and foster meaningful connections.
          </p>
        </header>

        {/* Partners Grid */}
        <div className={styles.partnersGrid} role="list" aria-label="Our trusted partners">
          <div className={styles.partnerCard} role="listitem">
            <div className={styles.partnerLogo}>
              <Image
                src="/imgs/gal.png"
                alt="Go Ask Lee Partnership - Supporting intergenerational learning initiatives"
                width={200}
                height={100}
                className={styles.logoImage}
                priority
              />
            </div>
          </div>
          
          <div className={styles.partnerCard} role="listitem">
            <div className={styles.partnerLogo}>
              <Image
                src="/imgs/glc.png"
                alt="GLC Partnership - Global learning and wisdom exchange"
                width={200}
                height={100}
                className={styles.logoImage}
                priority
              />
            </div>
          </div>
          
          <div className={styles.partnerCard} role="listitem">
            <div className={styles.partnerLogo}>
              <Image
                src="/imgs/ifgf.png"
                alt="IFGF Partnership - International foundation for generational futures"
                width={200}
                height={100}
                className={styles.logoImage}
                priority
              />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={styles.ctaContainer}>
          <p className={styles.ctaText}>
            Interested in partnering with JenGen.ai?
          </p>
          <button className={styles.partnerButton} aria-label="Learn more about partnership opportunities">
            Become a Partner
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;