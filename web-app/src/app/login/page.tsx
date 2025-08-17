'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LoginModal from '../../components/login/LoginModal';
import SignupModal from '../../components/login/SignupModal';

export default function LoginPage() {
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const router = useRouter();

  // Close both modals and redirect to home
  const handleCloseModals = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    router.push('/');
  }, [router]);

  // Switch from login to signup
  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
    // Update URL without page reload
    window.history.pushState({}, '', '/signup');
  };

  // Switch from signup to login
  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
    // Update URL without page reload
    window.history.pushState({}, '', '/login');
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // If user navigates back, close modals and go to home
      handleCloseModals();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleCloseModals]);

  return (
    <div>
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseModals}
        onSwitchToSignup={handleSwitchToSignup}
      />
      
      <SignupModal
        isOpen={showSignupModal}
        onClose={handleCloseModals}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}