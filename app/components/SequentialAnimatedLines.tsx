'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SequentialAnimatedLinesProps {
  className?: string;
  duration?: number;
  delay?: number;
  strokeColor?: string;
  gapBetweenAnimations?: number;
}

const SequentialAnimatedLines: React.FC<SequentialAnimatedLinesProps> = ({ 
  className = '',
  duration = 2,
  delay = 0,
  strokeColor = 'white',
  gapBetweenAnimations = 0.5
}) => {
  return (
    <div className={`flex flex-col items-center space-y-8 ${className}`}>
      {/* First animation - smaller radius */}
      <svg
        width="190"
        height="35"
        viewBox="0 0 220 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path 
          d="M0 5H200C203.978 5 207.794 6.58035 210.607 9.3934C213.42 12.2064 215 16.0218 215 20C215 23.9782 213.42 27.7936 210.607 30.6066C207.794 33.4197 203.978 35 200 35H0" 
          stroke={strokeColor} 
          strokeWidth="10"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: duration, 
            ease: "easeInOut",
            delay: delay
          }}
        />
      </svg>
      
      {/* Second animation - double radius */}
      <svg
        width="220"
        height="60"
        viewBox="0 0 220 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path 
          d="M0 5H200C205.5 5 210 7.5 212.5 12.5C215 17.5 215 22.5 212.5 27.5C210 32.5 205.5 35 200 35C194.5 35 190 37.5 187.5 42.5C185 47.5 185 52.5 187.5 57.5C190 62.5 194.5 65 200 65H0" 
          stroke={strokeColor} 
          strokeWidth="10"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: duration, 
            ease: "easeInOut",
            delay: delay + duration + gapBetweenAnimations
          }}
        />
      </svg>
    </div>
  );
};

export default SequentialAnimatedLines;
