import React from 'react';
import { OptimizedDashboard } from './components/OptimizedDashboard';
import './index.css';

/**
 * Main Application Component
 * 
 * Treasury Dashboard - A real-time dashboard for tracking token buybacks across leading DeFi DAOs
 * 
 * Architecture:
 * - Single, optimized dashboard component for better performance
 * - Clean data service layer with real API integrations (Aave, PumpFun)
 * - Modern React 18 with TypeScript for type safety
 * - Tailwind CSS for responsive, modern styling
 * - Framer Motion for smooth animations
 * 
 * Features:
 * - Real-time data updates every 5 minutes
 * - Multi-DAO support (Hyperliquid, Jupiter, Aave, etc.)
 * - Comprehensive metrics and analytics
 * - Historical chart data and trends
 * - Modern, responsive UI design
 * 
 * Data Sources:
 * - CoinGecko API for token prices
 * - TokenLogic API for real Aave buyback data
 * - PumpFun fees API for real PUMP buyback data
 * - Mock data for other protocols (with realistic variance)
 * 
 * @version 1.0.0
 * @author Treasury Dashboard Team
 */
function App() {
  return (
    <div className="App">
      {/* Main dashboard container */}
      <OptimizedDashboard />
    </div>
  );
}

export default App;