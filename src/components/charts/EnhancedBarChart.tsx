/**
 * Enhanced Bar Chart Component
 * Modern, responsive, and highly interactive bar chart with advanced animations
 */

import React, { useState, useMemo, memo, useCallback, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatVolume, formatPercentage } from '../../utils/formatters';

interface EnhancedBarChartProps {
  data: Array<{
    name: string;
    value: number;
    change24h?: number;
    volume?: number;
    color?: string;
  }>;
  title?: string;
  height?: number;
  showGradient?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  responsive?: boolean;
  colorScheme?: 'default' | 'performance' | 'volume';
}

// Color schemes for different chart types
const COLOR_SCHEMES = {
  default: {
    primary: '#00ff87',
    secondary: '#16a34a', 
    gradient: ['#00ff87', '#16a34a'],
    negative: '#ef4444',
    positive: '#22c55e'
  },
  performance: {
    primary: '#8b5cf6',
    secondary: '#3b82f6',
    gradient: ['#8b5cf6', '#3b82f6'],
    negative: '#f87171',
    positive: '#34d399'
  },
  volume: {
    primary: '#f59e0b',
    secondary: '#d97706',
    gradient: ['#f59e0b', '#d97706'],
    negative: '#dc2626',
    positive: '#059669'
  }
};

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024
};

/**
 * Custom animated tooltip with modern design
 */
interface EnhancedTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
    payload: any;
  }>;
  label?: string;
}

