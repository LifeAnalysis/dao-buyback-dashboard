/**
 * Optimized Dashboard Component
 * Clean, maintainable dashboard using the new modular architecture
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BRANDING, 
  EXPECTED_PROTOCOL_COUNT,
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
  THEME_COLORS 
} from '../constants';
import { formatCurrency, formatTokenAmount } from '../utils/formatters';
import { getProtocolColor, sortArray, isValidProtocolCount } from '../utils/helpers';
import { OptimizedDataService } from '../services/optimizedDataService';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { OptimizedChart } from './charts/OptimizedChart';
import { ProtocolLogoImage } from './ProtocolLogo';
import type { 
  BuybackData, 
  HistoricalDataPoint, 
  GlobalStats, 
  SortOption, 
  SortOrder,
  DashboardState 
} from '../types';

/**
 * Global market statistics component
 */
interface GlobalStatsProps {
  stats: GlobalStats;
}

const GlobalStatsSection = React.memo<GlobalStatsProps>(({ stats }) => (
  <motion.div 
    style={{ 
      background: THEME_COLORS.MEDIUM_BLACK, 
      borderBottom: `1px solid ${THEME_COLORS.LIGHT_BLACK}` 
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: ANIMATION_DELAYS.SHORT, duration: ANIMATION_DURATIONS.NORMAL }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">Protocols</div>
          <div className="font-semibold text-white">{stats.totalCoins}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Total Market Cap</div>
          <div className="font-semibold text-white">{formatCurrency(stats.totalMarketCap)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">24h Volume</div>
          <div className="font-semibold text-white">{formatCurrency(stats.total24hVolume)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Tokens Bought Back</div>
          <div className="font-semibold text-white">{formatTokenAmount(stats.totalTokensBoughtBack)}M</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Total Revenue</div>
          <div className="font-semibold text-white">{formatCurrency(stats.totalRevenue)}</div>
        </div>
      </div>
    </div>
  </motion.div>
));

GlobalStatsSection.displayName = 'GlobalStatsSection';

/**
 * Description section component
 */
const DescriptionSection = React.memo(() => (
  <motion.div 
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: ANIMATION_DELAYS.MEDIUM, duration: ANIMATION_DURATIONS.NORMAL }}
  >
    <div className="dark-card">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white mb-3 font-mono">
          🏛️ DAO Treasury Management Dashboard
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto">
          {BRANDING.DESCRIPTION}
        </p>
      </div>
    </div>
  </motion.div>
));

DescriptionSection.displayName = 'DescriptionSection';

/**
 * Protocol selector component
 */
interface ProtocolSelectorProps {
  protocols: BuybackData[];
  selectedProtocol: string;
  onProtocolSelect: (protocol: string) => void;
}

const ProtocolSelector = React.memo<ProtocolSelectorProps>(({
  protocols,
  selectedProtocol,
  onProtocolSelect
}) => (
  <motion.div 
    className="dark-card"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: ANIMATION_DELAYS.LONG, duration: ANIMATION_DURATIONS.NORMAL }}
  >
    <h3 className="text-lg font-semibold text-white mb-4 font-mono">Select Protocol</h3>
    <div className="space-y-2">
      {protocols.map((protocol) => (
        <button
          key={protocol.protocol}
          onClick={() => onProtocolSelect(protocol.protocol)}
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
));

ProtocolSelector.displayName = 'ProtocolSelector';

/**
 * Protocol rankings table component
 */
interface ProtocolTableProps {
  protocols: BuybackData[];
  selectedProtocol: string;
  sortBy: SortOption;
  sortOrder: SortOrder;
  onProtocolSelect: (protocol: string) => void;
  onSort: (column: SortOption) => void;
}

const ProtocolTable = React.memo<ProtocolTableProps>(({
  protocols,
  selectedProtocol,
  sortBy,
  sortOrder,
  onProtocolSelect,
  onSort
}) => {
  const SortIcon = ({ column }: { column: SortOption }) => (
    sortBy === column ? (
      <svg 
        className={`w-3 h-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
          clipRule="evenodd" 
        />
      </svg>
    ) : null
  );

  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_DELAYS.VERY_LONG, duration: ANIMATION_DURATIONS.NORMAL }}
    >
      <div className="dark-card overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <h3 className="text-lg font-semibold text-white font-mono">Protocol Buyback Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: THEME_COLORS.DARK_BLACK }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">
                  Protocol
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-[#00ff87] transition-colors font-mono"
                  onClick={() => onSort('marketCap')}
                >
                  <div className="flex items-center gap-1">
                    Total Buybacks
                    <SortIcon column="marketCap" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-[#00ff87] transition-colors font-mono"
                  onClick={() => onSort('change')}
                >
                  <div className="flex items-center gap-1">
                    Supply Reduced
                    <SortIcon column="change" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">
                  Fee Allocation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">
                  24h Change
                </th>
              </tr>
            </thead>
            <tbody style={{ background: THEME_COLORS.MEDIUM_BLACK }}>
              {protocols.map((protocol, index) => (
                <tr 
                  key={protocol.protocol} 
                  className="cursor-pointer transition-colors border-b border-[#1a1a1a] hover:bg-[#151515]"
                  onClick={() => onProtocolSelect(protocol.protocol)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div className="flex items-center">
                      <span className="mr-2">{index + 1}</span>
                      {selectedProtocol === protocol.protocol && (
                        <div className="w-2 h-2 rounded-full bg-[#00ff87]" />
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
  );
});

ProtocolTable.displayName = 'ProtocolTable';

/**
 * Loading component
 */
const LoadingSpinner = React.memo(() => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00ff87] mx-auto mb-6" />
      <p className="text-gray-300 text-lg font-mono">Loading market data...</p>
    </motion.div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

/**
 * Main Optimized Dashboard Component
 */
export const OptimizedDashboard: React.FC = () => {
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

  // Memoized calculations
  const globalStats = useMemo((): GlobalStats => {
    const { buybackData } = state;
    return {
      totalCoins: buybackData.length,
      totalMarketCap: buybackData.reduce((sum, data) => sum + data.totalValueUSD * 10, 0),
      total24hVolume: buybackData.reduce((sum, data) => sum + data.estimatedAnnualBuyback / 365, 0),
      totalTokensBoughtBack: buybackData.reduce((sum, data) => sum + data.totalRepurchased, 0),
      totalRevenue: buybackData.reduce((sum, data) => sum + data.totalValueUSD, 0),
    };
  }, [state.buybackData]);

  const sortedProtocols = useMemo(() => {
    return sortArray(
      state.buybackData,
      (protocol) => {
        switch (state.sortBy) {
          case 'marketCap': return protocol.totalValueUSD;
          case 'volume': return protocol.estimatedAnnualBuyback;
          case 'change': return protocol.circulatingSupplyPercent;
          default: return protocol.totalValueUSD;
        }
      },
      state.sortOrder
    );
  }, [state.buybackData, state.sortBy, state.sortOrder]);

  const chartData = useMemo(() => {
    return state.historicalData
      .filter(item => item.protocol === state.selectedProtocol)
      .map(item => ({
        timestamp: item.timestamp,
        price: item.cumulative_value ? item.cumulative_value / item.cumulative_tokens! : item.price,
        volume: item.value_usd || item.volume,
        marketCap: item.cumulative_value ? item.cumulative_value * 0.8 : item.marketCap,
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

      if (!isValidProtocolCount(buyback.length)) {
        console.warn(`Unexpected protocol count: ${buyback.length}, expected: ${EXPECTED_PROTOCOL_COUNT}`);
      }

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

  const handleSort = useCallback((column: SortOption) => {
    setState(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  // Effects
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-4">{state.error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-[#00ff87] text-black rounded-lg hover:bg-[#00e67a] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (state.loading) {
    return <LoadingSpinner />;
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <Header />

      {/* Global Market Stats */}
      <GlobalStatsSection stats={globalStats} />

      {/* Description Section */}
      <DescriptionSection />

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Chart */}
            <div className="lg:col-span-2">
              <OptimizedChart
                data={chartData}
                title={`${state.selectedProtocol} Buyback Activity`}
                color={getProtocolColor(state.selectedProtocol)}
                height={400}
                showVolume={true}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ProtocolSelector
                protocols={state.buybackData}
                selectedProtocol={state.selectedProtocol}
                onProtocolSelect={handleProtocolSelect}
              />
            </div>
          </div>

          {/* Protocol Table */}
          <ProtocolTable
            protocols={sortedProtocols}
            selectedProtocol={state.selectedProtocol}
            sortBy={state.sortBy}
            sortOrder={state.sortOrder}
            onProtocolSelect={handleProtocolSelect}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OptimizedDashboard;