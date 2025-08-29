'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './css/SuccessStep.module.css';

interface SuccessStepProps {
  formData: {
    personalInfo: {
      username: string;
      name: {
        first_name: string;
        last_name: string;
      };
      email: string;
      phone: string;
      address: string;
    };
    selectedServices: string[];
    selectedPlan: string;
  };
}

const SuccessStep: React.FC<SuccessStepProps> = ({ formData }) => {
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to dashboard or main app
    router.push('/dashboard');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.successContent}>
          {/* Success Icon */}
          <div className={styles.successIcon}>
            <svg className={styles.checkIcon} viewBox="0 0 24 24" width="80" height="80">
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={styles.checkCircle}
              />
              <path 
                d="M9 12l2 2 4-4" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={styles.checkMark}
              />
            </svg>
          </div>

          {/* Success Message */}
          <div className={styles.messageContent}>
            <h1 className={styles.title}>Welcome to JenGen AI, {formData.personalInfo.name.first_name}!</h1>
            <p className={styles.subtitle}>
              Your account has been successfully created and you&apos;re all set to begin your journey with us.
            </p>
            
            {/* Success Details */}
            <div className={styles.successDetails}>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span>Account created successfully</span>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <span>Confirmation email sent to {formData.personalInfo.email}</span>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span>{formData.selectedPlan} plan activated</span>
              </div>
            </div>

            {/* Selected Services Summary */}
            {formData.selectedServices.length > 0 && (
              <div className={styles.servicesSummary}>
                <h3 className={styles.summaryTitle}>Your Selected Services:</h3>
                <div className={styles.servicesGrid}>
                  {formData.selectedServices.map((service, index) => (
                    <div key={index} className={styles.serviceChip}>
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button 
              className={styles.primaryButton}
              onClick={handleGetStarted}
            >
              Get Started
            </button>
            
            <button 
              className={styles.secondaryButton}
              onClick={handleBackToHome}
            >
              Back to Home
            </button>
          </div>

          {/* Additional Help */}
          <div className={styles.helpSection}>
            <p className={styles.helpText}>
              Need help getting started? 
              <Link href="/support" className={styles.helpLink}>
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;