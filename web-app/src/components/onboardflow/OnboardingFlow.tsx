'use client';

import React, { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import ServiceSelection from './ServiceSelection';
import PlanSelection from './PlanSelection';
import styles from './css/OnboardingFlow.module.css';

export interface OnboardingData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
  selectedServices: string[];
  selectedPlan: string;
}

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      address: '',
    },
    selectedServices: [],
    selectedPlan: '',
  });

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
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    console.log('Onboarding completed:', formData);
    // Handle final submission here
  };

  return (
    <div className={styles.onboardingContainer}>
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
      </div>
    </div>
  );
};

export default OnboardingFlow;