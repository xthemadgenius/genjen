'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LogoutContextType {
  isLoggingOut: boolean;
  setIsLoggingOut: (value: boolean) => void;
  recentlyLoggedOut: boolean;
  setRecentlyLoggedOut: (value: boolean) => void;
}

const LogoutContext = createContext<LogoutContextType | undefined>(undefined);

export function LogoutProvider({ children }: { children: React.ReactNode }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [recentlyLoggedOut, setRecentlyLoggedOut] = useState(false);

  // Clear recently logged out flag after a delay
  useEffect(() => {
    if (recentlyLoggedOut) {
      const timer = setTimeout(() => {
        setRecentlyLoggedOut(false);
      }, 3000); // Clear after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [recentlyLoggedOut]);

  return (
    <LogoutContext.Provider value={{
      isLoggingOut,
      setIsLoggingOut,
      recentlyLoggedOut,
      setRecentlyLoggedOut
    }}>
      {children}
    </LogoutContext.Provider>
  );
}

export function useLogout() {
  const context = useContext(LogoutContext);
  if (context === undefined) {
    throw new Error('useLogout must be used within a LogoutProvider');
  }
  return context;
}