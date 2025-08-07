import axios from 'axios';
import { BuybackData } from '../types';
import { MOCK_BUYBACK_DATA } from '../config/protocols';
import { DatabaseService, BuybackRecord, HistoricalChart } from '../database/browserDb';
import { format } from 'date-fns';

export class DataService {
  private static instance: DataService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private dbService: DatabaseService;

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key);
    return cached ? Date.now() - cached.timestamp < this.CACHE_DURATION : false;
  }

  async getTokenPrice(coingeckoId: string): Promise<number> {
    const cacheKey = `price_${coingeckoId}`;
    
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      // Try to fetch from CoinGecko API
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
        { timeout: 5000 }
      );
      
      const price = response.data[coingeckoId]?.usd || 0;
      this.cache.set(cacheKey, { data: price, timestamp: Date.now() });
      return price;
    } catch (error) {
      console.warn(`Failed to fetch price for ${coingeckoId}:`, error);
      // Return mock prices if API fails
      const mockPrices: { [key: string]: number } = {
        'hyperliquid': 19.3,
        'jupiter-exchange-solana': 0.6,
        'aave': 192.0,
        'jito-governance-token': 5.0,
        'pump-fun-token': 0.165,
        'debridge': 6.0,
        'fluid-tokens': 6.0
      };
      return mockPrices[coingeckoId] || 1;
    }
  }

  async getBuybackData(token: string): Promise<BuybackData> {
    const cacheKey = `buyback_${token}`;
    
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      // Special handling for AAVE - fetch real data from TokenLogic
      if (token === 'AAVE') {
        const aaveScrapingService = await import('./aaveScrapingService').then(m => m.AaveScrapingService.getInstance());
        
        try {
          const aaveBuybackData = await aaveScrapingService.getAaveBuybackData();
          
          // Transform real Aave data to BuybackData format
          const updatedData: BuybackData = {
            dao: 'Aave',
            protocol: 'Aave',
            token: 'AAVE',
            totalRepurchased: aaveBuybackData.totalAavePurchased,
            totalValueUSD: aaveBuybackData.buybackReturns.currentValue,
            circulatingSupplyPercent: (aaveBuybackData.totalAavePurchased / 16000000) * 100, // AAVE total supply ~16M
            estimatedAnnualBuyback: aaveBuybackData.buybackReturns.netProfitLoss * 4, // Quarterly extrapolation
            feeAllocationPercent: 100, // Aave allocates 100% of eligible fees to buybacks
            lastUpdated: new Date().toISOString().split('T')[0],
            aaveBuybacks: aaveBuybackData,
            monthlyData: [
              { month: 'Jan 2025', amount: aaveBuybackData.totalAavePurchased * 0.3, valueUSD: aaveBuybackData.buybackReturns.currentValue * 0.3 },
              { month: 'Feb 2025', amount: aaveBuybackData.totalAavePurchased * 0.35, valueUSD: aaveBuybackData.buybackReturns.currentValue * 0.35 },
              { month: 'Mar 2025', amount: aaveBuybackData.totalAavePurchased * 0.35, valueUSD: aaveBuybackData.buybackReturns.currentValue * 0.35 }
            ]
          };

          this.cache.set(cacheKey, { data: updatedData, timestamp: Date.now() });
          return updatedData;
        } catch (aaveError) {
          console.warn('Failed to fetch real Aave data, falling back to mock:', aaveError);
          // Fall through to mock data if real data fails
        }
      }

      // Special handling for PUMP - fetch real data from fees.pump.fun
      if (token === 'PUMP') {
        const pumpFunScrapingService = await import('./pumpFunScrapingService').then(m => m.PumpFunScrapingService.getInstance());
        
        try {
          const pumpFunBuybackData = await pumpFunScrapingService.getPumpFunBuybackData();
          
          // Calculate current PUMP price from recent buybacks
          const recentDailyData = Object.values(pumpFunBuybackData.dailyBuybacks).slice(-3);
          const avgPumpPrice = recentDailyData.reduce((sum, day) => {
            return sum + (day.buybackUsd / day.pumpTokensBought);
          }, 0) / recentDailyData.length;

          // Calculate total PUMP supply (estimated at 1B tokens)
          const totalSupply = 1000000000;
          const circulatingPercent = (pumpFunBuybackData.totalPumpTokensBought / totalSupply) * 100;

          // Transform real PumpFun data to BuybackData format
          const updatedData: BuybackData = {
            dao: 'Pump.fun',
            protocol: 'Pump.fun',
            token: 'PUMP',
            totalRepurchased: pumpFunBuybackData.totalPumpTokensBought,
            totalValueUSD: pumpFunBuybackData.totalBuybackUsd,
            circulatingSupplyPercent: circulatingPercent,
            estimatedAnnualBuyback: (pumpFunBuybackData.totalBuybackUsd / pumpFunBuybackData.totalDays) * 365, // Daily average * 365
            feeAllocationPercent: 100, // PumpFun allocates fees to buybacks
            lastUpdated: new Date().toISOString().split('T')[0],
            pumpFunBuybacks: pumpFunBuybackData,
            monthlyData: [
              { month: 'Jan 2025', amount: pumpFunBuybackData.totalPumpTokensBought * 0.4, valueUSD: pumpFunBuybackData.totalBuybackUsd * 0.4 },
              { month: 'Feb 2025', amount: pumpFunBuybackData.totalPumpTokensBought * 0.35, valueUSD: pumpFunBuybackData.totalBuybackUsd * 0.35 },
              { month: 'Mar 2025', amount: pumpFunBuybackData.totalPumpTokensBought * 0.25, valueUSD: pumpFunBuybackData.totalBuybackUsd * 0.25 }
            ]
          };

          this.cache.set(cacheKey, { data: updatedData, timestamp: Date.now() });
          return updatedData;
        } catch (pumpFunError) {
          console.warn('Failed to fetch real PumpFun data, falling back to mock:', pumpFunError);
          // Fall through to mock data if real data fails
        }
      }

      // For all other tokens or if Aave real data fails, use mock data
      const mockData = MOCK_BUYBACK_DATA[token as keyof typeof MOCK_BUYBACK_DATA];
      if (!mockData) {
        throw new Error(`No data available for token: ${token}`);
      }

      // Add some randomness to simulate real-time updates
      const variance = 0.95 + Math.random() * 0.1; // ±5% variance
      const updatedData: BuybackData = {
        ...mockData,
        dao: mockData.protocol, // Add dao field for compatibility
        totalRepurchased: Math.floor(mockData.totalRepurchased * variance),
        totalValueUSD: Math.floor(mockData.totalValueUSD * variance),
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      this.cache.set(cacheKey, { data: updatedData, timestamp: Date.now() });
      return updatedData;
    } catch (error) {
      console.error(`Failed to fetch buyback data for ${token}:`, error);
      throw error;
    }
  }

  async getAllBuybackData(): Promise<BuybackData[]> {
    try {
      // Try to get data from database first
      const dbData = this.dbService.getLatestBuybackData();
      
      if (dbData.length > 0) {
        // Convert database records to BuybackData format
        const buybackData = dbData.map(record => this.convertDbRecordToBuybackData(record));
        
        // Save new data to database (simulate real-time updates)
        await this.saveCurrentDataToDb();
        
        return buybackData;
      } else {
        // Fallback to fetching fresh data if no DB data
        const tokens = ['HYPE', 'JUP', 'AAVE', 'JTO', 'PUMP', 'DBR', 'FLUID'];
        const promises = tokens.map(token => this.getBuybackData(token));
        const data = await Promise.all(promises);
        
        // Save to database
        await this.saveDataToDatabase(data);
        
        return data;
      }
    } catch (error) {
      console.error('Error getting buyback data:', error);
      // Fallback to mock data
      const tokens = ['HYPE', 'JUP', 'AAVE', 'JTO', 'PUMP', 'DBR', 'FLUID'];
      const promises = tokens.map(token => this.getBuybackData(token));
      return Promise.all(promises);
    }
  }

  private convertDbRecordToBuybackData(record: BuybackRecord): BuybackData {
    return {
      protocol: record.protocol,
      token: record.token,
      totalRepurchased: record.total_repurchased,
      totalValueUSD: record.total_value_usd,
      circulatingSupplyPercent: record.circulating_supply_percent,
      estimatedAnnualBuyback: record.estimated_annual_buyback,
      feeAllocationPercent: record.fee_allocation_percent,
      lastUpdated: record.timestamp,
      monthlyData: [] // This would be populated separately if needed
    };
  }

  private async saveCurrentDataToDb(): Promise<void> {
    try {
      const tokens = ['HYPE', 'JUP', 'AAVE'];
      
      for (const token of tokens) {
        const data = await this.getBuybackData(token);
        const price = await this.getTokenPrice(this.getCoingeckoId(token));
        
        const record: BuybackRecord = {
          protocol: data.protocol,
          token: data.token,
          timestamp: new Date().toISOString(),
          total_repurchased: data.totalRepurchased,
          total_value_usd: data.totalValueUSD,
          circulating_supply_percent: data.circulatingSupplyPercent,
          estimated_annual_buyback: data.estimatedAnnualBuyback,
          fee_allocation_percent: data.feeAllocationPercent,
          price_per_token: price,
          trading_volume_24h: this.getMockTradingVolume(token),
          fee_generation_24h: this.getMockFeeGeneration(token)
        };

        this.dbService.insertBuybackRecord(record);

        // Also save historical chart data
        const dailyBuyback = data.estimatedAnnualBuyback / 365;
        const dailyTokens = dailyBuyback / price;
        
        const chartData: HistoricalChart = {
          protocol: data.protocol,
          timestamp: new Date().toISOString(),
          value_usd: dailyBuyback,
          tokens_amount: dailyTokens,
          cumulative_value: data.totalValueUSD,
          cumulative_tokens: data.totalRepurchased
        };

        this.dbService.insertHistoricalData(chartData);
      }
    } catch (error) {
      console.error('Error saving data to database:', error);
    }
  }

  private async saveDataToDatabase(data: BuybackData[]): Promise<void> {
    try {
      for (const buybackData of data) {
        const price = await this.getTokenPrice(this.getCoingeckoId(buybackData.token));
        
        const record: BuybackRecord = {
          protocol: buybackData.protocol,
          token: buybackData.token,
          timestamp: new Date().toISOString(),
          total_repurchased: buybackData.totalRepurchased,
          total_value_usd: buybackData.totalValueUSD,
          circulating_supply_percent: buybackData.circulatingSupplyPercent,
          estimated_annual_buyback: buybackData.estimatedAnnualBuyback,
          fee_allocation_percent: buybackData.feeAllocationPercent,
          price_per_token: price,
          trading_volume_24h: this.getMockTradingVolume(buybackData.token),
          fee_generation_24h: this.getMockFeeGeneration(buybackData.token)
        };

        this.dbService.insertBuybackRecord(record);
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  }

  // Helper methods
  private getCoingeckoId(token: string): string {
    const mapping: { [key: string]: string } = {
      'HYPE': 'hyperliquid',
      'JUP': 'jupiter-exchange-solana',
      'AAVE': 'aave'
    };
    return mapping[token] || token.toLowerCase();
  }

  private getMockTradingVolume(token: string): number {
    const volumes: { [key: string]: number } = {
      'HYPE': 1200000000,
      'JUP': 850000000,
      'AAVE': 45000000
    };
    return volumes[token] || 0;
  }

  private getMockFeeGeneration(token: string): number {
    const fees: { [key: string]: number } = {
      'HYPE': 2400000,
      'JUP': 850000,
      'AAVE': 180000
    };
    return fees[token] || 0;
  }

  // New methods for chart data
  async getHistoricalChartData(protocol?: string, days: number = 30): Promise<any[]> {
    try {
      const data = this.dbService.getHistoricalData(protocol, days);
      
      return data.map(record => ({
        timestamp: record.timestamp,
        date: format(new Date(record.timestamp), 'yyyy-MM-dd'),
        protocol: record.protocol,
        value_usd: record.value_usd,
        tokens_amount: record.tokens_amount,
        cumulative_value: record.cumulative_value,
        cumulative_tokens: record.cumulative_tokens
      }));
    } catch (error) {
      console.error('Error getting historical data:', error);
      return [];
    }
  }

  async getPerformanceMetrics(): Promise<any[]> {
    try {
      return this.dbService.getPerformanceMetrics();
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return [];
    }
  }

  async getBuybackTrends(protocol: string, days: number = 30): Promise<any[]> {
    try {
      return this.dbService.getBuybackTrends(protocol, days);
    } catch (error) {
      console.error('Error getting buyback trends:', error);
      return [];
    }
  }

  // Method to fetch protocol-specific data (can be extended with real APIs)
  async getProtocolMetrics(protocol: string): Promise<any> {
    switch (protocol.toLowerCase()) {
      case 'hyperliquid':
        return this.getHyperliquidMetrics();
      case 'jupiter':
        return this.getJupiterMetrics();
      case 'aave':
        return this.getAaveMetrics();
      default:
        throw new Error(`Unsupported protocol: ${protocol}`);
    }
  }

  private async getHyperliquidMetrics(): Promise<any> {
    // In real implementation, this would call Hyperliquid's API
    return {
      tradingVolume24h: 1200000000,
      totalValueLocked: 890000000,
      feeGeneration24h: 2400000
    };
  }

  private async getJupiterMetrics(): Promise<any> {
    // In real implementation, this would call Jupiter's API
    return {
      tradingVolume24h: 850000000,
      totalValueLocked: 320000000,
      feeGeneration24h: 850000
    };
  }

  private async getAaveMetrics(): Promise<any> {
    const aaveScrapingService = await import('./aaveScrapingService').then(m => m.AaveScrapingService.getInstance());
    
    try {
      const aaveBuybackData = await aaveScrapingService.getAaveBuybackData();
      
      // Transform buyback data to match expected metrics format
      return {
        tradingVolume24h: aaveBuybackData.buybackReturns.currentValue * 0.1, // Estimate based on holdings
        totalValueLocked: aaveBuybackData.holdingBalance.aave * aaveBuybackData.latestAavePrice,
        feeGeneration24h: aaveBuybackData.buybackReturns.netProfitLoss / 365, // Daily profit estimate
        // Add the full buyback data for components that need it
        buybackData: aaveBuybackData
      };
    } catch (error) {
      console.error('Failed to fetch Aave buyback data, using fallback:', error);
      // Fallback to original mock data if scraping fails
      return {
        tradingVolume24h: 45000000,
        totalValueLocked: 12500000000,
        feeGeneration24h: 180000,
        buybackData: null
      };
    }
  }
}