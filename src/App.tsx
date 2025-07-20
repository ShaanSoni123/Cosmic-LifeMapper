import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ExoplanetDetail } from './components/ExoplanetDetail';
import { ComparisonTool } from './components/ComparisonTool';
import { getAllExoplanets } from './data/exoplanets';
import { Exoplanet } from './types/exoplanet';

type View = 'dashboard' | 'detail' | 'compare';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedExoplanetId, setSelectedExoplanetId] = useState<string | null>(null);
  const [userAddedExoplanets, setUserAddedExoplanets] = useState<Exoplanet[]>([]);

  // Combine static and dynamic exoplanets
  const combinedExoplanets = React.useMemo(() => {
    const allExoplanets = getAllExoplanets();
    console.log(`App: Combined ${allExoplanets.length} base + ${userAddedExoplanets.length} user exoplanets`);
    return [...allExoplanets, ...userAddedExoplanets];
  }, [userAddedExoplanets]);

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
    const exists = combinedExoplanets.some(p => 
      p.name.toLowerCase() === planetData.name.toLowerCase() || p.id === planetData.id
    );
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
}

export default App;