/**
 * Essential Animations Configuration
 * Only the animations actually used in the project
 */

export const animations = {
  // Used in intro section
  'u-intro': 'fadeInDown 5s ease-in-out forwards 1.5s, pulseOpacity 7s ease-in-out infinite 6.5s',
  'header-in': 'fadeIn 3s ease-in-out forwards 1s',
  'fade-in-delayed': 'fadeIn 3s ease-in-out forwards 2s',
  
  // Used for visibility-based animations
  'in-scale': 'fadeIn 5s ease-out forwards 0.5s, scaleIn 7s ease-out forwards',
  'in-to-right': 'fadeIn 1s ease-out forwards 0.5s, slideInRight 1s ease-out forwards',
  'in-to-left': 'fadeIn 1s ease-out forwards 0.5s, slideInLeft 1s ease-out forwards',
  'gear-to-left': 'gearSlideRotate 1s linear forwards .5s, gearRotate 2s linear infinite 1.5s',
  'lens-to-left': 'lensSlideRotate 1.5s linear forwards 1s, lensRotate 2s linear infinite 2.5s',
  'fade-in-delayed-web': 'fadeIn 2s ease-out forwards 1s',
  'fade-in-delayed-data': 'fadeIn 2s ease-out forwards 1.5s',
  'fade-in-down': 'fadeInDown 1s ease-in-out forwards',
  'fade-in-slide-right': 'fadeInSlideRight 1.5s ease-out forwards',
  'fade-in': 'fadeIn 1.5s ease-out forwards',
  'slide-down': 'slideDown 2s ease-out forwards'
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
  gearRotate: {
    '0%': { transform: 'rotate(360deg)' },
    '100%': { transform: 'rotate(0deg)' },
  },
  lensSlideRotate: {
    '0%': { 
      opacity: '0', 
      transform: 'rotate(0deg) translateX(1vw) rotate(0deg)' 
    },
    '100%': { 
      opacity: '1', 
      transform: 'rotate(360deg) translateX(0.5vw) rotate(-360deg)' 
    },
  },
  lensRotate: {
    '0%': { transform: 'rotate(0deg) translateX(0.5vw) rotate(0deg)' },
    '100%': { transform: 'rotate(360deg) translateX(0.5vw) rotate(-360deg)' },
  },
  fadeInSlideRight: {
    '0%': { 
      opacity: '0', 
      transform: 'translateX(-10%)' 
    },
    '100%': { 
      opacity: '1', 
      transform: 'translateX(0)' 
    },
  },
  slideDown: {
    '0%': {
      opacity: '0',
      transform: 'translateY(-30px) scaleY(0)',
    },
    '20%': {
      opacity: '1',
    },
    '50%': {
      opacity: '1',
      transform: 'translateY(0) scaleY(0)',
    },
    '100%': { 
      opacity: '1',
      transform: 'translateY(0) scaleY(1)',
    },
  },
};
