import React from 'react';

interface ProtocolLogoProps {
  protocol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProtocolLogo: React.FC<ProtocolLogoProps> = ({ 
  protocol, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const getLogoComponent = () => {
    switch (protocol) {
      case 'Hyperliquid':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg`}>
            <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-white" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        );
      
      case 'Jupiter':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg`}>
            <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-white" fill="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
              <path d="M20.49 8.51l-4.24 4.24m-4.5 4.5l-4.24 4.24M3.51 8.51l4.24 4.24m4.5 4.5l4.24 4.24"/>
            </svg>
          </div>
        );
      
      case 'Aave':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg`}>
            <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        );
      
      case 'Jito':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg`}>
            <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-white" fill="currentColor">
              <path d="M13 3L4 14h6l-1 4 9-11h-6l1-4z"/>
            </svg>
          </div>
        );
      
      case 'Pump.fun':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg`}>
            <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-white" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        );
      
      case 'DeBridge':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg`}>
            <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-white" fill="currentColor">
              <path d="M17 7l-10 10M7 7l10 10M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/>
            </svg>
          </div>
        );
      
      case 'Fluid':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg`}>
            <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72 0-.43-.35-.78-.78-.78-.22 0-.42.09-.56.24-.78.28-1.6.43-2.46.43-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6c0 .86-.15 1.68-.43 2.46-.15.14-.24.34-.24.56 0 .43.35.78.78.78.32 0 .61-.19.72-.49.39-1.07.6-2.22.6-3.41 0-5.52-4.48-10-10-10z"/>
            </svg>
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-sm">
              {protocol.charAt(0)}
            </span>
          </div>
        );
    }
  };

  return getLogoComponent();
};

// Alternative version with actual logo images (if available)
export const ProtocolLogoImage: React.FC<ProtocolLogoProps> = ({ 
  protocol, 
  size = 'md', 
  className = '' 
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const logoUrls = {
    'Hyperliquid': 'https://assets.coingecko.com/coins/images/38481/standard/hyperliquid.png',
    'Jupiter': 'https://assets.coingecko.com/coins/images/33547/standard/jupiter.png',
    'Aave': 'https://assets.coingecko.com/coins/images/12645/standard/AAVE.png',
    'Jito': 'https://assets.coingecko.com/coins/images/32592/standard/jto.png',
    'Pump.fun': 'https://pump.fun/icon.png',
    'DeBridge': 'https://assets.coingecko.com/coins/images/27840/standard/debridge.png',
    'Fluid': 'https://assets.coingecko.com/coins/images/10393/standard/INST.png'
  };

  const renderFallback = () => (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center shadow-lg`}>
      <span className="text-white font-bold text-sm">
        {protocol.charAt(0)}
      </span>
    </div>
  );

  const logoUrl = logoUrls[protocol as keyof typeof logoUrls];

  if (!logoUrl || imageError) {
    return renderFallback();
  }

  return (
    <img
      src={logoUrl}
      alt={`${protocol} logo`}
      className={`${sizeClasses[size]} ${className} rounded-lg shadow-lg object-cover`}
      onError={() => setImageError(true)}
    />
  );
};