/**
 * Optimized Chart Component
 * High-performance, clean chart implementation with proper error handling and memoization
 */

import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  CHART_COLORS, 
  CHART_HEIGHTS, 
  ANIMATION_DURATIONS, 
  ANIMATION_DELAYS,
  THEME_COLORS 
} from '../../constants';
import { formatCurrency, formatVolume, formatChartDateByTimeframe } from '../../utils/formatters';
import { filterDataByTimeframe, getOptimalTickCount, type TimeframeOption } from '../../utils/helpers';
import type { ChartProps } from '../../types';

// Chart type options focused on DAO treasury metrics
type ChartType = 'buybacks' | 'revenue' | 'tokensBought';

const TIMEFRAME_OPTIONS: TimeframeOption[] = ['1D', '7D', '30D', '90D', '1Y'];
const CHART_TYPE_OPTIONS: Array<{
  key: ChartType;
  label: string;
  color: string;
  description: string;
}> = [
  { key: 'buybacks', label: 'Buyback Value', color: '#00ff87', description: 'Total USD value of token buybacks' },
  { key: 'revenue', label: 'DAO Revenue', color: '#16a34a', description: 'Revenue generated from DAO fees' },
  { key: 'tokensBought', label: 'Tokens Bought', color: '#2563eb', description: 'Number of tokens purchased back' }
];

/**
 * Custom tooltip component for better performance
 */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
    dataKey: string;
  }>;
  label?: string;
  timeframe?: TimeframeOption;
}

