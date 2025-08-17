'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './css/LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // TODO: Replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login attempt:', formData);
      router.push('/onboard');
    } catch {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual OAuth logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`${provider} login attempt`);
      router.push('/onboard');
    } catch {
      setErrors({ general: `${provider} login failed. Please try again.` });
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
      aria-labelledby="login-title"
    >
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close login modal"
          >
            ×
          </button>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>JG</div>
            <span className={styles.logoText}>JenGen.ai</span>
          </div>
        </div>

        <div className={styles.content}>
          <h1 id="login-title" className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account to continue your journey</p>

          {errors.general && (
            <div className={styles.errorMessage}>{errors.general}</div>
          )}

          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className={styles.field}>
              <label htmlFor="login-email" className={styles.label}>
                Email address
              </label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordContainer}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter your password"
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

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loading}>
                  <span className={styles.spinner}></span>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or continue with</span>
          </div>

          <div className={styles.socialButtons}>
            <button
              className={`${styles.socialButton} ${styles.googleButton}`}
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <span className={styles.socialIcon}>🔍</span>
              Google
            </button>

            <button
              className={`${styles.socialButton} ${styles.facebookButton}`}
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
            >
              <span className={styles.socialIcon}>📘</span>
              Facebook
            </button>

            <button
              className={`${styles.socialButton} ${styles.appleButton}`}
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              <span className={styles.socialIcon}>🍎</span>
              Apple
            </button>
          </div>

          <div className={styles.footer}>
            <p>
              Don&apos;t have an account?{' '}
              <button
                className={styles.linkButton}
                onClick={onSwitchToSignup}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;