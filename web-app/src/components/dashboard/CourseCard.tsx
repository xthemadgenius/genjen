'use client';

import React from 'react';
import styles from './css/CourseCard.module.css';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    instructorRole: string;
    thumbnail: string;
    progress: number;
    totalLessons: number;
    watchedLessons: number;
    category: string;
  };
  variant?: 'default' | 'compact';
}

const CourseCard: React.FC<CourseCardProps> = ({ course, variant = 'default' }) => {
  const progressPercentage = (course.watchedLessons / course.totalLessons) * 100;

  return (
    <div className={`${styles.courseCard} ${variant === 'compact' ? styles.compact : ''}`}>
      {/* Course Thumbnail */}
      <div className={styles.thumbnail}>
        <div className={styles.thumbnailImage}>
          {/* Placeholder gradient background */}
          <div className={styles.thumbnailPlaceholder}>
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="currentColor" d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className={styles.progressIndicator}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 6L16 12l-6.5 6V6z"/>
          </svg>
          <span>{course.watchedLessons}/{course.totalLessons} Watched</span>
        </div>
      </div>

      {/* Course Info */}
      <div className={styles.courseInfo}>
        {/* Category Badge */}
        <span className={styles.categoryBadge}>{course.category}</span>
        
        {/* Course Title */}
        <h3 className={styles.courseTitle}>{course.title}</h3>
        
        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        
        {/* Instructor Info */}
        <div className={styles.instructorInfo}>
          <div className={styles.instructorAvatar}>
            <span>{course.instructor.charAt(0)}</span>
          </div>
          <div className={styles.instructorDetails}>
            <span className={styles.instructorName}>{course.instructor}</span>
            <span className={styles.instructorRole}>{course.instructorRole}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;