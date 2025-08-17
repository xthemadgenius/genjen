'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './css/SignupModal.module.css';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle form data changes
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup submission
  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // TODO: Replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Signup attempt:', formData);
      router.push('/onboard');
    } catch {
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social signup
  const handleSocialSignup = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual OAuth logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`${provider} signup attempt`);
      router.push('/onboard');
    } catch {
      setErrors({ general: `${provider} signup failed. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      
      // Focus trapping
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [href]'
        );
        const focusableArray = Array.from(focusableElements) as HTMLElement[];
        
        if (focusableArray.length === 0) return;
        
        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];
        
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus first input when modal opens
      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector('input') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
    >
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close signup modal"
          >
            ×
          </button>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>JG</div>
            <span className={styles.logoText}>JenGen.ai</span>
          </div>
        </div>

        <div className={styles.content}>
          <h1 id="signup-title" className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Join JenGen.ai and start your journey</p>

          {errors.general && (
            <div className={styles.errorMessage}>{errors.general}</div>
          )}

          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
            <div className={styles.field}>
              <label htmlFor="signup-fullName" className={styles.label}>
                Full name
              </label>
              <input
                id="signup-fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                disabled={isLoading}
              />
              {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-email" className={styles.label}>
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter your email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                disabled={isLoading}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordContainer}>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Create a password"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-confirmPassword" className={styles.label}>
                Confirm password
              </label>
              <div className={styles.passwordContainer}>
                <input
                  id="signup-confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className={styles.signupButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loading}>
                  <span className={styles.spinner}></span>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or continue with</span>
          </div>

          <div className={styles.socialButtons}>
            <button
              className={`${styles.socialButton} ${styles.googleButton}`}
              onClick={() => handleSocialSignup('google')}
              disabled={isLoading}
            >
              <span className={styles.socialIcon}>🔍</span>
              Google
            </button>

            <button
              className={`${styles.socialButton} ${styles.facebookButton}`}
              onClick={() => handleSocialSignup('facebook')}
              disabled={isLoading}
            >
              <span className={styles.socialIcon}>📘</span>
              Facebook
            </button>

            <button
              className={`${styles.socialButton} ${styles.appleButton}`}
              onClick={() => handleSocialSignup('apple')}
              disabled={isLoading}
            >
              <span className={styles.socialIcon}>🍎</span>
              Apple
            </button>
          </div>

          <div className={styles.footer}>
            <p>
              Already have an account?{' '}
              <button
                className={styles.linkButton}
                onClick={onSwitchToLogin}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;