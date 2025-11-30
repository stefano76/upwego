/**
 * LAYOUT WRAPPER COMPONENT
 * 
 * This is the main layout component that wraps all pages. It provides:
 * - Authentication (password protection) - DISABLED (commented out for future use)
 * - Header and Footer (shown on all pages)
 * - Contact modal (accessible from anywhere)
 * - Animation context (for page animations)
 * - Page-specific CSS classes on body element
 * 
 * AUTHENTICATION:
 * - Password protection for production (bypasses on localhost) - DISABLED
 * - Uses sessionStorage to remember authentication during session - DISABLED
 * - Shows PasswordForm component if not authenticated - DISABLED
 * 
 * FEATURES:
 * - Adds page-specific class to body (e.g., "page-home", "page-about")
 * - Loads menu items and contact form texts on authentication
 * - Manages contact modal state globally
 * - Provides animation context to all children
 */
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
// PASSWORD PROTECTION - COMMENTED OUT (can be restored in the future)
// import PasswordForm from './PasswordForm';
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
  const pathname = usePathname();
  
  // PASSWORD PROTECTION - COMMENTED OUT (can be restored in the future)
  // Authentication state
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  
  // Authentication is now always true (password protection disabled)
  const [isAuthenticated] = useState(true);
  const [isLoading] = useState(false);
  
  // Menu and contact form data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactTexts, setContactTexts] = useState<ContactFormTexts | null>(null);

  /**
   * Get current page slug from pathname
   * Examples: "/" → "home", "/about" → "about", "/services/web" → "services-web"
   */
  const pageSlug = pathname === '/' ? 'home' : pathname.replace(/^\//, '').replace(/\//g, '-') || 'home';

  /**
   * EFFECT: Add page-specific class to body element
   * 
   * Adds a class like "page-home", "page-about", etc. to the body element.
   * This allows page-specific CSS styling.
   * 
   * HOW IT WORKS:
   * - Extracts page slug from pathname
   * - Removes any existing "page-*" classes
   * - Adds new "page-{slug}" class
   * - Cleans up on unmount
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const body = document.body;
    // Remove all existing page-* classes while preserving other classes
    const currentClasses = body.className.split(' ').filter(cls => !cls.startsWith('page-'));
    body.className = [...currentClasses, `page-${pageSlug}`].join(' ').trim();
    
    // Cleanup: remove class on unmount
    return () => {
      body.classList.remove(`page-${pageSlug}`);
    };
  }, [pageSlug]);

  // PASSWORD PROTECTION - COMMENTED OUT (can be restored in the future)
  /**
   * EFFECT: Check authentication status on mount
   * 
   * AUTHENTICATION LOGIC:
   * - Localhost/development: Automatically authenticated (no password needed)
   * - Production: Checks sessionStorage for previous authentication
   * - If not authenticated, shows PasswordForm component
   */
  // useEffect(() => {
  //   // Only run on client side
  //   if (typeof window !== 'undefined') {
  //     // Check if accessing from localhost (development)
  //     const isLocalhost = window.location.hostname === 'localhost' || 
  //                        window.location.hostname === '127.0.0.1' ||
  //                        window.location.hostname.startsWith('192.168.');
  //     
  //     if (isLocalhost) {
  //       // Skip authentication for localhost (development convenience)
  //       setIsAuthenticated(true);
  //     } else {
  //       // Production: Check sessionStorage for authentication status
  //       // SessionStorage persists during browser session (clears on close)
  //       const authStatus = sessionStorage.getItem('upwego_authenticated');
  //       if (authStatus === 'true') {
  //         setIsAuthenticated(true);
  //       }
  //     }
  //   }
  //   setIsLoading(false);
  // }, []);

  /**
   * EFFECT: Load menu and contact form data when authenticated
   * 
   * Only fetches data after user is authenticated to avoid unnecessary API calls.
   * NOTE: Since password protection is disabled, this always runs on mount.
   */
  useEffect(() => {
    // PASSWORD PROTECTION - COMMENTED OUT
    // if (isAuthenticated) {
      fetchMenuItems();
      fetchContactTexts();
    // }
  }, []); // Changed from [isAuthenticated] since auth is always true

  /**
   * Fetches menu items from API for Header navigation
   */
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

  /**
   * Fetches contact form text content from API
   * Used for modal title and form labels/placeholders
   */
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

  // PASSWORD PROTECTION - COMMENTED OUT (can be restored in the future)
  /**
   * Handles successful password authentication
   * Saves authentication status to sessionStorage
   */
  // const handlePasswordCorrect = () => {
  //   setIsAuthenticated(true);
  //   // Save authentication status in sessionStorage (clears when browser closes)
  //   if (typeof window !== 'undefined') {
  //     sessionStorage.setItem('upwego_authenticated', 'true');
  //   }
  // };

  const handleContactFormSuccess = () => {
    // Close modal after success message is shown
    setTimeout(() => {
      setIsContactModalOpen(false);
    }, 3000);
  };

  const handleContactFormError = () => {
    // Error is now handled inside ContactForm
  };

  const openContactModal = () => {
    // console.log('openContactModal called!');
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  // PASSWORD PROTECTION - COMMENTED OUT (can be restored in the future)
  // Loading state check (disabled since password protection is off)
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
  //     </div>
  //   );
  // }

  // Password form check (disabled since password protection is off)
  // if (!isAuthenticated) {
  //   return <PasswordForm onPasswordCorrect={handlePasswordCorrect} />;
  // }

  return (
    <AnimationProvider>
      <div className={`relative main`}>
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
          title={contactTexts?.modalTitle?.title || "Get in Touch"}
        >
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