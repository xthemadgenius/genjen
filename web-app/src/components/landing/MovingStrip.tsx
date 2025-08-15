import React from 'react';
import styles from './css/MovingStrip.module.css';

const MovingStrip = () => {
  const text = "JEN GEN AI - Weaving Generations - Unifying Wisdom - Creating the Future";
  const repeatedText = Array(8).fill(text).join(" - ");

  return (
    <div className={styles.movingStrip}>
      <div className={styles.marqueeContainer}>
        <span className={styles.marqueeText}>
          {repeatedText}
        </span>
      </div>
    </div>
  );
};

export default MovingStrip;