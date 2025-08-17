'use client';

import React from 'react';
import styles from './css/ServiceSelection.module.css';

interface ServiceSelectionProps {
  selectedServices: string[];
  onUpdate: (services: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const services = [
  {
    id: 'mentorship',
    name: 'Mentorship',
    icon: '🤝',
    description: 'Connect with experienced mentors'
  },
  {
    id: 'learning',
    name: 'Learning Journeys',
    icon: '🎓',
    description: 'Personalized learning paths'
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    icon: '📚',
    description: 'AI-powered narrative experiences'
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: '🌐',
    description: 'Professional network building'
  },
  {
    id: 'wisdom-exchange',
    name: 'Wisdom Exchange',
    icon: '💡',
    description: 'Share and gain insights across generations'
  },
  {
    id: 'community',
    name: 'Community',
    icon: '👥',
    description: 'Engage with like-minded individuals'
  }
];

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedServices,
  onUpdate,
  onNext,
  onBack
}) => {
  const handleServiceToggle = (serviceId: string) => {
    const isSelected = selectedServices.includes(serviceId);
    if (isSelected) {
      onUpdate(selectedServices.filter(id => id !== serviceId));
    } else {
      onUpdate([...selectedServices, serviceId]);
    }
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      onNext();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content} role="main" aria-labelledby="service-selection-title">
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
            <span className={styles.stepLabel}>Interests</span>
          </div>
          
          <div className={styles.progressStep}>
            <div className={styles.stepCircle}>
              <span>3</span>
            </div>
            <span className={styles.stepLabel}>Membership</span>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 id="service-selection-title" className={styles.title}>What interests you most?</h1>
            <p className={styles.stepCounter}>Step 2/3</p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <div
                key={service.id}
                className={`${styles.serviceCard} ${
                  selectedServices.includes(service.id) ? styles.selected : ''
                }`}
                onClick={() => handleServiceToggle(service.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleServiceToggle(service.id);
                  }
                }}
                aria-pressed={selectedServices.includes(service.id)}
              >
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <div className={styles.checkmark}>
                  {selectedServices.includes(service.id) && <span>✓</span>}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button onClick={onBack} className={styles.backButton}>
              Back
            </button>
            <button
              onClick={handleContinue}
              className={styles.continueButton}
              disabled={selectedServices.length === 0}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;