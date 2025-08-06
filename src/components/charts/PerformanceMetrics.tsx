import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PerformanceData {
  protocol: string;
  data_points: number;
  avg_value_usd: number;
  max_value_usd: number;
  min_value_usd: number;
  avg_supply_reduction: number;
}

interface PerformanceMetricsProps {
  data: PerformanceData[];
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  const protocolColors = {
    'Hyperliquid': '#00D4AA',
    'Jupiter': '#FFA500',
    'Aave': '#B6509E'
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const barData = data.map(item => ({
    protocol: item.protocol,
    'Avg Buyback Value': item.avg_value_usd,
    'Max Buyback Value': item.max_value_usd,
    'Supply Reduction %': item.avg_supply_reduction
  }));

  const pieData = data.map(item => ({
    name: item.protocol,
    value: item.avg_value_usd,
    color: protocolColors[item.protocol as keyof typeof protocolColors] || '#3b82f6'
  }));

  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Comparison Bar Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="protocol" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name.includes('%') ? `${value.toFixed(2)}%` : formatCurrency(value),
                name
              ]}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="Avg Buyback Value" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Max Buyback Value" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Market Share Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Buyback Value Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [formatCurrency(value), 'Avg Buyback Value']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary Cards */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((protocol) => (
            <div 
              key={protocol.protocol}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4"
              style={{ 
                borderLeftColor: protocolColors[protocol.protocol as keyof typeof protocolColors] || '#3b82f6' 
              }}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-3">{protocol.protocol}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data Points:</span>
                  <span className="font-medium">{protocol.data_points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Value:</span>
                  <span className="font-medium">{formatCurrency(protocol.avg_value_usd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Value:</span>
                  <span className="font-medium">{formatCurrency(protocol.max_value_usd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Supply Reduction:</span>
                  <span className="font-medium">{protocol.avg_supply_reduction.toFixed(2)}%</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Market Share:</span>
                    <span className="font-medium">
                      {((protocol.avg_value_usd / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};