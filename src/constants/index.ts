/**
 * Application Constants
 * Centralized configuration for maintainable and consistent values across the application
 */

// ===========================
// PROTOCOL CONFIGURATION
// ===========================

export const PROTOCOL_TOKENS = [
  'HYPE', 'JUP', 'AAVE', 'JTO', 'PUMP', 'DBR', 'FLUID'
] as const;

export type ProtocolToken = typeof PROTOCOL_TOKENS[number];

export const PROTOCOL_COLORS = {
  Hyperliquid: '#00D4AA',
  Jupiter: '#FFA500', 
  Aave: '#B6509E',
  Jito: '#FF6B35',
  'Pump.fun': '#FF1493',
  DeBridge: '#4A90E2',
  Fluid: '#00BFFF',
} as const;

export const COINGECKO_IDS = {
  HYPE: 'hyperliquid',
  JUP: 'jupiter-exchange-solana',
  AAVE: 'aave',
  JTO: 'jito-governance-token',
  PUMP: 'pump-fun-token',
  DBR: 'debridge',
  FLUID: 'fluid-tokens',
} as const;

// ===========================
// MOCK DATA CONFIGURATION
// ===========================

export const MOCK_PRICES = {
  hyperliquid: 19.3,
  'jupiter-exchange-solana': 0.6,
  aave: 192.0,
  'jito-governance-token': 5.0,
  'pump-fun-token': 0.165,
  debridge: 6.0,
  'fluid-tokens': 6.0,
} as const;

export const BASE_VOLUMES = {
  HYPE: 1200000000,
  JUP: 850000000,
  AAVE: 45000000,
  JTO: 320000000,
  PUMP: 180000000,
  DBR: 125000000,
  FLUID: 240000000,
} as const;

export const DAILY_ACTIVE_USERS = {
  HYPE: 2400000,
  JUP: 850000,
  AAVE: 180000,
  JTO: 425000,
  PUMP: 320000,
  DBR: 185000,
  FLUID: 275000,
} as const;

// ===========================
// UI CONFIGURATION
// ===========================

export const SORT_OPTIONS = ['marketCap', 'volume', 'change'] as const;
export type SortOption = typeof SORT_OPTIONS[number];

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = typeof SORT_ORDERS[number];

export const LOGO_SIZES = ['sm', 'md', 'lg'] as const;
export type LogoSize = typeof LOGO_SIZES[number];

export const LOGO_SIZE_CLASSES = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
} as const;

// ===========================
// API CONFIGURATION
// ===========================

export const API_ENDPOINTS = {
  COINGECKO_BASE: 'https://api.coingecko.com/api/v3',
  HYPERLIQUID: 'https://api.hyperliquid.xyz',
  JUPITER: 'https://quote-api.jup.ag',
  AAVE: 'https://aave-api-v2.aave.com',
} as const;

export const API_TIMEOUTS = {
  DEFAULT: 5000,
  LONG: 10000,
  SHORT: 3000,
} as const;

// ===========================
// CACHE CONFIGURATION
// ===========================

export const CACHE_DURATIONS = {
  SHORT: 1 * 60 * 1000,    // 1 minute
  MEDIUM: 5 * 60 * 1000,   // 5 minutes
  LONG: 15 * 60 * 1000,    // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

// ===========================
// DATABASE CONFIGURATION
// ===========================

export const LOCAL_STORAGE_KEYS = {
  BUYBACK_DATA: 'dao_buyback_data',
  HISTORICAL_DATA: 'dao_historical_data',
  USER_PREFERENCES: 'dao_user_preferences',
} as const;

export const EXPECTED_PROTOCOL_COUNT = 7;

// ===========================
// ANIMATION CONFIGURATION
// ===========================

export const ANIMATION_DURATIONS = {
  FAST: 0.2,
  NORMAL: 0.5,
  SLOW: 0.8,
} as const;

export const ANIMATION_DELAYS = {
  NONE: 0,
  SHORT: 0.2,
  MEDIUM: 0.4,
  LONG: 0.6,
  VERY_LONG: 0.8,
} as const;

// ===========================
// CHART CONFIGURATION
// ===========================

export const CHART_COLORS = {
  PRIMARY: '#00ff87',
  SECONDARY: '#00e67a',
  GRID: '#2a2a2a',
  BACKGROUND: '#0f0f0f',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#6b7280',
} as const;

export const CHART_HEIGHTS = {
  SMALL: 200,
  MEDIUM: 300,
  LARGE: 400,
  EXTRA_LARGE: 500,
} as const;

// ===========================
// THEME CONFIGURATION
// ===========================

export const THEME_COLORS = {
  BLACK: '#000000',
  DARK_BLACK: '#0a0a0a',
  MEDIUM_BLACK: '#0f0f0f',
  LIGHT_BLACK: '#1a1a1a',
  ACCENT_BLACK: '#151515',
  PRIMARY_GREEN: '#00ff87',
  SECONDARY_GREEN: '#00e67a',
  WARNING_YELLOW: '#fbbf24',
  ERROR_RED: '#ef4444',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#d1d5db',
  TEXT_MUTED: '#6b7280',
} as const;

// ===========================
// BRANDING CONFIGURATION
// ===========================

export const BRANDING = {
  APP_NAME: 'DAOTreasuries',
  TAGLINE: '',
  POWERED_BY: 'ExaGroup',
  DESCRIPTION: 'Explore comprehensive analytics on how decentralized autonomous organizations (DAOs) manage their treasuries through strategic token buybacks.',
} as const;

// ===========================
// VALIDATION CONSTANTS
// ===========================

export const VALIDATION_LIMITS = {
  MIN_PROTOCOL_COUNT: 1,
  MAX_PROTOCOL_COUNT: 20,
  MIN_PRICE: 0.000001,
  MAX_PRICE: 1000000,
  MIN_VOLUME: 0,
  MAX_VOLUME: 10000000000,
} as const;

// ===========================
// FORMAT CONFIGURATION
// ===========================

export const NUMBER_FORMATS = {
  CURRENCY_DECIMALS: 2,
  PERCENTAGE_DECIMALS: 2,
  VOLUME_DECIMALS: 1,
  PRICE_DECIMALS: 4,
} as const;

// ===========================
// LEGAL DISCLAIMER
// ===========================

export const LEGAL_DISCLAIMER = `Any references to token purchases are for informational purposes only, and only describe historical activity. This information should not be understood as a commitment to future token purchases for any reason. Any purchases may have the effect of preventing or retarding a decline in the market price of tokens and may stabilize, maintain or otherwise affect the market price of the tokens. As a result, the market price of the tokens may be higher than the price that otherwise might exist. Entities affiliated with the pump platform may purchase or sell tokens from time to time, but are not under no obligation to do so. If any purchases occur in the future, any such activity may be initiated, suspended, modified, or discontinued at any time, with or without notice. No token purchaser, holder or seller should rely on past purchases as an indication of future token purchases.` as const;