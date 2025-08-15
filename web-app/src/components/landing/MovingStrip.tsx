import React from 'react';
import styles from './css/MovingStrip.module.css';

const MovingStrip = () => {
  const text = "JEN GEN AI - Weaving Generations - Unifying Wisdom - Creating the Future";
  const repeatedText = Array(8).fill(text).join(" - ");

  return (
    <div className={styles.movingStrip} role="banner" aria-label="JenGen AI marquee announcement">
      <div className={styles.marqueeContainer}>
        <span className={styles.marqueeText} aria-hidden="true">
          {repeatedText}
        </span>
      </div>
      <div className="sr-only">
        JenGen AI - Weaving Generations - Unifying Wisdom - Creating the Future
      </div>
    </div>
  );
};

export default MovingStrip;