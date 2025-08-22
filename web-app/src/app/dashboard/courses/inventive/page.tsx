'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const InventivePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to first question
    router.replace('/dashboard/courses/inventive/1');
  }, [router]);

  return null;
};

export default InventivePage;