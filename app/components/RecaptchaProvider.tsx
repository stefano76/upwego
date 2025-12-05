/**
 * RECAPTCHA PROVIDER COMPONENT
 * 
 * Wraps the application with Google reCAPTCHA v3 context.
 * Must be a client component to use the reCAPTCHA hook.
 * 
 * reCAPTCHA v3 runs invisibly in the background and provides a score
 * (0.0 = likely bot, 1.0 = likely human) to help detect abuse.
 */
'use client';

import { ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { isLocalhost } from '@/app/utils/environment';

interface RecaptchaProviderProps {
  children: ReactNode;
}

export default function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  const reCaptchaKey = process.env.RECAPTCHA_SITE_KEY;

  // If reCAPTCHA key is not configured, render children without provider
  // This allows the site to work even if reCAPTCHA is not set up
  // On localhost, suppress the warning since reCAPTCHA is not needed for development
  if (!reCaptchaKey) {
    if (!isLocalhost()) {
      console.warn('reCAPTCHA key is not configured. Set RECAPTCHA_SITE_KEY.');
    }
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
