import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ExoplanetDetail } from './components/ExoplanetDetail';
import { ComparisonTool } from './components/ComparisonTool';
import { exoplanets } from './data/exoplanets';

type View = 'dashboard' | 'detail' | 'compare';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedExoplanetId, setSelectedExoplanetId] = useState<string | null>(null);

  const selectedExoplanet = selectedExoplanetId 
    ? exoplanets.find(p => p.id === selectedExoplanetId) 
    : null;

  const handleExoplanetSelect = (id: string) => {
    setSelectedExoplanetId(id);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedExoplanetId(null);
  };

  const handleCompareClick = () => {
    setCurrentView('compare');
  };

  if (currentView === 'detail' && selectedExoplanet) {
    return (
      <ExoplanetDetail 
        exoplanet={selectedExoplanet} 
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'compare') {
    return (
      <ComparisonTool 
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <Dashboard 
      onExoplanetSelect={handleExoplanetSelect}
      onCompareClick={handleCompareClick}
    />
  );
}

export default App;