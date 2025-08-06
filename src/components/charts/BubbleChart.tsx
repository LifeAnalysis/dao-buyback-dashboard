import React from 'react';
import { motion } from 'framer-motion';

interface BubbleData {
  name: string;
  value: number;
  color: string;
  change: number;
}

interface BubbleChartProps {
  data: BubbleData[];
  height?: number;
}

export const BubbleChart: React.FC<BubbleChartProps> = ({ data, height = 200 }) => {
  const formatValue = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  const maxValue = Math.max(...data.map(d => d.value));
  
  const calculateBubbleSize = (value: number) => {
    if (value === 0) return 0;
    const minSize = 40;
    const maxSize = 120;
    const ratio = value / maxValue;
    return Math.max(minSize, ratio * maxSize);
  };

  const calculatePosition = (index: number, total: number, size: number) => {
    const containerWidth = 300;
    const containerHeight = height - 40;
    
    if (total === 1) {
      return {
        x: containerWidth / 2 - size / 2,
        y: containerHeight / 2 - size / 2
      };
    }
    
    if (total === 2) {
      const spacing = containerWidth / 3;
      return {
        x: spacing * (index + 1) - size / 2,
        y: containerHeight / 2 - size / 2
      };
    }
    
    // For more items, arrange in a grid-like pattern
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const spacingX = containerWidth / (cols + 1);
    const spacingY = containerHeight / (rows + 1);
    
    return {
      x: spacingX * (col + 1) - size / 2,
      y: spacingY * (row + 1) - size / 2
    };
  };

  return (
    <div className="bubble-chart-container" style={{ height }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        {data.map((item, index) => {
          const size = calculateBubbleSize(item.value);
          const position = calculatePosition(index, data.length, size);
          
          if (size === 0) return null;
          
          return (
            <motion.g
              key={item.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <motion.circle
                cx={position.x + size / 2}
                cy={position.y + size / 2}
                r={size / 2}
                fill={item.color}
                opacity={0.8}
                whileHover={{ scale: 1.1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer"
              />
              <motion.circle
                cx={position.x + size / 2}
                cy={position.y + size / 2}
                r={size / 2}
                fill="none"
                stroke={item.color}
                strokeWidth={2}
                opacity={0.6}
                whileHover={{ strokeWidth: 3, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.g>
          );
        })}
      </svg>
      
      {/* Labels */}
      {data.map((item, index) => {
        const size = calculateBubbleSize(item.value);
        const position = calculatePosition(index, data.length, size);
        
        if (size === 0) return null;
        
        return (
          <motion.div
            key={`label-${item.name}`}
            className="absolute pointer-events-none"
            style={{
              left: position.x,
              top: position.y,
              width: size,
              height: size
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full text-center p-2">
              <div className="text-white font-semibold text-xs leading-tight">
                {item.name}
              </div>
              <div className="text-white text-xs opacity-90 mt-1">
                {formatValue(item.value)}
              </div>
              {item.change !== 0 && (
                <div className={`text-xs mt-1 ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};