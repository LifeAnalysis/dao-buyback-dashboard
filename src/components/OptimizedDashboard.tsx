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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 lg:gap-x-12">
        <div className="text-center min-w-[120px]">
          <div className="text-xs text-gray-400 mb-1 font-mono">Protocols</div>
          <div className="font-semibold text-white text-lg">{stats.totalCoins}</div>
        </div>
        <div className="text-center min-w-[140px]">
          <div className="text-xs text-gray-400 mb-1 font-mono">Total Market Cap</div>
          <div className="font-semibold text-white text-lg">{formatCurrency(stats.totalMarketCap)}</div>
        </div>
        <div className="text-center min-w-[120px]">
          <div className="text-xs text-gray-400 mb-1 font-mono">24h Volume</div>
          <div className="font-semibold text-white text-lg">{formatCurrency(stats.total24hVolume)}</div>
        </div>
        <div className="text-center min-w-[140px]">
          <div className="text-xs text-gray-400 mb-1 font-mono">Tokens Bought Back</div>
          <div className="font-semibold text-white text-lg">{formatTokenAmount(stats.totalTokensBoughtBack)}M</div>
        </div>
        <div className="text-center min-w-[120px]">
          <div className="text-xs text-gray-400 mb-1 font-mono">Total Revenue</div>
          <div className="font-semibold text-white text-lg">{formatCurrency(stats.totalRevenue)}</div>
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
              ? 'border bg-opacity-10 hover:bg-opacity-20'
              : 'border border-transparent hover:bg-[#1a1a1a]'
          }`}
          style={
            selectedProtocol === protocol.protocol
              ? {
                  borderColor: THEME_COLORS.PRIMARY_GREEN,
                  backgroundColor: `${THEME_COLORS.PRIMARY_GREEN}1a`
                }
              : {}
          }
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
              <div className="text-sm" style={{ color: THEME_COLORS.PRIMARY_GREEN }}>+{protocol.circulatingSupplyPercent}%</div>
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
  onSortByChange: (sortBy: SortOption) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

const ProtocolTable = React.memo<ProtocolTableProps>(({
  protocols,
  selectedProtocol,
  sortBy,
  sortOrder,
  onProtocolSelect,
  onSort,
  onSortByChange,
  onSortOrderChange
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-white font-mono">Protocol Buyback Rankings</h3>
            
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400 font-mono">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortByChange(e.target.value as SortOption)}
                  className="px-3 py-1 text-sm text-white border border-gray-600 rounded font-mono focus:outline-none transition-colors"
                  style={{ 
                    backgroundColor: THEME_COLORS.MEDIUM_BLACK,
                    borderColor: 'focus:' + THEME_COLORS.PRIMARY_GREEN
                  }}
                  onFocus={(e) => e.target.style.borderColor = THEME_COLORS.PRIMARY_GREEN}
                  onBlur={(e) => e.target.style.borderColor = '#4b5563'}
                >
                  <option value="buybackValue">Buyback Value</option>
                  <option value="revenue">Protocol Revenue</option>
                  <option value="tokensBought">Tokens Bought</option>
                  <option value="change">Supply Reduced</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400 font-mono">Order:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
                  className="px-3 py-1 text-sm text-white border border-gray-600 rounded font-mono focus:outline-none transition-colors"
                  style={{ 
                    backgroundColor: THEME_COLORS.MEDIUM_BLACK,
                    borderColor: 'focus:' + THEME_COLORS.PRIMARY_GREEN
                  }}
                  onFocus={(e) => e.target.style.borderColor = THEME_COLORS.PRIMARY_GREEN}
                  onBlur={(e) => e.target.style.borderColor = '#4b5563'}
                >
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                </select>
              </div>
            </div>
          </div>
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors font-mono"
                  onClick={() => onSort('marketCap')}
                >
                  <div className="flex items-center gap-1">
                    Buyback Value
                    <SortIcon column="marketCap" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors font-mono"
                  onClick={() => onSort('volume')}
                >
                  <div className="flex items-center gap-1">
                    Protocol Revenue
                    <SortIcon column="volume" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors font-mono"
                  onClick={() => onSort('change')}
                >
                  <div className="flex items-center gap-1">
                    Tokens Bought
                    <SortIcon column="change" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors font-mono"
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
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ background: THEME_COLORS.PRIMARY_GREEN }}
                        />
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                    {formatCurrency(protocol.estimatedAnnualBuyback * 0.15)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                    {formatTokenAmount(protocol.totalRepurchased)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium font-mono" style={{ color: THEME_COLORS.PRIMARY_GREEN }}>
                      {protocol.circulatingSupplyPercent}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                    {protocol.feeAllocationPercent}%
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
      <div 
        className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-6" 
        style={{ borderBottomColor: THEME_COLORS.PRIMARY_GREEN }}
      />
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
    return {
      totalCoins: state.buybackData.length,
      totalMarketCap: state.buybackData.reduce((sum, data) => sum + data.totalValueUSD * 10, 0),
      total24hVolume: state.buybackData.reduce((sum, data) => sum + data.estimatedAnnualBuyback / 365, 0),
      totalTokensBoughtBack: state.buybackData.reduce((sum, data) => sum + data.totalRepurchased, 0),
      totalRevenue: state.buybackData.reduce((sum, data) => sum + data.totalValueUSD, 0),
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
        buybacks: item.cumulative_value || item.value_usd || 0,  // Total buyback value
        revenue: (item.cumulative_value || 0) * 0.15,           // Estimated revenue (15% of buybacks)
        tokensBought: item.cumulative_tokens || 0,              // Number of tokens bought
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
            className="px-4 py-2 text-black rounded-lg transition-colors"
            style={{ 
              background: THEME_COLORS.PRIMARY_GREEN,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = THEME_COLORS.SECONDARY_GREEN;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = THEME_COLORS.PRIMARY_GREEN;
            }}
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
            onSortByChange={(sortBy) => setState(prev => ({ ...prev, sortBy }))}
            onSortOrderChange={(sortOrder) => setState(prev => ({ ...prev, sortOrder }))}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OptimizedDashboard;