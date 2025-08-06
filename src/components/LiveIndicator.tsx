import React from 'react';

interface LiveIndicatorProps {
  isLive: boolean;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ isLive }) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`w-2 h-2 rounded-full ${
          isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`}
      />
      <span className={`text-sm font-medium ${
        isLive ? 'text-green-600' : 'text-gray-500'
      }`}>
        {isLive ? 'Live' : 'Offline'}
      </span>
    </div>
  );
};