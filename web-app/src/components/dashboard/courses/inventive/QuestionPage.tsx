'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuestionById, getTotalQuestions } from './questions';
import styles from './css/QuestionPage.module.css';

interface FormData {
  [key: number]: string | string[];
}

const QuestionPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const step = params?.step as string;
  const [formData, setFormData] = useState<FormData>({});
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>('');
  const [isValid, setIsValid] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState(false);
  
  const currentStep = parseInt(step || '1', 10);
  const totalSteps = getTotalQuestions();
  const question = getQuestionById(currentStep);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('inventive-course-data');
    if (saved) {
      const data = JSON.parse(saved);
      setFormData(data);
      setCurrentAnswer(data[currentStep] || '');
    }
  }, [currentStep]);

  // Validate current answer
  useEffect(() => {
    if (!question) return;
    
    const validation = question.validation;
    if (!validation) {
      setIsValid(true);
      setErrorMessage('');
      setShowError(false);
      return;
    }

    if (validation.required && (!currentAnswer || currentAnswer === '')) {
      setIsValid(false);
      setErrorMessage('This field is required to continue your creative journey.');
      setShowError(false); // Don't show error until user tries to proceed
      return;
    }

    if (typeof currentAnswer === 'string') {
      if (validation.minLength && currentAnswer.length < validation.minLength) {
        setIsValid(false);
        setErrorMessage(`Please share a bit more - at least ${validation.minLength} characters help us understand you better.`);
        setShowError(false);
        return;
      }
      if (validation.maxLength && currentAnswer.length > validation.maxLength) {
        setIsValid(false);
        setErrorMessage(`Let's keep it concise - please stay under ${validation.maxLength} characters.`);
        setShowError(true); // Show immediately for max length
        return;
      }
    }

    setIsValid(true);
    setErrorMessage('');
    setShowError(false);
  }, [currentAnswer, question]);

  if (!question || currentStep < 1 || currentStep > totalSteps) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Oops! Page not found</h1>
        <button 
          className={styles.primaryButton}
          onClick={() => router.push('/dashboard/courses')}
        >
          Return to Courses
        </button>
      </div>
    );
  }

  const handleInputChange = (value: string | string[]) => {
    setCurrentAnswer(value);
    // Hide error when user starts typing
    if (showError && value !== '') {
      setShowError(false);
    }
  };

  const handleNext = () => {
    if (!isValid) {
      setShowError(true);
      return;
    }

    // Save current answer
    const updatedData = { ...formData, [currentStep]: currentAnswer };
    setFormData(updatedData);
    localStorage.setItem('inventive-course-data', JSON.stringify(updatedData));

    if (currentStep === totalSteps) {
      // Show completion screen
      router.push('/dashboard/courses/inventive/complete');
    } else {
      router.push(`/dashboard/courses/inventive/${currentStep + 1}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/dashboard/courses/inventive/${currentStep - 1}`);
    } else {
      router.push('/dashboard/courses');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setCurrentAnswer(file.name);
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            className={styles.textInput}
            value={currentAnswer as string}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={question.placeholder}
            autoFocus
          />
        );

      case 'textarea':
        return (
          <textarea
            className={styles.textareaInput}
            value={currentAnswer as string}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            autoFocus
          />
        );

      case 'choice':
        return (
          <div className={styles.choicesContainer}>
            {question.choices?.map((choice, index) => (
              <button
                key={index}
                className={`${styles.choiceButton} ${
                  currentAnswer === choice ? styles.choiceSelected : ''
                }`}
                onClick={() => handleInputChange(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className={styles.fileUploadContainer}>
            <input
              type="file"
              id="file-upload"
              className={styles.fileInput}
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />
            <label htmlFor="file-upload" className={styles.fileUploadLabel}>
              <div className={styles.uploadIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/>
                </svg>
              </div>
              <span className={styles.uploadText}>
                {fileName ? `Selected: ${fileName}` : 'Choose file or drag here'}
              </span>
              <span className={styles.uploadSubtext}>
                Images, PDFs, and documents welcome
              </span>
            </label>
          </div>
        );

      case 'contact':
        return (
          <div className={styles.contactForm}>
            <input
              type="text"
              placeholder="Your name"
              className={styles.textInput}
              onChange={(e) => handleInputChange(e.target.value)}
              autoFocus
            />
            <input
              type="email"
              placeholder="Email address"
              className={styles.textInput}
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              className={styles.textInput}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.questionPage}>
      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <span className={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Question Content */}
      <div className={styles.questionContainer}>
        <h1 className={styles.questionTitle}>{question.text}</h1>
        {question.subtitle && (
          <p className={styles.questionSubtitle}>{question.subtitle}</p>
        )}

        <div className={styles.inputContainer}>
          {renderInput()}
          
          {/* Gentle Error Message */}
          {showError && errorMessage && (
            <div className={styles.errorMessage}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
              {errorMessage}
            </div>
          )}
        </div>

        {/* Character count for text inputs */}
        {(question.type === 'text' || question.type === 'textarea') && question.validation?.maxLength && (
          <div className={styles.characterCount}>
            {(currentAnswer as string).length} / {question.validation.maxLength}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={styles.navigationContainer}>
        <button 
          className={styles.secondaryButton}
          onClick={handleBack}
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
          </svg>
          {currentStep === 1 ? 'Back to Courses' : 'Previous'}
        </button>

        <button 
          className={`${styles.primaryButton} ${!isValid ? styles.disabled : ''}`}
          onClick={handleNext}
          disabled={!isValid}
        >
          {currentStep === totalSteps ? 'Complete' : 'Next'}
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;