/**
 * Essential Animations Configuration
 * Only the animations actually used in the project
 */

export const animations = {
  // Used in intro section
  'u-intro': 'fadeInDown 5s ease-in-out forwards 1.5s, pulseOpacity 10s ease-in-out infinite 6.5s',
  'header-in': 'fadeIn 3s ease-in-out forwards 1s',
  'fade-in-delayed': 'fadeIn 3s ease-in-out forwards 2s',
  
  // Used for visibility-based animations
  'in-scale': 'fadeIn 5s ease-out forwards 0.5s, scaleIn 7s ease-out forwards',
  'in-to-right': 'fadeIn 2s ease-out forwards 0.5s, slideInRight 2s ease-out forwards',
  'in-to-left': 'fadeIn 2s ease-out forwards 0.5s, slideInLeft 2s ease-out forwards',
  'gear-to-left': 'gearSlideRotate 2s ease-out forwards 1s',
  'lens-to-left': 'lensSlideRotate 2s ease-out forwards 2s',
  'fade-in-delayed-web': 'fadeIn 3s ease-out forwards 3s',
  'fade-in-delayed-data': 'fadeIn 3s ease-out forwards 4s'
};

export const keyframes = {
  // Intro animations
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.7)' },
    '100%': { transform: 'scale(1)' },
  },
  fadeInDown: {
    '0%': { opacity: '0', transform: 'translateY(-8%)' },
    '20%': { opacity: '0' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  pulseOpacity: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
  slideInRight: {
    '0%': { transform: 'translateX(-2vw)' },
    '100%': { transform: 'translateX(0)' },
  },
  slideInLeft: {
    '0%': { transform: 'translateX(2vw)' },
    '100%': { transform: 'translateX(0)' },
  },
  gearSlideRotate: {
    '0%': { 
      opacity: '0', 
      transform: 'translateX(2vw) rotate(270deg)' 
    },
    '100%': { 
      opacity: '1', 
      transform: 'translateX(0) rotate(0deg)' 
    },
  },
  lensSlideRotate: {
    '0%': { 
      opacity: '0', 
      transform: 'rotate(0deg) translateX(2vw) rotate(0deg)' 
    },
    '100%': { 
      opacity: '1', 
      transform: 'rotate(180deg) translateX(0) rotate(-180deg)' 
    },
  },
};
