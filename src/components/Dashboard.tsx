import React, { useState } from 'react';
import { 
  EXOPLANET_COUNT, 
  LOCAL_EXOPLANET_COUNT,
  NASA_EXOPLANET_COUNT,
  getAllExoplanets,
  refreshExoplanets 
} from '../data/exoplanets';
import { ExoplanetCard } from './ExoplanetCard';
import { Search, Filter, Rocket, BarChart3, Globe, Zap, Satellite, Database, Users, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { NASASearchModal } from './NASASearchModal';
import { Exoplanet } from '../types/exoplanet';
import { TeamSection } from './TeamSection';
import { NASADataViewer } from './NASADataViewer';
import { EnhancedExoplanetStats } from './EnhancedExoplanetStats';

interface DashboardProps {
  onExoplanetSelect: (id: string) => void;
  onCompareClick: () => void;
  onAddNASAPlanet?: (planetData: any) => void;
  userAddedExoplanets?: Exoplanet[];
  allExoplanets?: Exoplanet[];
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onExoplanetSelect, 
  onCompareClick, 
  onAddNASAPlanet,
  userAddedExoplanets = [],
  allExoplanets: providedExoplanets
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'habitability' | 'distance'>('habitability');
  const [showOnlyHabitable, setShowOnlyHabitable] = useState(false);
  const [showNASAModal, setShowNASAModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNASADataViewer, setShowNASADataViewer] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Use provided exoplanets or get all available exoplanets
  const displayExoplanets = React.useMemo(() => {
    if (providedExoplanets) return providedExoplanets;
    const allExoplanets = getAllExoplanets();
    console.log(`Dashboard: Got ${allExoplanets.length} exoplanets`);
    return allExoplanets;
  }, [providedExoplanets, userAddedExoplanets]);

  const totalCount = displayExoplanets.length + userAddedExoplanets.length;
  const localCount = LOCAL_EXOPLANET_COUNT;
  const nasaCount = NASA_EXOPLANET_COUNT();
  const userAddedCount = userAddedExoplanets.length;

  const filteredExoplanets = displayExoplanets
    .filter(planet => 
      planet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!showOnlyHabitable || planet.habitabilityScore >= 70) // Only show planets with 70%+ habitability
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'habitability':
          return b.habitabilityScore - a.habitabilityScore;
        case 'distance':
          return a.distance - b.distance;
        default:
          return 0;
      }
    });

  const habitablePlanetsCount = displayExoplanets.filter(p => p.habitabilityScore >= 70).length;

  // Calculate enhanced statistics
  const discoveryMethods = [...new Set(displayExoplanets.map(p => p.starType))].length;
  const latestDiscovery = Math.max(...displayExoplanets.map(p => p.discoveryYear)).toString();
  const averageDistance = Math.round(displayExoplanets.reduce((sum, p) => sum + p.distance, 0) / displayExoplanets.length);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    setIsLoadingData(true);
    try {
      await refreshExoplanets();
      console.log('✅ Successfully refreshed real NASA CSV data');
    } catch (error) {
      console.error('❌ Failed to refresh NASA CSV data:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoadingData(false);
    }
  };

  // Check if data is still loading
  React.useEffect(() => {
    // Check every 500ms if data is loaded
    const interval = setInterval(() => {
      if (displayExoplanets.length > 0) {
        setIsLoadingData(false);
        clearInterval(interval);
        console.log(`✅ Data loaded: ${displayExoplanets.length} exoplanets`);
      }
    }, 500);

    // Fallback timeout after 8 seconds
    const timeout = setTimeout(() => {
      setIsLoadingData(false);
      clearInterval(interval);
      console.log(`⏰ Timeout reached, showing ${displayExoplanets.length} exoplanets`);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [displayExoplanets.length]);

  // Show loading screen while data is loading
  if (isLoadingData && displayExoplanets.length < 10) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl mb-4">Loading Real NASA Data...</h1>
          <p className="text-gray-400">Loading 1000+ accurate exoplanets from NASA CSV</p>
          <p className="text-gray-500 text-sm mt-2">Currently loaded: {displayExoplanets.length} planets</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Deep Space Background */}
      <div className="absolute inset-0">
        {/* Deep Space Black Background */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Subtle Space Nebula */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-radial from-purple-900/8 via-purple-900/3 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-gradient-radial from-blue-900/6 via-blue-900/2 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-gradient-radial from-indigo-900/5 via-indigo-900/2 to-transparent rounded-full blur-2xl transform -translate-x-1/2"></div>
        </div>
        
        {/* Realistic Star Field */}
        <div className="absolute inset-0">
          {/* Tiny distant stars */}
          <div className="absolute top-[8%] left-[12%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[23%] left-[28%] w-px h-px bg-white rounded-full opacity-60"></div>
          <div className="absolute top-[41%] left-[67%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[58%] left-[19%] w-px h-px bg-white rounded-full opacity-65"></div>
          <div className="absolute top-[76%] left-[83%] w-px h-px bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[14%] left-[91%] w-px h-px bg-white rounded-full opacity-55"></div>
          <div className="absolute top-[37%] left-[7%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[52%] left-[44%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[71%] left-[13%] w-px h-px bg-white rounded-full opacity-65"></div>
          <div className="absolute top-[89%] left-[58%] w-px h-px bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[6%] left-[49%] w-px h-px bg-white rounded-full opacity-60"></div>
          <div className="absolute top-[43%] left-[88%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[67%] left-[3%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[82%] left-[39%] w-px h-px bg-white rounded-full opacity-65"></div>
          <div className="absolute top-[18%] left-[72%] w-px h-px bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[31%] left-[56%] w-px h-px bg-white rounded-full opacity-60"></div>
          <div className="absolute top-[49%] left-[21%] w-px h-px bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[64%] left-[77%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[79%] left-[31%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[93%] left-[65%] w-px h-px bg-white rounded-full opacity-65"></div>
          
          {/* Small stars */}
          <div className="absolute top-[26%] left-[15%] w-0.5 h-0.5 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[68%] left-[62%] w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[47%] left-[85%] w-0.5 h-0.5 bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[11%] left-[63%] w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[84%] left-[24%] w-0.5 h-0.5 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[35%] left-[9%] w-0.5 h-0.5 bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[73%] left-[91%] w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[16%] left-[41%] w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[59%] left-[76%] w-0.5 h-0.5 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[92%] left-[47%] w-0.5 h-0.5 bg-white rounded-full opacity-75"></div>
          
          {/* Medium bright stars */}
          <div className="absolute top-[22%] left-[52%] w-1 h-1 bg-white rounded-full opacity-90"></div>
          <div className="absolute top-[74%] left-[33%] w-1 h-1 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[12%] left-[78%] w-1 h-1 bg-white rounded-full opacity-90"></div>
          <div className="absolute top-[86%] left-[81%] w-1 h-1 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[45%] left-[26%] w-1 h-1 bg-white rounded-full opacity-80"></div>
          
          {/* Bright prominent stars */}
          <div className="absolute top-[29%] left-[69%] w-1.5 h-1.5 bg-white rounded-full opacity-95"></div>
          <div className="absolute top-[61%] left-[18%] w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
          <div className="absolute top-[38%] left-[54%] w-1.5 h-1.5 bg-white rounded-full opacity-85"></div>
          
          {/* Very distant galaxies */}
          <div className="absolute top-[17%] left-[87%] w-2 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-sm transform rotate-12"></div>
          <div className="absolute top-[77%] left-[8%] w-3 h-0.5 bg-gradient-to-r from-transparent via-white/8 to-transparent rounded-full blur-sm transform -rotate-25"></div>
          <div className="absolute top-[53%] left-[95%] w-2 h-0.5 bg-gradient-to-r from-transparent via-white/12 to-transparent rounded-full blur-sm transform rotate-45"></div>
        </div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Floating Header */}
          <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-500">
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl flex items-center">
                <span>C</span>
                <span className="relative">
                  <Globe 
                    className="w-12 h-12 text-cyan-400 mx-1" 
                    style={{ 
                      animation: 'spin 8s linear infinite',
                      transformOrigin: 'center center'
                    }} 
                  />
                </span>
                <span>smic-LifeMapper</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-cyan-500/20">
              Embark on a voyage across the cosmos to uncover a universe of scientifically explored exoplanets. 
              Dive into their enigmatic compositions, evaluate their potential to host life, and compare the distinct celestial imprints they leave behind.
              <span className="block mt-2 text-green-300 font-bold text-xl">
                Featuring {totalCount} real exoplanets from NASA's official archive with accurate data!
              </span>
            </p>
          </div>


          {/* Floating Stats */}
          <div className="mb-12 flex justify-start">
            <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-12 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-4xl">
              <div className="flex items-center space-x-8">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-2xl">{totalCount}</span>
                </div>
                <div>
                  <h3 className="text-5xl font-bold text-white mb-2">{totalCount}</h3>
                  <p className="text-cyan-300 font-medium text-xl">Worlds Discovered</p>
                  <p className="text-gray-400 text-sm mt-2">Scientifically analyzed exoplanets from across the galaxy</p>
                </div>
              </div>
            </div>
          </div>


          {/* Enhanced Statistics */}
          <EnhancedExoplanetStats
            totalExoplanets={totalCount}
            nasaExoplanets={nasaCount}
            localExoplanets={localCount}
            userAddedExoplanets={userAddedCount}
            habitablePlanets={habitablePlanetsCount}
            discoveryMethods={discoveryMethods}
            latestDiscovery={latestDiscovery}
            averageDistance={averageDistance}
          />

          {/* Search and Controls */}
          <div className="backdrop-blur-xl bg-black/40 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={onCompareClick}
                className="flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg shadow-cyan-500/30 text-sm md:text-base"
              >
                <BarChart3 className="w-4 md:w-5 h-4 md:h-5" />
                <span>Compare Worlds</span>
              </button>
              
              <button
                onClick={() => setShowNASAModal(true)}
                className="flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg shadow-purple-500/30 text-sm md:text-base"
              >
                <Database className="w-4 md:w-5 h-4 md:h-5" />
                <span>NASA Exoplanets</span>
              </button>
              
              <button
                onClick={() => setShowNASADataViewer(true)}
                className="flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg shadow-indigo-500/30 text-sm md:text-base"
              >
                <FileSpreadsheet className="w-4 md:w-5 h-4 md:h-5" />
                <span>NASA Data Archive</span>
              </button>
              
              <button
                onClick={() => setShowTeamModal(true)}
                className="flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg shadow-emerald-500/30 text-sm md:text-base"
              >
                <Users className="w-4 md:w-5 h-4 md:h-5" />
                <span>Meet Our Team</span>
              </button>
              
              <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg shadow-green-500/30 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 md:w-5 h-4 md:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Real Data'}</span>
              </button>
            </div>
          </div>

          {/* Exoplanet Section Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Explore {totalCount} Real NASA Exoplanets
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search exoplanets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-black/60 border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-400 backdrop-blur-sm transition-all duration-300 text-sm w-64"
                  />
                </div>
                
                {/* Filter Options */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-purple-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'habitability' | 'distance')}
                    className="bg-black/60 border border-purple-500/50 rounded-xl text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/70 backdrop-blur-sm transition-all duration-300 text-sm"
                  >
                    <option value="habitability">Sort by Habitability</option>
                    <option value="distance">Sort by Distance</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Floating Exoplanet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredExoplanets.map((exoplanet, index) => (
              <div
                key={exoplanet.id}
                className="transform hover:scale-105 hover:-translate-y-2 md:hover:-translate-y-4 transition-all duration-500"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <ExoplanetCard
                  exoplanet={exoplanet}
                  onClick={() => onExoplanetSelect(exoplanet.id)}
                />
              </div>
            ))}
          </div>

          {filteredExoplanets.length === 0 && (
            <div className="text-center py-8 md:py-16 backdrop-blur-xl bg-black/40 rounded-2xl md:rounded-3xl border border-gray-500/30">
              <div className="w-16 md:w-24 h-16 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center animate-pulse">
                <Search className="w-8 md:w-12 h-8 md:h-12 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg md:text-xl px-4">
                {showOnlyHabitable 
                  ? "No highly habitable worlds found in this sector of space." 
                  : "No cosmic worlds found in this sector of space."
                }
              </p>
              <p className="text-gray-500 text-sm mt-2 px-4">
                {showOnlyHabitable 
                  ? "Try showing all worlds or adjusting your search parameters." 
                  : "Try adjusting your search parameters to explore different regions."
                }
              </p>
            </div>
          )}

          {/* NASA Search Modal */}
          <NASASearchModal
            isOpen={showNASAModal}
            onClose={() => setShowNASAModal(false)}
            onPlanetSelect={(planetData) => {
              if (onAddNASAPlanet) {
                onAddNASAPlanet(planetData);
              }
            }}
          />

          {/* NASA Data Viewer */}
          <NASADataViewer
            isOpen={showNASADataViewer}
            onClose={() => setShowNASADataViewer(false)}
            allExoplanets={displayExoplanets}
            onPlanetSelect={(planetData) => {
              if (onAddNASAPlanet) {
                onAddNASAPlanet(planetData);
              }
            }}
          />

          {/* Team Modal */}
          <TeamSection
            isOpen={showTeamModal}
            onClose={() => setShowTeamModal(false)}
          />
        </div>
      </div>

      {/* Custom CSS for horizontal rotation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
};