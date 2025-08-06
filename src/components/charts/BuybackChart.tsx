import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format } from 'date-fns';

interface ChartDataPoint {
  timestamp: string;
  date: string;
  [key: string]: any;
}

interface BuybackChartProps {
  data: ChartDataPoint[];
  title: string;
  type?: 'line' | 'area';
  height?: number;
  showGrid?: boolean;
}

export const BuybackChart: React.FC<BuybackChartProps> = ({
  data,
  title,
  type = 'area',
  height = 300,
  showGrid = true
}) => {
  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      if (name.includes('USD') || name.includes('Value')) {
        return [`$${(value / 1000000).toFixed(2)}M`, name];
      } else if (name.includes('Tokens')) {
        return [`${(value / 1000000).toFixed(2)}M`, name];
      }
      return [value.toLocaleString(), name];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem: string) => {
    try {
      return format(new Date(tickItem), 'MMM dd');
    } catch {
      return tickItem;
    }
  };

  const formatYAxisLabel = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  const protocolColors = {
    'Hyperliquid': '#00D4AA',
    'Jupiter': '#FFA500',
    'Aave': '#B6509E'
  };

  const getLineColor = (key: string) => {
    for (const [protocol, color] of Object.entries(protocolColors)) {
      if (key.includes(protocol)) return color;
    }
    return '#3b82f6';
  };

  const dataKeys = data.length > 0 ? Object.keys(data[0]).filter(key => 
    key !== 'timestamp' && key !== 'date'
  ) : [];

  if (type === 'area') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatYAxisLabel}
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={getLineColor(key)}
                fill={getLineColor(key)}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxisLabel}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatYAxisLabel}
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={getLineColor(key)}
              strokeWidth={2}
              dot={{ fill: getLineColor(key), strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: getLineColor(key), strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};