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
import { formatCurrency, formatVolume, formatChartDate } from '../../utils/formatters';
import type { ChartProps } from '../../types';

// Chart type options focused on DAO treasury metrics
type ChartType = 'buybacks' | 'revenue' | 'tokensBought';
type TimeframeOption = '1D' | '7D' | '30D' | '90D' | '1Y';

const TIMEFRAME_OPTIONS: TimeframeOption[] = ['1D', '7D', '30D', '90D', '1Y'];
const CHART_TYPE_OPTIONS: Array<{
  key: ChartType;
  label: string;
  color: string;
  description: string;
}> = [
  { key: 'buybacks', label: 'Buyback Value', color: '#00ff87', description: 'Total USD value of token buybacks' },
  { key: 'revenue', label: 'Protocol Revenue', color: '#16a34a', description: 'Revenue generated from protocol fees' },
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
}

const CustomTooltip = memo<TooltipProps>(({ active, payload, label }) => {
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
        {label ? formatChartDate(label) : 'No date'}
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
  
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
      {/* Title and current value */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2 font-mono">{title}</h3>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-white font-mono">
            {(() => {
              const chartType = activeChart as ChartType;
              const formatter = chartType === 'tokensBought' ? formatVolume : formatCurrency;
              return formatter(currentValue);
            })()}
          </span>
          <span 
            className={`text-sm font-medium px-2 py-1 rounded font-mono ${
              isPositive 
                ? `text-[${CHART_COLORS.PRIMARY}] bg-[${CHART_COLORS.PRIMARY}]/10` 
                : 'text-red-400 bg-red-900/30'
            }`}
          >
            {isPositive ? '+' : ''}{change24h.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Chart type selector */}
        <div className="flex flex-wrap gap-2">
          {CHART_TYPE_OPTIONS.map(({ key, label, color, description }) => (
            <button
              key={key}
              onClick={() => onChartTypeChange(key)}
              title={description}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors font-mono ${
                activeChart === key
                  ? 'text-black border'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={
                activeChart === key 
                  ? { 
                      background: CHART_COLORS.PRIMARY, 
                      borderColor: CHART_COLORS.PRIMARY 
                    }
                  : { background: THEME_COLORS.DARK_BLACK }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timeframe selector */}
        <div 
          className="flex rounded-lg p-1" 
          style={{ background: THEME_COLORS.DARK_BLACK }}
        >
          {TIMEFRAME_OPTIONS.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors font-mono ${
                timeframe === tf
                  ? 'text-black shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={
                timeframe === tf 
                  ? { background: CHART_COLORS.PRIMARY } 
                  : {}
              }
            >
              {tf}
            </button>
          ))}
        </div>
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

    const latest = sortedData[sortedData.length - 1];
    const previous = sortedData[sortedData.length - 2];
    
    const currentVal = latest?.[activeChart] || 0;
    const previousVal = previous?.[activeChart] || currentVal;
    const change = previousVal === 0 ? 0 : ((currentVal - previousVal) / previousVal) * 100;

    return {
      currentValue: currentVal,
      change24h: change,
      chartData: sortedData
    };
  }, [data, activeChart]);

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
                tickFormatter={formatChartDate}
                height={40}
                tickMargin={10}
                interval="preserveStartEnd"
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
                content={<CustomTooltip />}
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
                tickFormatter={formatChartDate}
                height={40}
                tickMargin={10}
                interval="preserveStartEnd"
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
                content={<CustomTooltip />}
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