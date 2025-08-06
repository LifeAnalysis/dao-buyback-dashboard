import React, { useState, useEffect, useCallback } from 'react';
import { BuybackData } from '../types';
import { DataService } from '../services/dataService';
import { SearchHeader } from './layout/SearchHeader';
import { MarketOverview } from './sections/MarketOverview';
import { Leaderboards } from './sections/Leaderboards';
import { Sidebar } from './layout/Sidebar';
import { motion } from 'framer-motion';

export const ModernDashboard: React.FC = () => {
  const [buybackData, setBuybackData] = useState<BuybackData[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Fees');

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
          
          {/* Market Overview */}
          <MarketOverview 
            buybackData={buybackData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {/* Leaderboards */}
          <Leaderboards 
            performanceMetrics={performanceMetrics}
            historicalData={historicalData}
          />
        </div>
        
        {/* Sidebar */}
        <Sidebar buybackData={buybackData} />
      </div>
    </div>
  );
};