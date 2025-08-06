import React, { useState, useEffect, useCallback } from 'react';
import { BuybackData } from '../types';
import { DataService } from '../services/dataService';
import { SearchHeader } from './layout/SearchHeader';
import { BubbleChart } from './charts/BubbleChart';
import { Sidebar } from './layout/Sidebar';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, BarChart, Bar, Tooltip } from 'recharts';

export const HybridDashboard: React.FC = () => {
  const [buybackData, setBuybackData] = useState<BuybackData[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState('Hyperliquid');
  const [activeView, setActiveView] = useState<'overview' | 'details'>('overview');

  const dataService = DataService.getInstance();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [buyback, historical, performance] = await Promise.all([
        dataService.getAllBuybackData(),
        dataService.getHistoricalChartData(undefined, 30),
        dataService.getPerformanceMetrics()
      ]);

      setBuybackData(buyback);
      setHistoricalData(historical);
      setPerformanceMetrics(performance);
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
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
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
        name: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.cumulative_value,
        dailyValue: item.value_usd
      }))
      .sort((a, b) => a.date - b.date);
  };

  const getAllProtocolsChartData = () => {
    const dataByDate: { [date: string]: any } = {};
    
    historicalData.forEach(item => {
      const dateKey = new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dataByDate[dateKey]) {
        dataByDate[dateKey] = { date: dateKey };
      }
      dataByDate[dateKey][`${item.protocol} Value`] = item.cumulative_value;
    });

    return Object.values(dataByDate).sort((a: any, b: any) => 
      new Date(a.date + ', 2024').getTime() - new Date(b.date + ', 2024').getTime()
    );
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
          <p className="text-gray-300 text-lg">Loading market data...</p>
        </motion.div>
      </div>
    );
  }

  const currentData = getCurrentProtocolData();
  const chartData = getHistoricalChartData();
  const allProtocolsData = getAllProtocolsChartData();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search Header */}
          <SearchHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          {/* Navigation Tabs */}
          <motion.div 
            className="p-6 border-b border-gray-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('overview')}
                  className={activeView === 'overview' ? 'nav-pill-active' : 'nav-pill-inactive'}
                >
                  Market Overview
                </button>
                <button
                  onClick={() => setActiveView('details')}
                  className={activeView === 'details' ? 'nav-pill-active' : 'nav-pill-inactive'}
                >
                  Protocol Details
                </button>
              </div>
              
              {activeView === 'details' && (
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
              )}
            </div>
          </motion.div>

          {/* Content based on active view */}
          {activeView === 'overview' ? (
            // Market Overview Mode
            <div className="p-6">
              {/* Total Market Metrics */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="metric-card">
                  <h3 className="text-sm text-gray-400 mb-2">Total Value Repurchased</h3>
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {formatCurrency(buybackData.reduce((sum, data) => sum + data.totalValueUSD, 0))}
                  </div>
                  <div className="text-sm text-gray-500">Across all protocols</div>
                </div>

                <div className="metric-card">
                  <h3 className="text-sm text-gray-400 mb-2">Estimated Annual Buybacks</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {formatCurrency(buybackData.reduce((sum, data) => sum + data.estimatedAnnualBuyback, 0))}
                  </div>
                  <div className="text-sm text-gray-500">Based on current rates</div>
                </div>

                <div className="metric-card">
                  <h3 className="text-sm text-gray-400 mb-2">Protocols Tracked</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {buybackData.length}
                  </div>
                  <div className="text-sm text-gray-500">Active buyback programs</div>
                </div>
              </motion.div>

              {/* Market Overview Grid */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Bubble Chart */}
                <div className="dark-card">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Protocol Market Size</h3>
                  <BubbleChart 
                    data={buybackData.map(protocol => ({
                      name: protocol.protocol,
                      value: protocol.totalValueUSD,
                      color: getProtocolColor(protocol.protocol),
                      change: Math.random() * 20 - 10 // Mock change
                    }))}
                    height={300}
                  />
                </div>

                {/* All Protocols Chart */}
                <div className="dark-card">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Historical Buyback Trends</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={allProtocolsData}>
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                          tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => [formatCurrency(value), '']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Hyperliquid Value" 
                          stroke="#00D4AA" 
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Jupiter Value" 
                          stroke="#FFA500" 
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Aave Value" 
                          stroke="#B6509E" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* Protocol Cards */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {buybackData.map((protocol, index) => (
                  <motion.div
                    key={protocol.token}
                    className="dark-card cursor-pointer"
                    style={{ borderLeftColor: getProtocolColor(protocol.protocol), borderLeftWidth: '4px' }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedProtocol(protocol.protocol);
                      setActiveView('details');
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">{getProtocolIcon(protocol.protocol)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100">{protocol.protocol}</h3>
                        <p className="text-sm text-gray-400">{protocol.token} Token</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Repurchased</span>
                        <span className="text-sm font-medium text-gray-200">
                          {formatCurrency(protocol.totalValueUSD)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Supply Reduced</span>
                        <span className="text-sm font-medium text-green-400">
                          {protocol.circulatingSupplyPercent}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Fee Allocation</span>
                        <span className="text-sm font-medium text-blue-400">
                          {protocol.feeAllocationPercent}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            // Protocol Details Mode (pump.fun style)
            <div className="p-6">
              {currentData && (
                <>
                  {/* Protocol Header */}
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
                    <div className="dark-card">
                      <h3 className="text-sm text-gray-400 mb-2">Total ${currentData.token} Purchases</h3>
                      <div className="text-2xl font-bold text-white mb-1">
                        {formatNumber(currentData.totalRepurchased)} {currentData.token}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(currentData.totalRepurchased / 1000000).toFixed(2)}M tokens
                      </div>
                    </div>

                    <div className="dark-card">
                      <h3 className="text-sm text-gray-400 mb-2">Total ${currentData.token} Purchases (USD)</h3>
                      <div className="text-2xl font-bold text-white mb-1">
                        {formatCurrency(currentData.totalValueUSD)}
                      </div>
                      <div className="text-sm text-gray-500">Since token launch</div>
                    </div>

                    <div className="dark-card">
                      <h3 className="text-sm text-gray-400 mb-2">Total supply</h3>
                      <div className="text-2xl font-bold text-white mb-1">
                        {currentData.protocol === 'Hyperliquid' ? '322.6M' : 
                         currentData.protocol === 'Jupiter' ? '10B' : '16M'} {currentData.token}
                      </div>
                      <div className="text-sm text-gray-500">Circulating supply</div>
                    </div>

                    <div className="dark-card">
                      <h3 className="text-sm text-gray-400 mb-2">Total supply offset</h3>
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {currentData.circulatingSupplyPercent}%
                      </div>
                      <div className="text-sm text-gray-500">Reduced through buybacks</div>
                    </div>
                  </motion.div>

                  {/* Chart Section */}
                  <motion.div 
                    className="dark-card mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">
                        Historical {selectedProtocol} Buyback Activity
                      </h3>
                      <div className="text-sm text-gray-400">Last 30 days</div>
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
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                            formatter={(value: any) => [formatCurrency(value), 'Cumulative Value']}
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
                    className="dark-card mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Buyback Strategy</h3>
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        {selectedProtocol} currently uses <span className="font-semibold text-white">{currentData.feeAllocationPercent}%</span> of 
                        protocol fees for token buybacks and strategic investments. {selectedProtocol} may modify or discontinue 
                        those plans at any time.
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
                </>
              )}
            </div>
          )}

          {/* Legal Disclaimer (always visible) */}
          <motion.div 
            className="p-6 border-t border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <div className="dark-card">
              <h3 className="text-lg font-semibold text-white mb-4">Legal Disclaimer</h3>
              <div className="text-sm text-gray-400 space-y-3 leading-relaxed">
                <p>
                  Any references to token purchases are for informational purposes only, and only describe historical activity. 
                  This information should not be understood as a commitment to future token purchases for any reason.
                </p>
                <p>
                  No token purchaser, holder or seller should rely on past purchases as an indication of future token purchases.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Sidebar */}
        <Sidebar buybackData={buybackData} />
      </div>
    </div>
  );
};