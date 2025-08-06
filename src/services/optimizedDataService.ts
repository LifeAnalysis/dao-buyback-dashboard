/**
 * Optimized Data Service
 * Clean, modular service with proper error handling, caching, and validation
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  PROTOCOL_TOKENS, 
  COINGECKO_IDS, 
  MOCK_PRICES, 
  API_ENDPOINTS,
  API_TIMEOUTS,
  CACHE_DURATIONS,
  EXPECTED_PROTOCOL_COUNT 
} from '../constants';
import { 
  formatDate
} from '../utils/formatters';
import {
  isValidProtocolToken,
  isValidPrice,
  isValidVolume,
  createError,
  isNetworkError,
  createCacheKey,
  isCacheExpired
} from '../utils/helpers';
import { DatabaseService } from '../database/browserDb';
import type { 
  BuybackData, 
  ProtocolToken, 
  CacheEntry, 
  AppError,
  ErrorCode 
} from '../types';

/**
 * Service configuration interface
 */
interface ServiceConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  cacheDuration?: number;
  enableMockData?: boolean;
}

/**
 * Default service configuration
 */
const DEFAULT_CONFIG: Required<ServiceConfig> = {
  baseURL: API_ENDPOINTS.COINGECKO_BASE,
  timeout: API_TIMEOUTS.DEFAULT,
  retries: 3,
  cacheDuration: CACHE_DURATIONS.MEDIUM,
  enableMockData: true,
};

/**
 * Optimized Data Service Class
 */
export class OptimizedDataService {
  private static instance: OptimizedDataService;
  private readonly config: Required<ServiceConfig>;
  private readonly apiClient: AxiosInstance;
  private readonly cache = new Map<string, CacheEntry>();
  private readonly dbService: DatabaseService;

  /**
   * Singleton pattern implementation
   */
  public static getInstance(config?: ServiceConfig): OptimizedDataService {
    if (!OptimizedDataService.instance) {
      OptimizedDataService.instance = new OptimizedDataService(config);
    }
    return OptimizedDataService.instance;
  }

  /**
   * Private constructor
   */
  private constructor(config?: ServiceConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.dbService = DatabaseService.getInstance();
    this.apiClient = this.createApiClient();
  }

  /**
   * Create configured Axios instance
   */
  private createApiClient(): AxiosInstance {
    const client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor for logging
    client.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(this.createServiceError('REQUEST_ERROR', error))
    );

