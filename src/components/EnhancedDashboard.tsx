import React, { useState, useEffect } from 'react';
import { BuybackData } from '../types';
import { DataService } from '../services/dataService';
import { PROTOCOLS } from '../config/protocols';
import { ProtocolCard } from './ProtocolCard';
import { MetricCard } from './MetricCard';
import { LiveIndicator } from './LiveIndicator';
import { BuybackChart } from './charts/BuybackChart';
import { PerformanceMetrics } from './charts/PerformanceMetrics';
import { motion } from 'framer-motion';

export const EnhancedDashboard: React.FC = () => {
  const [buybackData, setBuybackData] = useState<BuybackData[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(30);

  const dataService = DataService.getInstance();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [buyback, historical, performance] = await Promise.all([
        dataService.getAllBuybackData(),
        dataService.getHistoricalChartData(undefined, selectedTimeframe),
        dataService.getPerformanceMetrics()
      ]);

      setBuybackData(buyback);
      setHistoricalData(historical);
      setPerformanceMetrics(performance);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const calculateTotalMetrics = () => {
    const totalValueUSD = buybackData.reduce((sum, data) => sum + data.totalValueUSD, 0);
    const totalAnnualBuyback = buybackData.reduce((sum, data) => sum + data.estimatedAnnualBuyback, 0);
    const avgSupplyReduction = buybackData.reduce((sum, data) => sum + data.circulatingSupplyPercent, 0) / buybackData.length;

    return {
      totalValueUSD,
      totalAnnualBuyback,
      avgSupplyReduction: avgSupplyReduction || 0
    };
  };

  const prepareChartData = () => {
    // Group data by date and aggregate by protocol
    const groupedData: { [date: string]: any } = {};
    
    historicalData.forEach(item => {
      if (!groupedData[item.date]) {
        groupedData[item.date] = {
          date: item.date,
          timestamp: item.timestamp
        };
      }
      groupedData[item.date][`${item.protocol} Cumulative Value`] = item.cumulative_value;
      groupedData[item.date][`${item.protocol} Daily Value`] = item.value_usd;
    });

    return Object.values(groupedData).sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading comprehensive buyback data...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching database records and charts</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Retry Loading
          </button>
        </motion.div>
      </div>
    );
  }

  const totalMetrics = calculateTotalMetrics();
  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <motion.div 
        className="gradient-bg text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <motion.h1 
              className="text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              DAO Token Buyback Analytics
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Real-time tracking and analysis of token buybacks across Hyperliquid, Jupiter, and Aave protocols
            </motion.p>
            <motion.div 
              className="flex items-center justify-center gap-6 text-sm text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <span>Last updated: {lastUpdated.toLocaleString()}</span>
              <LiveIndicator isLive={!loading && !error} />
              <span>Database: {historicalData.length} records</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Metrics - Enhanced */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <MetricCard
            title="Total Value Repurchased"
            value={totalMetrics.totalValueUSD}
            icon="💰"
            color="#059669"
            subtitle="Across all protocols"
            change={{ value: 12.5, positive: true }}
          />
          <MetricCard
            title="Estimated Annual Buybacks"
            value={totalMetrics.totalAnnualBuyback}
            icon="📈"
            color="#2563eb"
            subtitle="Based on current rates"
            change={{ value: 8.7, positive: true }}
          />
          <MetricCard
            title="Average Supply Reduction"
            value={`${totalMetrics.avgSupplyReduction.toFixed(2)}%`}
            icon="📉"
            color="#dc2626"
            subtitle="Of circulating supply"
            change={{ value: 3.2, positive: true }}
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          {/* Timeframe Selector */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Historical Analysis</h2>
            <div className="flex gap-2">
              {[7, 30, 90].map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedTimeframe(days)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === days
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {days}D
                </button>
              ))}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <BuybackChart
              data={chartData}
              title="Cumulative Buyback Value"
              type="area"
              height={350}
            />
            <BuybackChart
              data={chartData}
              title="Daily Buyback Activity"
              type="line"
              height={350}
            />
          </div>
        </motion.div>

        {/* Performance Metrics */}
        {performanceMetrics.length > 0 && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Metrics</h2>
            <PerformanceMetrics data={performanceMetrics} />
          </motion.div>
        )}

        {/* Protocol Cards - Enhanced Layout */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800">Protocol Details</h2>
          <div className="grid grid-cols-1 gap-8">
            {buybackData.map((data, index) => {
              const protocol = PROTOCOLS.find(p => p.token === data.token);
              return (
                <motion.div
                  key={data.token}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + index * 0.2, duration: 0.6 }}
                >
                  <ProtocolCard
                    data={data}
                    color={protocol?.color || '#3b82f6'}
                    icon={protocol?.icon || '💎'}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div 
          className="mt-16 text-center text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.6 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-lg mb-4">
              Data is automatically updated every 5 minutes and stored in local database
            </p>
            <div className="flex justify-center items-center gap-6 text-sm">
              <button
                onClick={fetchData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
              <span className="text-gray-300">|</span>
              <span>{buybackData.length} protocols tracked</span>
              <span className="text-gray-300">|</span>
              <span>{historicalData.length} historical data points</span>
              <span className="text-gray-300">|</span>
              <span>SQLite Database</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};