'use client';

import React from 'react';
import styles from './css/TaskList.module.css';

interface TaskItem {
  id: string;
  instructorName: string;
  instructorDate: string;
  courseType: string;
  courseTitle: string;
  instructor: {
    name: string;
    avatar?: string;
  };
}

interface TaskListProps {
  tasks?: TaskItem[];
  title?: string;
}

const defaultTasks: TaskItem[] = [
  {
    id: '1',
    instructorName: 'Lee Richter',
    instructorDate: '25/2/2023',
    courseType: 'Mindset',
    courseTitle: 'Understanding Concept Of React',
    instructor: {
      name: 'Aby Richter',
      avatar: undefined
    }
  },
  {
    id: '2',
    instructorName: 'Ravi Kumar',
    instructorDate: '25/2/2023',
    courseType: 'FRONTEND',
    courseTitle: 'Understanding Concept Of React',
    instructor: {
      name: 'Ravi Kumar',
      avatar: undefined
    }
  }
];

const TaskList: React.FC<TaskListProps> = ({ 
  tasks = defaultTasks,
  title = "Your Mentor" 
}) => {
  return (
    <section className={styles.taskList} role="region" aria-label="Upcoming Tasks and Lessons">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <button className={styles.seeAllButton}>
          See All
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table} role="table" aria-label="Mentor tasks and course information">
          <thead>
            <tr>
              <th className={styles.headerCell}>Instructor Name & Date</th>
              <th className={styles.headerCell}>Course Type</th>
              <th className={styles.headerCell}>Course Title</th>
              <th className={styles.headerCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className={styles.tableRow}>
                <td className={styles.instructorCell}>
                  <div className={styles.instructorInfo}>
                    <div className={styles.instructorAvatar}>
                      {task.instructor.avatar ? (
                        <img src={task.instructor.avatar} alt={task.instructor.name} />
                      ) : (
                        <span>{task.instructor.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className={styles.instructorDetails}>
                      <div className={styles.instructorName}>{task.instructorName}</div>
                      <div className={styles.instructorDate}>{task.instructorDate}</div>
                    </div>
                  </div>
                </td>
                
                <td className={styles.courseTypeCell}>
                  <span className={styles.courseTypeBadge}>
                    {task.courseType}
                  </span>
                </td>
                
                <td className={styles.courseTitleCell}>
                  <span className={styles.courseTitle}>{task.courseTitle}</span>
                </td>
                
                <td className={styles.actionsCell}>
                  <button className={styles.actionButton} aria-label={`Show details for ${task.courseTitle} by ${task.instructorName}`}>
                    SHOW DETAILS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TaskList;