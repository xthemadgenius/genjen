'use client';

import React, { useState } from 'react';
import styles from './css/PlanSelection.module.css';

interface PlanSelectionProps {
  selectedPlan: string;
  onUpdate: (plan: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isYearly?: boolean;
  onBillingUpdate?: (isYearly: boolean) => void;
}

const plans = [
  {
    id: 'circle',
    name: 'The Circle',
    description: 'Begin. Belong. Blossom.',
    monthlyPrice: '$29',
    yearlyPrice: '$290',
    features: [
      'Community platform & circles',
      'Intro courses & learning journeys',
      'Wisdom Exchange content library',
      'Invitations to free events',
      'Entry tier: self-paced, no live calls'
    ]
  },
  {
    id: 'legacy-path',
    name: 'The Legacy Path',
    description: 'Grow your leadership. Build your legacy.',
    monthlyPrice: '$97',
    yearlyPrice: '$970',
    features: [
      'Everything in The Circle',
      'Full course & learning tracks',
      'Monthly Book Club',
      'All session recordings',
      'Early access to workshops & summits',
      'Growth tier: complete library, still no live calls'
    ]
  },
  {
    id: 'sun-collective',
    name: 'The Sun Collective',
    description: 'Shine brighter. Share wisdom. Lead with impact.',
    monthlyPrice: '$197',
    yearlyPrice: '$1,970',
    popular: true,
    features: [
      'Everything in The Legacy Path',
      'Quarterly live group calls with Lee',
      'Exclusive virtual masterminds',
      'AI Storytelling & Legacy toolkit',
      'Community spotlight recognition',
      'Leadership tier: live access, masterminds, storytelling tools'
    ]
  },
  {
    id: 'visionary-circle',
    name: 'The Visionary Circle',
    description: 'Co-create the future. Lead with vision.',
    monthlyPrice: '$497',
    yearlyPrice: '$4,970',
    features: [
      'Everything in The Sun Collective',
      'Small-group strategy calls with Lee',
      'VIP retreats & legacy labs',
      'Partner collaborations',
      'Visionary Partner recognition',
      'Visionary tier: high-touch mentorship & exclusive experiences'
    ]
  }
];

const PlanSelection: React.FC<PlanSelectionProps> = ({
  selectedPlan,
  onUpdate,
  onBack,
  onSubmit,
  isYearly = false,
  onBillingUpdate
}) => {
  const [localIsYearly, setLocalIsYearly] = useState(isYearly);
  const currentIsYearly = onBillingUpdate ? isYearly : localIsYearly;

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
      <div className={styles.content} role="main" aria-labelledby="plan-selection-title">
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
            <h1 id="plan-selection-title" className={styles.title}>Available plans</h1>
            <p className={styles.subtitle}>Select the plan that best fits your needs and budget.</p>
            
            {/* Billing Toggle */}
            <div className={styles.billingToggle}>
              <span className={!currentIsYearly ? styles.activeToggle : ''}>Monthly</span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={currentIsYearly}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    if (onBillingUpdate) {
                      onBillingUpdate(newValue);
                    } else {
                      setLocalIsYearly(newValue);
                    }
                  }}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={currentIsYearly ? styles.activeToggle : ''}>
                Yearly
                <span className={styles.saveBadge}>Save 16%</span>
              </span>
            </div>
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
                {plan.popular && <div className={styles.popularBadge}>Most Loved</div>}
                
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planDescription}>{plan.description}</p>
                </div>

                <div className={styles.planDetails}>
                  <div className={styles.price}>
                    {currentIsYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    <span className={styles.billingPeriod}>
                      /{currentIsYearly ? 'year' : 'month'}
                    </span>
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