'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleOAuthCallback } from '../../../components/login/reownConfig';

const AuthCallbackPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check if this is a Reown AppKit callback (it handles OAuth internally)
        // For AppKit, we mainly need to check the authentication state
        const provider = sessionStorage.getItem('auth_provider');
        const authType = sessionStorage.getItem('auth_type') as 'login' | 'signup';
        
        if (!provider || !authType) {
          // If no provider context, redirect to login
          router.push('/login');
          return;
        }

        // Import auth utilities
        const { auth } = await import('../../../components/login/reownConfig');
        
        // Check if user is authenticated via AppKit
        const isAuthenticated = auth.isAuthenticated();
        const currentUser = auth.getCurrentUser();
        
        if (isAuthenticated && currentUser) {
          setStatus('success');
          
          // Store user data for consistency
          localStorage.setItem('jengen_user', JSON.stringify({
            ...currentUser,
            provider,
            authType
          }));
          
          // Clear session storage
          sessionStorage.removeItem('auth_provider');
          sessionStorage.removeItem('auth_type');
          
          // Redirect to onboarding after successful authentication
          setTimeout(() => {
            router.push('/onboarding');
          }, 1500);
        } else {
          // OAuth might still be in progress, wait a bit and check again
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const recheckAuth = auth.isAuthenticated();
          const recheckUser = auth.getCurrentUser();
          
          if (recheckAuth && recheckUser) {
            setStatus('success');
            
            localStorage.setItem('jengen_user', JSON.stringify({
              ...recheckUser,
              provider,
              authType
            }));
            
            sessionStorage.removeItem('auth_provider');
            sessionStorage.removeItem('auth_type');
            
            setTimeout(() => {
              router.push('/onboarding');
            }, 1500);
          } else {
            throw new Error('Authentication verification failed');
          }
        }
      } catch (error) {
        console.error('OAuth callback processing failed:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        // Clear session storage on error
        sessionStorage.removeItem('auth_provider');
        sessionStorage.removeItem('auth_type');
        
        // Redirect back to login page after showing error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    processCallback();
  }, [router, searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing Authentication</h2>
            <p className="text-gray-600 text-center">Please wait while we process your login...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Successful!</h2>
            <p className="text-gray-600 text-center">Redirecting you to get started...</p>
          </div>
        );
      
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 text-center mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">Redirecting you back to login...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">JenGen.ai</span>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthCallbackPage;