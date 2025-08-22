'use client';

import React from 'react';
import styles from './css/CourseContentList.module.css';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted?: boolean;
}

interface CourseContentListProps {
  lessons: Lesson[];
}

const CourseContentList: React.FC<CourseContentListProps> = ({ lessons }) => {
  return (
    <div className={styles.courseContentList}>
      <div className={styles.lessonsList}>
        {lessons.map((lesson, index) => (
          <div 
            key={lesson.id} 
            className={`${styles.lessonItem} ${lesson.isCompleted ? styles.completed : ''}`}
          >
            <div className={styles.lessonContent}>
              <div className={styles.lessonTitle}>{lesson.title}</div>
              <div className={styles.lessonDuration}>{lesson.duration}</div>
            </div>
            <div className={styles.lessonStatus}>
              {lesson.isCompleted ? (
                <div className={styles.completedIcon}>
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path 
                      fill="currentColor" 
                      d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"
                    />
                  </svg>
                </div>
              ) : (
                <div className={styles.playIcon}>
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path 
                      fill="currentColor" 
                      d="M8,5.14V19.14L19,12.14L8,5.14Z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContentList;