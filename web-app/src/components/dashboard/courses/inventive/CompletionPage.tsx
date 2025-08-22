'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './css/CompletionPage.module.css';

interface FormData {
  [key: number]: string | string[];
}

const CompletionPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('inventive-course-data');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Clear form data after successful submission
    localStorage.removeItem('inventive-course-data');
  };

  const handleReturnToCourses = () => {
    router.push('/dashboard/courses');
  };

  const handleStartAnother = () => {
    localStorage.removeItem('inventive-course-data');
    router.push('/dashboard/courses/inventive/1');
  };

  if (isSubmitted) {
    return (
      <div className={styles.completionPage}>
        <div className={styles.completionContainer}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 24 24" width="80" height="80">
              <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
            </svg>
          </div>
          
          <h1 className={styles.completionTitle}>
            🎉 Your Creative Journey Begins!
          </h1>
          
          <p className={styles.completionMessage}>
            Thank you for sharing your creative spirit with us! Your responses help us understand how to best support your spontaneous freedom in creativity.
          </p>
          
          <div className={styles.nextSteps}>
            <h3 className={styles.nextStepsTitle}>What happens next?</h3>
            <ul className={styles.nextStepsList}>
              <li>We'll analyze your creative profile</li>
              <li>You'll receive personalized resource recommendations</li>
              <li>Access to our exclusive creative community opens up</li>
              <li>Your customized learning path will be ready in 24 hours</li>
            </ul>
          </div>
          
          <div className={styles.actionButtons}>
            <button 
              className={styles.primaryButton}
              onClick={handleReturnToCourses}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
              </svg>
              Return to Courses
            </button>
            
            <button 
              className={styles.secondaryButton}
              onClick={handleStartAnother}
            >
              Take Another Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.completionPage}>
      <div className={styles.completionContainer}>
        <div className={styles.reviewIcon}>
          <svg viewBox="0 0 24 24" width="64" height="64">
            <path fill="currentColor" d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19M17,17H7V15H17V17M17,13H7V11H17V13M17,9H7V7H17V9Z"/>
          </svg>
        </div>
        
        <h1 className={styles.completionTitle}>
          Ready to Unlock Your Creative Freedom?
        </h1>
        
        <p className={styles.completionMessage}>
          You've completed all 10 questions! Your creative journey profile is ready to be processed. 
          We're excited to help you discover new ways to express your spontaneous creativity.
        </p>
        
        <div className={styles.summaryBox}>
          <h3 className={styles.summaryTitle}>Your Creative Profile Summary</h3>
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10</span>
              <span className={styles.statLabel}>Questions Completed</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {Object.keys(formData).length}
              </span>
              <span className={styles.statLabel}>Insights Captured</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>Creative Possibilities</span>
            </div>
          </div>
        </div>
        
        <div className={styles.actionButtons}>
          {!isSubmitting ? (
            <>
              <button 
                className={styles.primaryButton}
                onClick={handleSubmit}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                </svg>
                Submit My Profile
              </button>
              
              <button 
                className={styles.secondaryButton}
                onClick={handleReturnToCourses}
              >
                Save & Return Later
              </button>
            </>
          ) : (
            <button className={styles.loadingButton} disabled>
              <div className={styles.spinner}></div>
              Processing Your Creative Profile...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;