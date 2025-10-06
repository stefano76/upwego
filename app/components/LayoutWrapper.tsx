'use client';

import React, { useState, useEffect } from 'react';
import PasswordForm from './PasswordForm';
import Header from '../Header';
import Footer from '../Footer';
import Modal from './Modal';
import ContactForm from './ContactForm';
import { AnimationProvider } from './AnimationContext';
import { ContactModalProvider } from './ContactModalContext';
import { ContactFormTexts } from '@/lib/contact-form-texts';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

type MenuItem = {
  title: string;
  slug: string;
};

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactFormMessage, setContactFormMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [contactTexts, setContactTexts] = useState<ContactFormTexts | null>(null);

  useEffect(() => {
    // Check if user is accessing from localhost (development)
    // Only run on client side
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.startsWith('192.168.');
      
      if (isLocalhost) {
        // Skip authentication for localhost
        setIsAuthenticated(true);
      } else {
        // Check if user is already authenticated (from sessionStorage)
        const authStatus = sessionStorage.getItem('upwego_authenticated');
        if (authStatus === 'true') {
          setIsAuthenticated(true);
        }
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Fetch menu items when authenticated
    if (isAuthenticated) {
      fetchMenuItems();
      fetchContactTexts();
    }
  }, [isAuthenticated]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const items = await response.json();
        setMenuItems(items);
      } else {
        console.error('Failed to fetch menu items:', response.status);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Fallback to empty array if API fails
      setMenuItems([]);
    }
  };

  const fetchContactTexts = async () => {
    try {
      const response = await fetch('/api/contact-form-texts');
      if (response.ok) {
        const texts = await response.json();
        setContactTexts(texts);
      } else {
        console.error('Failed to fetch contact texts:', response.status);
      }
    } catch (error) {
      console.error('Error fetching contact texts:', error);
    }
  };

  const handlePasswordCorrect = () => {
    setIsAuthenticated(true);
    // Save authentication status in sessionStorage (clears when browser closes)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('upwego_authenticated', 'true');
    }
  };

  const handleContactFormSuccess = () => {
    setContactFormMessage({ 
      type: 'success', 
      text: contactTexts?.success.formSuccess || 'Message sent successfully! We\'ll get back to you soon.' 
    });
    setTimeout(() => {
      setIsContactModalOpen(false);
      setContactFormMessage(null);
    }, 2000);
  };

  const handleContactFormError = (error: string) => {
    setContactFormMessage({ type: 'error', text: error });
  };

  const openContactModal = () => {
    console.log('openContactModal called!');
    setIsContactModalOpen(true);
    setContactFormMessage(null);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactFormMessage(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordForm onPasswordCorrect={handlePasswordCorrect} />;
  }

  return (
    <AnimationProvider>
      <div className="relative main">
        {/* Header - only shown when authenticated */}
        <Header menuItems={menuItems} onContactClick={openContactModal} />
        
        {/* Main content */}
        <ContactModalProvider openContactModal={openContactModal}>
          {children}
        </ContactModalProvider>
        
        {/* Footer - only shown when authenticated */}
        <Footer onContactClick={openContactModal} />
        
        {/* Contact Modal - available on all pages */}
        <Modal 
          isOpen={isContactModalOpen} 
          onClose={closeContactModal}
          title={contactTexts?.modalTitle || "Get in Touch"}
        >
          {contactFormMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              contactFormMessage.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {contactFormMessage.text}
            </div>
          )}
          <ContactForm 
            onSuccess={handleContactFormSuccess}
            onError={handleContactFormError}
          />
        </Modal>
      </div>
    </AnimationProvider>
  );
};

export default LayoutWrapper;