const EnhancedTooltip = memo<EnhancedTooltipProps>(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      }}
    >
      <div className="text-sm font-semibold text-white mb-2">{label}</div>
      
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300 text-sm">{entry.name}</span>
          </div>
          <span className="text-white font-bold">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
      
      {data.change24h !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">24h Change</span>
            <span className={`text-xs font-semibold ${
              data.change24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercentage(data.change24h)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

EnhancedTooltip.displayName = 'EnhancedTooltip';

/**
 * Custom bar component with enhanced styling and animations
 */
interface CustomBarProps {
  fill: string;
  width: number;
  height: number;
  x: number;
  y: number;
  payload: any;
  index: number;
  showGradient: boolean;
}

const CustomBar: React.FC<CustomBarProps> = memo(({ 
  fill, 
  width, 
  height, 
  x, 
  y, 
  payload, 
  index,
  showGradient 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const gradientId = `bar-gradient-${index}`;
  
  return (
    <motion.g
      initial={{ scaleY: 0, originY: '100%' }}
      animate={{ scaleY: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={0.9} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.3} />
          </linearGradient>
        </defs>
      )}
      
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={showGradient ? `url(#${gradientId})` : fill}
        rx={4}
        ry={4}
        animate={{
          opacity: isHovered ? 0.8 : 1,
          filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
        }}
        transition={{ duration: 0.2 }}
        style={{
          filter: isHovered ? 'drop-shadow(0 8px 25px rgba(0, 255, 135, 0.3))' : 'none'
        }}
      />
      
      {/* Hover effect overlay */}
      {isHovered && (
        <motion.rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="rgba(255, 255, 255, 0.1)"
          rx={4}
          ry={4}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.g>
  );
});

CustomBar.displayName = 'CustomBar';

/**
 * Main Enhanced Bar Chart Component
 */
export const EnhancedBarChart = memo<EnhancedBarChartProps>(({
  data,
  title,
  height = 400,
  showGradient = true,
  showLabels = false,
  animated = true,
  responsive = true,
  colorScheme = 'default'
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const colors = COLOR_SCHEMES[colorScheme];
  
  // Handle window resize for responsiveness
  useEffect(() => {
    if (!responsive) return;
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsive]);

  // Responsive calculations
  const isMobile = windowWidth < BREAKPOINTS.mobile;
  const isTablet = windowWidth < BREAKPOINTS.tablet;
  
  // Adjust chart properties based on screen size
  const chartProps = useMemo(() => {
    if (isMobile) {
      return {
        margin: { top: 20, right: 10, left: 10, bottom: 20 },
        barSize: 20,
        fontSize: 10,
        tickInterval: 1
      };
    } else if (isTablet) {
      return {
        margin: { top: 25, right: 20, left: 20, bottom: 25 },
        barSize: 30,
        fontSize: 11,
        tickInterval: 0
      };
    } else {
      return {
        margin: { top: 30, right: 30, left: 30, bottom: 30 },
        barSize: 40,
        fontSize: 12,
        tickInterval: 0
      };
    }
  }, [isMobile, isTablet]);

  // Enhanced data with colors
  const enhancedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: item.color || colors.primary,
      isPositive: (item.change24h || 0) >= 0
    }));
  }, [data, colors.primary]);

  // Custom bar component with enhanced features
  const renderCustomBar = useCallback((props: any) => {
    const { fill, ...restProps } = props;
    return (
      <CustomBar 
        {...restProps} 
        fill={fill}
        showGradient={showGradient}
      />
    );
  }, [showGradient]);

  if (!data || data.length === 0) {
    return (
      <motion.div
        className="flex items-center justify-center bg-gray-900/50 rounded-xl border border-gray-800"
        style={{ height }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-400">No data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800/50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Header */}
      {title && (
        <motion.div 
          className="p-6 border-b border-gray-800/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </motion.div>
      )}

      {/* Chart Container */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={enhancedData}
            margin={chartProps.margin}
            barCategoryGap="20%"
          >
            {/* Gradient Definitions */}
            <defs>
              {enhancedData.map((_, index) => (
                <linearGradient 
                  key={`gradient-${index}`}
                  id={`barGradient-${index}`} 
                  x1="0" 
                  y1="0" 
                  x2="0" 
                  y2="1"
                >
                  <stop offset="0%" stopColor={colors.gradient[0]} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={colors.gradient[1]} stopOpacity={0.4} />
                </linearGradient>
              ))}
            </defs>

            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(107, 114, 128, 0.1)"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#9ca3af',
                fontSize: chartProps.fontSize,
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
              interval={chartProps.tickInterval}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 60 : 40}
            />

            {/* Y Axis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#9ca3af',
                fontSize: chartProps.fontSize,
                fontFamily: 'JetBrains Mono, monospace'
              }}
              tickFormatter={formatCurrency}
              width={isMobile ? 50 : 70}
            />

            {/* Enhanced Tooltip */}
            <Tooltip
              content={<EnhancedTooltip />}
              cursor={{ 
                fill: 'rgba(255, 255, 255, 0.05)',
                stroke: 'rgba(255, 255, 255, 0.1)',
                strokeWidth: 1,
                radius: 4
              }}
            />

            {/* Main Bar */}
            <Bar
              dataKey="value"
              fill={colors.primary}
              radius={[6, 6, 0, 0]}
              maxBarSize={chartProps.barSize}
              shape={animated ? renderCustomBar : undefined}
            >
              {/* Individual bar colors */}
              {enhancedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={showGradient ? `url(#barGradient-${index})` : entry.color}
                />
              ))}

              {/* Labels */}
              {showLabels && (
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{
                    fill: '#ffffff',
                    fontSize: chartProps.fontSize,
                    fontWeight: 'bold'
                  }}
                  formatter={formatCurrency}
                />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Indicators */}
      <motion.div 
        className="px-6 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {enhancedData.slice(0, 4).map((item, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/30 rounded-lg p-3 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xs text-gray-400 mb-1">{item.name}</div>
              <div className="text-sm font-bold text-white">
                {formatCurrency(item.value)}
              </div>
              {item.change24h !== undefined && (
                <div className={`text-xs ${
                  item.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatPercentage(item.change24h)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
});

EnhancedBarChart.displayName = 'EnhancedBarChart';

export default EnhancedBarChart;