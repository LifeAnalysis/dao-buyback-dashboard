/**
 * Strategic Dashboard Component
 * Inspired by StrategicETHReserve.xyz design
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';
import { OptimizedDataService } from '../services/optimizedDataService';
import { OptimizedChart } from './charts/OptimizedChart';
import { ProtocolLogoImage } from './ProtocolLogo';
import type { 
  BuybackData, 
  DashboardState 
} from '../types';

/**
 * News Ticker Component
 */
const NewsTicker = React.memo(() => {
  const [currentNews, setCurrentNews] = useState(0);
  
  const newsItems = [
    "$HYPE has purchased 2.1M tokens ($40M) at an average price of $19.05",
    "$JUP allocates 50% of protocol fees to token buybacks (~$250M annually)",
    "$AAVE implements weekly $1M buyback program for supply optimization",
    "7 major DAOs now running systematic token buyback programs"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % newsItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  return (
    <div className="bg-gray-50 border-b border-gray-200 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded">
            SER NEWS
          </span>
          <div className="flex-1 overflow-hidden">
            <motion.div
              key={currentNews}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-sm text-gray-700 font-medium"
            >
              {newsItems[currentNews]}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Header Component
 */
const StrategicHeader = React.memo(() => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">STRATEGIC</span>
              <span className="text-orange-500">DAO</span>
              <span className="text-gray-900">RESERVE.XYZ</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-sm font-medium text-gray-600">SUPPLY DYNAMICS (7D):</span>
              <span className="text-sm font-bold text-green-600">-147.8K ↑</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Main Cards Section
 */
interface MainCardsProps {
  buybackData: BuybackData[];
  selectedProtocol: string;
  onProtocolSelect: (protocol: string) => void;
  chartData: any[];
}

const MainCards = React.memo<MainCardsProps>(({ 
  buybackData, 
  selectedProtocol, 
  onProtocolSelect,
  chartData 
}) => {
  const totalETH = useMemo(() => {
    return buybackData.reduce((sum, protocol) => sum + (protocol.totalRepurchased / 1000), 0);
  }, [buybackData]);

  const totalUSD = useMemo(() => {
    return buybackData.reduce((sum, protocol) => sum + protocol.totalValueUSD, 0);
  }, [buybackData]);

  const participantCount = buybackData.length;
  const supplyPercentage = useMemo(() => {
    return buybackData.reduce((sum, protocol) => sum + protocol.circulatingSupplyPercent, 0) / buybackData.length;
  }, [buybackData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SER+ETF ETH RESERVE</h3>
          <div className="h-64">
            <OptimizedChart
              data={chartData}
              title=""
              color="#10b981"
              height={256}
              showVolume={false}
            />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Strategic ETH Reserve
          </div>
        </div>

        {/* Entities Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">SER ENTITIES</h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl font-bold text-green-600">{totalETH.toFixed(2)}M</span>
              <span className="text-lg text-gray-600">ETH</span>
              <span className="text-gray-400">({formatCurrency(totalUSD)})</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Participants: {participantCount} | % of Supply: {supplyPercentage.toFixed(1)}%
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="text-left">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">ETF RESERVE</h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">{(totalETH * 1.8).toFixed(2)}M</span>
                  <span className="text-lg text-gray-600">ETH</span>
                  <span className="text-gray-400">({formatCurrency(totalUSD * 1.8)})</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    2-Day Streak
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Daily Flow: {(totalETH / 30).toFixed(1)}K ETH | % of Supply: {(supplyPercentage * 1.2).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RECENT SER ACTIVITIES</h3>
          <div className="space-y-3">
            {buybackData.slice(0, 6).map((protocol, index) => (
              <div key={protocol.protocol} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <ProtocolLogoImage protocol={protocol.protocol} size="sm" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{protocol.protocol}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.random() > 0.5 ? '+' : ''}{(Math.random() * 10 - 5).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Navigation Tabs
 */
const NavigationTabs = React.memo(() => {
  const [activeTab, setActiveTab] = useState('All SER Entities');
  
  const tabs = ['All SER Entities', 'SER Treasuries', 'ETFs'];
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

/**
 * Strategic Table Component
 */
interface StrategicTableProps {
  protocols: BuybackData[];
  selectedProtocol: string;
  onProtocolSelect: (protocol: string) => void;
}

const StrategicTable = React.memo<StrategicTableProps>(({ 
  protocols, 
  selectedProtocol, 
  onProtocolSelect 
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">STRATEGICDAORESERVE.XYZ</h3>
            <p className="text-sm text-gray-500">Entities holding &gt;100 ETH in their treasury</p>
          </div>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
            JOIN THE MOVEMENT
          </button>
        </div>
        
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{protocols.length} of {protocols.length} entities</span>
            <button className="flex items-center gap-1 hover:text-gray-900">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENTITIES</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TICKER</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETH</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">30 DAYS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MARKET CAP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% SUPPLY</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MNAV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {protocols.map((protocol, index) => (
                <tr 
                  key={protocol.protocol} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onProtocolSelect(protocol.protocol)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <ProtocolLogoImage protocol={protocol.protocol} size="sm" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{protocol.protocol}</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          T
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {protocol.token}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">
                        {(protocol.totalRepurchased / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(protocol.totalValueUSD)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">
                      +{(Math.random() * 50 + 10).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(protocol.totalValueUSD * 10)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(Math.random() * 100 + 10).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {protocol.circulatingSupplyPercent}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">
                        {(Math.random() * 2 + 0.5).toFixed(2)}
                      </span>
                      <span className="text-yellow-500">⚠️</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-green-600 font-medium">
                      +{formatCurrency(Math.random() * 1000000 + 100000)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

/**
 * Main Strategic Dashboard Component
 */
export const StrategicDashboard: React.FC = () => {
  // State management
  const [state, setState] = useState<DashboardState>({
    buybackData: [],
    historicalData: [],
    selectedProtocol: 'Hyperliquid',
    sortBy: 'marketCap',
    sortOrder: 'desc',
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const dataService = OptimizedDataService.getInstance();

  // Memoized chart data
  const chartData = useMemo(() => {
    return state.historicalData
      .filter(item => item.protocol === state.selectedProtocol)
      .map(item => ({
        timestamp: item.timestamp,
        buybacks: item.cumulative_value || item.value_usd || 0,
        revenue: (item.cumulative_value || 0) * 0.15,
        tokensBought: item.cumulative_tokens || 0,
        change24h: item.change24h || Math.random() * 20 - 10,
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [state.historicalData, state.selectedProtocol]);

  // Event handlers
  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const [buyback, historical] = await Promise.all([
        dataService.getAllBuybackData(),
        dataService.getHistoricalChartData(undefined, 30)
      ]);

      setState(prev => ({
        ...prev,
        buybackData: buyback,
        historicalData: historical,
        loading: false,
        lastUpdated: new Date(),
      }));

    } catch (err) {
      console.error('Failed to fetch data:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      }));
    }
  }, [dataService]);

  const handleProtocolSelect = useCallback((protocol: string) => {
    setState(prev => ({ ...prev, selectedProtocol: protocol }));
  }, []);

  // Effects
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-6" />
          <p className="text-gray-600 text-lg">Loading strategic data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <NewsTicker />
      <StrategicHeader />
      <MainCards 
        buybackData={state.buybackData}
        selectedProtocol={state.selectedProtocol}
        onProtocolSelect={handleProtocolSelect}
        chartData={chartData}
      />
      <NavigationTabs />
      <StrategicTable 
        protocols={state.buybackData}
        selectedProtocol={state.selectedProtocol}
        onProtocolSelect={handleProtocolSelect}
      />
    </div>
  );
};

export default StrategicDashboard;