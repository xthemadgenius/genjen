'use client';

import { createAppKit } from '@reown/appkit';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import type { SocialProvider } from '@reown/appkit';

// Configuration for JenGen Reown integration - Social Auth Only
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  console.error('NEXT_PUBLIC_REOWN_PROJECT_ID is required');
}

// Metadata for the app
const metadata = {
  name: 'JenGen',
  description: 'Bridging Generations Through AI-Powered Learning & Mentorship',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  icons: ['/jengenwhite.png']
};

// Features configuration - enable email and social logins, disable direct wallet connections
const features = {
  analytics: true,
  email: true, // Enable email login (creates wallets)
  socials: ['google', 'facebook', 'apple'] as SocialProvider[],
  emailShowWallets: false, // Don't show wallet options in email flow
  socialShowWallets: false, // Don't show wallet options in social flow
  swaps: false,
  onramp: false,
  history: false
};

// Theme configuration to match JenGen branding
const themeConfig = {
  themeMode: 'light' as const,
  themeVariables: {
    '--w3m-font-family': 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    '--w3m-accent': '#8b5cf6',
    '--w3m-color-mix': '#8b5cf6',
    '--w3m-color-mix-strength': 20,
    '--w3m-font-size-master': '16px',
    '--w3m-border-radius-master': '12px',
  }
};

let appKit: ReturnType<typeof createAppKit> | null = null;

// Initialize Reown AppKit with social auth only
export function initializeReown() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (appKit) {
    return appKit;
  }

  if (!projectId) {
    console.error('NEXT_PUBLIC_REOWN_PROJECT_ID is required but not found in environment variables');
    return null;
  }

  try {
    appKit = createAppKit({
      projectId,
      metadata,
      networks: [mainnet, arbitrum],
      features,
      themeMode: themeConfig.themeMode,
      themeVariables: themeConfig.themeVariables
      // Remove includeWalletIds and excludeWalletIds to prevent HTTP 400
      // AppKit will handle this based on the features configuration
    });

    return appKit;
  } catch (error) {
    console.error('Failed to initialize Reown AppKit:', error);
    // Return null to allow fallback authentication
    return null;
  }
}

