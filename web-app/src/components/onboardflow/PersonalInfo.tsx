'use client';

import React, { useState } from 'react';
import styles from './css/PersonalInfo.module.css';

interface PersonalInfoProps {
  data: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
  onUpdate: (data: PersonalInfoProps['data']) => void;
  onNext: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>JG</div>
          <span className={styles.logoText}>JenGen.ai</span>
        </div>
        
        <div className={styles.stepsList}>
          <div className={`${styles.step} ${styles.stepActive}`}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Personal information</h3>
              <p className={styles.stepDescription}>Tell us who you are to get started.</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Membership plan</h3>
              <p className={styles.stepDescription}>Choose the membership plan that fits your needs.</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Payment</h3>
              <p className={styles.stepDescription}>Complete your membership registration.</p>
            </div>
          </div>
        </div>
        
        <div className={styles.helpSection}>
          <h4>Need a help?</h4>
          <p>Chat with live support</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Personal information</h1>
          
          <div className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="fullName" className={styles.label}>
                  Full name<span className={styles.required}>*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Exp. John Carter"
                  className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                />
                {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
              </div>
              
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email<span className={styles.required}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>
            </div>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>
                  Phone number<span className={styles.required}>*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(123) 000-0000"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>
              
              <div className={styles.field}>
                <label htmlFor="company" className={styles.label}>
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Exp. Company"
                  className={styles.input}
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <label htmlFor="address" className={styles.label}>
                Address<span className={styles.required}>*</span>
              </label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Exp. San Francisco, CA"
                className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
              />
              {errors.address && <span className={styles.errorText}>{errors.address}</span>}
            </div>
            
            <button onClick={handleContinue} className={styles.continueButton}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;