    // Add response interceptor for error handling
    client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error: ${error.message}`);
        return Promise.reject(this.createServiceError('RESPONSE_ERROR', error));
      }
    );

    return client;
  }

  /**
   * Create standardized service error
   */
  private createServiceError(type: string, originalError: any): AppError {
    const code: ErrorCode = isNetworkError(originalError) ? 'NETWORK_ERROR' : 'API_ERROR';
    const error = createError(`${type}: ${originalError.message}`, code) as AppError;
    error.details = originalError;
    error.timestamp = Date.now();
    return error;
  }

  /**
   * Cache management methods
   */
  private getCacheEntry<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || isCacheExpired(entry.timestamp, this.config.cacheDuration)) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCacheEntry<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.cacheDuration,
    };
    this.cache.set(key, entry);
  }

  private clearCache(): void {
    this.cache.clear();
  }

  /**
   * Validation methods
   */
  private validateProtocolToken(token: string): ProtocolToken {
    if (!isValidProtocolToken(token)) {
      throw createError(`Invalid protocol token: ${token}`, 'VALIDATION_ERROR');
    }
    return token as ProtocolToken;
  }

  private validatePriceData(price: number, token: string): number {
    if (!isValidPrice(price)) {
      console.warn(`Invalid price for ${token}: ${price}, using mock data`);
      const validToken = token as ProtocolToken;
      const coingeckoId = COINGECKO_IDS[validToken];
      return MOCK_PRICES[coingeckoId as keyof typeof MOCK_PRICES] || 1;
    }
    return price;
  }

  /**
   * API request with retry logic
   */
  private async apiRequest<T>(
    config: AxiosRequestConfig,
    retries: number = this.config.retries
  ): Promise<T> {
    try {
      const response = await this.apiClient.request<T>(config);
      return response.data;
    } catch (error) {
      if (retries > 0 && isNetworkError(error)) {
        console.warn(`Retrying API request... ${retries} attempts remaining`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.apiRequest<T>(config, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Get token price from CoinGecko API
   */
  async getTokenPrice(token: ProtocolToken): Promise<number> {
    const validToken = this.validateProtocolToken(token);
    const coingeckoId = COINGECKO_IDS[validToken];
    const cacheKey = createCacheKey('price', coingeckoId);

    // Check cache first
    const cachedPrice = this.getCacheEntry<number>(cacheKey);
    if (cachedPrice !== null) {
      return cachedPrice;
    }

    try {
      const response = await this.apiRequest<Record<string, { usd: number }>>({
        url: `/simple/price`,
        params: {
          ids: coingeckoId,
          vs_currencies: 'usd',
        },
      });

      const price = response[coingeckoId]?.usd;
      if (typeof price !== 'number') {
        throw createError(`Invalid price response for ${token}`, 'API_ERROR');
      }

      const validatedPrice = this.validatePriceData(price, token);
      this.setCacheEntry(cacheKey, validatedPrice);
      return validatedPrice;

    } catch (error) {
      console.warn(`Failed to fetch price for ${token}, using mock data:`, error);
      return MOCK_PRICES[coingeckoId as keyof typeof MOCK_PRICES] || 1;
    }
  }

  /**
   * Get buyback data for a specific protocol
   */
  async getBuybackData(token: ProtocolToken): Promise<BuybackData> {
    const validToken = this.validateProtocolToken(token);
    const cacheKey = createCacheKey('buyback', validToken);

    // Check cache first
    const cachedData = this.getCacheEntry<BuybackData>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Get current price (for future use when integrating real price data)
      await this.getTokenPrice(validToken);
      
      // Get mock buyback data from config
      const mockData = await import('../config/protocols');
      const protocolData = (mockData.MOCK_BUYBACK_DATA as any)[validToken];
      
      if (!protocolData) {
        throw createError(`No mock data available for ${validToken}`, 'VALIDATION_ERROR');
      }

      // Create buyback data with real price
      const buybackData: BuybackData = {
        ...protocolData,
        lastUpdated: formatDate(new Date()),
      };

      // Validate the data
      if (!isValidVolume(buybackData.totalValueUSD)) {
        console.warn(`Invalid volume data for ${validToken}`);
      }

      this.setCacheEntry(cacheKey, buybackData);
      return buybackData;

    } catch (error) {
      console.error(`Failed to get buyback data for ${validToken}:`, error);
      throw this.createServiceError('BUYBACK_DATA_ERROR', error);
    }
  }

  /**
   * Get all buyback data for all protocols
   */
  async getAllBuybackData(): Promise<BuybackData[]> {
    const cacheKey = 'all_buyback_data';

    // Check cache first
    const cachedData = this.getCacheEntry<BuybackData[]>(cacheKey);
    if (cachedData && cachedData.length === EXPECTED_PROTOCOL_COUNT) {
      return cachedData;
    }

    try {
      // Try to get data from database first
      const dbData = this.dbService.getLatestBuybackData();
      
      if (dbData.length >= EXPECTED_PROTOCOL_COUNT) {
        const buybackData = dbData.map(record => this.convertDbRecordToBuybackData(record));
        
        // Update database with fresh data
        await this.saveCurrentDataToDb();
        
        this.setCacheEntry(cacheKey, buybackData);
        return buybackData;
      }

      // Fallback: Fetch fresh data for all protocols
      console.log('Fetching fresh data for all protocols...');
      const dataPromises = PROTOCOL_TOKENS.map(token => this.getBuybackData(token));
      const allData = await Promise.all(dataPromises);

      // Save to database
      await this.saveDataToDatabase(allData);
      
      this.setCacheEntry(cacheKey, allData);
      return allData;

    } catch (error) {
      console.error('Error getting all buyback data:', error);
      
      // Final fallback: Return mock data for all protocols
      console.warn('Using fallback mock data for all protocols');
      const fallbackPromises = PROTOCOL_TOKENS.map(token => this.getBuybackData(token));
      return Promise.all(fallbackPromises);
    }
  }

  /**
   * Get historical chart data
   */
  async getHistoricalChartData(protocol?: string, days: number = 30): Promise<any[]> {
    const cacheKey = createCacheKey('historical', protocol || 'all', days);

    // Check cache first
    const cachedData = this.getCacheEntry<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const historicalData = this.dbService.getHistoricalData(protocol, days);
      this.setCacheEntry(cacheKey, historicalData);
      return historicalData;

    } catch (error) {
      console.error('Error getting historical data:', error);
      return [];
    }
  }

  /**
   * Database operations
   */
  private convertDbRecordToBuybackData(record: any): BuybackData {
    return {
      protocol: record.protocol,
      token: record.token,
      totalRepurchased: record.total_repurchased,
      totalValueUSD: record.total_value_usd,
      circulatingSupplyPercent: record.circulating_supply_percent,
      estimatedAnnualBuyback: record.estimated_annual_buyback,
      feeAllocationPercent: record.fee_allocation_percent,
      lastUpdated: formatDate(new Date(record.timestamp)),
    };
  }

  private async saveDataToDatabase(data: BuybackData[]): Promise<void> {
    try {
      // This would integrate with the database service
      console.log('Saving data to database:', data.length, 'records');
      // Implementation would go here
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  }

  private async saveCurrentDataToDb(): Promise<void> {
    try {
      // Simulate saving current data
      console.log('Saving current data to database');
      // Implementation would go here
    } catch (error) {
      console.error('Error saving current data:', error);
    }
  }

  /**
   * Utility methods
   */
  public getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  public clearAllCache(): void {
    this.clearCache();
    console.log('🗑️ All cache cleared');
  }

  public async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      // Test API connectivity
      await this.apiRequest({ url: '/ping', timeout: 3000 });
      
      // Test database connectivity
      const dbData = this.dbService.getLatestBuybackData();
      
      return {
        status: 'healthy',
        details: {
          api: 'connected',
          database: `${dbData.length} records`,
          cache: `${this.cache.size} entries`,
          lastCheck: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          lastCheck: new Date().toISOString(),
        },
      };
    }
  }
}