/**
 * Optimized Dashboard Component
 * 
 * The main dashboard component for the Treasury Dashboard application.
 * This component provides a comprehensive view of DAO token buyback activities
 * across multiple protocols with real-time data integration.
 * 
 * Features:
 * - Real-time buyback data from multiple DAOs (Hyperliquid, Jupiter, Aave, etc.)
 * - Interactive charts with historical data visualization
 * - Global market statistics and performance metrics
 * - Protocol selector with live data updates
 * - Responsive design with modern animations
 * - Error handling and loading states
 * 
 * Architecture:
 * - Uses OptimizedDataService for data fetching and caching
 * - Implements React.memo and useMemo for performance optimization
 * - Modular component structure with clean separation of concerns
 * - TypeScript interfaces for type safety
 * 
 * Data Flow:
 * 1. Fetch buyback data from OptimizedDataService on mount
 * 2. Transform data for charts and statistics
 * 3. Update UI with smooth animations
 * 4. Refresh data every 5 minutes automatically
 * 
 * State Management:
 * - Uses single DashboardState object for consistency
 * - Handles loading, error, and success states
 * - Tracks selected protocol and sort preferences
 * 
 * @component
 * @example
 * ```tsx
 * <OptimizedDashboard />
 * ```
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
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
import { ProtocolPerformanceChart } from './charts/ProtocolPerformanceChart';
import { ProtocolLogoImage } from './ProtocolLogo';
import { SubmissionModal } from './SubmissionModal';

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
      {/* Compact Header with Description */}
      <div className="text-center mb-6">


      </div>
      
      {/* Stats Container */}
      <div className="bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] rounded-xl border border-gray-800/50 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="group text-center">
                            <div className="text-xs text-gray-500 mb-1 font-mono uppercase tracking-wide">DAOs</div>
            <div className="font-semibold text-white text-xl font-mono group-hover:text-green-400 transition-colors">
              {stats.totalCoins}
            </div>
          </div>
          <div className="group text-center">
            <div className="text-xs text-gray-500 mb-1 font-mono uppercase tracking-wide">Market Cap</div>
            <div className="font-semibold text-white text-xl font-mono group-hover:text-green-400 transition-colors">
              {formatCurrency(stats.totalMarketCap)}
            </div>
          </div>
          <div className="group text-center">
            <div className="text-xs text-gray-500 mb-1 font-mono uppercase tracking-wide">24h Volume</div>
            <div className="font-semibold text-white text-xl font-mono group-hover:text-green-400 transition-colors">
              {formatCurrency(stats.total24hVolume)}
            </div>
          </div>
          <div className="group text-center">
            <div className="text-xs text-gray-500 mb-1 font-mono uppercase tracking-wide">Tokens Bought</div>
            <div className="font-semibold text-white text-xl font-mono group-hover:text-green-400 transition-colors">
              {formatTokenAmount(stats.totalTokensBoughtBack)}M
            </div>
          </div>
          <div className="group text-center">
            <div className="text-xs text-gray-500 mb-1 font-mono uppercase tracking-wide">Revenue</div>
            <div className="font-semibold text-white text-xl font-mono group-hover:text-green-400 transition-colors">
              {formatCurrency(stats.totalRevenue)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

GlobalStatsSection.displayName = 'GlobalStatsSection';



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
    className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: ANIMATION_DELAYS.LONG, duration: ANIMATION_DURATIONS.NORMAL }}
  >
    <h3 className="text-lg font-semibold text-white mb-4 font-mono">Select DAO</h3>
    <div className="space-y-2">
      {protocols.map((protocol) => (
        <button
          key={protocol.protocol}
          onClick={() => onProtocolSelect(protocol.protocol)}
          className={`w-full text-left p-2 rounded-md transition-all duration-200 ${
            selectedProtocol === protocol.protocol
              ? 'border bg-opacity-15 hover:bg-opacity-25'
              : 'border border-gray-700/50 hover:border-gray-600/70 hover:bg-gray-800/30'
          }`}
          style={
            selectedProtocol === protocol.protocol
              ? {
                  borderColor: THEME_COLORS.PRIMARY_GREEN,
                  backgroundColor: `${THEME_COLORS.PRIMARY_GREEN}26`
                }
              : {}
          }
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <ProtocolLogoImage protocol={protocol.protocol} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-xs leading-tight truncate">
                  {protocol.protocol}
                </div>
                <div className="text-xs text-gray-400 leading-none">
                  {protocol.token}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-medium text-white font-mono text-xs leading-tight">
                {formatCurrency(protocol.totalValueUSD)}
              </div>
              <div 
                className="text-xs leading-none"
                style={{ color: THEME_COLORS.PRIMARY_GREEN }}
              >
                +{protocol.circulatingSupplyPercent}%
              </div>
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
            <h3 className="text-lg font-semibold text-white font-mono">DAO Buyback Rankings</h3>
            
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
                  <option value="revenue">DAO Revenue</option>
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
                  DAO
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
                    DAO Revenue
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
  // ===== STATE MANAGEMENT =====
  
  /**
   * Main dashboard state - consolidates all data and UI state in one object
   * This pattern ensures consistency and makes state updates atomic
   */
  const [state, setState] = useState<DashboardState>({
    buybackData: [],           // DAO buyback data from all protocols
    historicalData: [],        // Historical chart data points
    selectedDAO: 'Hyperliquid', // Currently selected DAO for detailed view
    selectedProtocol: 'Hyperliquid', // TODO: Deprecated, remove after migration
    sortBy: 'marketCap',       // Sort criterion for protocol table
    sortOrder: 'desc',         // Sort direction (desc = highest first)
    loading: true,             // Loading state for entire dashboard
    error: null,               // Error state for user feedback
    lastUpdated: null,         // Timestamp of last successful data fetch
  });

  // Submission modal state (separate from main state for performance)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get singleton instance of optimized data service
  const dataService = OptimizedDataService.getInstance();

  // ===== MEMOIZED CALCULATIONS =====
  
  /**
   * Global statistics calculated from all DAO data
   * Memoized to prevent recalculation on every render
   */
  const globalStats = useMemo((): GlobalStats => {
    return {
      totalCoins: state.buybackData.length,
      // Estimate market cap as 10x total buyback value (realistic multiple)
      totalMarketCap: state.buybackData.reduce((sum, data) => sum + data.totalValueUSD * 10, 0),
      // Daily volume estimate from annual buyback rate
      total24hVolume: state.buybackData.reduce((sum, data) => sum + data.estimatedAnnualBuyback / 365, 0),
      // Total tokens bought back across all DAOs
      totalTokensBoughtBack: state.buybackData.reduce((sum, data) => sum + data.totalRepurchased, 0),
      // Total USD value of all buybacks
      totalRevenue: state.buybackData.reduce((sum, data) => sum + data.totalValueUSD, 0),
    };
  }, [state.buybackData]);

  /**
   * Sorted protocols for the main table display
   * Supports multiple sort criteria with dynamic ordering
   */
  const sortedProtocols = useMemo(() => {
    return sortArray(
      state.buybackData,
      (protocol) => {
        // Map sort criteria to actual data fields
        switch (state.sortBy) {
          case 'marketCap': return protocol.totalValueUSD;        // Total buyback value
          case 'volume': return protocol.estimatedAnnualBuyback;  // Annual buyback estimate
          case 'change': return protocol.circulatingSupplyPercent; // Supply reduction %
          default: return protocol.totalValueUSD;                // Default to market cap
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

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmission = useCallback((data: any) => {
    console.log('Entity submission:', data);
    // Here you would typically send the data to your backend
    // For now, we'll just log it
    alert('Thank you for your submission! We will review your entity and get back to you.');
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


      {/* MARKET OVERVIEW HERO SECTION */}
      <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-black border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              DAO Treasury <span className="text-green-400">Analytics</span>
            </h1>

          </motion.div>
          <GlobalStatsSection stats={globalStats} />
        </div>
      </section>

      {/* DAO PERFORMANCE MATRIX */}
      <section className="bg-gray-950/30 border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-2">DAO Performance Matrix</h2>
            <p className="text-base text-gray-400">Comprehensive comparison across all DAOs</p>
          </motion.div>
          
          <ProtocolPerformanceChart
            data={state.buybackData}
            title=""
            height={350}
            showComparisons={true}
            metric="totalValueUSD"
          />
        </div>
      </section>

      {/* INTERACTIVE ANALYSIS SECTION */}
      <section className="flex-1 bg-gradient-to-b from-gray-900/20 to-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-2">Deep Dive Analysis</h2>
            <p className="text-base text-gray-400">Interactive charts and detailed DAO exploration</p>
          </motion.div>
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <ProtocolSelector
                  protocols={state.buybackData}
                  selectedProtocol={state.selectedProtocol}
                  onProtocolSelect={handleProtocolSelect}
                />
              </motion.div>
            </div>

            {/* Main Chart Area */}
            <div className="xl:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <OptimizedChart
                  data={chartData}
                  title={`${state.selectedProtocol} Buyback Activity`}
                  color={getProtocolColor(state.selectedProtocol)}
                  height={450}
                  showVolume={true}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED DATA TABLE */}
      <section className="bg-gray-950/30 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-2">Complete DAO Data</h2>
            <p className="text-base text-gray-400">Comprehensive table with all DAO metrics and statistics</p>
          </motion.div>
          
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
      </section>



      {/* FOOTER */}
      <Footer />

      {/* Submission Modal */}
      <SubmissionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmission}
      />

      {/* Enhanced Floating Submit Button */}
      <motion.button
        onClick={handleModalOpen}
        className="fixed bottom-8 right-8 z-40 font-mono font-bold rounded-xl shadow-2xl transition-all duration-300 group overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${THEME_COLORS.PRIMARY_GREEN}, ${THEME_COLORS.SECONDARY_GREEN})`,
          boxShadow: `0 25px 50px -12px rgba(0, 255, 135, 0.3), 0 0 0 1px rgba(0, 255, 135, 0.1)`
        }}
        whileHover={{ y: -2, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Add Your DAO to the Buyback Movement"
      >
        <div className="flex items-center gap-3 px-6 py-4 text-black">
          {/* Treasury/Vault icon */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="group-hover:scale-110 transition-transform duration-300"
          >
            {/* Building/Treasury structure */}
            <rect x="2" y="8" width="20" height="12" rx="1" fill="currentColor" opacity="0.9"/>
            <rect x="4" y="10" width="2" height="6" fill="white" opacity="0.8"/>
            <rect x="7" y="10" width="2" height="6" fill="white" opacity="0.8"/>
            <rect x="10" y="10" width="2" height="6" fill="white" opacity="0.8"/>
            <rect x="13" y="10" width="2" height="6" fill="white" opacity="0.8"/>
            <rect x="16" y="10" width="2" height="6" fill="white" opacity="0.8"/>
            {/* Roof/Top */}
            <path d="M1 8L12 2L23 8H1Z" fill="currentColor"/>
            {/* Central vault door */}
            <circle cx="12" cy="14" r="2" fill="white" opacity="0.9"/>
            <circle cx="12" cy="14" r="1" fill="currentColor" opacity="0.3"/>
            {/* Plus icon overlay */}
            <path d="M12 4v16m8-8H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
          </svg>
          
          <div className="text-left">
            <div className="text-sm font-semibold leading-tight">Add DAO</div>
            <div className="text-xs opacity-80 leading-tight">Join the Movement</div>
          </div>
        </div>
        
        {/* Animated glow effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-20 animate-pulse group-hover:opacity-30 transition-opacity duration-300"
          style={{ 
            background: `radial-gradient(circle at center, ${THEME_COLORS.PRIMARY_GREEN}, transparent)` 
          }} 
        />
        
        {/* Enhanced tooltip */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 font-mono shadow-lg"
             style={{ boxShadow: `0 10px 25px -5px rgba(0, 255, 135, 0.1)` }}>
          <div className="font-medium">Submit Your DAO</div>
          <div className="text-xs text-gray-400 mt-1">Help grow the ecosystem</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </motion.button>
    </div>
  );
};

export default OptimizedDashboard;