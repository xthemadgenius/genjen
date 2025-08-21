'use client';

import React from 'react';
import { Course } from './Courses';
import styles from './css/CourseCard.module.css';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'Beginner':
        return styles.levelBeginner;
      case 'Intermediate':
        return styles.levelIntermediate;
      case 'Advanced':
        return styles.levelAdvanced;
      case 'Master':
        return styles.levelMaster;
      default:
        return styles.levelBeginner;
    }
  };

  return (
    <div className={styles.courseCard}>
      {/* Course Image */}
      <div className={styles.imageContainer}>
        <img 
          src={course.image} 
          alt={course.title}
          className={styles.courseImage}
          onError={(e) => {
            // Fallback to existing images or create a CSS-based placeholder
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
                font-size: 1.5rem;
                font-weight: 600;
                text-align: center;
              `;
              placeholder.textContent = course.title.charAt(0);
              container.appendChild(placeholder);
            }
          }}
        />
        <div className={`${styles.levelBadge} ${getLevelColor(course.level)}`}>
          {course.level}
          <svg className={styles.levelIcon} viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
          </svg>
        </div>
      </div>

      {/* Course Content */}
      <div className={styles.cardContent}>
        <h3 className={styles.courseTitle}>{course.title}</h3>
        
        <div className={styles.authorInfo}>
          <div className={styles.authorAvatar}>
            <span>{course.author.charAt(0)}</span>
          </div>
          <span className={styles.authorName}>{course.author}</span>
        </div>

        {/* Course Stats */}
        <div className={styles.courseStats}>
          <div className={styles.statItem}>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <span>{course.videos}</span>
          </div>
          <div className={styles.statItem}>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
            </svg>
            <span>{course.assignments}</span>
          </div>
          <div className={styles.statItem}>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M16 4C16.88 4 17.67 4.5 18 5.29C18.11 5.5 18.11 5.7 18 5.92L16.83 9H20C20.35 9 20.65 9.22 20.78 9.54L22.25 13.69C22.33 13.89 22.33 14.1 22.25 14.3L20.78 18.46C20.65 18.78 20.35 19 20 19H5C4.45 19 4 18.55 4 18V10C4 9.45 4.45 9 5 9H12.17L13.5 5.92C13.61 5.7 13.61 5.5 13.5 5.29C13.83 4.5 14.62 4 15.5 4H16M16 6H15.5C15.22 6 15 6.22 15 6.5C15 6.61 15.05 6.71 15.12 6.79L14.5 8.21L13.12 8.79C13.05 8.71 13 8.61 13 8.5C13 8.22 12.78 8 12.5 8H5V10H12.5C12.78 10 13 10.22 13 10.5C13 10.61 12.95 10.71 12.88 10.79L14.26 11.21L15.62 10.79C15.95 10.71 16 10.61 16 10.5C16 10.22 16.22 10 16.5 10H20L18.5 14L20 18H5V10H16.5C16.78 10 17 9.78 17 9.5C17 9.39 16.95 9.29 16.88 9.21L15.5 8.79L16.12 6.79C16.05 6.71 16 6.61 16 6.5C16 6.22 16.22 6 16.5 6H16Z"/>
            </svg>
            <span>{course.students}</span>
          </div>
        </div>

        {/* Progress */}
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>Completed: {course.completed}%</span>
            <span className={styles.daysInfo}>Days: {course.currentDay}/{course.totalDays}</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${course.completed}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;