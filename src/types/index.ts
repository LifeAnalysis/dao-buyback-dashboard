import type { DAOToken, ProtocolToken, SortOption, SortOrder, LogoSize } from '../constants';

// Re-export types from constants for easier imports
export type { DAOToken, ProtocolToken, SortOption, SortOrder, LogoSize };

/**
 * Core data interfaces
 */

export interface BuybackData {
  dao: string;
  protocol: string; // deprecated, use dao instead
  token: string;
  totalRepurchased: number;
  totalValueUSD: number;
  circulatingSupplyPercent: number;
  estimatedAnnualBuyback: number;
  feeAllocationPercent: number;
  lastUpdated: string;
  monthlyData?: MonthlyBuyback[];
  // Aave-specific buyback data from TokenLogic
  aaveBuybacks?: AaveBuybackData;
  // PumpFun-specific buyback data from fees.pump.fun
  pumpFunBuybacks?: PumpFunBuybackData;
}

/**
 * Aave buyback data structure from TokenLogic API
 */
export interface AaveBuybackData {
  totalAavePurchased: number;
  latestAavePrice: number;
  startDate: string;
  buybackReturns: {
    costOfPurchase: number;
    currentValue: number;
    netProfitLoss: number;
    netProfitLossPercent: number;
    averageAavePrice: number;
  };
  holdingBalance: {
    aave: number;
    usdt: number;
    aEthUSDT: number;
    usdc: number;
    aEthUSDC: number;
    eth: number;
  };
  fundingDetails: {
    usdt: {
      allowance: number;
      remaining: number;
      transferred: number;
    };
    usdc: {
      allowance: number;
      remaining: number;
      transferred: number;
    };
  };
  cumulativeChart: AaveBuybackChartPoint[];
  transactions: AaveBuybackTransaction[];
}

export interface AaveBuybackChartPoint {
  timestamp: string;
  cumulativeValue: number;
  dailyAmount?: number;
}

export interface AaveBuybackTransaction {
  txHash: string;
  timestamp: string;
  aaveAmount: number;
  usdValue: number;
  price: number;
  funding: 'USDT' | 'USDC';
}

export interface MonthlyBuyback {
  month: string;
  amount: number;
  valueUSD: number;
}

export interface DAOConfig {
  name: string;
  token: string;
  color: string;
  icon: string;
  coingeckoId: string;
}

// Backward compatibility
export interface ProtocolConfig extends DAOConfig {}

export interface HistoricalDataPoint {
  timestamp: string;
  dao: string;
  protocol: string; // deprecated, use dao instead
  price: number;
  volume: number;
  marketCap: number;
  change24h?: number;
  cumulative_value?: number;
  cumulative_tokens?: number;
  value_usd?: number;
}

export interface ChartDataPoint {
  timestamp: string;
  buybacks: number;      // USD value of buybacks
  revenue: number;       // DAO revenue  
  tokensBought: number;  // Number of tokens bought back
  change24h: number;
}

/**
 * Component props interfaces
 */

export interface DAOLogoProps {
  dao: string;
  size?: LogoSize;
  className?: string;
}

// Backward compatibility
export interface ProtocolLogoProps {
  protocol: string;
  size?: LogoSize;
  className?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  title: string;
  color: string;
  height?: number;
  showVolume?: boolean;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
}

export interface DAOCardProps {
  dao: BuybackData;
  isSelected?: boolean;
  onClick?: () => void;
}

// Backward compatibility
export interface ProtocolCardProps {
  protocol: BuybackData;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * API and service interfaces
 */

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface MCPResponse {
  status: 'success' | 'error';
  data: any;
  timestamp: number;
  source: string;
}

/**
 * Database interfaces
 */

export interface BuybackRecord {
  id: number;
  dao: string;
  protocol: string; // deprecated, use dao instead
  token: string;
  timestamp: string;
  total_repurchased: number;
  total_value_usd: number;
  circulating_supply_percent: number;
  estimated_annual_buyback: number;
  fee_allocation_percent: number;
  price_per_token: number;
  trading_volume_24h: number;
  fee_generation_24h: number;
}

export interface HistoricalChart {
  id: number;
  dao: string;
  protocol: string; // deprecated, use dao instead
  token: string;
  timestamp: string;
  value_usd: number;
  tokens_amount: number;
  cumulative_value: number;
  cumulative_tokens: number;
}

/**
 * State management interfaces
 */

export interface DashboardState {
  buybackData: BuybackData[];
  historicalData: HistoricalDataPoint[];
  selectedDAO: string;
  selectedProtocol: string; // deprecated, use selectedDAO instead
  sortBy: SortOption;
  sortOrder: SortOrder;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface UserPreferences {
  selectedDAO: string;
  selectedProtocol: string; // deprecated, use selectedDAO instead
  sortBy: SortOption;
  sortOrder: SortOrder;
  theme: 'dark' | 'light';
  autoRefresh: boolean;
  refreshInterval: number;
}

/**
 * Animation and motion interfaces
 */

export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
  repeat?: number;
}

export interface MotionVariant {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit?: Record<string, any>;
  transition?: AnimationConfig;
}

/**
 * Global statistics interface
 */

export interface GlobalStats {
  totalCoins: number;
  totalMarketCap: number;
  total24hVolume: number;
  totalTokensBoughtBack: number;
  totalRevenue: number;
  dominanceMetrics?: Record<string, number>;
}

/**
 * Error handling types
 */

export type ErrorCode = 
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'VALIDATION_ERROR'
  | 'CACHE_ERROR'
  | 'DATABASE_ERROR'
  | 'UNKNOWN_ERROR';

export interface AppError extends Error {
  code: ErrorCode;
  details?: any;
  timestamp: number;
}

/**
 * Utility types
 */

export type NonEmptyArray<T> = [T, ...T[]];

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ValueOf<T> = T[keyof T];

/**
 * PumpFun buyback data structure from fees.pump.fun API
 */
export interface PumpFunBuybackData {
  // Total aggregated data
  totalBuybackSol: number;
  totalBuybackUsd: number;
  totalPumpTokensBought: number;
  totalDays: number;
  lastUpdated: string;
  
  // Daily breakdown
  dailyBuybacks: Record<string, PumpFunDailyData>;
  
  // Fee aggregates
  totalPumpFeesUsd: number;
  totalPumpFeesSol: number;
  totalPumpAmmFeesUsd: number;
  totalPumpAmmFeesSol: number;
  totalFeesUsd: number;
  totalFeesSol: number;
  
  // Volume aggregates
  totalPumpVolumeUsd: number;
  totalPumpAmmVolumeUsd: number;
  totalVolumeUsd: number;
}

export interface PumpFunDailyData {
  buybackSol: number;
  buybackUsd: number;
  transactionCount: number;
  pumpTokensBought: number;
  lastUpdated: string;
  pumpFeesUsd: number;
  pumpFeesSol: number;
  pumpAmmFeesUsd: number;
  pumpAmmFeesSol: number;
  totalFeesUsd: number;
  totalFeesSol: number;
  pumpVolumeUsd: number;
  pumpAmmVolumeUsd: number;
  totalVolumeUsd: number;
}

/**
 * Event handler types
 */

export type ClickHandler = (event: React.MouseEvent) => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type SubmitHandler = (event: React.FormEvent) => void;