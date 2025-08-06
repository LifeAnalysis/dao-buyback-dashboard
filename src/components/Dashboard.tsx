import React, { useState, useEffect } from 'react';
import { BuybackData } from '../types';
import { DataService } from '../services/dataService';
import { PROTOCOLS } from '../config/protocols';
import { ProtocolCard } from './ProtocolCard';
import { MetricCard } from './MetricCard';
import { LiveIndicator } from './LiveIndicator';

export const Dashboard: React.FC = () => {
  const [buybackData, setBuybackData] = useState<BuybackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const dataService = DataService.getInstance();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getAllBuybackData();
      setBuybackData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateTotalMetrics = () => {
    const totalValueUSD = buybackData.reduce((sum, data) => sum + data.totalValueUSD, 0);
    const totalAnnualBuyback = buybackData.reduce((sum, data) => sum + data.estimatedAnnualBuyback, 0);
    const avgSupplyReduction = buybackData.reduce((sum, data) => sum + data.circulatingSupplyPercent, 0) / buybackData.length;

    return {
      totalValueUSD,
      totalAnnualBuyback,
      avgSupplyReduction: avgSupplyReduction || 0
    };
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading buyback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalMetrics = calculateTotalMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">DAO Token Buyback Dashboard</h1>
            <p className="text-xl text-white/90 mb-6">
              Track token buybacks across leading DeFi protocols
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-white/80">
              <span>Last updated: {lastUpdated.toLocaleString()}</span>
              <LiveIndicator isLive={!loading && !error} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Value Repurchased"
            value={totalMetrics.totalValueUSD}
            icon="💰"
            color="#059669"
            subtitle="Across all protocols"
          />
          <MetricCard
            title="Estimated Annual Buybacks"
            value={totalMetrics.totalAnnualBuyback}
            icon="📈"
            color="#2563eb"
            subtitle="Based on current rates"
          />
          <MetricCard
            title="Average Supply Reduction"
            value={`${totalMetrics.avgSupplyReduction.toFixed(2)}%`}
            icon="📉"
            color="#dc2626"
            subtitle="Of circulating supply"
          />
        </div>

        {/* Protocol Cards */}
        <div className="space-y-8">
          {buybackData.map((data, index) => {
            const protocol = PROTOCOLS.find(p => p.token === data.token);
            return (
              <ProtocolCard
                key={data.token}
                data={data}
                color={protocol?.color || '#3b82f6'}
                icon={protocol?.icon || '💎'}
              />
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            Data is updated every 5 minutes. Buyback amounts and estimates are based on publicly available information.
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={fetchData}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              🔄 Refresh Data
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-sm">
              {buybackData.length} protocols tracked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};