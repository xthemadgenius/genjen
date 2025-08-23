'use client';

import React from 'react';
import styles from './css/AlsoBoughtCard.module.css';

interface AlsoBoughtCourse {
  id: string;
  title: string;
  price: number;
  tag: string;
  thumbnail: string;
}

interface AlsoBoughtCardProps {
  course: AlsoBoughtCourse;
}

const AlsoBoughtCard: React.FC<AlsoBoughtCardProps> = ({ course }) => {
  const handleCardClick = () => {
    console.log(`Navigate to course: ${course.id}`);
  };

  return (
    <div 
      className={styles.alsoBoughtCard} 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className={styles.imageContainer}>
        <div className={styles.courseImage}>
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className={styles.thumbnail}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const container = target.parentElement;
              if (container && !container.querySelector('.placeholder')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder';
                placeholder.style.cssText = `
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 1rem;
                  font-weight: 600;
                  text-align: center;
                  border-radius: 8px;
                `;
                placeholder.textContent = course.title.charAt(0);
                container.appendChild(placeholder);
              }
            }}
          />
          <div className={styles.favoriteButton}>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path 
                fill="currentColor" 
                d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
              />
            </svg>
          </div>
        </div>
        <div className={styles.tagOverlay}>
          <span className={styles.courseTag}>{course.tag}</span>
        </div>
      </div>
      
      <div className={styles.courseInfo}>
        <h4 className={styles.courseTitle}>{course.title}</h4>
        <span className={styles.coursePrice}>${course.price.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default AlsoBoughtCard;