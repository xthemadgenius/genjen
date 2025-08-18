'use client';

import React from 'react';
import CourseCard from './CourseCard';
import styles from './css/ContinueWatching.module.css';

interface ContinueWatchingProps {
  courses?: Array<{
    id: string;
    title: string;
    instructor: string;
    instructorRole: string;
    thumbnail: string;
    progress: number;
    totalLessons: number;
    watchedLessons: number;
    category: string;
  }>;
}

const defaultCourses = [
  {
    id: '1',
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    instructor: 'Prashant Kumar Singh',
    instructorRole: 'Software Developer',
    thumbnail: '/course-thumbnails/frontend.jpg',
    progress: 25,
    totalLessons: 8,
    watchedLessons: 2,
    category: 'FRONTEND'
  },
  {
    id: '2',
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    instructor: 'Prashant Kumar Singh',
    instructorRole: 'Software Developer',
    thumbnail: '/course-thumbnails/design.jpg',
    progress: 25,
    totalLessons: 8,
    watchedLessons: 2,
    category: 'FRONTEND'
  },
  {
    id: '3',
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    instructor: 'Prashant Kumar Singh',
    instructorRole: 'Software Developer',
    thumbnail: '/course-thumbnails/development.jpg',
    progress: 25,
    totalLessons: 8,
    watchedLessons: 2,
    category: 'FRONTEND'
  }
];

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ courses = defaultCourses }) => {
  return (
    <section className={styles.continueWatching}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Continue Watching</h2>
        <div className={styles.navigationControls}>
          <button className={styles.navButton} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z"/>
            </svg>
          </button>
          <button className={styles.navButton} aria-label="Next">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.coursesGrid}>
        {courses.map((course) => (
          <CourseCard 
            key={course.id}
            course={course}
          />
        ))}
      </div>
    </section>
  );
};

export default ContinueWatching;