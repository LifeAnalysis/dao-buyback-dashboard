/**
 * Footer Component
 * Professional footer with legal disclaimer and additional information
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { LEGAL_DISCLAIMER, THEME_COLORS, ANIMATION_DELAYS, ANIMATION_DURATIONS } from '../../constants';

interface FooterProps {
  className?: string;
  showDisclaimer?: boolean;
}

/**
 * Warning icon component
 */
const WarningIcon = memo(() => (
  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    <path 
      fillRule="evenodd" 
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
      clipRule="evenodd" 
    />
  </svg>
));

WarningIcon.displayName = 'WarningIcon';

/**
 * Legal disclaimer section
 */
const LegalDisclaimer = memo(() => (
  <motion.div 
    className="dark-card border-t-2 border-yellow-500/20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: ANIMATION_DURATIONS.NORMAL,
      delay: ANIMATION_DELAYS.VERY_LONG 
    }}
  >
    <div className="flex items-start gap-3">
      <div className="mt-1 flex-shrink-0">
        <WarningIcon />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-yellow-500 mb-2 font-mono">
          Legal Disclaimer
        </h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          {LEGAL_DISCLAIMER}
        </p>
      </div>
    </div>
  </motion.div>
));

LegalDisclaimer.displayName = 'LegalDisclaimer';



/**
 * Main Footer Component
 */
export const Footer = memo<FooterProps>(({ 
  className = '', 
  showDisclaimer = true 
}) => {
  return (
    <footer 
      className={`mt-auto ${className}`}
      style={{ background: THEME_COLORS.BLACK }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Legal Disclaimer */}
        {showDisclaimer && (
          <div className="py-8">
            <LegalDisclaimer />
          </div>
        )}
        

      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;