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
  const [isLoading, setIsLoading] = useState(false);

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

  if (isLoading) {
    return <LoadingScreen />;
  }

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

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white text-center">
      <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h1 className="text-2xl mb-4">Loading Cosmic-LifeMapper...</h1>
      <p className="text-gray-400">Initializing exoplanet data...</p>
      <div className="mt-4 flex justify-center space-x-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
);

export default App;