import React, { useState } from 'react';
import { exoplanets, EXOPLANET_COUNT } from '../data/exoplanets';
import { ExoplanetCard } from './ExoplanetCard';
import { Search, Filter, Rocket, BarChart3, Globe, Zap } from 'lucide-react';

interface DashboardProps {
  onExoplanetSelect: (id: string) => void;
  onCompareClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onExoplanetSelect, onCompareClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'habitability' | 'distance'>('habitability');
  const [showOnlyHabitable, setShowOnlyHabitable] = useState(false);

  const filteredExoplanets = exoplanets
    .filter(planet => 
      planet && 
      planet.name && 
      typeof planet.name === 'string' && 
      planet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!showOnlyHabitable || planet.habitabilityScore >= 70) // Only show planets with 70%+ habitability
    )
    .sort((a, b) => {
      if (!a || !b) return 0;
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'habitability':
          return (Number(b.habitabilityScore) || 0) - (Number(a.habitabilityScore) || 0);
        case 'distance':
          return (Number(a.distance) || 0) - (Number(b.distance) || 0);
        default:
          return 0;
      }
    });

  const habitablePlanetsCount = exoplanets.filter(p => p && typeof p.habitabilityScore === 'number' && p.habitabilityScore >= 70).length;

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
              Journey through the infinite cosmos to discover {EXOPLANET_COUNT} scientifically analyzed exoplanets. 
              Explore their mysterious compositions, analyze their life potential, and compare their unique cosmic signatures.
            </p>
          </div>

          {/* Floating Search and Controls */}
          <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 mb-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search the infinite cosmos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/60 border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-400 backdrop-blur-sm transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <Filter className="w-5 h-5 text-purple-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'habitability' | 'distance')}
                    className="bg-black/60 border border-purple-500/50 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/70 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="habitability">Sort by Habitability</option>
                    <option value="distance">Sort by Distance</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
                
                <button
                  onClick={onCompareClick}
                  className="flex items-center space-x-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg shadow-cyan-500/30"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Compare Worlds</span>
                </button>
              </div>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-lg">{EXOPLANET_COUNT}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">{EXOPLANET_COUNT}</h3>
                  <p className="text-cyan-300 font-medium">Worlds Discovered</p>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-lg">{habitablePlanetsCount}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">{habitablePlanetsCount}</h3>
                  <p className="text-emerald-300 font-medium">Life Candidates</p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs text-emerald-400">
                  {Math.round((habitablePlanetsCount / EXOPLANET_COUNT) * 100)}% of discovered worlds
                </p>
              </div>
            </div>
            {/* Habitable Exoplanets Interactive Card */}
            <div 
              onClick={() => setShowOnlyHabitable(!showOnlyHabitable)}
              className={`backdrop-blur-xl bg-black/40 rounded-3xl p-8 border shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                showOnlyHabitable 
                  ? 'border-emerald-500/50 shadow-emerald-500/40 hover:shadow-emerald-500/60' 
                  : 'border-purple-500/30 shadow-purple-500/20 hover:shadow-purple-500/40'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center animate-pulse ${
                  showOnlyHabitable 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                    : 'bg-gradient-to-r from-purple-500 to-violet-500'
                }`}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-3xl font-bold mb-1 ${
                    showOnlyHabitable ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {showOnlyHabitable ? 'ON' : 'OFF'}
                  </h3>
                  <p className={`font-medium ${
                    showOnlyHabitable ? 'text-emerald-300' : 'text-purple-300'
                  }`}>
                    Habitable Exoplanets
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  {showOnlyHabitable ? 'Showing life candidates only' : 'Click to filter by life potential'}
                </p>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8 text-center">
            <p className="text-gray-300 text-lg backdrop-blur-sm bg-black/20 rounded-xl p-4 border border-gray-500/20 inline-block">
              {showOnlyHabitable ? (
                <>
                  Displaying <span className="text-emerald-400 font-bold">{filteredExoplanets.length}</span> habitable worlds with <span className="text-green-400 font-bold">70%+</span> life potential
                </>
              ) : (
                <>
                  Displaying <span className="text-cyan-400 font-bold">{filteredExoplanets.length}</span> of <span className="text-purple-400 font-bold">{EXOPLANET_COUNT}</span> cosmic worlds
                </>
              )}
            </p>
          </div>

          {/* Floating Exoplanet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExoplanets.map((exoplanet, index) => (
              <div
                key={exoplanet.id}
                className="transform hover:scale-105 hover:-translate-y-4 transition-all duration-500"
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
            <div className="text-center py-16 backdrop-blur-xl bg-black/40 rounded-3xl border border-gray-500/30">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center animate-pulse">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-400 text-xl">
                {showOnlyHabitable 
                  ? "No highly habitable worlds found in this sector of space." 
                  : "No cosmic worlds found in this sector of space."
                }
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {showOnlyHabitable 
                  ? "Try showing all worlds or adjusting your search parameters." 
                  : "Try adjusting your search parameters to explore different regions."
                }
              </p>
            </div>
          )}
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