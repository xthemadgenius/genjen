'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import CourseVideoPlayer from './CourseVideoPlayer';
import CourseTabs from './CourseTabs';
import CourseContentList from './CourseContentList';
import AlsoBoughtCard from './AlsoBoughtCard';
import { Course } from '../Courses';
import styles from './css/CourseDetail.module.css';

// Mock course data - in a real app this would come from an API
const mockCourseDetails = {
  'LeeRichter/Healing': {
    id: 'LeeRichter/Healing',
    title: 'Healing Through Creative Expression',
    author: 'Lee Richter',
    level: 'Intermediate',
    image: '/imgs/lee.png',
    videos: 12,
    assignments: 4,
    students: 127,
    completed: 0,
    totalDays: 8,
    currentDay: 1,
    status: 'not-started',
    videoThumbnail: '/imgs/lee.png',
    pointsRequired: 60,
    description: 'Discover the transformative power of creative expression for emotional healing and personal growth. This course combines therapeutic techniques with artistic practices to help you process emotions, reduce stress, and find inner peace through creativity.',
    detailedDescription: 'Learn evidence-based creative therapies including art journaling, mindful drawing, color therapy, and expressive movement. Perfect for beginners seeking emotional wellness through creativity.',
    lessons: [
      { id: '1', title: 'Introduction to Creative Healing', duration: '08:30' },
      { id: '2', title: 'Art Journaling for Emotional Release', duration: '12:15' },
      { id: '3', title: 'Mindful Drawing Techniques', duration: '09:45' },
      { id: '4', title: 'Color Psychology in Healing', duration: '11:20' },
      { id: '5', title: 'Expressive Movement Therapy', duration: '10:30' },
      { id: '6', title: 'Creating Your Healing Space', duration: '07:45' }
    ]
  },
  'KilianJames/UIStyleguide': {
    id: 'KilianJames/UIStyleguide',
    title: 'UI Styleguide With Figma',
    author: 'Kilian James',
    level: 'Intermediate',
    image: '/imgs/glc.png',
    videos: 24,
    assignments: 9,
    students: 30,
    completed: 75,
    totalDays: 12,
    currentDay: 4,
    status: 'active',
    videoThumbnail: '/imgs/glc.png',
    pointsRequired: 80,
    description: 'In this online 3d illustration design short course, you&rsquo;ll learn how to create realistic props, characters and environment using Learn 3D Animation online at your own pace. Start today and improve your skills. Join millions of learners from around the world already learning on Udemy. Expert Instructors. Lifetime',
    detailedDescription: 'Characters and environment using Learn 3D Animation online at your own pace. Start today and improve your skills.',
    lessons: [
      { id: '1', title: 'What is UI Design?', duration: '00:45' },
      { id: '2', title: 'How to Concept?', duration: '00:45' },
      { id: '3', title: 'What is UI Design?', duration: '00:45' },
      { id: '4', title: 'What is UI Design?', duration: '00:45' },
      { id: '5', title: 'What is UI Design?', duration: '00:45' }
    ]
  }
};

const mockRelatedCourses = [
  {
    id: 'related-1',
    title: 'Complete web design',
    price: 20.30,
    tag: 'Bestseller',
    thumbnail: '/imgs/ifgf.png'
  },
  {
    id: 'related-2',
    title: 'Figma UI/UX Essential',
    price: 23.00,
    tag: 'Bestseller',
    thumbnail: '/imgs/lee.png'
  }
];

type TabType = 'about' | 'details' | 'review' | 'resources';

const CourseDetail: React.FC = () => {
  const params = useParams();
  const mentor = params?.mentor as string;
  const courseName = params?.course as string;
  const [activeTab, setActiveTab] = useState<TabType>('about');

  // Construct course key from mentor and course name
  const courseKey = `${mentor}/${courseName}`;
  
  // Get course details
  const course = mockCourseDetails[courseKey as keyof typeof mockCourseDetails];

  if (!course) {
    return (
      <div className={styles.notFound}>
        <h1>Course not found</h1>
        <p>The requested course could not be found.</p>
      </div>
    );
  }

  return (
    <div className={styles.courseDetail}>
      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Course Header */}
          <div className={styles.courseHeader}>
            <h1 className={styles.courseTitle}>{course.title}</h1>
          </div>

          {/* Video Player */}
          <CourseVideoPlayer 
            thumbnail={course.videoThumbnail}
            title={course.title}
          />

          {/* Tabs Navigation */}
          <CourseTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'about' && (
              <div className={styles.aboutContent}>
                <div className={styles.courseInfo}>
                  <h3 className={styles.sectionTitle}>About this course</h3>
                  <div className={styles.courseMeta}>
                    <span className={styles.pointsRequired}>
                      {course.pointsRequired} points required
                    </span>
                    <span className={`${styles.levelBadge} ${styles[course.level.toLowerCase()]}`}>
                      {course.level}
                    </span>
                  </div>
                  <p className={styles.courseDescription}>
                    {course.description}
                  </p>
                  <p className={styles.courseDetailedDescription}>
                    {course.detailedDescription}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className={styles.detailsContent}>
                <h3 className={styles.sectionTitle}>Course Details</h3>
                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Duration:</span>
                    <span className={styles.detailValue}>{course.totalDays} days</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Videos:</span>
                    <span className={styles.detailValue}>{course.videos} lessons</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Assignments:</span>
                    <span className={styles.detailValue}>{course.assignments} projects</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Students:</span>
                    <span className={styles.detailValue}>{course.students} enrolled</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className={styles.reviewContent}>
                <h3 className={styles.sectionTitle}>Reviews</h3>
                <p className={styles.comingSoon}>Reviews coming soon...</p>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className={styles.resourcesContent}>
                <h3 className={styles.sectionTitle}>Resources</h3>
                <p className={styles.comingSoon}>Resources coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Course Content */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Course Content</h3>
            <CourseContentList lessons={course.lessons} />
          </div>

          {/* Also Bought */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Student Also Bought</h3>
            <div className={styles.alsoBoughtList}>
              {mockRelatedCourses.map((relatedCourse) => (
                <AlsoBoughtCard 
                  key={relatedCourse.id}
                  course={relatedCourse}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;