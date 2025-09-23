'use client';

import React, { useState, useEffect } from 'react';
import PasswordForm from './PasswordForm';
import Header from '../Header';
import { AnimationProvider } from './AnimationContext';

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
    }
  }, [isAuthenticated]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const items = await response.json();
        setMenuItems(items);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Fallback to empty array if API fails
      setMenuItems([]);
    }
  };

  const handlePasswordCorrect = () => {
    setIsAuthenticated(true);
    // Save authentication status in sessionStorage (clears when browser closes)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('upwego_authenticated', 'true');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-brand-primary to-brand-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordForm onPasswordCorrect={handlePasswordCorrect} />;
  }

  return (
    <AnimationProvider>
      <div className="relative">
        {/* Header - only shown when authenticated */}
        <Header menuItems={menuItems} />
        
        {/* Main content */}
        {children}
      </div>
    </AnimationProvider>
  );
};

export default LayoutWrapper;