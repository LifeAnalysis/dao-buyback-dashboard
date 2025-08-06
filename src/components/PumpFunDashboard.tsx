import React, { useState, useEffect, useCallback } from 'react';
import { BuybackData } from '../types';
import { DataService } from '../services/dataService';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

export const PumpFunDashboard: React.FC = () => {
  const [buybackData, setBuybackData] = useState<BuybackData[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState('Hyperliquid');

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

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(3)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString()}`;
  };

  const getProtocolData = (protocol: string) => {
    return buybackData.find(data => data.protocol === protocol);
  };

  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case 'Hyperliquid': return '#00D4AA';
      case 'Jupiter': return '#FFA500';
      case 'Aave': return '#B6509E';
      default: return '#3b82f6';
    }
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case 'Hyperliquid': return '🚀';
      case 'Jupiter': return '🪐';
      case 'Aave': return '👻';
      default: return '💎';
    }
  };

  const getCurrentProtocolData = () => {
    return getProtocolData(selectedProtocol);
  };

  const getHistoricalChartData = () => {
    return historicalData
      .filter(item => item.protocol === selectedProtocol)
      .map(item => ({
        date: new Date(item.timestamp).getTime(),
        value: item.cumulative_value,
        dailyValue: item.value_usd
      }))
      .sort((a, b) => a.date - b.date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg">Loading buyback data...</p>
        </motion.div>
      </div>
    );
  };

  const currentData = getCurrentProtocolData();
  const chartData = getHistoricalChartData();

  if (!currentData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-300">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <motion.div 
        className="bg-gray-800 border-b border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">DAO Token Buybacks</h1>
              <div className="flex gap-2">
                {buybackData.map((protocol) => (
                  <button
                    key={protocol.protocol}
                    onClick={() => setSelectedProtocol(protocol.protocol)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedProtocol === protocol.protocol
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {getProtocolIcon(protocol.protocol)} {protocol.protocol}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-400">
              View historical {selectedProtocol.toLowerCase()} revenue and token purchases
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Protocol Info Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{getProtocolIcon(selectedProtocol)}</div>
            <div>
              <h2 className="text-3xl font-bold text-white">{selectedProtocol} Token</h2>
              <p className="text-gray-400">{selectedProtocol.toLowerCase()}.protocol token</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-3xl">
            View historical {selectedProtocol.toLowerCase()} revenue and ${currentData.token} purchases since token launch
          </p>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Total Token Purchases */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm text-gray-400 mb-2">Total ${currentData.token} Purchases</h3>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(currentData.totalRepurchased)} {currentData.token}
            </div>
            <div className="text-sm text-gray-500">
              {(currentData.totalRepurchased / 1000000).toFixed(2)}M tokens
            </div>
          </div>

          {/* Total Purchases USD */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm text-gray-400 mb-2">Total ${currentData.token} Purchases (USD)</h3>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(currentData.totalValueUSD)}
            </div>
            <div className="text-sm text-gray-500">
              Since token launch
            </div>
          </div>

          {/* Total Supply */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm text-gray-400 mb-2">Total supply</h3>
            <div className="text-2xl font-bold text-white mb-1">
              {currentData.protocol === 'Hyperliquid' ? '322.6M' : 
               currentData.protocol === 'Jupiter' ? '10B' : '16M'} {currentData.token}
            </div>
            <div className="text-sm text-gray-500">
              Circulating supply
            </div>
          </div>

          {/* Supply Offset */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm text-gray-400 mb-2">Total supply offset</h3>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {currentData.circulatingSupplyPercent}%
            </div>
            <div className="text-sm text-gray-500">
              Reduced through buybacks
            </div>
          </div>
        </motion.div>

        {/* Chart Section */}
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Historical {selectedProtocol} Buyback Activity
            </h3>
            <div className="text-sm text-gray-400">
              Last 30 days
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getProtocolColor(selectedProtocol)} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={getProtocolColor(selectedProtocol)} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={getProtocolColor(selectedProtocol)}
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Protocol Strategy */}
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Buyback Strategy</h3>
          <div className="space-y-4">
            <p className="text-gray-300">
              {selectedProtocol} currently uses <span className="font-semibold text-white">{currentData.feeAllocationPercent}%</span> of 
              protocol fees for token buybacks and strategic investments. {selectedProtocol} may modify or discontinue 
              those plans at any time. The ${currentData.token} token does not represent a right to revenues or any other distribution.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Fee Allocation</div>
                <div className="text-xl font-bold text-white">{currentData.feeAllocationPercent}%</div>
                <div className="text-xs text-gray-500">Of protocol fees</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Est. Annual Buyback</div>
                <div className="text-xl font-bold text-white">
                  ${(currentData.estimatedAnnualBuyback / 1000000).toFixed(0)}M
                </div>
                <div className="text-xs text-gray-500">Based on current rates</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Supply Impact</div>
                <div className="text-xl font-bold text-green-400">-{currentData.circulatingSupplyPercent}%</div>
                <div className="text-xs text-gray-500">Circulating supply reduction</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Legal Disclaimer</h3>
          <div className="text-sm text-gray-400 space-y-3 leading-relaxed">
            <p>
              Any references to token purchases are for informational purposes only, and only describe historical activity. 
              This information should not be understood as a commitment to future token purchases for any reason.
            </p>
            <p>
              Any purchases may have the effect of preventing or retarding a decline in the market price of tokens and may 
              stabilize, maintain or otherwise affect the market price of the tokens. As a result, the market price of the 
              tokens may be higher than the price that otherwise might exist.
            </p>
            <p>
              Entities affiliated with the {selectedProtocol.toLowerCase()} platform may purchase or sell tokens from time to time, 
              but are under no obligation to do so. If any purchases occur in the future, any such activity may be initiated, 
              suspended, modified, or discontinued at any time, with or without notice.
            </p>
            <p>
              No token purchaser, holder or seller should rely on past purchases as an indication of future token purchases.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};