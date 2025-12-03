/**
 * CONTACT FORM COMPONENT
 * 
 * A reusable contact form that handles user submissions and sends them via API.
 * 
 * FEATURES:
 * - Form validation (name, email, message required)
 * - Email format validation
 * - Loading states during submission
 * - Success/error message display
 * - Dynamic text content loaded from API
 * - Auto-clears form on successful submission
 * - Calls onSuccess callback after successful submission (typically closes modal)
 * 
 * DATA FLOW:
 * 1. Component loads text content from /api/contact-form-texts
 * 2. User fills out form
 * 3. On submit, validates data and sends to /api/contact (POST)
 * 4. API sends email via Resend service
 * 5. Shows success/error message and calls callback
 */
'use client';
import { useState, useEffect } from 'react';
import { ContactFormTexts } from '@/lib/contact-form-texts';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  onSuccess?: () => void;  // Called after successful form submission (e.g., close modal)
  onError?: (error: string) => void;  // Called if submission fails
}

export default function ContactForm({ onSuccess, onError }: ContactFormProps) {
  // Form field values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyAccepted: false
  });
  
  // Tracks if form is currently being submitted (disables submit button)
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Field-specific validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Dynamic text content (placeholders, labels, error messages) loaded from API
  const [texts, setTexts] = useState<ContactFormTexts | null>(null);
  
  // Success or error message displayed above form
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  /**
   * EFFECT: Load form text content from API
   * 
   * Fetches dynamic text content (placeholders, labels, error messages) on mount.
   * This allows content to be managed in markdown files rather than hardcoded.
   */
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const response = await fetch('/api/contact-form-texts');
        if (response.ok) {
          const data = await response.json();
          setTexts(data);
        }
      } catch (error) {
        console.error('Error fetching contact form texts:', error);
      }
    };
    fetchTexts();
  }, []);

  /**
   * Validates form fields before submission
   * 
   * VALIDATION RULES:
   * - Name: Required (cannot be empty)
   * - Email: Required and must be valid email format
   * - Message: Required (cannot be empty)
   * - Phone: Optional (no validation)
   * 
   * @returns true if form is valid, false otherwise
   */
  const validateForm = () => {
    if (!texts) return false;
    
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = texts.errors.nameRequired;
    }
    
    // Email validation (required + format check)
    if (!formData.email.trim()) {
      newErrors.email = texts.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      // Email format regex: must have @ symbol and domain
      newErrors.email = texts.errors.emailInvalid;
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = texts.errors.messageRequired;
    }
    
    // Privacy acceptance validation (only if privacy text is configured)
    if (texts.privacy && !formData.privacyAccepted) {
      newErrors.privacyAccepted = texts.errors.privacyRequired;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * 
   * PROCESS:
   * 1. Prevents default form submission
   * 2. Validates form fields
   * 3. Sends data to /api/contact endpoint
   * 4. On success: clears form, shows success message, calls onSuccess callback
   * 5. On error: shows error message, calls onError callback
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send form data to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // SUCCESS: Clear form and show success message
        setFormData({ name: '', email: '', phone: '', message: '', privacyAccepted: false });
        setErrors({});
        setMessage({
          type: 'success',
          text: texts?.success.formSuccess || 'Message sent successfully! We\'ll get back to you soon.'
        });
        
        // Auto-close modal after 3 seconds (via onSuccess callback)
        setTimeout(() => {
          setMessage(null);
          onSuccess?.();
        }, 3000);
      } else {
        // API ERROR: Show error message from server
        const errorData = await response.json();
        let errorMessage = errorData.message || texts?.api.serverError || 'Failed to send message';
        
        // Include detailed error in development mode (for debugging)
        if (errorData.error) {
          console.error('Server error details:', errorData.error);
          errorMessage += ` (${errorData.error})`;
        }
        setMessage({ type: 'error', text: errorMessage });
        onError?.(errorMessage);
      }
    } catch {
      // NETWORK ERROR: Failed to reach server
      const errorMessage = texts?.api.networkError || 'Network error. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
      onError?.(errorMessage);
    } finally {
      // Always re-enable submit button
      setIsSubmitting(false);
    }
  };

  /**
   * Handles input field changes
   * 
   * FEATURES:
   * - Updates form state as user types
   * - Clears field-specific error when user starts typing (better UX)
   * - Clears success/error message when user starts typing
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear success/error message when user starts typing
    if (message) {
      setMessage(null);
    }
  };

  /**
   * Handles checkbox changes (for privacy acceptance)
   */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Clear error when checkbox is checked
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear success/error message when user interacts
    if (message) {
      setMessage(null);
    }
  };

  // Show loading state while form texts are being fetched
  if (!texts) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinnerLarge}></div>
        <span className={styles.loadingText}>Loading form...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Optional intro text (subtitle and paragraph) */}
      {texts.modalTitle.subtitle && (
        <div className={styles.modalIntro}>
          {texts.modalTitle.subtitle && (
            <h3 className={styles.modalSubtitle}>{texts.modalTitle.subtitle}</h3>
          )}
          {texts.modalTitle.paragraph && (
            <p className={styles.modalParagraph}>{texts.modalTitle.paragraph}</p>
          )}
        </div>
      )}
      
      {/* NAME FIELD - Full width, required */}
      <div className={styles.fieldFull}>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.inputError : styles.inputNormal}`}
          style={{ boxShadow: 'none' }}
          placeholder={texts.placeholders.name}
        />
        {errors.name && (
          <p className={styles.errorMessage}>{errors.name}</p>
        )}
      </div>

      {/* EMAIL AND PHONE FIELDS - Side by side on larger screens */}
      <div className={styles.formGrid}>
        {/* Email field - Required, with format validation */}
        <div className={styles.field}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputError : styles.inputNormal}`}
            style={{ boxShadow: 'none' }}
            placeholder={texts.placeholders.email}
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email}</p>
          )}
        </div>

        {/* Phone field - Optional */}
        <div className={styles.field}>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
            style={{ boxShadow: 'none' }}
            placeholder={texts.placeholders.phone}
          />
        </div>
      </div>

      {/* MESSAGE FIELD - Full width, required */}
      <div className={`${styles.field} ${styles.fieldFinal}`}>
        <textarea
            id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          className={`${styles.textarea} ${errors.message ? styles.inputError : styles.inputNormal}`}
          style={{ boxShadow: 'none' }}
          placeholder={texts.placeholders.message}
        />
        {errors.message && (
          <p className={`${styles.errorMessage} ${styles.errorMessageTextarea}`}>{errors.message}</p>
        )}
      </div>

      {/* PRIVACY ACCEPTANCE CHECKBOX - Required */}
      {texts.privacy && (
        <div className={`${styles.field} ${styles.fieldFinal}`}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              id="privacyAccepted"
              name="privacyAccepted"
              checked={formData.privacyAccepted}
              onChange={handleCheckboxChange}
              className={errors.privacyAccepted ? styles.checkboxError : styles.checkbox}
            />
            <span>
              {texts.privacy.label}{' '}
              <a 
                href={texts.privacy.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.privacyLink}
              >
                {texts.privacy.linkText}
              </a>.
            </span>
          </label>
          {errors.privacyAccepted && (
            <p className={styles.errorMessage}>{errors.privacyAccepted}</p>
          )}
        </div>
      )}

      {/* SUCCESS/ERROR MESSAGE - Displayed above submit button */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200 text-center' 
            : 'bg-red-100 text-red-800 border border-red-200 text-center'
        }`}>
          {message.text}
        </div>
      )}

      {/* SUBMIT BUTTON - Shows loading state during submission */}
      <div className={styles.submitContainer}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ marginTop: '1rem' }}
          className={`btn-secondary ${styles.submitButton} ${isSubmitting ? styles.submitButtonDisabled : ''}`}
        >
          {isSubmitting ? (
            <div className={styles.submitButtonContent}>
              <div className={styles.loadingSpinner}></div>
              <span>{texts.success.submitButtonLoading}</span>
            </div>
          ) : (
            texts.success.submitButton
          )}
        </button>
      </div>
    </form>
  );
}

