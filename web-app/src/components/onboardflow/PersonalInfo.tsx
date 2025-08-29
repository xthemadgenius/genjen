'use client';

import React, { useState } from 'react';
import { UpdateUserRequest } from '../../types/user';
import styles from './css/PersonalInfo.module.css';

interface PersonalInfoProps {
  data: {
    username: string;
    name: {
      first_name: string;
      last_name: string;
    };
    email: string;
    phone: string;
    address: string;
  };
  onUpdate: (data: PersonalInfoProps['data']) => void;
  onNext: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    let newData;
    if (field === 'firstName') {
      newData = { ...formData, name: { ...formData.name, first_name: value } };
    } else if (field === 'lastName') {
      newData = { ...formData, name: { ...formData.name, last_name: value } };
    } else {
      newData = { ...formData, [field]: value };
    }
    
    setFormData(newData);
    onUpdate(newData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.first_name.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.name.last_name.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
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
              <h3 className={styles.stepTitle}>Subscription plan</h3>
              <p className={styles.stepDescription}>Choose the product plan that fits your needs.</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Identity verification</h3>
              <p className={styles.stepDescription}>Verify your identity for security purposes.</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Activate account</h3>
              <p className={styles.stepDescription}>Final step! Let&apos;s activate your account.</p>
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
                <label htmlFor="firstName" className={styles.label}>
                  First name<span className={styles.required}>*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.name.first_name}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="First name"
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              </div>
              
              <div className={styles.field}>
                <label htmlFor="lastName" className={styles.label}>
                  Last name<span className={styles.required}>*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.name.last_name}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Last name"
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </div>
            </div>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="username" className={styles.label}>
                  Username<span className={styles.required}>*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Choose a username"
                  className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                />
                {errors.username && <span className={styles.errorText}>{errors.username}</span>}
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
                  placeholder="(123) 456-7890"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
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
                  placeholder="123 Main St, City, State"
                  className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                />
                {errors.address && <span className={styles.errorText}>{errors.address}</span>}
              </div>
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