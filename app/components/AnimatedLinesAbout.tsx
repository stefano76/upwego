'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLinesAbout {
  className?: string;
  duration?: number;
  delay?: number;
  strokeColor?: string;
}

const AnimatedLinesAbout: React.FC<AnimatedLinesAbout> = ({ 
  className = '',
  duration = 2,
  delay = 0,
  strokeColor = 'white'
}) => {
  return (
    <svg
      width="190"
      height="35"
      viewBox="0 0 220 40"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Single continuous line: top left -> right -> semicircle -> bottom left */}
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
  );
};

export default AnimatedLinesAbout;
