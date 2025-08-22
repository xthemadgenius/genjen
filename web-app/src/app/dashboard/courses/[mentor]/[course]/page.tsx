'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CourseDetail from '@/components/dashboard/courses/detail/CourseDetail';

const CourseDetailPage: React.FC = () => {
  return (
    <DashboardLayout>
      <CourseDetail />
    </DashboardLayout>
  );
};

export default CourseDetailPage;