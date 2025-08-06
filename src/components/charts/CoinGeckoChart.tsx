import React, { useState } from 'react';
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

interface ChartDataPoint {
  timestamp: string;
  price: number;
  volume: number;
  marketCap: number;
  change24h?: number;
}

interface CoinGeckoChartProps {
  data: ChartDataPoint[];
  title: string;
  color?: string;
  height?: number;
  showVolume?: boolean;
}

export const CoinGeckoChart: React.FC<CoinGeckoChartProps> = ({
  data,
  title,
  color = '#16a34a',
  height = 400,
  showVolume = true
}) => {
  const [activeChart, setActiveChart] = useState<'price' | 'marketCap' | 'volume'>('price');
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D' | '90D' | '1Y'>('30D');

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: timeframe === '1D' ? 'numeric' : undefined,
      minute: timeframe === '1D' ? '2-digit' : undefined
    });
  };

  const getCurrentValue = () => {
    if (data.length === 0) return 0;
    const latest = data[data.length - 1];
    switch (activeChart) {
      case 'price': return latest.price;
      case 'marketCap': return latest.marketCap;
      case 'volume': return latest.volume;
      default: return latest.price;
    }
  };

  const getChange24h = () => {
    if (data.length < 2) return 0;
    const previous = data[data.length - 2];
    const currentValue = getCurrentValue();
    const previousValue = activeChart === 'price' ? previous.price : 
                         activeChart === 'marketCap' ? previous.marketCap : previous.volume;
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  const change24h = getChange24h();
  const isPositive = change24h >= 0;

  return (
    <motion.div 
      className="dark-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 font-mono">{title}</h3>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-white font-mono">
              {activeChart === 'volume' ? formatVolume(getCurrentValue()) : formatCurrency(getCurrentValue())}
            </span>
            <span className={`text-sm font-medium px-2 py-1 rounded font-mono ${
              isPositive ? 'text-[#00ff87] bg-[#00ff87]/10' : 'text-red-400 bg-red-900/30'
            }`}>
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </span>
          </div>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex rounded-lg p-1" style={{ background: '#0a0a0a' }}>
          {['1D', '7D', '30D', '90D', '1Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as any)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors font-mono ${
                timeframe === tf
                  ? 'text-black shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={timeframe === tf ? { background: '#00ff87' } : {}}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'price', label: 'Price', color: '#16a34a' },
          { key: 'marketCap', label: 'Market Cap', color: '#2563eb' },
          { key: 'volume', label: 'Volume', color: '#dc2626' }
        ].map((chart) => (
          <button
            key={chart.key}
            onClick={() => setActiveChart(chart.key as any)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors font-mono ${
              activeChart === chart.key
                ? 'text-black border border-[#00ff87]'
                : 'text-gray-400 hover:text-white'
            }`}
            style={activeChart === chart.key ? { background: '#00ff87' } : { background: '#0a0a0a' }}
          >
            {chart.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {showVolume && activeChart === 'price' ? (
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="1 3" 
                stroke="#2a2a2a" 
                strokeWidth={0.5}
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="timestamp" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#6b7280', 
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={formatDate}
                height={40}
                tickMargin={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                yAxisId="price"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#00ff87', 
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={formatCurrency}
                width={80}
                tickMargin={5}
                domain={['dataMin * 0.95', 'dataMax * 1.05']}
              />
              <YAxis 
                yAxisId="volume"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#6b7280', 
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={formatVolume}
                width={60}
                tickMargin={5}
                domain={[0, 'dataMax * 1.1']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid #00ff87',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 255, 135, 0.1)',
                  color: '#ffffff',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px'
                }}
                formatter={(value: any, name: string) => [
                  name === 'price' ? formatCurrency(value) : formatVolume(value),
                  name === 'price' ? 'Price' : 'Volume'
                ]}
                labelFormatter={(label) => formatDate(label)}
                labelStyle={{ color: '#00ff87', fontWeight: 'bold' }}
              />
              <Bar 
                yAxisId="volume"
                dataKey="volume" 
                fill="#e5e7eb" 
                opacity={0.3}
                radius={[2, 2, 0, 0]}
              />
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#colorPrice)"
                dot={false}
              />
            </ComposedChart>
          ) : (
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={`color${activeChart}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="1 3" 
                stroke="#2a2a2a" 
                strokeWidth={0.5}
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="timestamp" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#6b7280', 
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={formatDate}
                height={40}
                tickMargin={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#00ff87', 
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                tickFormatter={activeChart === 'volume' ? formatVolume : formatCurrency}
                width={80}
                tickMargin={5}
                domain={['dataMin * 0.95', 'dataMax * 1.05']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid #00ff87',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 255, 135, 0.1)',
                  color: '#ffffff',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [
                  activeChart === 'volume' ? formatVolume(value) : formatCurrency(value),
                  activeChart === 'price' ? 'Price' : activeChart === 'marketCap' ? 'Market Cap' : 'Volume'
                ]}
                labelFormatter={(label) => formatDate(label)}
                labelStyle={{ color: '#00ff87', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey={activeChart}
                stroke={color}
                strokeWidth={2}
                fill={`url(#color${activeChart})`}
                dot={false}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <div className="text-xs text-gray-500 mb-1">24h Volume</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {data.length > 0 ? formatVolume(data[data.length - 1].volume) : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Market Cap</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {data.length > 0 ? formatCurrency(data[data.length - 1].marketCap) : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">24h Change</div>
          <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change24h.toFixed(2)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};