const CustomTooltip = memo<TooltipProps>(({ active, payload, label, timeframe = '30D' }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="rounded-lg p-3 shadow-lg border"
      style={{
        backgroundColor: THEME_COLORS.DARK_BLACK,
        borderColor: CHART_COLORS.PRIMARY,
        boxShadow: `0 10px 25px -5px ${CHART_COLORS.PRIMARY}1a`,
      }}
    >
      <p className="text-xs font-mono mb-2" style={{ color: CHART_COLORS.PRIMARY }}>
        {label ? formatChartDateByTimeframe(label, timeframe) : 'No date'}
      </p>
      {payload.map((entry, index: number) => (
        <p key={index} className="text-xs font-mono" style={{ color: entry.color }}>
          {`${entry.name}: ${
            (() => {
              const formatter = entry.dataKey === 'tokensBought' ? formatVolume : formatCurrency;
              return formatter(entry.value);
            })()
          }`}
        </p>
      ))}
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

/**
 * Chart header with controls
 */
interface ChartHeaderProps {
  title: string;
  currentValue: number;
  change24h: number;
  activeChart: ChartType;
  timeframe: TimeframeOption;
  onChartTypeChange: (type: ChartType) => void;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
}

const ChartHeader = memo<ChartHeaderProps>(({
  title,
  currentValue,
  change24h,
  activeChart,
  timeframe,
  onChartTypeChange,
  onTimeframeChange
}) => {
  const isPositive = change24h >= 0;
  const currentMetric = CHART_TYPE_OPTIONS.find(option => option.key === activeChart);
  
  return (
    <div className="space-y-6">
      {/* Title and Metric Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-400 font-mono tracking-wide">
            {title}
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">
              {(() => {
                const chartType = activeChart as ChartType;
                const formatter = chartType === 'tokensBought' ? formatVolume : formatCurrency;
                return formatter(currentValue);
              })()}
            </span>
            <div className="flex items-center gap-2">
              <span 
                className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full font-mono ${
                  isPositive 
                    ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' 
                    : 'text-red-400 bg-red-400/10 border border-red-400/20'
                }`}
              >
                <svg className={`w-3 h-3 mr-1 ${isPositive ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                {isPositive ? '+' : ''}{change24h.toFixed(2)}%
              </span>
              <span className="text-xs text-gray-500 font-mono">24h</span>
            </div>
          </div>
          {currentMetric && (
            <p className="text-sm text-gray-400 mt-1">{currentMetric.description}</p>
          )}
        </div>

        {/* Timeframe Selector - Elevated Design */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-1 flex gap-1">
          {TIMEFRAME_OPTIONS.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 font-mono ${
                timeframe === tf
                  ? 'text-black shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              style={
                timeframe === tf
                  ? {
                      backgroundColor: CHART_COLORS.PRIMARY,
                      boxShadow: `0 0 20px ${CHART_COLORS.PRIMARY}40`,
                    }
                  : {}
              }
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Selector - Card Style Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CHART_TYPE_OPTIONS.map(({ key, label, color, description }) => (
          <button
            key={key}
            onClick={() => onChartTypeChange(key)}
            className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 border ${
              activeChart === key
                ? 'border-opacity-50 shadow-xl'
                : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/30'
            }`}
            style={
              activeChart === key
                ? {
                    borderColor: color,
                    backgroundColor: `${color}0a`,
                    boxShadow: `0 8px 32px ${color}20`,
                  }
                : {}
            }
          >
            {/* Background gradient effect */}
            {activeChart === key && (
              <div 
                className="absolute inset-0 opacity-5 bg-gradient-to-br from-transparent via-current to-transparent"
                style={{ color }}
              />
            )}
            
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${activeChart === key ? 'shadow-lg' : ''}`} style={{ backgroundColor: color }} />
                <div className={`text-xs font-mono transition-colors ${
                  activeChart === key ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'
                }`}>
                  {activeChart === key ? 'ACTIVE' : 'SELECT'}
                </div>
              </div>
              
              <h4 className={`text-sm font-semibold transition-colors font-mono ${
                activeChart === key ? 'text-white' : 'text-gray-300 group-hover:text-white'
              }`}>
                {label}
              </h4>
              
              <p className={`text-xs mt-1 transition-colors ${
                activeChart === key ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'
              }`}>
                {description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

ChartHeader.displayName = 'ChartHeader';

/**
 * Main Optimized Chart Component
 */
export const OptimizedChart = memo<ChartProps>(({
  data,
  title,
  color = CHART_COLORS.PRIMARY,
  height = CHART_HEIGHTS.LARGE,
  showVolume = true
}) => {
  const [activeChart, setActiveChart] = useState<ChartType>('buybacks');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30D');

  // Memoized calculations
  const { currentValue, change24h, chartData } = useMemo(() => {
    if (!data || data.length === 0) {
      return { currentValue: 0, change24h: 0, chartData: [] };
    }

    const sortedData = [...data].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Filter data by selected timeframe
    const filteredData = filterDataByTimeframe(sortedData, timeframe);

    const latest = filteredData[filteredData.length - 1] || sortedData[sortedData.length - 1];
    const previous = filteredData[filteredData.length - 2] || sortedData[sortedData.length - 2];
    
    const currentVal = latest?.[activeChart] || 0;
    const previousVal = previous?.[activeChart] || currentVal;
    const change = previousVal === 0 ? 0 : ((currentVal - previousVal) / previousVal) * 100;

    return {
      currentValue: currentVal,
      change24h: change,
      chartData: filteredData.length > 0 ? filteredData : sortedData
    };
  }, [data, activeChart, timeframe]);

  // Event handlers
  const handleChartTypeChange = useCallback((type: ChartType) => {
    setActiveChart(type);
  }, []);

  const handleTimeframeChange = useCallback((tf: TimeframeOption) => {
    setTimeframe(tf);
  }, []);

  // Error boundary fallback
  if (!data || data.length === 0) {
    return (
      <motion.div
        className="dark-card flex items-center justify-center"
        style={{ height }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
      >
        <div className="text-center">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-400 text-sm">No chart data available</p>
        </div>
      </motion.div>
    );
  }

  const gradientId = `gradient-${activeChart}`;

  return (
    <motion.div
      className="dark-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_DURATIONS.NORMAL,
        delay: ANIMATION_DELAYS.MEDIUM 
      }}
    >
      <ChartHeader
        title={title}
        currentValue={currentValue}
        change24h={change24h}
        activeChart={activeChart}
        timeframe={timeframe}
        onChartTypeChange={handleChartTypeChange}
        onTimeframeChange={handleTimeframeChange}
      />

      {/* Chart Container */}
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {showVolume && activeChart === 'buybacks' ? (
            <ComposedChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid
                strokeDasharray="1 3"
                stroke={CHART_COLORS.GRID}
                strokeWidth={0.5}
                horizontal={true}
                vertical={false}
              />
              
              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: CHART_COLORS.TEXT_SECONDARY,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={(value) => formatChartDateByTimeframe(value, timeframe)}
                height={40}
                tickMargin={10}
                interval="preserveStartEnd"
                tickCount={getOptimalTickCount(timeframe)}
              />
              
              <YAxis
                yAxisId="primary"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: CHART_COLORS.PRIMARY,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={formatCurrency}
                width={80}
                tickMargin={5}
                domain={['dataMin * 0.95', 'dataMax * 1.05']}
              />
              
              <YAxis
                yAxisId="secondary"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: CHART_COLORS.TEXT_SECONDARY,
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={formatVolume}
                width={60}
                tickMargin={5}
                domain={[0, 'dataMax * 1.1']}
              />
              
              <Tooltip
                content={<CustomTooltip timeframe={timeframe} />}
                cursor={{ stroke: color, strokeWidth: 1, strokeOpacity: 0.5 }}
              />
              
              <Bar
                yAxisId="secondary"
                dataKey="revenue"
                fill="#16a34a"
                opacity={0.4}
                radius={[2, 2, 0, 0]}
              />
              
              <Area
                yAxisId="primary"
                type="monotone"
                dataKey={activeChart}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : (
            <AreaChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid
                strokeDasharray="1 3"
                stroke={CHART_COLORS.GRID}
                strokeWidth={0.5}
                horizontal={true}
                vertical={false}
              />
              
              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: CHART_COLORS.TEXT_SECONDARY,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={(value) => formatChartDateByTimeframe(value, timeframe)}
                height={40}
                tickMargin={10}
                interval="preserveStartEnd"
                tickCount={getOptimalTickCount(timeframe)}
              />
              
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: CHART_COLORS.PRIMARY,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={(value: number) => {
                  const chartType = activeChart as ChartType;
                  const formatter = chartType === 'tokensBought' ? formatVolume : formatCurrency;
                  return formatter(value);
                }}
                width={80}
                tickMargin={5}
                domain={['dataMin * 0.95', 'dataMax * 1.05']}
              />
              
              <Tooltip
                content={<CustomTooltip timeframe={timeframe} />}
                cursor={{ stroke: color, strokeWidth: 1, strokeOpacity: 0.5 }}
              />
              
              <Area
                type="monotone"
                dataKey={activeChart}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

OptimizedChart.displayName = 'OptimizedChart';

export default OptimizedChart;