import React from 'react';
import { BuybackData } from '../../types';
import { BubbleChart } from '../charts/BubbleChart';
import { motion } from 'framer-motion';

interface MarketOverviewProps {
  buybackData: BuybackData[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  buybackData,
  activeTab,
  onTabChange
}) => {
  const tabs = ['Fees', 'Total value locked', 'Active users (daily)'];

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toLocaleString()}`;
  };

  // Removed unused getTabData function

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Market overview</h2>
        <motion.button 
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          whileHover={{ x: 5 }}
        >
          View full overview →
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-800 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={activeTab === tab ? 'nav-pill-active' : 'nav-pill-inactive'}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Protocol Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stablecoin Issuers */}
        <motion.div 
          className="dark-card bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-700/50 h-64"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-emerald-400 text-sm font-medium">💰 Stablecoin issuers</span>
            <span className="text-gray-400 text-xs">Values shown are 30 day sums</span>
          </div>
          <BubbleChart 
            data={[
              { name: 'Circle', value: 163800000000, color: '#10b981', change: 8.4 },
              { name: 'Tether', value: 447700000000, color: '#059669', change: 22.5 }
            ]}
            height={180}
          />
        </motion.div>

        {/* Blockchains */}
        <motion.div 
          className="dark-card bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50 h-64"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-blue-400 text-sm font-medium">⛓️ Blockchains (L1)</span>
          </div>
          <BubbleChart 
            data={[
              { name: 'Tron', value: 352100000, color: '#ef4444', change: 20.2 }
            ]}
            height={180}
          />
        </motion.div>

        {/* Exchanges */}
        <motion.div 
          className="dark-card bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50 h-64"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-400 text-sm font-medium">🏪 Exchanges (DEX)</span>
          </div>
          <BubbleChart 
            data={[
              { name: 'PancakeSwap', value: 103300000, color: '#8b5cf6', change: 5.6 },
              { name: 'Uniswap', value: 833300000, color: '#a855f7', change: 4.3 }
            ]}
            height={180}
          />
        </motion.div>

        {/* Liquid Staking */}
        <motion.div 
          className="dark-card bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 border-indigo-700/50 h-64"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-indigo-400 text-sm font-medium">🔒 Liquid staking</span>
          </div>
          <BubbleChart 
            data={[
              { name: 'Aave', value: 757000000, color: '#6366f1', change: 3.9 },
              { name: 'Lending', value: 0, color: '#818cf8', change: 0 },
              { name: 'Infrastructure', value: 0, color: '#a5b4fc', change: 0 },
              { name: 'Other', value: 0, color: '#c7d2fe', change: 0 }
            ]}
            height={180}
          />
        </motion.div>
      </div>

      {/* DAO Buyback Section */}
      <motion.div 
        className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {buybackData.map((protocol, index) => {
          const colors = {
            'Hyperliquid': { bg: 'from-cyan-900/50 to-cyan-800/30', border: 'border-cyan-700/50', text: 'text-cyan-400' },
            'Jupiter': { bg: 'from-orange-900/50 to-orange-800/30', border: 'border-orange-700/50', text: 'text-orange-400' },
            'Aave': { bg: 'from-pink-900/50 to-pink-800/30', border: 'border-pink-700/50', text: 'text-pink-400' }
          };
          
          const color = colors[protocol.protocol as keyof typeof colors] || colors['Aave'];
          
          return (
            <motion.div 
              key={protocol.token}
              className={`dark-card bg-gradient-to-br ${color.bg} ${color.border} h-48`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`${color.text} text-sm font-medium`}>
                  {protocol.protocol === 'Hyperliquid' ? '🚀' : protocol.protocol === 'Jupiter' ? '🪐' : '👻'} {protocol.protocol} Buybacks
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-gray-100">
                    {formatCurrency(protocol.totalValueUSD)}
                  </div>
                  <div className="text-sm text-gray-400">Total repurchased</div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-200">
                      {protocol.circulatingSupplyPercent}%
                    </div>
                    <div className="text-xs text-gray-500">Supply reduced</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-200">
                      {protocol.feeAllocationPercent}%
                    </div>
                    <div className="text-xs text-gray-500">Fee allocation</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Est. annual: {formatCurrency(protocol.estimatedAnnualBuyback)}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};