import React from 'react';
import { OptimizedDashboard } from './components/OptimizedDashboard';
import './index.css';

/**
 * Main Application Component
 * Uses the optimized, modular dashboard architecture
 */
function App() {
  return (
    <div className="App">
      <OptimizedDashboard />
    </div>
  );
}

export default App;