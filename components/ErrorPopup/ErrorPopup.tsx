"use client";

import React, { useEffect } from 'react';
import { useError } from '../ErrorBoundary/ErrorContext';
import { Close } from '@/services/icons/Close';
import styles from './styles.module.scss';

const ErrorPopup: React.FC = () => {
  const { error, clearError } = useError();

  // Only show popup for 400 errors
  const shouldShowPopup = error && error.status === 400;

  useEffect(() => {
    if (shouldShowPopup) {
      // Auto-hide popup after 5 seconds
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowPopup, clearError]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && shouldShowPopup) {
        clearError();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [shouldShowPopup, clearError]);

  if (!shouldShowPopup) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={styles.backdrop} 
        onClick={clearError}
        aria-hidden="true"
      />
      
      {/* Popup */}
      <div 
        className={styles.popup}
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-title"
        aria-describedby="error-description"
      >
        <div className={styles.popup__header}>
          <div className={styles.popup__icon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" fill="var(--color-error-100)" />
              <path
                d="M15 9l-6 6m0-6l6 6"
                stroke="var(--color-error-600)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.popup__content}>
            <h3 id="error-title" className={styles.popup__title}>
              Request Error
            </h3>
            <p id="error-description" className={styles.popup__message}>
              {error.message || 'Invalid request. Please check your input and try again.'}
            </p>
          </div>
          <button
            className={styles.popup__closeBtn}
            onClick={clearError}
            aria-label="Close error message"
          >
            <Close />
          </button>
        </div>
        
        {/* Progress bar for auto-hide */}
        <div className={styles.popup__progressBar}>
          <div className={styles.popup__progress} />
        </div>
      </div>
    </>
  );
};

export default ErrorPopup;
