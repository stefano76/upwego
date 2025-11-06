'use client';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  const modalTitleClassName = `
    text-3xl
    mobile-large:text-4xl
    font-bold
    text-brand-primary
    bg-[url('/img/brandmark.svg')]
    bg-no-repeat
    bg-center-left
    bg-[1em_auto]
    mobile-large:bg-[auto_100%]
    pl-9
    mobile-large:pl-14
    translate-y-[-0.5rem]
    mobile-large:translate-y-[0]
    bg-bottom-left
  `.trim().replace(/\s+/g, ' ');

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`bg-brand-tertiary border border-brand-primary rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start mobile-large:items-start justify-between p-6 pb-0 border-b border-brand-tertiary">
            <h2 className={modalTitleClassName}>{title}</h2>
            <button
              onClick={onClose}
              className="text-brand-primary hover:text-brand-secondary transition-colors duration-200 text-4xl relative top-[-10px]"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Content */}
        {children}
        
        
        {/* Close button if no title */}
        {!title && (
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-brand-tertiary hover:text-brand-secondary transition-colors duration-200 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
