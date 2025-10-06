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
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [texts, setTexts] = useState<ContactFormTexts | null>(null);

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
        setFormData({ name: '', email: '', company: '', message: '' });
        setErrors({});
        onSuccess?.();
      } else {
        const errorData = await response.json();
        onError?.(errorData.message || texts?.api.serverError || 'Failed to send message');
      }
    } catch (error) {
      onError?.(texts?.api.networkError || 'Network error. Please try again.');
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
      <div className={styles.formGrid}>
        {/* Name Field */}
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            {texts.labels.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.input} ${errors.name ? styles.inputError : styles.inputNormal}`}
            placeholder={texts.placeholders.name}
          />
          {errors.name && (
            <p className={styles.errorMessage}>{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            {texts.labels.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputError : styles.inputNormal}`}
            placeholder={texts.placeholders.email}
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email}</p>
          )}
        </div>
      </div>

      {/* Company Field */}
      <div className={styles.field}>
        <label htmlFor="company" className={styles.label}>
          {texts.labels.company}
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={styles.input}
          placeholder={texts.placeholders.company}
        />
      </div>

      {/* Message Field */}
      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          {texts.labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`${styles.textarea} ${errors.message ? styles.inputError : styles.inputNormal}`}
          placeholder={texts.placeholders.message}
        />
        {errors.message && (
          <p className={styles.errorMessage}>{errors.message}</p>
        )}
      </div>

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
