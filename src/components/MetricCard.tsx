import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: string;
  change?: {
    value: number;
    positive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  color = '#3b82f6',
  icon,
  change
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000000) {
        return `$${(val / 1000000000).toFixed(2)}B`;
      } else if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(2)}M`;
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(2)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && <span className="text-lg">{icon}</span>}
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p 
              className="text-2xl font-bold"
              style={{ color }}
            >
              {formatValue(value)}
            </p>
            {change && (
              <span 
                className={`text-sm font-medium ${
                  change.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.positive ? '+' : ''}{change.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};