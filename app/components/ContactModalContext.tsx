'use client';
import React, { createContext, useContext } from 'react';

interface ContactModalContextType {
  openContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | null>(null);

export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error('useContactModal must be used within ContactModalProvider');
  }
  return context;
};

export const ContactModalProvider: React.FC<{ children: React.ReactNode; openContactModal: () => void }> = ({ 
  children, 
  openContactModal 
}) => {
  return (
    <ContactModalContext.Provider value={{ openContactModal }}>
      {children}
    </ContactModalContext.Provider>
  );
};
