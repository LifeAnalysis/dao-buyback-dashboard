import React from 'react';
import { BuybackData } from '../../types';
import { motion } from 'framer-motion';

interface SidebarProps {
  buybackData: BuybackData[];
}

export const Sidebar: React.FC<SidebarProps> = ({ buybackData }) => {
  const favoriteProjects = [
    { name: 'Tether', symbol: 'USDT', category: 'Stablecoins' },
    { name: 'Tron TRX', symbol: 'TRX', category: 'Blockchains (L1)' },
    { name: 'Circle', symbol: 'USDC', category: 'Stablecoins' },
    { name: 'PancakeSwap CAKE', symbol: 'CAKE', category: 'Exchanges (DEX)' },
    { name: 'Uniswap UNI', symbol: 'UNI', category: 'Exchanges (DEX)' }
  ];

  const recentlyListed = [
    { name: 'Frequency', symbol: 'FRQY', category: 'Blockchains (L2)' },
    { name: 'Bifrost', symbol: 'BNC', category: 'Blockchains (L2)' },
    { name: 'NeuroWeb', symbol: 'NEURO', category: 'Blockchains (L2)' },
    { name: 'Berachain', symbol: 'BERA', category: 'Blockchains (L1)' },
    { name: 'Cosmos Hub', symbol: 'ATOM', category: 'Blockchains (L1)' }
  ];

  const getCategoryIcon = (category: string) => {
    if (category.includes('Stablecoins')) return '💰';
    if (category.includes('Blockchains')) return '⛓️';
    if (category.includes('Exchanges')) return '🏪';
    return '📊';
  };

  return (
    <motion.div 
      className="w-80 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      {/* Favorites Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Favorites</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-4">Get started with favorites</p>
          <p className="text-xs text-gray-500 mb-4">
            Keep track of projects, charts, and dashboards.
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Suggested projects</h4>
          <div className="space-y-2">
            {favoriteProjects.map((project, index) => (
              <motion.div
                key={project.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 cursor-pointer group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                    {getCategoryIcon(project.category)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">{project.name}</div>
                    <div className="text-xs text-gray-500">{project.symbol}</div>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-200 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Listed Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Recently listed</h3>
          <motion.button 
            className="text-blue-400 hover:text-blue-300 text-sm"
            whileHover={{ x: 5 }}
          >
            Get listed →
          </motion.button>
        </div>
        
        <div className="space-y-2">
          {recentlyListed.map((project, index) => (
            <motion.div
              key={project.name}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + index * 0.1, duration: 0.3 }}
              whileHover={{ x: 5 }}
            >
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                {getCategoryIcon(project.category)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-200">{project.name}</div>
                <div className="text-xs text-gray-500">{project.category}</div>
              </div>
              <div className="text-xs text-gray-400">{project.symbol}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DAO Buyback Summary */}
      <div className="border-t border-gray-800 pt-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Buyback Summary</h3>
        <div className="space-y-4">
          {buybackData.map((protocol, index) => (
            <motion.div
              key={protocol.token}
              className="gradient-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
            >
              <div className="gradient-border-content">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-lg">
                    {protocol.protocol === 'Hyperliquid' ? '🚀' : 
                     protocol.protocol === 'Jupiter' ? '🪐' : '👻'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-100">{protocol.protocol}</div>
                    <div className="text-xs text-gray-400">{protocol.token}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Total Value</span>
                    <span className="text-gray-200">
                      ${(protocol.totalValueUSD / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Supply Reduced</span>
                    <span className="text-green-400">{protocol.circulatingSupplyPercent}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Fee Allocation</span>
                    <span className="text-blue-400">{protocol.feeAllocationPercent}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};