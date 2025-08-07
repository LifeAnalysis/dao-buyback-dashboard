import React, { useState, useEffect } from 'react';
import { AaveBuybackData } from '../types';
import { AaveScrapingService } from '../services/aaveScrapingService';

interface AaveMetricsProps {
  className?: string;
}

export const AaveMetrics: React.FC<AaveMetricsProps> = ({ className = '' }) => {
  const [aaveData, setAaveData] = useState<AaveBuybackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAaveData = async () => {
      try {
        setLoading(true);
        setError(null);
        const service = AaveScrapingService.getInstance();
        const data = await service.getAaveBuybackData();
        setAaveData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Aave data');
      } finally {
        setLoading(false);
      }
    };

    fetchAaveData();
  }, []);

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString();
  };

  const formatPercent = (percent: number): string => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className={`bg-gray-900 p-6 rounded-lg ${className}`}>
        <h3 className="text-xl font-bold text-white mb-4">🔍 Aave TokenLogic Data</h3>
        <div className="text-gray-400">Loading real Aave buyback data...</div>
      </div>
    );
  }

  if (error || !aaveData) {
    return (
      <div className={`bg-gray-900 p-6 rounded-lg ${className}`}>
        <h3 className="text-xl font-bold text-white mb-4">❌ Aave Data Error</h3>
        <div className="text-red-400">{error || 'No data available'}</div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 p-6 rounded-lg ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4">👻 Aave TokenLogic Buybacks</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-400">Total AAVE Purchased</div>
          <div className="text-lg font-bold text-white">{formatNumber(aaveData.totalAavePurchased)} AAVE</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-400">Latest AAVE Price</div>
          <div className="text-lg font-bold text-white">{formatCurrency(aaveData.latestAavePrice)}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-400">Current Portfolio Value</div>
          <div className="text-lg font-bold text-white">{formatCurrency(aaveData.buybackReturns.currentValue)}</div>
        </div>
      </div>

      {/* Returns Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">💰 Buyback Returns</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">Cost of Purchase</div>
            <div className="text-sm font-bold text-white">{formatCurrency(aaveData.buybackReturns.costOfPurchase)}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">Current Value</div>
            <div className="text-sm font-bold text-white">{formatCurrency(aaveData.buybackReturns.currentValue)}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">Net P&L</div>
            <div className={`text-sm font-bold ${aaveData.buybackReturns.netProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(aaveData.buybackReturns.netProfitLoss)}
            </div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">P&L %</div>
            <div className={`text-sm font-bold ${aaveData.buybackReturns.netProfitLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercent(aaveData.buybackReturns.netProfitLossPercent)}
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">🏦 Treasury Holdings</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">AAVE</div>
            <div className="text-sm font-bold text-purple-400">{formatNumber(aaveData.holdingBalance.aave)}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">USDT</div>
            <div className="text-sm font-bold text-green-400">{formatCurrency(aaveData.holdingBalance.usdt)}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">aEthUSDT</div>
            <div className="text-sm font-bold text-green-400">{formatCurrency(aaveData.holdingBalance.aEthUSDT)}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">USDC</div>
            <div className="text-sm font-bold text-blue-400">{formatCurrency(aaveData.holdingBalance.usdc)}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">aEthUSDC</div>
            <div className="text-sm font-bold text-blue-400">{formatCurrency(aaveData.holdingBalance.aEthUSDC)}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">ETH</div>
            <div className="text-sm font-bold text-yellow-400">{formatNumber(aaveData.holdingBalance.eth)} ETH</div>
          </div>
        </div>
      </div>

      {/* Funding Details */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-white mb-3">💸 Funding Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm font-semibold text-green-400 mb-2">USDT Funding</div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Allowance:</span>
                <span className="text-white">{formatCurrency(aaveData.fundingDetails.usdt.allowance)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Remaining:</span>
                <span className="text-white">{formatCurrency(aaveData.fundingDetails.usdt.remaining)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Transferred:</span>
                <span className="text-white">{formatCurrency(aaveData.fundingDetails.usdt.transferred)}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm font-semibold text-blue-400 mb-2">USDC Funding</div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Allowance:</span>
                <span className="text-white">{formatCurrency(aaveData.fundingDetails.usdc.allowance)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Remaining:</span>
                <span className="text-white">{formatCurrency(aaveData.fundingDetails.usdc.remaining)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Transferred:</span>
                <span className="text-white">{formatCurrency(aaveData.fundingDetails.usdc.transferred)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source & Status */}
      <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
        <div className="flex justify-between items-center">
          <span>📊 Data sourced from TokenLogic Aave Analytics</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="mt-1">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          <span>{aaveData.cumulativeChart.length} chart points • {aaveData.transactions.length} transactions tracked</span>
        </div>
      </div>
    </div>
  );
};