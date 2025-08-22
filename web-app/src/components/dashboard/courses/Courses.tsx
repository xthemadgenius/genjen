'use client';

import React, { useState } from 'react';
import CourseTabs from './CourseTabs';
import CourseCard from './CourseCard';
import CourseTable from './CourseTable';
import styles from './css/Courses.module.css';

export type TabType = 'all' | 'active' | 'completed';

export interface Course {
  id: string;
  title: string;
  author: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  image: string;
  videos: number;
  assignments: number;
  students: number;
  completed: number;
  totalDays: number;
  currentDay: number;
  status: 'active' | 'completed' | 'not-started';
}

export interface CourseTableItem {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tools: string;
  lessons: string;
  points: number;
  pointsColor: 'green' | 'red';
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Spontaneous Freedom',
    author: 'Jonathan Due',
    level: 'Intermediate',
    image: '/imgs/gal.png', // Using existing image
    videos: 24,
    assignments: 9,
    students: 30,
    completed: 45,
    totalDays: 12,
    currentDay: 4,
    status: 'active'
  },
  {
    id: '2',
    title: 'Interection design With Figma',
    author: 'Kilian James',
    level: 'Beginner',
    image: '/imgs/glc.png', // Using existing image
    videos: 24,
    assignments: 9,
    students: 30,
    completed: 75,
    totalDays: 12,
    currentDay: 4,
    status: 'active'
  },
  {
    id: '3',
    title: '3D illustration Design With Figma',
    author: 'Jonathan Due',
    level: 'Intermediate',
    image: '/imgs/ifgf.png', // Using existing image
    videos: 24,
    assignments: 9,
    students: 30,
    completed: 65,
    totalDays: 12,
    currentDay: 4,
    status: 'completed'
  },
  {
    id: '4',
    title: 'Web App Design With Figma',
    author: 'Jonathan Due',
    level: 'Master',
    image: '/imgs/lee.png', // Using existing image
    videos: 24,
    assignments: 9,
    students: 30,
    completed: 25,
    totalDays: 12,
    currentDay: 4,
    status: 'active'
  }
];

const mockTableData: CourseTableItem[] = [
  {
    id: '1',
    name: '3D animation',
    category: 'UI Design',
    level: 'Beginner',
    tools: 'Cinema 4D',
    lessons: '25 tutorials',
    points: 100,
    pointsColor: 'green'
  },
  {
    id: '2',
    name: 'Design Thinking',
    category: 'UX Design',
    level: 'Intermediate',
    tools: 'Adobe XD',
    lessons: '25 tutorials',
    points: 100,
    pointsColor: 'green'
  },
  {
    id: '3',
    name: 'Matching Learning',
    category: 'Data Learn',
    level: 'Advanced',
    tools: 'VS Code',
    lessons: '25 tutorials',
    points: 100,
    pointsColor: 'red'
  },
  {
    id: '4',
    name: 'Responsive Design',
    category: 'UI Design',
    level: 'Beginner',
    tools: 'Figma',
    lessons: '25 tutorials',
    points: 100,
    pointsColor: 'red'
  }
];

const Courses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredCourses = mockCourses.filter(course => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return course.status === 'active';
    if (activeTab === 'completed') return course.status === 'completed';
    return true;
  });

  return (
    <div className={styles.coursesContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Course</h1>
      </div>

      {/* Tabs */}
      <CourseTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Course Cards */}
      <div className={styles.courseCards}>
        {filteredCourses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course} 
          />
        ))}
      </div>

      {/* Course Listing */}
      <div className={styles.courseListingSection}>
        <h2 className={styles.sectionTitle}>Course Listing</h2>
        <CourseTable courses={mockTableData} />
      </div>
    </div>
  );
};

export default Courses;