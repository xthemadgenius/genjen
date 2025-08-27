'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, ReownUser, socialLogin } from './reownConfig';

interface ReownContextType {
  isAuthenticated: boolean;
  user: ReownUser | null;
  login: (provider: 'google' | 'facebook' | 'apple') => Promise<{ success: boolean; provider: string }>;
  logout: () => Promise<void>;
}

const ReownContext = createContext<ReownContextType | null>(null);

interface ReownProviderProps {
  children: React.ReactNode;
}

export const ReownProvider: React.FC<ReownProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<ReownUser | null>(null);

  useEffect(() => {
    // Initialize auth state from localStorage
    const initAuthState = () => {
      try {
        // Set up auth state listener
        const cleanup = auth.onAuthStateChange((newUser) => {
          setUser(newUser);
          setIsAuthenticated(!!newUser);
        });

        // Check initial auth state
        const currentUser = auth.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(auth.isAuthenticated());

        return cleanup;
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
      }
    };

    const cleanup = initAuthState();
    return cleanup;
  }, []);

  const login = async (provider: 'google' | 'facebook' | 'apple') => {
    switch (provider) {
      case 'google':
        return await socialLogin.loginWithGoogle();
      case 'facebook':
        return await socialLogin.loginWithFacebook();
      case 'apple':
        return await socialLogin.loginWithApple();
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  };

  const logout = async () => {
    await socialLogin.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue: ReownContextType = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <ReownContext.Provider value={contextValue}>
      {children}
    </ReownContext.Provider>
  );
};

export const useReown = (): ReownContextType => {
  const context = useContext(ReownContext);
  if (!context) {
    throw new Error('useReown must be used within a ReownProvider');
  }
  return context;
};

export default ReownProvider;