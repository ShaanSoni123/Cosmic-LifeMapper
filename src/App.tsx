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
      console.log(`✅ Fuzzy Search: Added ${planetData.name} to your collection`);
      
      // Show success notification (you can enhance this with a toast library)
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
      notification.textContent = `✅ Added ${planetData.name} to collection!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } else {
      console.log(`⚠️ Fuzzy Search: ${planetData.name} already exists in your collection`);
      
      // Show warning notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-yellow-500 text-black px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
      notification.textContent = `⚠️ ${planetData.name} already in collection!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
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