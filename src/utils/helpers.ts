/**
 * Utility helper functions for common operations
 */

import { VALIDATION_LIMITS, PROTOCOL_COLORS, PROTOCOL_TOKENS, COINGECKO_IDS } from '../constants';
import type { ProtocolToken, SortOrder } from '../constants';

/**
 * Type guards and validation functions
 */

export const isValidProtocolToken = (token: string): token is ProtocolToken => {
  return PROTOCOL_TOKENS.includes(token as ProtocolToken);
};

export const isValidPrice = (price: number): boolean => {
  return price >= VALIDATION_LIMITS.MIN_PRICE && price <= VALIDATION_LIMITS.MAX_PRICE;
};

export const isValidVolume = (volume: number): boolean => {
  return volume >= VALIDATION_LIMITS.MIN_VOLUME && volume <= VALIDATION_LIMITS.MAX_VOLUME;
};

export const isValidProtocolCount = (count: number): boolean => {
  return count >= VALIDATION_LIMITS.MIN_PROTOCOL_COUNT && count <= VALIDATION_LIMITS.MAX_PROTOCOL_COUNT;
};

/**
 * Protocol-related helper functions
 */

export const getProtocolColor = (protocol: string): string => {
  return PROTOCOL_COLORS[protocol as keyof typeof PROTOCOL_COLORS] || '#16a34a';
};

export const getCoingeckoId = (token: ProtocolToken): string => {
  return COINGECKO_IDS[token];
};

export const getProtocolFromToken = (token: ProtocolToken): string => {
  const protocolMap: Record<ProtocolToken, string> = {
    HYPE: 'Hyperliquid',
    JUP: 'Jupiter',
    AAVE: 'Aave',
    JTO: 'Jito',
    PUMP: 'Pump.fun',
    DBR: 'DeBridge',
    FLUID: 'Fluid',
  };
  return protocolMap[token];
};

/**
 * Array manipulation utilities
 */

export const sortArray = <T>(
  array: T[],
  getValue: (item: T) => number,
  order: SortOrder = 'desc'
): T[] => {
  return [...array].sort((a, b) => {
    const aValue = getValue(a);
    const bValue = getValue(b);
    return order === 'desc' ? bValue - aValue : aValue - bValue;
  });
};

export const filterBySearch = <T>(
  array: T[],
  searchTerm: string,
  getSearchableText: (item: T) => string
): T[] => {
  if (!searchTerm.trim()) return array;
  
  const searchLower = searchTerm.toLowerCase();
  return array.filter(item => 
    getSearchableText(item).toLowerCase().includes(searchLower)
  );
};

/**
 * Date and time utilities
 */

export const generateDateRange = (days: number): Date[] => {
  const dates: Date[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  
  return dates;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isWithinLastDays = (date: Date, days: number): boolean => {
  const now = new Date();
  const daysAgo = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  return date >= daysAgo;
};

/**
 * Mathematical utilities
 */

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const generateVariance = (base: number, variancePercent: number = 0.2): number => {
  const variance = 1 + (Math.random() - 0.5) * 2 * variancePercent;
  return base * variance;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const roundToDecimals = (value: number, decimals: number): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Object manipulation utilities
 */

export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Error handling utilities
 */

export const createError = (message: string, code?: string): Error => {
  const error = new Error(message);
  if (code) {
    (error as any).code = code;
  }
  return error;
};

export const isNetworkError = (error: any): boolean => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('network') ||
         error?.message?.includes('timeout');
};

/**
 * Cache utilities
 */

export const createCacheKey = (...parts: (string | number)[]): string => {
  return parts.map(String).join('_');
};

export const isCacheExpired = (timestamp: number, duration: number): boolean => {
  return Date.now() - timestamp > duration;
};

/**
 * Animation utilities
 */

export const getStaggeredDelay = (index: number, baseDelay: number = 0.1): number => {
  return baseDelay * index;
};

export const easeInOut = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

/**
 * URL and navigation utilities
 */

export const buildQueryString = (params: Record<string, string | number | boolean>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

/**
 * Local storage utilities
 */

export const safeLocalStorageGet = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const safeLocalStorageSet = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

export const safeLocalStorageRemove = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};