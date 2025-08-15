import React from 'react';
import styles from './css/MovingStrip.module.css';

const MovingStrip = () => {
  const text = "JENGEN.AI - Bridging Generations - Connecting Wisdom - Empowering Learning";
  const repeatedText = Array(8).fill(text).join(" - ");

  return (
    <div className={styles.movingStrip} role="banner" aria-label="JenGen AI marquee announcement">
      <div className={styles.marqueeContainer}>
        <span className={styles.marqueeText} aria-hidden="true">
          {repeatedText}
        </span>
      </div>
      <div className="sr-only">
        JenGen.ai - Bridging Generations - Connecting Wisdom - Empowering Learning
      </div>
    </div>
  );
};

export default MovingStrip;