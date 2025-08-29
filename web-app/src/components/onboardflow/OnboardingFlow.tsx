'use client';

import React, { useState, useEffect, useRef } from 'react';
import PersonalInfo from './PersonalInfo';
import ServiceSelection from './ServiceSelection';
import PlanSelection from './PlanSelection';
import SuccessStep from './SuccessStep';
import styles from './css/OnboardingFlow.module.css';

export interface OnboardingData {
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
}

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    personalInfo: {
      username: '',
      name: {
        first_name: '',
        last_name: ''
      },
      email: '',
      phone: '',
      address: ''
    },
    selectedServices: [],
    selectedPlan: '',
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePersonalInfo = (info: OnboardingData['personalInfo']) => {
    setFormData(prev => ({ ...prev, personalInfo: info }));
  };

  const updateServices = (services: string[]) => {
    setFormData(prev => ({ ...prev, selectedServices: services }));
  };

  const updatePlan = (plan: string) => {
    setFormData(prev => ({ ...prev, selectedPlan: plan }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    console.log('Onboarding completed:', formData);
    
    try {
      // TODO: Submit onboarding data to API to update user profile
      // This will update the temporary user created during signup
      const response = await fetch('/api/auth/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalInfo: formData.personalInfo,
          selectedServices: formData.selectedServices,
          selectedPlan: formData.selectedPlan
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }
      
      // Move to success step
      setCurrentStep(4);
      
    } catch (error) {
      console.error('Onboarding submission failed:', error);
      // TODO: Show error message to user
    }
  };

  // Handle keyboard navigation and focus management
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Handle escape key (could go back or show confirmation)
        if (currentStep > 1) {
          prevStep();
        }
      }
      
      // Focus trapping
      if (event.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [href]'
        );
        const focusableArray = Array.from(focusableElements) as HTMLElement[];
        
        if (focusableArray.length === 0) return;
        
        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];
        
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep]);
  
  // Auto-focus first element when step changes
  useEffect(() => {
    if (containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"]), [href]'
      ) as HTMLElement;
      
      if (firstFocusable) {
        // Small delay to ensure the DOM has updated
        setTimeout(() => {
          firstFocusable.focus();
        }, 100);
      }
    }
  }, [currentStep]);

  return (
    <div 
      className={styles.onboardingContainer}
      ref={containerRef}
      role="dialog"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-description"
    >
      <div className={styles.contentWrapper}>
        {currentStep === 1 && (
          <PersonalInfo
            data={formData.personalInfo}
            onUpdate={updatePersonalInfo}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 2 && (
          <ServiceSelection
            selectedServices={formData.selectedServices}
            onUpdate={updateServices}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 3 && (
          <PlanSelection
            selectedPlan={formData.selectedPlan}
            onUpdate={updatePlan}
            onBack={prevStep}
            onSubmit={handleSubmit}
          />
        )}
        
        {currentStep === 4 && (
          <SuccessStep
            formData={formData}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;