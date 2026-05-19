'use client';

import { useState } from 'react';
import Button from './Button';

interface AuditFormData {
  name: string;
  email: string;
  websiteUrl: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  websiteUrl?: string;
  message?: string;
}

const inputClass =
  'w-full bg-brand-tertiary border-2 text-sm desktop:text-base text-bodyText placeholder-bodyText/60 py-3 px-4 rounded-lg focus:outline-none focus:border-brand-secondary transition-colors duration-200';

const labelClass = 'block text-sm desktop:text-base text-brand-tertiary mb-3';

const errorClass = 'mt-2 text-sm desktop:text-base text-red-400';

export default function AuditContactForm() {
  const [formData, setAuditFormData] = useState<AuditFormData>({
    name: '',
    email: '',
    websiteUrl: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.websiteUrl.trim()) newErrors.websiteUrl = 'Website URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAuditFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (status) setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/audit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAuditFormData({ name: '', email: '', websiteUrl: '', message: '' });
        setErrors({});
        setStatus({ type: 'success', text: "Thanks! We'll be in touch shortly for the next step." });
      } else {
        const data = await response.json();
        setStatus({ type: 'error', text: data.message || 'Something went wrong. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} method="post" noValidate>
      <div className="flex flex-col gap-y-6 desktop:gap-y-8">

        <div className="">
          <label htmlFor="name" className={labelClass}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div className="">
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`${inputClass} ${errors.email ? 'border-red-400' : ''}`}
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        <div className="">
          <label htmlFor="websiteUrl" className={labelClass}>Website URL</label>
          <input
            type="text"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className={`${inputClass} ${errors.websiteUrl ? 'border-red-400' : ''}`}
          />
          {errors.websiteUrl && <p className={errorClass}>{errors.websiteUrl}</p>}
        </div>

        <div className="">
          <label htmlFor="message" className={labelClass}>Anything specific you’d like us to look at? <i className="font-light">(optional)</i></label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="e.g. I'm not sure why visitors aren't getting in touch, or the page associated to a campaign is particularly important..."
            className={`${inputClass} resize-none`}
          />
          {errors.message && <p className={errorClass}>{errors.message}</p>}
        </div>
      </div>

      {status && (
        <div className={`mt-8 p-4 rounded-lg text-center ${
          status.type === 'success'
            ? 'bg-green-900 text-green-300 border border-green-700'
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {status.text}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button type="submit">
          {isSubmitting ? 'Sending…' : 'Request your audit'}
        </Button>
      </div>
    </form>
  );
}
