'use client';

import React from 'react';
import InventiveLayout from '@/components/dashboard/courses/inventive/InventiveLayout';

interface InventiveLayoutPageProps {
  children: React.ReactNode;
}

const InventiveLayoutPage: React.FC<InventiveLayoutPageProps> = ({ children }) => {
  return <InventiveLayout>{children}</InventiveLayout>;
};

export default InventiveLayoutPage;