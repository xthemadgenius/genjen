'use client';

import React from 'react';
import styles from './css/CourseProgress.module.css';

interface CourseProgressItem {
  id: string;
  title: string;
  watched: number;
  total: number;
  color?: 'purple' | 'blue' | 'green' | 'orange';
}

interface CourseProgressProps {
  courses?: CourseProgressItem[];
}

const defaultCourses: CourseProgressItem[] = [
  {
    id: '1',
    title: 'Product Design',
    watched: 2,
    total: 8,
    color: 'purple'
  },
  {
    id: '2',
    title: 'Product Design',
    watched: 2,
    total: 8,
    color: 'blue'
  },
  {
    id: '3',
    title: 'Product Design',
    watched: 2,
    total: 8,
    color: 'green'
  }
];

const CourseProgress: React.FC<CourseProgressProps> = ({ 
  courses = defaultCourses 
}) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'purple':
        return styles.purple;
      case 'blue':
        return styles.blue;
      case 'green':
        return styles.green;
      case 'orange':
        return styles.orange;
      default:
        return styles.purple;
    }
  };

  return (
    <section className={styles.courseProgress} role="region" aria-label="Course Progress Overview">
      <div className={styles.progressGrid}>
        {courses.map((course) => (
          <div 
            key={course.id} 
            className={`${styles.progressChip} ${getColorClass(course.color || 'purple')}`}
            role="button"
            tabIndex={0}
            aria-label={`${course.title}: ${course.watched} of ${course.total} lessons watched. Click to view details.`}
          >
            <div className={styles.chipContent}>
              <div className={styles.progressInfo}>
                <div className={styles.progressCount}>
                  {course.watched}/{course.total} Watched
                </div>
                <div className={styles.courseTitle}>
                  {course.title}
                </div>
              </div>
              
              <div className={styles.progressIcon}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 6L16 12l-6.5 6V6z"/>
                </svg>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${(course.watched / course.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseProgress;