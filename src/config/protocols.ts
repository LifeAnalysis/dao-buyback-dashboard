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
  },
  {
    name: 'Jito',
    token: 'JTO',
    color: '#FF6B35',
    icon: '⚡',
    coingeckoId: 'jito-governance-token'
  },
  {
    name: 'Pump.fun',
    token: 'PUMP',
    color: '#FF1493',
    icon: '💎',
    coingeckoId: 'pump-fun-token'
  },
  {
    name: 'DeBridge',
    token: 'DBR',
    color: '#4A90E2',
    icon: '🌉',
    coingeckoId: 'debridge'
  },
  {
    name: 'Fluid',
    token: 'FLUID',
    color: '#00BFFF',
    icon: '💧',
    coingeckoId: 'fluid-tokens'
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
  },
  'JTO': {
    protocol: 'Jito',
    token: 'JTO',
    totalRepurchased: 8500000,
    totalValueUSD: 42500000,
    circulatingSupplyPercent: 2.1,
    estimatedAnnualBuyback: 180000000,
    feeAllocationPercent: 75,
    lastUpdated: '2025-04-01',
    monthlyData: [
      { month: 'Jan 2025', amount: 600000, valueUSD: 3000000 },
      { month: 'Feb 2025', amount: 850000, valueUSD: 4250000 },
      { month: 'Mar 2025', amount: 950000, valueUSD: 4750000 }
    ]
  },
  'PUMP': {
    protocol: 'Pump.fun',
    token: 'PUMP',
    totalRepurchased: 143814000,
    totalValueUSD: 23711464,
    circulatingSupplyPercent: 0.445,
    estimatedAnnualBuyback: 75000000,
    feeAllocationPercent: 95,
    lastUpdated: '2025-04-01',
    monthlyData: [
      { month: 'Jan 2025', amount: 11000000, valueUSD: 1810000 },
      { month: 'Feb 2025', amount: 12500000, valueUSD: 2056000 },
      { month: 'Mar 2025', amount: 14200000, valueUSD: 2337000 }
    ]
  },
  'DBR': {
    protocol: 'DeBridge',
    token: 'DBR',
    totalRepurchased: 2500000,
    totalValueUSD: 15000000,
    circulatingSupplyPercent: 1.5,
    estimatedAnnualBuyback: 45000000,
    feeAllocationPercent: 60,
    lastUpdated: '2025-04-01',
    monthlyData: [
      { month: 'Jan 2025', amount: 180000, valueUSD: 1080000 },
      { month: 'Feb 2025', amount: 220000, valueUSD: 1320000 },
      { month: 'Mar 2025', amount: 280000, valueUSD: 1680000 }
    ]
  },
  'FLUID': {
    protocol: 'Fluid',
    token: 'FLUID',
    totalRepurchased: 5200000,
    totalValueUSD: 31200000,
    circulatingSupplyPercent: 3.2,
    estimatedAnnualBuyback: 95000000,
    feeAllocationPercent: 80,
    lastUpdated: '2025-04-01',
    monthlyData: [
      { month: 'Jan 2025', amount: 420000, valueUSD: 2520000 },
      { month: 'Feb 2025', amount: 510000, valueUSD: 3060000 },
      { month: 'Mar 2025', amount: 590000, valueUSD: 3540000 }
    ]
  }
};