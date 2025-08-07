/**
 * Protocol Performance Bar Chart Component
 * Specialized bar chart for displaying protocol performance metrics with advanced responsiveness
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
  LabelList,
  ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import type { BuybackData } from '../../types';

interface ProtocolPerformanceChartProps {
  data: BuybackData[];
  title?: string;
  height?: number;
  showComparisons?: boolean;
  metric?: 'totalValueUSD' | 'estimatedAnnualBuyback' | 'circulatingSupplyPercent';
}

// Protocol color mapping
const PROTOCOL_COLORS: { [key: string]: string } = {
  'Hyperliquid': '#00D4AA',
  'Jupiter': '#FFA500', 
  'Aave': '#B6509E',
  'Jito': '#9945FF',
  'Pump.fun': '#FF6B35',
  'deBridge': '#3B82F6',
  'Fluid': '#10B981'
};

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024
};

/**
 * Enhanced Performance Tooltip
 */
interface PerformanceTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
    payload: BuybackData;
  }>;
  label?: string;
}

const PerformanceTooltip = memo<PerformanceTooltipProps>(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-2xl min-w-[200px]"
    >
      <div className="text-sm font-bold text-white mb-3 pb-2 border-b border-gray-700/30">
        {data.dao}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400 text-xs">Total Value:</span>
          <span className="text-white font-mono text-sm">
            {formatCurrency(data.totalValueUSD)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400 text-xs">Annual Estimate:</span>
          <span className="text-white font-mono text-sm">
            {formatCurrency(data.estimatedAnnualBuyback)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400 text-xs">Supply Reduction:</span>
          <span className="text-green-400 font-mono text-sm">
            {formatPercentage(data.circulatingSupplyPercent)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400 text-xs">Fee Allocation:</span>
          <span className="text-blue-400 font-mono text-sm">
            {data.feeAllocationPercent}%
          </span>
        </div>
      </div>
    </motion.div>
  );
});

PerformanceTooltip.displayName = 'PerformanceTooltip';

/**
 * Custom Bar Shape with Animation
 */
interface AnimatedBarProps {
  fill: string;
  width: number;
  height: number;
  x: number;
  y: number;
  payload: BuybackData;
  index: number;
}

const AnimatedBar: React.FC<AnimatedBarProps> = memo(({
  fill,
  width,
  height,
  x,
  y,
  payload,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.g
      initial={{ scaleY: 0, originY: '100%' }}
      animate={{ scaleY: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: 'easeOut'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Definition */}
      <defs>
        <linearGradient id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={0.9} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.4} />
        </linearGradient>
        <filter id={`glow-${index}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main Bar */}
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#barGradient-${index})`}
        rx={6}
        ry={6}
        animate={{
          opacity: isHovered ? 0.9 : 1,
          filter: isHovered ? `url(#glow-${index})` : 'none',
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Hover Effect Overlay */}
      {isHovered && (
        <motion.rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="rgba(255, 255, 255, 0.1)"
          rx={6}
          ry={6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.g>
  );
});

AnimatedBar.displayName = 'AnimatedBar';

/**
 * Main Protocol Performance Chart Component
 */
export const ProtocolPerformanceChart = memo<ProtocolPerformanceChartProps>(({
  data,
  title = "Protocol Performance",
  height = 400,
  showComparisons = true,
  metric = 'totalValueUSD'
}) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [hoveredProtocol, setHoveredProtocol] = useState<string | null>(null);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive breakpoints
  const isMobile = windowWidth < BREAKPOINTS.mobile;
  const isTablet = windowWidth < BREAKPOINTS.tablet;

  // Responsive configuration
  const chartConfig = useMemo(() => {
    if (isMobile) {
      return {
        margin: { top: 20, right: 10, left: 10, bottom: 60 },
        barSize: 30,
        fontSize: 10,
        tickInterval: 0,
        showLabels: false,
        angleLabels: -45
      };
    } else if (isTablet) {
      return {
        margin: { top: 25, right: 20, left: 20, bottom: 40 },
        barSize: 40,
        fontSize: 11,
        tickInterval: 0,
        showLabels: true,
        angleLabels: -30
      };
    } else {
      return {
        margin: { top: 30, right: 30, left: 30, bottom: 30 },
        barSize: 50,
        fontSize: 12,
        tickInterval: 0,
        showLabels: true,
        angleLabels: 0
      };
    }
  }, [isMobile, isTablet]);

  // Transform and sort data
  const chartData = useMemo(() => {
    return data
      .map(protocol => ({
        name: protocol.dao,
        value: protocol[metric],
        color: PROTOCOL_COLORS[protocol.dao] || '#3B82F6',
        ...protocol
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, metric]);

  // Calculate statistics for reference lines
  const { average, median } = useMemo(() => {
    const values = chartData.map(d => d.value);
    const sorted = [...values].sort((a, b) => a - b);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const med = sorted[Math.floor(sorted.length / 2)];
    return { average: avg, median: med };
  }, [chartData]);

  // Custom bar shape renderer
  const renderCustomBar = useCallback((props: any) => {
    const { fill, index, ...restProps } = props;
    return <AnimatedBar {...restProps} fill={fill} index={index} />;
  }, []);

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
          <p className="text-gray-400">No protocol data available</p>
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
      <motion.div 
        className="p-6 border-b border-gray-800/50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <div className="text-sm text-gray-400">
            {chartData.length} protocols
          </div>
        </div>
      </motion.div>

      {/* Chart Container */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            margin={chartConfig.margin}
            barCategoryGap="20%"
          >
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
                fontSize: chartConfig.fontSize,
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
              interval={chartConfig.tickInterval}
              angle={chartConfig.angleLabels}
              textAnchor={chartConfig.angleLabels !== 0 ? 'end' : 'middle'}
              height={isMobile ? 60 : 40}
            />

            {/* Y Axis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#9ca3af',
                fontSize: chartConfig.fontSize,
                fontFamily: 'JetBrains Mono, monospace'
              }}
              tickFormatter={formatCurrency}
              width={isMobile ? 60 : 80}
            />

            {/* Enhanced Tooltip */}
            <Tooltip
              content={<PerformanceTooltip />}
              cursor={{ 
                fill: 'rgba(255, 255, 255, 0.05)',
                stroke: 'rgba(255, 255, 255, 0.1)',
                strokeWidth: 1,
                radius: 4
              }}
            />

            {/* Reference Lines */}
            {showComparisons && (
              <>
                <ReferenceLine
                  y={average}
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  opacity={0.7}
                  label={{ value: "Avg", fill: "#f59e0b", fontSize: 12 }}
                />
                <ReferenceLine
                  y={median}
                  stroke="#8b5cf6"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  opacity={0.7}
                  label={{ value: "Med", fill: "#8b5cf6", fontSize: 12 }}
                />
              </>
            )}

            {/* Main Bar */}
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              maxBarSize={chartConfig.barSize}
              shape={renderCustomBar}
            >
              {/* Individual bar colors */}
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}

              {/* Value Labels */}
              {chartConfig.showLabels && (
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{
                    fill: '#ffffff',
                    fontSize: chartConfig.fontSize - 1,
                    fontWeight: 'bold'
                  }}
                  formatter={(value: number) => 
                    value > 1000000 ? `${(value / 1000000).toFixed(1)}M` : formatCurrency(value)
                  }
                />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary */}
      <motion.div 
        className="px-6 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Top Performer</div>
            <div className="text-sm font-bold text-white">
              {chartData[0]?.name || 'N/A'}
            </div>
            <div className="text-xs text-green-400">
              {formatCurrency(chartData[0]?.value || 0)}
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Average</div>
            <div className="text-sm font-bold text-white">
              {formatCurrency(average)}
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Total Value</div>
            <div className="text-sm font-bold text-white">
              {formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0))}
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Protocols</div>
            <div className="text-sm font-bold text-white">
              {chartData.length}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

ProtocolPerformanceChart.displayName = 'ProtocolPerformanceChart';

export default ProtocolPerformanceChart;