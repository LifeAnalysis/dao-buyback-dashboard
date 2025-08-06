import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatTokenAmount, formatPercentage } from '../utils/formatters';
import { THEME_COLORS, ANIMATION_DURATIONS, ANIMATION_DELAYS } from '../constants';

export interface MetricData {
  buybackValue: number;
  protocolRevenue: number;
  tokensBought: number;
  change24h?: {
    buybackValue: number;
    protocolRevenue: number;
    tokensBought: number;
  };
}

interface MetricsPanelProps {
  data: MetricData;
  selectedTimeframe: string;
  className?: string;
}

interface MetricItemProps {
  label: string;
  value: number;
  formatter: (value: number) => string;
  change?: number;
  icon: string;
  index: number;
  isPrimary?: boolean;
}

const MetricItem: React.FC<MetricItemProps> = ({ 
  label, 
  value, 
  formatter, 
  change, 
  icon, 
  index,
  isPrimary = false 
}) => {
  const isPositive = change !== undefined ? change >= 0 : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_DURATIONS.NORMAL,
        delay: ANIMATION_DELAYS.SHORT * index 
      }}
      className={`
        relative overflow-hidden rounded-xl
        ${isPrimary 
          ? 'bg-gradient-to-br from-gray-900 to-black border border-gray-700' 
          : 'bg-gray-900/80 border border-gray-800'
        }
        p-6 hover:bg-gray-900/90 transition-all duration-300
        hover:border-gray-600 group
      `}
    >
      {/* Accent line */}
      <div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r"
        style={{ 
          background: isPrimary 
            ? `linear-gradient(90deg, ${THEME_COLORS.PRIMARY_GREEN}, ${THEME_COLORS.SECONDARY_GREEN})`
            : `linear-gradient(90deg, ${THEME_COLORS.PRIMARY_GREEN}40, ${THEME_COLORS.SECONDARY_GREEN}40)`
        }}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center text-lg
              ${isPrimary ? 'bg-gray-800' : 'bg-gray-800/60'}
              group-hover:bg-gray-700 transition-colors duration-300
            `}
          >
            {icon}
          </div>
          <div>
            <h3 className={`
              font-semibold tracking-tight
              ${isPrimary ? 'text-white text-sm' : 'text-gray-300 text-xs'}
            `}>
              {label}
            </h3>
          </div>
        </div>
        
        {/* Change indicator */}
        {change !== undefined && (
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
            ${isPositive 
              ? 'bg-green-900/30 text-green-400' 
              : 'bg-red-900/30 text-red-400'
            }
          `}>
            <span>{isPositive ? '↗' : '↘'}</span>
            <span>{formatPercentage(Math.abs(change), 1, false)}</span>
          </div>
        )}
      </div>
      
      {/* Value */}
      <div className="space-y-1">
        <div className={`
          font-bold tracking-tight font-mono
          ${isPrimary ? 'text-2xl lg:text-3xl text-white' : 'text-xl lg:text-2xl text-gray-200'}
        `}>
          {formatter(value)}
        </div>
        {isPrimary && (
          <div className="text-xs text-gray-400 tracking-wide">
            Primary Treasury Metric
          </div>
        )}
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ 
  data, 
  selectedTimeframe, 
  className = '' 
}) => {
  const metrics = [
    {
      label: 'Buyback Value',
      value: data.buybackValue,
      formatter: formatCurrency,
      change: data.change24h?.buybackValue,
      icon: '💰',
      isPrimary: true
    },
    {
      label: 'Protocol Revenue',
      value: data.protocolRevenue,
      formatter: formatCurrency,
      change: data.change24h?.protocolRevenue,
      icon: '📈',
      isPrimary: false
    },
    {
      label: 'Tokens Bought',
      value: data.tokensBought,
      formatter: formatTokenAmount,
      change: data.change24h?.tokensBought,
      icon: '🪙',
      isPrimary: false
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Treasury Metrics
          </h2>
          <p className="text-sm text-gray-400">
            {selectedTimeframe} performance overview
          </p>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          Live Data
        </div>
      </motion.div>

      {/* Metrics Grid - Responsive Design */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {metrics.map((metric, index) => (
          <MetricItem
            key={metric.label}
            label={metric.label}
            value={metric.value}
            formatter={metric.formatter}
            change={metric.change}
            icon={metric.icon}
            index={index}
            isPrimary={metric.isPrimary}
          />
        ))}
      </div>

      {/* Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: ANIMATION_DURATIONS.NORMAL,
          delay: ANIMATION_DELAYS.MEDIUM 
        }}
        className="p-4 bg-gray-900/40 border border-gray-800 rounded-lg"
      >
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Total Treasury Activity</span>
          <span className="font-mono">
            {formatCurrency(data.buybackValue + data.protocolRevenue)}
          </span>
        </div>
        <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min(100, (data.buybackValue / (data.buybackValue + data.protocolRevenue)) * 100)}%` 
            }}
            transition={{ 
              duration: ANIMATION_DURATIONS.SLOW,
              delay: ANIMATION_DELAYS.LONG 
            }}
            className="h-full bg-gradient-to-r"
            style={{ 
              background: `linear-gradient(90deg, ${THEME_COLORS.PRIMARY_GREEN}, ${THEME_COLORS.SECONDARY_GREEN})`
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};