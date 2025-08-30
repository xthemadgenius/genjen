'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from './css/PaymentStep.module.css';

interface PaymentStepProps {
  selectedPlan: string;
  isYearly: boolean;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

const planDetails = {
  'circle': { name: 'The Circle', monthly: 29, yearly: 290 },
  'legacy-path': { name: 'The Legacy Path', monthly: 97, yearly: 970 },
  'sun-collective': { name: 'The Sun Collective', monthly: 197, yearly: 1970 },
  'visionary-circle': { name: 'The Visionary Circle', monthly: 497, yearly: 4970 }
};

const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedPlan,
  isYearly,
  onBack,
  onPaymentSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = planDetails[selectedPlan as keyof typeof planDetails];
  const price = isYearly ? plan.yearly : plan.monthly;
  const period = isYearly ? 'year' : 'month';

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          isYearly,
          amount: price * 100, // Stripe uses cents
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Redirect to Stripe Checkout or handle payment
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // For now, simulate payment success
      // In production, you'd integrate with Stripe Elements or Checkout
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentSuccess();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setIsProcessing(false);
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
          
          <div className={`${styles.progressStep} ${styles.completed}`}>
            <div className={styles.stepCircle}>
              <span>✓</span>
            </div>
            <span className={styles.stepLabel}>Interests</span>
          </div>
          
          <div className={`${styles.progressStep} ${styles.completed}`}>
            <div className={styles.stepCircle}>
              <span>✓</span>
            </div>
            <span className={styles.stepLabel}>Membership</span>
          </div>
          
          <div className={`${styles.progressStep} ${styles.active}`}>
            <div className={styles.stepCircle}>
              <span>4</span>
            </div>
            <span className={styles.stepLabel}>Payment</span>
          </div>
        </div>

        {/* Payment Content */}
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Complete Your Payment</h1>
            <p className={styles.subtitle}>Secure your membership to JenGen AI</p>
          </div>

          {/* Plan Summary */}
          <div className={styles.planSummary}>
            <div className={styles.summaryHeader}>
              <h3>{plan.name}</h3>
              <div className={styles.planPrice}>
                ${price}
                <span className={styles.period}>/{period}</span>
              </div>
            </div>
            
            <div className={styles.billingInfo}>
              <span className={styles.billingType}>
                {isYearly ? 'Annual Billing' : 'Monthly Billing'}
              </span>
              {isYearly && (
                <span className={styles.savings}>
                  Save ${(plan.monthly * 12) - plan.yearly}
                </span>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className={styles.paymentForm}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <div className={styles.paymentMethods}>
              <h4>Payment Method</h4>
              <div className={styles.methodCard}>
                <div className={styles.cardIcon}>💳</div>
                <span>Credit or Debit Card</span>
              </div>
            </div>

            <div className={styles.securityNote}>
              <div className={styles.securityIcon}>🔒</div>
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button onClick={onBack} className={styles.backButton}>
              Back
            </button>
            <button
              onClick={handlePayment}
              className={styles.payButton}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${price}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;