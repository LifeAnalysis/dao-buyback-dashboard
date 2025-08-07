import React from 'react';
import { StrategicDashboard } from './components/StrategicDashboard';
import './index.css';

/**
 * Main Application Component
 * Uses the Strategic Dashboard inspired by StrategicETHReserve.xyz
 */
function App() {
  return (
    <div className="App">
      <StrategicDashboard />
    </div>
  );
}

export default App;