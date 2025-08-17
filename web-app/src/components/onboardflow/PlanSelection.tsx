'use client';

import React from 'react';
import styles from './css/PlanSelection.module.css';

interface PlanSelectionProps {
  selectedPlan: string;
  onUpdate: (plan: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const plans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Limited access to essential features',
    userLimit: 'Up to 5 users',
    billing: 'Monthly',
    price: '$29',
    features: ['Community Access', 'Basic Learning Paths', 'Limited Mentorship']
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    description: 'All advanced features included',
    userLimit: 'Up to 25 users',
    billing: 'Monthly',
    price: '$99',
    popular: true,
    features: ['Smart Matching', 'Custom Learning Journeys', 'Priority Support', 'Analytics Dashboard']
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    description: 'Complete access and priority support',
    userLimit: 'Up to 100 users',
    billing: 'Annual',
    price: '$199',
    features: ['AI-Powered Storytelling', 'Private Network', 'White-label Options', '24/7 Support']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'Custom solutions for large teams',
    userLimit: 'Unlimited users',
    billing: 'Annual',
    price: 'Custom',
    features: ['Custom Integrations', 'Dedicated Account Manager', 'SLA Guarantee', 'Advanced Security']
  }
];

const PlanSelection: React.FC<PlanSelectionProps> = ({
  selectedPlan,
  onUpdate,
  onBack,
  onSubmit
}) => {
  const handlePlanSelect = (planId: string) => {
    onUpdate(planId);
  };

  const handleNext = () => {
    if (selectedPlan) {
      onSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Progress Steps */}
        <div className={styles.progressSteps}>
          <div className={`${styles.progressStep} ${styles.completed}`}>
            <div className={styles.stepCircle}>
              <span>✓</span>
            </div>
            <span className={styles.stepLabel}>Personal Info</span>
          </div>
          
          <div className={`${styles.progressStep} ${styles.active}`}>
            <div className={styles.stepCircle}>
              <span>2</span>
            </div>
            <span className={styles.stepLabel}>Membership</span>
          </div>
          
          <div className={styles.progressStep}>
            <div className={styles.stepCircle}>
              <span>3</span>
            </div>
            <span className={styles.stepLabel}>Complete</span>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Available plans</h1>
            <p className={styles.subtitle}>Select the plan that best fits your needs and budget.</p>
          </div>

          <div className={styles.plansGrid}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.planCard} ${
                  selectedPlan === plan.id ? styles.selected : ''
                } ${plan.popular ? styles.popular : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePlanSelect(plan.id);
                  }
                }}
                aria-pressed={selectedPlan === plan.id}
              >
                {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
                
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planDescription}>{plan.description}</p>
                </div>

                <div className={styles.planDetails}>
                  <div className={styles.planMeta}>
                    <span className={styles.userLimit}>👥 {plan.userLimit}</span>
                    <span className={styles.billing}>📅 {plan.billing}</span>
                  </div>
                  
                  <div className={styles.price}>
                    {plan.price === 'Custom' ? 'Custom Pricing' : `${plan.price}/month`}
                  </div>
                </div>

                <div className={styles.features}>
                  {plan.features.map((feature, index) => (
                    <div key={index} className={styles.feature}>
                      <span className={styles.checkIcon}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.radioButton}>
                  <input
                    type="radio"
                    id={plan.id}
                    name="plan"
                    checked={selectedPlan === plan.id}
                    onChange={() => handlePlanSelect(plan.id)}
                    className={styles.radioInput}
                  />
                  <label htmlFor={plan.id} className={styles.radioLabel}></label>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.stepInfo}>
            <span>Step 2 of 3</span>
          </div>

          <div className={styles.actions}>
            <button onClick={onBack} className={styles.backButton}>
              Back
            </button>
            <button
              onClick={handleNext}
              className={styles.nextButton}
              disabled={!selectedPlan}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;