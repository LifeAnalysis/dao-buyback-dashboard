/**
 * Optimized Header Component
 * Clean, performant header with proper branding and status indicators
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BRANDING, THEME_COLORS, ANIMATION_DELAYS, ANIMATION_DURATIONS } from '../../constants';

interface HeaderProps {
  isOnline?: boolean;
  className?: string;
}

/**
 * Live status indicator component
 */
const LiveStatusIndicator = memo(({ isOnline = true }: { isOnline?: boolean }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] rounded-lg">
    <div 
      className={`w-2 h-2 rounded-full ${isOnline ? 'animate-pulse' : ''}`}
      style={{ background: isOnline ? THEME_COLORS.PRIMARY_GREEN : THEME_COLORS.ERROR_RED }}
    />
    <span className="text-sm text-gray-300 font-mono">
      {isOnline ? 'Live Data' : 'Offline'}
    </span>
  </div>
));

LiveStatusIndicator.displayName = 'LiveStatusIndicator';

/**
 * Brand logo component
 */
const BrandLogo = memo(() => (
  <div className="flex items-center gap-3">
    <div 
      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" 
      style={{ 
        background: `linear-gradient(135deg, ${THEME_COLORS.PRIMARY_GREEN}, ${THEME_COLORS.SECONDARY_GREEN})` 
      }}
    >
      <span className="text-black font-bold text-lg font-mono">D</span>
    </div>
    <div>
      <h1 className="text-2xl font-bold text-white font-mono">{BRANDING.APP_NAME}</h1>
      <p className="text-xs text-gray-400 font-mono">{BRANDING.TAGLINE}</p>
    </div>
  </div>
));

BrandLogo.displayName = 'BrandLogo';

/**
 * Credits component
 */
const Credits = memo(() => (
  <div className="text-xs text-gray-500 font-mono">
    Powered by <span className="text-[#00ff87] font-semibold">{BRANDING.POWERED_BY}</span>
  </div>
));

Credits.displayName = 'Credits';

/**
 * Main Header Component
 */
export const Header = memo<HeaderProps>(({ isOnline = true, className = '' }) => {
  return (
    <motion.header
      className={`sticky top-0 z-50 ${className}`}
      style={{ 
        background: THEME_COLORS.DARK_BLACK, 
        borderBottom: `1px solid ${THEME_COLORS.LIGHT_BLACK}` 
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_DURATIONS.NORMAL,
        delay: ANIMATION_DELAYS.NONE 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: ANIMATION_DURATIONS.NORMAL,
              delay: ANIMATION_DELAYS.SHORT 
            }}
          >
            <BrandLogo />
          </motion.div>

          {/* Right: Status and Credits */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: ANIMATION_DURATIONS.NORMAL,
              delay: ANIMATION_DELAYS.MEDIUM 
            }}
          >
            <LiveStatusIndicator isOnline={isOnline} />
            <Credits />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
});

Header.displayName = 'Header';

export default Header;