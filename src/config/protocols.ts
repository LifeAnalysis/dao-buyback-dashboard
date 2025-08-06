import { ProtocolConfig } from '../types';

export const PROTOCOLS: ProtocolConfig[] = [
  {
    name: 'Hyperliquid',
    token: 'HYPE',
    color: '#00D4AA',
    icon: '🚀',
    coingeckoId: 'hyperliquid'
  },
  {
    name: 'Jupiter',
    token: 'JUP',
    color: '#FFA500',
    icon: '🪐',
    coingeckoId: 'jupiter-exchange-solana'
  },
  {
    name: 'Aave',
    token: 'AAVE',
    color: '#B6509E',
    icon: '👻',
    coingeckoId: 'aave'
  }
];

export const MOCK_BUYBACK_DATA = {
  'HYPE': {
    protocol: 'Hyperliquid',
    token: 'HYPE',
    totalRepurchased: 20000000,
    totalValueUSD: 386000000,
    circulatingSupplyPercent: 6.2,
    estimatedAnnualBuyback: 600000000,
    feeAllocationPercent: 97,
    lastUpdated: '2025-03-25',
    monthlyData: [
      { month: 'Jan 2025', amount: 1500000, valueUSD: 28950000 },
      { month: 'Feb 2025', amount: 1800000, valueUSD: 34740000 },
      { month: 'Mar 2025', amount: 2200000, valueUSD: 42460000 }
    ]
  },
  'JUP': {
    protocol: 'Jupiter',
    token: 'JUP',
    totalRepurchased: 45000000,
    totalValueUSD: 27000000,
    circulatingSupplyPercent: 3.6,
    estimatedAnnualBuyback: 250000000,
    feeAllocationPercent: 50,
    lastUpdated: '2025-03-25',
    monthlyData: [
      { month: 'Jan 2025', amount: 3000000, valueUSD: 1800000 },
      { month: 'Feb 2025', amount: 4500000, valueUSD: 2700000 },
      { month: 'Mar 2025', amount: 5000000, valueUSD: 3000000 }
    ]
  },
  'AAVE': {
    protocol: 'Aave',
    token: 'AAVE',
    totalRepurchased: 125000,
    totalValueUSD: 24000000,
    circulatingSupplyPercent: 0.8,
    estimatedAnnualBuyback: 52000000,
    feeAllocationPercent: 100,
    lastUpdated: '2025-04-01',
    monthlyData: [
      { month: 'Jan 2025', amount: 8000, valueUSD: 1536000 },
      { month: 'Feb 2025', amount: 12000, valueUSD: 2304000 },
      { month: 'Mar 2025', amount: 15000, valueUSD: 2880000 }
    ]
  }
};