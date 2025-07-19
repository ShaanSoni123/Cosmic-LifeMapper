import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ExoplanetDetail } from './components/ExoplanetDetail';
import { ComparisonTool } from './components/ComparisonTool';
import { exoplanets as allExoplanets, getLocalExoplanets, getNASAExoplanets } from './data/exoplanets';
import { Exoplanet } from './types/exoplanet';

type View = 'dashboard' | 'detail' | 'compare';

function App() {
  // Add error boundary
  try {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedExoplanetId, setSelectedExoplanetId] = useState<string | null>(null);
  const [userAddedExoplanets, setUserAddedExoplanets] = useState<Exoplanet[]>([]);

  // Combine static and dynamic exoplanets
  const combinedExoplanets = [...allExoplanets, ...userAddedExoplanets];

  const selectedExoplanet = selectedExoplanetId 
    ? combinedExoplanets.find(p => p.id === selectedExoplanetId) 
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

  const handleAddNASAPlanet = (planetData: Exoplanet) => {
    // Check if planet already exists
    const exists = combinedExoplanets.some(p => p.name === planetData.name);
    if (!exists) {
      setUserAddedExoplanets(prev => [...prev, planetData]);
      console.log(`✅ Added ${planetData.name} to your collection`);
    } else {
      console.log(`⚠️ ${planetData.name} already exists in your collection`);
    }
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
        allExoplanets={combinedExoplanets}
      />
    );
  }

  return (
    <Dashboard 
      onExoplanetSelect={handleExoplanetSelect}
      onCompareClick={handleCompareClick}
      onAddNASAPlanet={handleAddNASAPlanet}
      userAddedExoplanets={userAddedExoplanets}
      allExoplanets={combinedExoplanets}
    />
  );
  } catch (error) {
    console.error('App error:', error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Loading Cosmic-LifeMapper...</h1>
          <p className="text-gray-400">Initializing exoplanet data...</p>
        </div>
      </div>
    );
  }
}

export default App;