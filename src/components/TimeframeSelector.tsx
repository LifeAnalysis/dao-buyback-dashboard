import React from 'react';
import { motion } from 'framer-motion';
import { THEME_COLORS, ANIMATION_DURATIONS } from '../constants';

export type TimeframeOption = '1D' | '7D' | '30D' | '90D' | '1Y';

interface TimeframeSelectorProps {
  selectedTimeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'pills';
}

const TIMEFRAME_OPTIONS: { value: TimeframeOption; label: string; description: string }[] = [
  { value: '1D', label: '1D', description: 'Last 24 hours' },
  { value: '7D', label: '7D', description: 'Last 7 days' },
  { value: '30D', label: '30D', description: 'Last 30 days' },
  { value: '90D', label: '90D', description: 'Last 90 days' },
  { value: '1Y', label: '1Y', description: 'Last year' },
];

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onTimeframeChange,
  className = '',
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: 'flex bg-gray-900/60 border border-gray-700 rounded-lg p-1',
          button: 'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
          activeButton: 'text-black shadow-sm font-semibold',
          inactiveButton: 'text-gray-300 hover:text-white hover:bg-gray-700/50'
        };
      case 'pills':
        return {
          container: 'flex gap-2',
          button: 'px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200',
          activeButton: 'text-white border-gray-600 shadow-lg',
          inactiveButton: 'text-gray-400 border-gray-800 hover:text-white hover:border-gray-600 hover:bg-gray-800/50'
        };
      default:
        return {
          container: 'flex bg-gray-900/80 border border-gray-700 rounded-xl p-1.5 backdrop-blur-sm',
          button: 'px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden',
          activeButton: 'text-black shadow-lg font-semibold',
          inactiveButton: 'text-gray-300 hover:text-white hover:bg-gray-700/50'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${className}`}>
      {variant === 'default' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
          className="mb-3"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-1">Time Period</h3>
          <p className="text-xs text-gray-500">Select data range for analysis</p>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
        className={styles.container}
        role="tablist"
        aria-label="Select time period"
      >
        {TIMEFRAME_OPTIONS.map((option, index) => {
          const isActive = selectedTimeframe === option.value;
          
          return (
            <motion.button
              key={option.value}
              onClick={() => onTimeframeChange(option.value)}
              className={`
                ${styles.button}
                ${isActive ? styles.activeButton : styles.inactiveButton}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                disabled:opacity-50 disabled:cursor-not-allowed
                group
              `}
              style={isActive ? { 
                background: `linear-gradient(135deg, ${THEME_COLORS.PRIMARY_GREEN}, ${THEME_COLORS.SECONDARY_GREEN})`,
                color: THEME_COLORS.BLACK 
              } : {}}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${option.value}`}
              title={option.description}
              whileHover={{ scale: variant === 'pills' ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: ANIMATION_DURATIONS.FAST }}
            >
              {/* Background animation for active state */}
              {isActive && variant === 'default' && (
                <motion.div
                  layoutId="activeBackground"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${THEME_COLORS.PRIMARY_GREEN}, ${THEME_COLORS.SECONDARY_GREEN})`
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Content */}
              <span className="relative z-10 flex items-center gap-1">
                <span>{option.label}</span>
                {variant === 'default' && isActive && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs opacity-70"
                  >
                    ✓
                  </motion.span>
                )}
              </span>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.button>
          );
        })}
      </motion.div>
      
      {/* Active timeframe description */}
      {variant === 'default' && (
        <motion.div
          key={selectedTimeframe} // Key change triggers re-animation
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_DURATIONS.FAST }}
          className="mt-2 text-xs text-gray-400 font-mono"
        >
          {TIMEFRAME_OPTIONS.find(opt => opt.value === selectedTimeframe)?.description}
        </motion.div>
      )}
    </div>
  );
};