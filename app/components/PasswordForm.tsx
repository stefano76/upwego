/**
 * PASSWORD FORM COMPONENT
 * 
 * NOTE: This component is currently DISABLED but kept for future use.
 * Password protection has been commented out in LayoutWrapper.tsx.
 * 
 * To re-enable password protection:
 * 1. Uncomment password protection code in LayoutWrapper.tsx
 * 2. Uncomment the PasswordForm import in LayoutWrapper.tsx
 * 3. Ensure NEXT_PUBLIC_UPWEGO_PASSWORD is set in environment variables
 */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PasswordFormProps {
  onPasswordCorrect: () => void;
  className?: string;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ 
  onPasswordCorrect, 
  className = '' 
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const correctPassword = process.env.NEXT_PUBLIC_UPWEGO_PASSWORD;
    
    setTimeout(() => {
      if (password === correctPassword) {
        onPasswordCorrect();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-brand-primary ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-600">Please enter the password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 text-black"
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading || !password.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-brand-primary text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-secondary"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Enter'
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected content
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordForm;
