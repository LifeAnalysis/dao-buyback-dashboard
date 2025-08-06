import React from 'react';
import { motion } from 'framer-motion';
import { MetricsPanel, MetricData } from './MetricsPanel';
import { TimeframeSelector, TimeframeOption } from './TimeframeSelector';
import { ANIMATION_DURATIONS, ANIMATION_DELAYS } from '../constants';

interface MetricsContainerProps {
  data: MetricData;
  selectedTimeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
  className?: string;
  layout?: 'default' | 'sidebar' | 'compact';
}

export const MetricsContainer: React.FC<MetricsContainerProps> = ({
  data,
  selectedTimeframe,
  onTimeframeChange,
  className = '',
  layout = 'default'
}) => {
  const getLayoutClasses = () => {
    switch (layout) {
      case 'sidebar':
        return {
          container: 'space-y-6',
          header: 'flex flex-col gap-4',
          timeframeWrapper: 'w-full'
        };
      case 'compact':
        return {
          container: 'space-y-4',
          header: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
          timeframeWrapper: 'sm:w-auto'
        };
      default:
        return {
          container: 'space-y-8',
          header: 'flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8',
          timeframeWrapper: 'lg:w-auto lg:min-w-fit'
        };
    }
  };

  const layoutClasses = getLayoutClasses();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_DURATIONS.NORMAL,
        delay: ANIMATION_DELAYS.SHORT 
      }}
      className={`${layoutClasses.container} ${className}`}
    >
      {/* Header Section with Title and Controls */}
      <div className={layoutClasses.header}>
        {/* Left side - Title and description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: ANIMATION_DURATIONS.NORMAL,
            delay: ANIMATION_DELAYS.MEDIUM 
          }}
          className="flex-1"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              📊
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Treasury Analytics
            </h1>
          </div>
          <p className="text-gray-400 text-sm lg:text-base max-w-2xl">
            Real-time insights into token buybacks, protocol revenue, and treasury performance metrics
          </p>
        </motion.div>

        {/* Right side - Timeframe selector */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: ANIMATION_DURATIONS.NORMAL,
            delay: ANIMATION_DELAYS.LONG 
          }}
          className={layoutClasses.timeframeWrapper}
        >
          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={onTimeframeChange}
            variant={layout === 'compact' ? 'compact' : 'default'}
          />
        </motion.div>
      </div>

      {/* Metrics Panel */}
      <MetricsPanel
        data={data}
        selectedTimeframe={selectedTimeframe}
      />

      {/* Additional Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: ANIMATION_DURATIONS.NORMAL,
          delay: ANIMATION_DELAYS.VERY_LONG 
        }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-900/30 border border-gray-800 rounded-lg"
      >
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <span>📡</span>
            <span>Auto-refresh: 5 min</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="text-gray-500">
            Data sources: CoinGecko, Protocol APIs
          </div>
          <div className="text-gray-600 font-mono">
            {new Date().toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })} UTC
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};