// Proper Reown AppKit social authentication per documentation
export const socialLogin = {
  async loginWithGoogle(): Promise<{ success: boolean; provider: string; user?: ReownUser }> {
    try {
      const kit = initializeReown();
      if (!kit) throw new Error('Reown AppKit not initialized');
      
      // Store auth context
      sessionStorage.setItem('auth_provider', 'google');
      sessionStorage.setItem('auth_type', 'login');
      
      // Use AppKit's built-in social login - this handles OAuth internally
      await kit.open();
      
      return { success: true, provider: 'google' };
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  },

  async loginWithFacebook(): Promise<{ success: boolean; provider: string; user?: ReownUser }> {
    try {
      const kit = initializeReown();
      if (!kit) throw new Error('Reown AppKit not initialized');
      
      // Store auth context
      sessionStorage.setItem('auth_provider', 'facebook');
      sessionStorage.setItem('auth_type', 'login');
      
      // Use AppKit's built-in social login
      await kit.open();
      
      return { success: true, provider: 'facebook' };
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    }
  },

  async loginWithApple(): Promise<{ success: boolean; provider: string; user?: ReownUser }> {
    try {
      const kit = initializeReown();
      if (!kit) throw new Error('Reown AppKit not initialized');
      
      // Store auth context
      sessionStorage.setItem('auth_provider', 'apple');
      sessionStorage.setItem('auth_type', 'login');
      
      // Use AppKit's built-in social login
      await kit.open();
      
      return { success: true, provider: 'apple' };
    } catch (error) {
      console.error('Apple login failed:', error);
      throw error;
    }
  },

  async signupWithGoogle(): Promise<{ success: boolean; provider: string; user?: ReownUser }> {
    try {
      const kit = initializeReown();
      if (!kit) throw new Error('Reown AppKit not initialized');
      
      // Store auth context
      sessionStorage.setItem('auth_provider', 'google');
      sessionStorage.setItem('auth_type', 'signup');
      
      // Use AppKit's built-in social login
      await kit.open();
      
      return { success: true, provider: 'google' };
    } catch (error) {
      console.error('Google signup failed:', error);
      throw error;
    }
  },

  async signupWithFacebook(): Promise<{ success: boolean; provider: string; user?: ReownUser }> {
    try {
      const kit = initializeReown();
      if (!kit) throw new Error('Reown AppKit not initialized');
      
      // Store auth context
      sessionStorage.setItem('auth_provider', 'facebook');
      sessionStorage.setItem('auth_type', 'signup');
      
      // Use AppKit's built-in social login
      await kit.open();
      
      return { success: true, provider: 'facebook' };
    } catch (error) {
      console.error('Facebook signup failed:', error);
      throw error;
    }
  },

  async signupWithApple(): Promise<{ success: boolean; provider: string; user?: ReownUser }> {
    try {
      const kit = initializeReown();
      if (!kit) throw new Error('Reown AppKit not initialized');
      
      // Store auth context
      sessionStorage.setItem('auth_provider', 'apple');
      sessionStorage.setItem('auth_type', 'signup');
      
      // Use AppKit's built-in social login
      await kit.open();
      
      return { success: true, provider: 'apple' };
    } catch (error) {
      console.error('Apple signup failed:', error);
      throw error;
    }
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      const kit = initializeReown();
      if (kit) {
        await kit.disconnect();
      }
      
      // Clear session storage
      sessionStorage.removeItem('auth_provider');
      sessionStorage.removeItem('auth_type');
      sessionStorage.removeItem('auth_token');
      
      // Clear any stored user data
      localStorage.removeItem('jengen_user');
      
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
};

// User type definition
export interface ReownUser {
  id: string;
  email?: string;
  name?: string;
  provider: 'google' | 'facebook' | 'apple' | 'email';
  avatar?: string;
}

// Email authentication utilities
export const emailAuth = {
  async signupWithEmail(email: string, password: string): Promise<{ success: boolean; user?: ReownUser }> {
    try {
      // Direct email signup without modal
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          provider: 'email'
        }),
      });

      if (!response.ok) {
        throw new Error(`Signup failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Store user data
      if (result.success && result.user) {
        localStorage.setItem('jengen_user', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('Email signup failed:', error);
      throw error;
    }
  },

  async loginWithEmail(email: string, password: string): Promise<{ success: boolean; user?: ReownUser }> {
    try {
      // Direct email login without modal
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          provider: 'email'
        }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Store user data
      if (result.success && result.user) {
        localStorage.setItem('jengen_user', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    }
  }
};

// Authentication state management with AppKit
export const auth = {
  isAuthenticated(): boolean {
    // Check AppKit connection state first
    const kit = initializeReown();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (kit && typeof (kit as any).getIsConnected === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (kit as any).getIsConnected();
    }
    
    // Fallback to localStorage
    const userData = localStorage.getItem('jengen_user');
    return !!userData;
  },

  getCurrentUser(): ReownUser | null {
    // Try to get user from AppKit first
    const kit = initializeReown();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (kit && typeof (kit as any).getAddress === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const address = (kit as any).getAddress();
      if (address) {
        // Convert AppKit user data to our ReownUser format
        const provider = sessionStorage.getItem('auth_provider') as 'google' | 'facebook' | 'apple' || 'google';
        return {
          id: address,
          email: '', // Will be populated after OAuth
          name: '', // Will be populated after OAuth
          provider,
          avatar: ''
        };
      }
    }
    
    // Fallback to localStorage
    const userData = localStorage.getItem('jengen_user');
    return userData ? JSON.parse(userData) : null;
  },

  onAuthStateChange(callback: (user: ReownUser | null) => void) {
    // Listen for AppKit connection changes using provider subscription
    const kit = initializeReown();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (kit && typeof (kit as any).subscribeProvider === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unsubscribe = (kit as any).subscribeProvider((state: any) => {
        if (state.isConnected && state.address) {
          const provider = sessionStorage.getItem('auth_provider') as 'google' | 'facebook' | 'apple' || 'google';
          const user: ReownUser = {
            id: state.address,
            email: '',
            name: '',
            provider,
            avatar: ''
          };
          callback(user);
        } else {
          callback(null);
        }
      });
      
      return unsubscribe;
    }

    // Fallback to storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jengen_user') {
        const user = e.newValue ? JSON.parse(e.newValue) : null;
        callback(user);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
    
    return () => {};
  }
};

// OAuth callback handler
export const handleOAuthCallback = async (code: string, provider: string, authType: 'login' | 'signup') => {
  try {
    const response = await fetch('/api/auth/oauth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        provider,
        authType,
        projectId
      }),
    });

    if (!response.ok) {
      throw new Error(`OAuth callback failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success && result.user) {
      localStorage.setItem('jengen_user', JSON.stringify(result.user));
      return result;
    }

    throw new Error('OAuth authentication failed');
  } catch (error) {
    console.error('OAuth callback failed:', error);
    throw error;
  }
};