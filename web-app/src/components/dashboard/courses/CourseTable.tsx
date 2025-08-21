'use client';

import React from 'react';
import { CourseTableItem } from './Courses';
import styles from './css/CourseTable.module.css';

interface CourseTableProps {
  courses: CourseTableItem[];
}

const CourseTable: React.FC<CourseTableProps> = ({ courses }) => {
  const getLevelBadgeClass = (level: CourseTableItem['level']) => {
    switch (level) {
      case 'Beginner':
        return styles.levelBeginner;
      case 'Intermediate':
        return styles.levelIntermediate;
      case 'Advanced':
        return styles.levelAdvanced;
      default:
        return styles.levelBeginner;
    }
  };

  const getPointsClass = (color: CourseTableItem['pointsColor']) => {
    return color === 'green' ? styles.pointsGreen : styles.pointsRed;
  };

  return (
    <div className={styles.tableContainer}>
      {/* Desktop Table View */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.headerCell}>Name</th>
              <th className={styles.headerCell}>Category</th>
              <th className={styles.headerCell}>Level</th>
              <th className={styles.headerCell}>Tools</th>
              <th className={styles.headerCell}>Lessons</th>
              <th className={styles.headerCell}>Points required</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <span className={styles.courseName}>{course.name}</span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.category}>{course.category}</span>
                </td>
                <td className={styles.tableCell}>
                  <span className={`${styles.levelBadge} ${getLevelBadgeClass(course.level)}`}>
                    <svg className={styles.levelIcon} viewBox="0 0 24 24" width="12" height="12">
                      <path fill="currentColor" d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
                    </svg>
                    {course.level}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.tools}>{course.tools}</span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.lessons}>{course.lessons}</span>
                </td>
                <td className={styles.tableCell}>
                  <span className={`${styles.points} ${getPointsClass(course.pointsColor)}`}>
                    {course.points} points
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileCards}>
        {courses.map((course) => (
          <div key={course.id} className={styles.mobileCard}>
            <div className={styles.mobileCardHeader}>
              <span className={styles.mobileCardTitle}>{course.name}</span>
              <span className={`${styles.levelBadge} ${getLevelBadgeClass(course.level)}`}>
                <svg className={styles.levelIcon} viewBox="0 0 24 24" width="12" height="12">
                  <path fill="currentColor" d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
                </svg>
                {course.level}
              </span>
            </div>
            <div className={styles.mobileCardContent}>
              <div className={styles.mobileCardItem}>
                <span className={styles.mobileCardLabel}>Category</span>
                <span className={styles.mobileCardValue}>{course.category}</span>
              </div>
              <div className={styles.mobileCardItem}>
                <span className={styles.mobileCardLabel}>Tools</span>
                <span className={styles.mobileCardValue}>{course.tools}</span>
              </div>
              <div className={styles.mobileCardItem}>
                <span className={styles.mobileCardLabel}>Lessons</span>
                <span className={styles.mobileCardValue}>{course.lessons}</span>
              </div>
              <div className={styles.mobileCardItem}>
                <span className={styles.mobileCardLabel}>Points</span>
                <span className={`${styles.mobileCardValue} ${styles.points} ${getPointsClass(course.pointsColor)}`}>
                  {course.points} points
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTable;