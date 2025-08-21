'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Courses from '@/components/dashboard/courses/Courses';

const CoursesPage = () => {
  return (
    <DashboardLayout>
      <Courses />
    </DashboardLayout>
  );
};

export default CoursesPage;