import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface LeaderboardsProps {
  performanceMetrics: any[];
  historicalData: any[];
}

export const Leaderboards: React.FC<LeaderboardsProps> = () => {

  const mockChartData = Array.from({ length: 30 }, (_, i) => ({
    day: i,
    value: Math.random() * 100 + 50 + Math.sin(i * 0.2) * 20
  }));

  const leaderboardSections = [
    {
      title: 'Fees',
      subtitle: '$1.94B',
      change: '+16%',
      changePositive: true,
      data: [
        { name: 'Hyperliquid', value: '$1.2B', change: '+24%', positive: true },
        { name: 'Jupiter', value: '$580M', change: '+18%', positive: true },
        { name: 'Aave', value: '$160M', change: '+12%', positive: true }
      ]
    },
    {
      title: 'Total value locked',
      subtitle: '$444.2B',
      change: '+14.2%',
      changePositive: true,
      data: [
        { name: 'Aave', value: '$12.5B', change: '+8%', positive: true },
        { name: 'Hyperliquid', value: '$890M', change: '+15%', positive: true },
        { name: 'Jupiter', value: '$320M', change: '+22%', positive: true }
      ]
    },
    {
      title: 'Active users (daily)',
      subtitle: '26.5M',
      change: '+6.7%',
      changePositive: true,
      data: [
        { name: 'Jupiter', value: '125K', change: '+12%', positive: true },
        { name: 'Hyperliquid', value: '89K', change: '+8%', positive: true },
        { name: 'Aave', value: '45K', change: '+15%', positive: true }
      ]
    }
  ];

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Leaderboards</h2>
        <motion.button 
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          whileHover={{ x: 5 }}
        >
          View all
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {leaderboardSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="dark-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + sectionIndex * 0.1, duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-100">{section.title}</h3>
                <span className="text-xs text-gray-400">30d sum</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-100">{section.subtitle}</span>
                <span className={`text-sm font-medium ${section.changePositive ? 'text-green-400' : 'text-red-400'}`}>
                  {section.change}
                </span>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="mb-6 h-16">
              <ResponsiveContainer width="100%" height="100%">
                {sectionIndex === 0 ? (
                  <AreaChart data={mockChartData}>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : sectionIndex === 1 ? (
                  <AreaChart data={mockChartData}>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#06b6d4" 
                      fill="#06b6d4" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={mockChartData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Market Leaders */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Market leaders</h4>
              <div className="space-y-3">
                {section.data.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="flex items-center justify-between"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.name === 'Hyperliquid' ? 'bg-cyan-400' :
                        item.name === 'Jupiter' ? 'bg-orange-400' :
                        'bg-pink-400'
                      }`} />
                      <span className="text-sm text-gray-200">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-sm font-medium text-gray-100">{item.value}</span>
                      <span className={`text-xs ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                        {item.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-xs text-gray-400">
                Latest (30d change)
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};