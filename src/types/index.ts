export interface BuybackData {
  protocol: string;
  token: string;
  totalRepurchased: number;
  totalValueUSD: number;
  circulatingSupplyPercent: number;
  estimatedAnnualBuyback: number;
  feeAllocationPercent: number;
  lastUpdated: string;
  monthlyData?: MonthlyBuyback[];
}

export interface MonthlyBuyback {
  month: string;
  amount: number;
  valueUSD: number;
}

export interface ProtocolConfig {
  name: string;
  token: string;
  color: string;
  icon: string;
  coingeckoId: string;
}