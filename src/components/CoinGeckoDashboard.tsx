import React, { useState, useEffect, useCallback } from 'react';
import { BuybackData } from '../types';
import { DataService } from '../services/dataService';
import { CoinGeckoChart } from './charts/CoinGeckoChart';
import { ProtocolLogoImage } from './ProtocolLogo';
import { motion } from 'framer-motion';

export const CoinGeckoDashboard: React.FC = () => {
  const [buybackData, setBuybackData] = useState<BuybackData[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState('Hyperliquid');

  const [sortBy, setSortBy] = useState<'marketCap' | 'volume' | 'change'>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


  const dataService = DataService.getInstance();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [buyback, historical] = await Promise.all([
        dataService.getAllBuybackData(),
        dataService.getHistoricalChartData(undefined, 30)
      ]);

      setBuybackData(buyback);
      setHistoricalData(historical);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [dataService]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toLocaleString()}`;
  };

  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case 'Hyperliquid': return '#00D4AA';
      case 'Jupiter': return '#FFA500';
      case 'Aave': return '#B6509E';
      case 'Jito': return '#FF6B35';
      case 'Pump.fun': return '#FF1493';
      case 'DeBridge': return '#4A90E2';
      case 'Fluid': return '#00BFFF';
      default: return '#16a34a';
    }
  };

  const getChartData = (protocol: string) => {
    return historicalData
      .filter(item => item.protocol === protocol)
      .map(item => ({
        timestamp: item.timestamp,
        price: item.cumulative_value / item.cumulative_tokens, // Estimated price
        volume: item.value_usd,
        marketCap: item.cumulative_value * 0.8, // Mock market cap
        change24h: Math.random() * 20 - 10 // Mock change
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getGlobalStats = () => {
    const totalMarketCap = buybackData.reduce((sum, data) => sum + data.totalValueUSD * 10, 0);
    const total24hVolume = buybackData.reduce((sum, data) => sum + data.estimatedAnnualBuyback / 365, 0);
    const totalCoins = buybackData.length;
    const totalTokensBoughtBack = buybackData.reduce((sum, data) => sum + data.totalRepurchased, 0);
    const totalRevenue = buybackData.reduce((sum, data) => sum + data.totalValueUSD, 0);
    
    return {
      totalMarketCap,
      total24hVolume,
      totalCoins,
      totalTokensBoughtBack,
      totalRevenue
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00ff87] mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg font-mono">Loading market data...</p>
        </motion.div>
      </div>
    );
  }

  const getFilteredAndSortedData = () => {
    // Apply sorting
    const sorted = [...buybackData].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'marketCap':
          aValue = a.totalValueUSD;
          bValue = b.totalValueUSD;
          break;
        case 'volume':
          aValue = a.estimatedAnnualBuyback;
          bValue = b.estimatedAnnualBuyback;
          break;
        case 'change':
          aValue = a.circulatingSupplyPercent;
          bValue = b.circulatingSupplyPercent;
          break;
        default:
          aValue = a.totalValueUSD;
          bValue = b.totalValueUSD;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
    
    return sorted;
  };

  const handleSort = (column: 'marketCap' | 'volume' | 'change') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const globalStats = getGlobalStats();
  const filteredData = getFilteredAndSortedData();

  return (
    <div className="min-h-screen bg-black">
      {/* CoinGecko-style Header */}
      <motion.div 
        className="sticky top-0 z-50"
        style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Branding */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #00ff87, #00e67a)' }}>
                  <span className="text-black font-bold text-lg font-mono">D</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-mono">DAOGecko</h1>
                  <p className="text-xs text-gray-400 font-mono">DAO Treasury Management & Token Buyback Analytics</p>
                </div>
              </div>
            </div>

            {/* Status and Credits */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] rounded-lg">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff87' }}></div>
                <span className="text-sm text-gray-300 font-mono">Live Data</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Powered by <span className="text-[#00ff87] font-semibold">ExaGroup</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Market Stats */}
      <motion.div 
        style={{ background: '#0f0f0f', borderBottom: '1px solid #1a1a1a' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Protocols</div>
              <div className="font-semibold text-white">{globalStats.totalCoins}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Total Market Cap</div>
              <div className="font-semibold text-white">{formatCurrency(globalStats.totalMarketCap)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">24h Vol</div>
              <div className="font-semibold text-white">{formatCurrency(globalStats.total24hVolume)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Tokens Bought Back</div>
              <div className="font-semibold text-white">{(globalStats.totalTokensBoughtBack / 1000000).toFixed(1)}M</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Total Revenue</div>
              <div className="font-semibold text-white">{formatCurrency(globalStats.totalRevenue)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Description Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="dark-card">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white mb-3 font-mono">
              🏛️ DAO Treasury Management Dashboard
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto">
              Explore comprehensive analytics on how decentralized autonomous organizations (DAOs) manage their treasuries through strategic token buybacks. 
              Track real-time buyback activities, treasury allocations, and supply reduction strategies across major protocols like Hyperliquid, Jupiter, and Aave. 
              This dashboard provides insights into how DAOs optimize tokenomics, reduce circulating supply, and create value for token holders through systematic treasury management.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <CoinGeckoChart
                data={getChartData(selectedProtocol)}
                title={`${selectedProtocol} Buyback Activity`}
                color={getProtocolColor(selectedProtocol)}
                height={400}
                showVolume={true}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Protocol Selector */}
            <motion.div 
              className="dark-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 font-mono">Select Protocol</h3>
              <div className="space-y-2">
                {buybackData.map((protocol) => (
                  <button
                    key={protocol.protocol}
                    onClick={() => setSelectedProtocol(protocol.protocol)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedProtocol === protocol.protocol
                        ? 'border border-[#00ff87] bg-[#00ff87]/10'
                        : 'border border-transparent hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ProtocolLogoImage protocol={protocol.protocol} size="md" />
                        <div>
                          <div className="font-medium text-white">{protocol.protocol}</div>
                          <div className="text-sm text-gray-400">{protocol.token}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white font-mono">
                          {formatCurrency(protocol.totalValueUSD)}
                        </div>
                        <div className="text-sm text-[#00ff87]">+{protocol.circulatingSupplyPercent}%</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>




          </div>
        </div>

        {/* Protocol Table */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="dark-card overflow-hidden">
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
              <h3 className="text-lg font-semibold text-white font-mono">Protocol Buyback Rankings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: '#0a0a0a' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">Protocol</th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-[#00ff87] transition-colors font-mono"
                      onClick={() => handleSort('marketCap')}
                    >
                      <div className="flex items-center gap-1">
                        Total Buybacks
                        {sortBy === 'marketCap' && (
                          <svg className={`w-3 h-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-[#00ff87] transition-colors font-mono"
                      onClick={() => handleSort('change')}
                    >
                      <div className="flex items-center gap-1">
                        Supply Reduced
                        {sortBy === 'change' && (
                          <svg className={`w-3 h-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">Fee Allocation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">
                      <div className="flex items-center gap-2">
                        24h Change
                        <div className="flex flex-col">
                          <div className="w-0 h-0 border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent border-b-green-500"></div>
                          <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-red-500"></div>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: '#0f0f0f' }}>
                  {filteredData.map((protocol, index) => (
                    <tr 
                      key={protocol.protocol} 
                      className="cursor-pointer transition-colors border-b border-[#1a1a1a] hover:bg-[#151515]"
                      onClick={() => setSelectedProtocol(protocol.protocol)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div className="flex items-center">
                          <span className="mr-2">{index + 1}</span>
                          {selectedProtocol === protocol.protocol && (
                            <div className="w-2 h-2 rounded-full" style={{ background: '#00ff87' }}></div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <ProtocolLogoImage protocol={protocol.protocol} size="md" />
                          <div>
                            <div className="font-medium text-white">{protocol.protocol}</div>
                            <div className="text-sm text-gray-400">{protocol.token}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                        {formatCurrency(protocol.totalValueUSD)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#00ff87] font-mono">
                          {protocol.circulatingSupplyPercent}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                        {protocol.feeAllocationPercent}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#00ff87] font-mono">
                          +{(Math.random() * 15).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="dark-card border-t-2 border-yellow-500/20">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-yellow-500 mb-2 font-mono">Legal Disclaimer</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Any references to token purchases are for informational purposes only, and only describe historical activity. 
                  This information should not be understood as a commitment to future token purchases for any reason. 
                  Any purchases may have the effect of preventing or retarding a decline in the market price of tokens and may stabilize, 
                  maintain or otherwise affect the market price of the tokens. As a result, the market price of the tokens may be higher 
                  than the price that otherwise might exist. Entities affiliated with the pump platform may purchase or sell tokens from 
                  time to time, but are not under no obligation to do so. If any purchases occur in the future, any such activity may be 
                  initiated, suspended, modified, or discontinued at any time, with or without notice. No token purchaser, holder or seller 
                  should rely on past purchases as an indication of future token purchases.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};