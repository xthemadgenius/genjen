"use client";

import React, { useState } from 'react';
import styles from './css/ContactSection.module.css';

const ContactSection = () => {
  const [formType, setFormType] = useState('sayHi');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData, 'Type:', formType);
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Left Side - Form */}
          <div className={styles.leftContent}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.contactLabel}>Get In Touch</div>
              <h2 className={styles.subtitle}>
                Ready to Bridge Generations? Let&apos;s <span className={styles.accent}>Connect & Create</span> Together
              </h2>
            </div>

            {/* Radio Toggle */}
            <div className={styles.radioToggle}>
              <label className={`${styles.radioOption} ${formType === 'sayHi' ? styles.active : ''}`}>
                <input
                  type="radio"
                  value="sayHi"
                  checked={formType === 'sayHi'}
                  onChange={(e) => setFormType(e.target.value)}
                />
                <span className={styles.radioCircle}></span>
                Share Your Vision
              </label>
              
              <label className={`${styles.radioOption} ${formType === 'getQuote' ? styles.active : ''}`}>
                <input
                  type="radio"
                  value="getQuote"
                  checked={formType === 'getQuote'}
                  onChange={(e) => setFormType(e.target.value)}
                />
                <span className={styles.radioCircle}></span>
                Join the Movement
              </label>
            </div>

            {/* Form Container */}
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Name Field */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className={styles.input}
                  />
                </div>

                {/* Email Field */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Email<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={styles.input}
                    required
                  />
                </div>

                {/* Message Field */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Message<span className={styles.required}>*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={formType === 'sayHi' 
                      ? "Share your vision for bridging generational wisdom with technology..." 
                      : "Tell us how you'd like to contribute to the JenGen AI movement..."
                    }
                    className={styles.textarea}
                    rows={5}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className={styles.submitButton}>
                  {formType === 'sayHi' ? 'Share Your Vision' : 'Join the Movement'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Decorative Graphics */}
          <div className={styles.rightContent}>
            <div className={styles.decorativeElements}>
              {/* Main Starburst */}
              <div className={styles.starburst}>
                <svg viewBox="0 0 200 200" className={styles.starburstSvg}>
                  <g className={styles.starburstGroup}>
                    {/* Main diamond shape */}
                    <path 
                      d="M100,20 L140,100 L100,180 L60,100 Z" 
                      className={styles.starburstCore}
                    />
                    
                    {/* Radiating lines */}
                    {Array.from({ length: 16 }, (_, i) => {
                      const angle = (i * 22.5) * Math.PI / 180;
                      const x1 = 100 + Math.cos(angle) * 35;
                      const y1 = 100 + Math.sin(angle) * 35;
                      const x2 = 100 + Math.cos(angle) * 80;
                      const y2 = 100 + Math.sin(angle) * 80;
                      
                      return (
                        <line 
                          key={i}
                          x1={x1} 
                          y1={y1} 
                          x2={x2} 
                          y2={y2} 
                          className={styles.starburstLine}
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* Accent Star */}
              <div className={styles.accentStar}>
                <svg viewBox="0 0 60 60" className={styles.accentStarSvg}>
                  <path 
                    d="M30,5 L35,20 L50,20 L40,30 L45,45 L30,37 L15,45 L20,30 L10,20 L25,20 Z" 
                    className={styles.accentStarShape}
                  />
                </svg>
              </div>

              {/* Additional decorative elements */}
              <div className={styles.floatingDot1}></div>
              <div className={styles.floatingDot2}></div>
              <div className={styles.floatingDot3}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;