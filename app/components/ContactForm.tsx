'use client';
import { useState, useEffect } from 'react';
import { ContactFormTexts } from '@/lib/contact-form-texts';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function ContactForm({ onSuccess, onError }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [texts, setTexts] = useState<ContactFormTexts | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const response = await fetch('/api/contact-form-texts');
        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          setTexts(data);
        }
      } catch (error) {
        console.error('Error fetching contact form texts:', error);
      }
    };
    fetchTexts();
  }, []);

  const validateForm = () => {
    if (!texts) return false;
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = texts.errors.nameRequired;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = texts.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = texts.errors.emailInvalid;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = texts.errors.messageRequired;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
        setMessage({
          type: 'success',
          text: texts?.success.formSuccess || 'Message sent successfully! We\'ll get back to you soon.'
        });
        // Clear message and close modal after 2 seconds
        setTimeout(() => {
          setMessage(null);
          onSuccess?.();
        }, 3000);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || texts?.api.serverError || 'Failed to send message';
        setMessage({ type: 'error', text: errorMessage });
        onError?.(errorMessage);
      }
    } catch {
      const errorMessage = texts?.api.networkError || 'Network error. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear message when user starts typing
    if (message) {
      setMessage(null);
    }
  };

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
      
      {/* Name Field - Full Width */}
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

      {/* Email and Phone Fields - Half Width Each */}
      <div className={styles.formGrid}>
        {/* Email Field */}
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

        {/* Phone Field */}
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

      {/* Message Field */}
      <div className={styles.field}>
        {/* <label htmlFor="message" className={styles.label}>
          {texts.labels.message}
        </label> */}
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
          <p className={styles.errorMessage}>{errors.message}</p>
        )}
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200 text-center' 
            : 'bg-red-100 text-red-800 border border-red-200 text-center'
        }`}>
          {message.text}
        </div>
      )}

      {/* Submit Button */}
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
