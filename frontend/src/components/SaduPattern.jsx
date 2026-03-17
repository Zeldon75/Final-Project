import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const SaduDivider = ({ className = '' }) => {
  const { isHeritage } = useTheme();
  
  return (
    <div className={`w-full h-8 ${className}`}>
      <svg viewBox="0 0 400 32" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="saduPattern" x="0" y="0" width="40" height="32" patternUnits="userSpaceOnUse">
            {/* Triangle pointing up */}
            <polygon points="10,24 20,8 30,24" fill="#8D1C1C" />
            {/* Diamond in center */}
            <polygon points="20,0 30,16 20,32 10,16" fill="#D97706" fillOpacity="0.8" />
            {/* Small triangles */}
            <polygon points="0,32 10,24 0,16" fill="#1A1A1A" />
            <polygon points="40,32 30,24 40,16" fill="#1A1A1A" />
            {/* Decorative lines */}
            <line x1="0" y1="4" x2="40" y2="4" stroke="#F9FAFB" strokeWidth="2" />
            <line x1="0" y1="28" x2="40" y2="28" stroke="#F9FAFB" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#saduPattern)" opacity={isHeritage ? 1 : 0.1} />
      </svg>
    </div>
  );
};

export const SaduCorner = ({ position = 'top-left', size = 64, className = '' }) => {
  const rotations = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270
  };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${className}`}
      style={{ transform: `rotate(${rotations[position]}deg)` }}
    >
      <path d="M0 0 L64 0 L64 8 L8 8 L8 64 L0 64 Z" fill="#8D1C1C" />
      <path d="M8 8 L48 8 L48 16 L16 16 L16 48 L8 48 Z" fill="#D97706" />
      <polygon points="24,24 40,24 32,40" fill="#1A1A1A" />
    </svg>
  );
};

export const SaduCard = ({ children, className = '' }) => {
  const { isHeritage, darkMode } = useTheme();
  
  if (isHeritage) {
    return (
      <div className={`relative ${className}`}>
        <SaduCorner position="top-left" className="absolute -top-2 -left-2" size={48} />
        <SaduCorner position="top-right" className="absolute -top-2 -right-2" size={48} />
        <SaduCorner position="bottom-left" className="absolute -bottom-2 -left-2" size={48} />
        <SaduCorner position="bottom-right" className="absolute -bottom-2 -right-2" size={48} />
        <div className={`p-6 rounded-lg border-2 border-[#8D1C1C] ${
          darkMode ? 'bg-[#2A2A2A]' : 'bg-[#FDF6E3]'
        } shadow-[4px_4px_0px_0px_#8D1C1C]`}>
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`glass-modern rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export const SaduBorder = ({ orientation = 'horizontal', className = '' }) => {
  return (
    <div className={`${orientation === 'horizontal' ? 'sadu-border' : 'sadu-border-vertical'} ${className}`} />
  );
};

export default { SaduDivider, SaduCorner, SaduCard, SaduBorder };
