// Browser-compatible database service using localStorage
// This replaces better-sqlite3 for client-side storage

export interface BuybackRecord {
  id?: number;
  protocol: string;
  token: string;
  timestamp: string;
  total_repurchased: number;
  total_value_usd: number;
  circulating_supply_percent: number;
  estimated_annual_buyback: number;
  fee_allocation_percent: number;
  price_per_token: number;
  trading_volume_24h?: number;
  fee_generation_24h?: number;
}

export interface HistoricalChart {
  id?: number;
  protocol: string;
  timestamp: string;
  value_usd: number;
  tokens_amount: number;
  cumulative_value: number;
  cumulative_tokens: number;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private readonly BUYBACK_KEY = 'buyback_records';
  private readonly HISTORICAL_KEY = 'historical_charts';

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  constructor() {
    this.initializeWithSampleData();
  }

  private initializeWithSampleData(): void {
    // Check if data already exists
    const existingBuyback = localStorage.getItem(this.BUYBACK_KEY);
    const existingHistorical = localStorage.getItem(this.HISTORICAL_KEY);
    
    if (!existingBuyback || !existingHistorical) {
      this.generateSampleData();
    }
  }

  private generateSampleData(): void {
    const protocols = [
      { name: 'Hyperliquid', token: 'HYPE', basePrice: 19.3, baseVolume: 1200000000 },
      { name: 'Jupiter', token: 'JUP', basePrice: 0.6, baseVolume: 850000000 },
      { name: 'Aave', token: 'AAVE', basePrice: 192, baseVolume: 45000000 },
      { name: 'Jito', token: 'JTO', basePrice: 5.0, baseVolume: 320000000 },
      { name: 'Pump.fun', token: 'PUMP', basePrice: 0.165, baseVolume: 180000000 },
      { name: 'DeBridge', token: 'DBR', basePrice: 6.0, baseVolume: 125000000 },
      { name: 'Fluid', token: 'FLUID', basePrice: 6.0, baseVolume: 240000000 }
    ];

    const buybackRecords: BuybackRecord[] = [];
    const historicalCharts: HistoricalChart[] = [];
    
    const now = new Date();
    let cumulativeData: { [key: string]: { value: number; tokens: number } } = {
      'Hyperliquid': { value: 350000000, tokens: 18000000 },
      'Jupiter': { value: 24000000, tokens: 42000000 },
      'Aave': { value: 20000000, tokens: 115000 },
      'Jito': { value: 35000000, tokens: 7500000 },
      'Pump.fun': { value: 20000000, tokens: 125000000 },
      'DeBridge': { value: 12000000, tokens: 2200000 },
      'Fluid': { value: 28000000, tokens: 4800000 }
    };

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const timestamp = date.toISOString();

      protocols.forEach(protocol => {
        // Generate realistic variance
        const priceVariance = 0.9 + Math.random() * 0.2;
        const volumeVariance = 0.8 + Math.random() * 0.4;
        const price = protocol.basePrice * priceVariance;
        const volume = protocol.baseVolume * volumeVariance;
        
        // Calculate buyback amounts
        let feePercent, dailyBuybackUSD, dailyTokens;
        
        if (protocol.name === 'Hyperliquid') {
          feePercent = 97;
          dailyBuybackUSD = (volume * 0.0002 * 0.97);
          dailyTokens = dailyBuybackUSD / price;
        } else if (protocol.name === 'Jupiter') {
          feePercent = 50;
          dailyBuybackUSD = (volume * 0.0001 * 0.5);
          dailyTokens = dailyBuybackUSD / price;
        } else if (protocol.name === 'Jito') {
          feePercent = 75;
          dailyBuybackUSD = (volume * 0.00015 * 0.75);
          dailyTokens = dailyBuybackUSD / price;
        } else if (protocol.name === 'Pump.fun') {
          feePercent = 95;
          dailyBuybackUSD = (volume * 0.0003 * 0.95);
          dailyTokens = dailyBuybackUSD / price;
        } else if (protocol.name === 'DeBridge') {
          feePercent = 60;
          dailyBuybackUSD = (volume * 0.0001 * 0.6);
          dailyTokens = dailyBuybackUSD / price;
        } else if (protocol.name === 'Fluid') {
          feePercent = 80;
          dailyBuybackUSD = (volume * 0.00012 * 0.8);
          dailyTokens = dailyBuybackUSD / price;
        } else { // Aave
          feePercent = 100;
          dailyBuybackUSD = Math.min(1000000 / 7, volume * 0.0004);
          dailyTokens = dailyBuybackUSD / price;
        }

        // Update cumulative data
        cumulativeData[protocol.name].value += dailyBuybackUSD;
        cumulativeData[protocol.name].tokens += dailyTokens;

        // Add buyback record
        buybackRecords.push({
          id: buybackRecords.length + 1,
          protocol: protocol.name,
          token: protocol.token,
          timestamp,
          total_repurchased: cumulativeData[protocol.name].tokens,
          total_value_usd: cumulativeData[protocol.name].value,
          circulating_supply_percent: protocol.name === 'Hyperliquid' ? 6.2 : protocol.name === 'Jupiter' ? 3.6 : protocol.name === 'Jito' ? 2.1 : protocol.name === 'Pump.fun' ? 0.445 : protocol.name === 'DeBridge' ? 1.5 : protocol.name === 'Fluid' ? 3.2 : 0.8,
          estimated_annual_buyback: protocol.name === 'Hyperliquid' ? 600000000 : protocol.name === 'Jupiter' ? 250000000 : protocol.name === 'Jito' ? 180000000 : protocol.name === 'Pump.fun' ? 75000000 : protocol.name === 'DeBridge' ? 45000000 : protocol.name === 'Fluid' ? 95000000 : 52000000,
          fee_allocation_percent: feePercent,
          price_per_token: price,
          trading_volume_24h: volume,
          fee_generation_24h: volume * 0.0002
        });

        // Add historical chart data
        historicalCharts.push({
          id: historicalCharts.length + 1,
          protocol: protocol.name,
          timestamp,
          value_usd: dailyBuybackUSD,
          tokens_amount: dailyTokens,
          cumulative_value: cumulativeData[protocol.name].value,
          cumulative_tokens: cumulativeData[protocol.name].tokens
        });
      });
    }

