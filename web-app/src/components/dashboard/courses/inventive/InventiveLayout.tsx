'use client';

import React from 'react';
import styles from './css/InventiveLayout.module.css';

interface InventiveLayoutProps {
  children: React.ReactNode;
}

const InventiveLayout: React.FC<InventiveLayoutProps> = ({ children }) => {
  return (
    <div className={styles.inventiveLayout}>
      <div className={styles.backgroundGradient}>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default InventiveLayout;