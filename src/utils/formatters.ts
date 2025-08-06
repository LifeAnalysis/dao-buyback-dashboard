/**
 * Utility functions for formatting numbers, currency, and other data
 */

import { NUMBER_FORMATS } from '../constants';

/**
 * Format a number as currency with appropriate suffixes (K, M, B)
 */
export const formatCurrency = (num: number, decimals: number = NUMBER_FORMATS.CURRENCY_DECIMALS): string => {
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(decimals)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(decimals)}K`;
  }
  return `$${num.toLocaleString(undefined, { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  })}`;
};

/**
 * Format a number as volume with appropriate suffixes
 */
export const formatVolume = (num: number, decimals: number = NUMBER_FORMATS.VOLUME_DECIMALS): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(decimals)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  return num.toLocaleString(undefined, { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  });
};

/**
 * Format a number as percentage
 */
export const formatPercentage = (
  num: number, 
  decimals: number = NUMBER_FORMATS.PERCENTAGE_DECIMALS,
  showSign: boolean = false
): string => {
  const sign = showSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(decimals)}%`;
};

/**
 * Format a number as a price with appropriate decimal places
 */
export const formatPrice = (num: number, decimals: number = NUMBER_FORMATS.PRICE_DECIMALS): string => {
  return `$${num.toFixed(decimals)}`;
};

/**
 * Format a large number with appropriate suffixes (for token amounts)
 */
export const formatTokenAmount = (num: number, decimals: number = 1): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(decimals)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  return num.toLocaleString(undefined, { 
    maximumFractionDigits: decimals 
  });
};

/**
 * Format a date for display
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a timestamp for charts
 */
export const formatChartDate = (timestamp: string | Date): string => {
  const d = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  });
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(past);
};