    localStorage.setItem(this.BUYBACK_KEY, JSON.stringify(buybackRecords));
    localStorage.setItem(this.HISTORICAL_KEY, JSON.stringify(historicalCharts));
  }

  // Insert buyback record
  insertBuybackRecord(record: BuybackRecord): number {
    const records = this.getBuybackRecords();
    const newId = Math.max(...records.map(r => r.id || 0), 0) + 1;
    record.id = newId;
    records.push(record);
    localStorage.setItem(this.BUYBACK_KEY, JSON.stringify(records));
    return newId;
  }

  // Insert historical chart data
  insertHistoricalData(data: HistoricalChart): number {
    const records = this.getHistoricalRecords();
    const newId = Math.max(...records.map(r => r.id || 0), 0) + 1;
    data.id = newId;
    records.push(data);
    localStorage.setItem(this.HISTORICAL_KEY, JSON.stringify(records));
    return newId;
  }

  private getBuybackRecords(): BuybackRecord[] {
    const data = localStorage.getItem(this.BUYBACK_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getHistoricalRecords(): HistoricalChart[] {
    const data = localStorage.getItem(this.HISTORICAL_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Get latest buyback data for all protocols
  getLatestBuybackData(): BuybackRecord[] {
    const records = this.getBuybackRecords();
    const latestByProtocol: { [protocol: string]: BuybackRecord } = {};
    
    records.forEach(record => {
      if (!latestByProtocol[record.protocol] || 
          new Date(record.timestamp) > new Date(latestByProtocol[record.protocol].timestamp)) {
        latestByProtocol[record.protocol] = record;
      }
    });

    return Object.values(latestByProtocol);
  }

  // Get historical data for charts
  getHistoricalData(protocol?: string, days: number = 30): HistoricalChart[] {
    const records = this.getHistoricalRecords();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return records.filter(record => {
      const recordDate = new Date(record.timestamp);
      const matchesProtocol = !protocol || record.protocol === protocol;
      const withinTimeframe = recordDate >= cutoffDate;
      return matchesProtocol && withinTimeframe;
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Get buyback trends
  getBuybackTrends(protocol: string, days: number = 30): any[] {
    const records = this.getBuybackRecords();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return records
      .filter(record => {
        const recordDate = new Date(record.timestamp);
        return record.protocol === protocol && recordDate >= cutoffDate;
      })
      .map(record => ({
        timestamp: record.timestamp,
        total_value_usd: record.total_value_usd,
        total_repurchased: record.total_repurchased,
        price_per_token: record.price_per_token,
        trading_volume_24h: record.trading_volume_24h
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Get performance metrics
  getPerformanceMetrics(): any[] {
    const records = this.getBuybackRecords();
    const metricsByProtocol: { [protocol: string]: any } = {};
    
    records.forEach(record => {
      if (!metricsByProtocol[record.protocol]) {
        metricsByProtocol[record.protocol] = {
          protocol: record.protocol,
          data_points: 0,
          total_value: 0,
          values: [],
          supply_reductions: []
        };
      }
      
      const metrics = metricsByProtocol[record.protocol];
      metrics.data_points++;
      metrics.total_value += record.total_value_usd;
      metrics.values.push(record.total_value_usd);
      metrics.supply_reductions.push(record.circulating_supply_percent);
    });

    return Object.values(metricsByProtocol).map((metrics: any) => ({
      protocol: metrics.protocol,
      data_points: metrics.data_points,
      avg_value_usd: metrics.total_value / metrics.data_points,
      max_value_usd: Math.max(...metrics.values),
      min_value_usd: Math.min(...metrics.values),
      avg_supply_reduction: metrics.supply_reductions.reduce((a: number, b: number) => a + b, 0) / metrics.supply_reductions.length
    }));
  }

  // Clean old data (keep last 90 days)
  cleanOldData(): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    
    const buybackRecords = this.getBuybackRecords();
    const historicalRecords = this.getHistoricalRecords();
    
    const filteredBuyback = buybackRecords.filter(record => 
      new Date(record.timestamp) >= cutoffDate
    );
    const filteredHistorical = historicalRecords.filter(record => 
      new Date(record.timestamp) >= cutoffDate
    );
    
    localStorage.setItem(this.BUYBACK_KEY, JSON.stringify(filteredBuyback));
    localStorage.setItem(this.HISTORICAL_KEY, JSON.stringify(filteredHistorical));
    
    return (buybackRecords.length - filteredBuyback.length) + 
           (historicalRecords.length - filteredHistorical.length);
  }

  // Close database connection (no-op for localStorage)
  close(): void {
    // No-op for localStorage implementation
  }
}