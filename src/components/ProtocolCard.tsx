import React from 'react';
import { BuybackData } from '../types';

interface ProtocolCardProps {
  data: BuybackData;
  color: string;
  icon: string;
}

export const ProtocolCard: React.FC<ProtocolCardProps> = ({ data, color, icon }) => {
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="px-6 py-4 text-white"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h2 className="text-xl font-bold">{data.protocol}</h2>
              <p className="text-white/90 text-sm">{data.token} Token Buybacks</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/90 text-sm">Last Updated</p>
            <p className="text-white font-medium">{data.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Repurchased</h4>
            <p className="text-xl font-bold" style={{ color }}>
              {formatLargeNumber(data.totalRepurchased)} {data.token}
            </p>
            <p className="text-sm text-gray-500">
              {formatCurrency(data.totalValueUSD)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Supply Reduction</h4>
            <p className="text-xl font-bold text-green-600">
              {data.circulatingSupplyPercent}%
            </p>
            <p className="text-sm text-gray-500">of circulating supply</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Fee Allocation</h4>
            <p className="text-xl font-bold text-blue-600">
              {data.feeAllocationPercent}%
            </p>
            <p className="text-sm text-gray-500">of protocol fees</p>
          </div>
        </div>

        {/* Annual Projection */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Estimated Annual Buyback
              </h4>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(data.estimatedAnnualBuyback)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Monthly Average</p>
              <p className="text-lg font-semibold text-gray-700">
                {formatCurrency(data.estimatedAnnualBuyback / 12)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {data.monthlyData && data.monthlyData.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {data.monthlyData.slice(-3).map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{month.month}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {formatLargeNumber(month.amount)} {data.token}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(month.valueUSD)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};