'use client';

import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener function
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

// Predefined breakpoint hooks
export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 1025px)');
export const useIsTablet = (): boolean => useMediaQuery('(min-width: 601px) and (max-width: 1024px)');
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 600px)');

// Device type hook
export const useDeviceType = (): 'desktop' | 'tablet' | 'mobile' => {
  const isDesktop = useIsDesktop();
  const isTablet = useIsTablet();

  if (isDesktop) return 'desktop';
  if (isTablet) return 'tablet';
  return 'mobile';
};