import React, { useState } from 'react';
import { Exoplanet } from '../types/exoplanet';
import { ArrowLeft, Globe, Thermometer, Star, Clock, Search } from 'lucide-react';

interface ComparisonToolProps {
  onBack: () => void;
  allExoplanets?: Exoplanet[];
}

export const ComparisonTool: React.FC<ComparisonToolProps> = ({ onBack, allExoplanets = [] }) => {
  const [selectedPlanets, setSelectedPlanets] = useState<[Exoplanet | null, Exoplanet | null]>([null, null]);
  const [searchTerms, setSearchTerms] = useState<[string, string]>(['', '']);

  const handlePlanetSelect = (planet: Exoplanet, index: 0 | 1) => {
    const newSelection: [Exoplanet | null, Exoplanet | null] = [...selectedPlanets];
    newSelection[index] = planet;
    setSelectedPlanets(newSelection);
  };

  const handleSearchChange = (term: string, index: 0 | 1) => {
    const newSearchTerms: [string, string] = [...searchTerms];
    newSearchTerms[index] = term;
    setSearchTerms(newSearchTerms);
  };

  const getFilteredPlanets = (index: 0 | 1) => {
    return allExoplanets.filter(p => 
      p.name.toLowerCase().includes(searchTerms[index].toLowerCase()) &&
      !selectedPlanets.includes(p)
    );
  };

  const ComparisonCard: React.FC<{ planet: Exoplanet | null; index: 0 | 1 }> = ({ planet, index }) => {
    const filteredPlanets = getFilteredPlanets(index);
    
    if (!planet) {
      return (
        <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-cyan-500/30 border-dashed hover:border-cyan-400/70 transition-all duration-300 transform hover:scale-105">
          <h3 className="text-xl font-bold text-gray-400 mb-6 text-center">Select Cosmic World {index + 1}</h3>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exoplanets..."
              value={searchTerms[index]}
              onChange={(e) => handleSearchChange(e.target.value, index)}
              className="w-full pl-10 pr-4 py-3 bg-black/60 border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-400 backdrop-blur-sm transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {filteredPlanets.length > 0 ? (
              filteredPlanets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePlanetSelect(p, index)}
                  className="w-full text-left p-4 rounded-xl backdrop-blur-sm bg-black/40 hover:bg-black/60 transition-all duration-300 text-white border border-cyan-500/20 hover:border-cyan-400/50 transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-sm text-gray-400">{p.habitabilityScore}% habitable</span>
                  </div>
                </button>
              ))
            ) : (
              <button
                disabled
                className="w-full text-left p-4 rounded-xl backdrop-blur-sm bg-black/40 text-gray-500 border border-gray-500/20 cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">No exoplanets found</span>
                  <span className="text-sm text-gray-500">Try different search terms</span>
                </div>
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{planet.name}</h3>
          <button
            onClick={() => handlePlanetSelect(null as any, index)}
            className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-black/30"
          >
            Change
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 backdrop-blur-sm bg-black/40 rounded-xl border border-blue-500/30 transform hover:scale-105 transition-all duration-300">
              <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3 animate-pulse" />
              <p className="text-xs text-gray-400 mb-1">Distance</p>
              <p className="text-lg font-bold text-white">{planet.distance} ly</p>
            </div>
            <div className="text-center p-4 backdrop-blur-sm bg-black/40 rounded-xl border border-red-500/30 transform hover:scale-105 transition-all duration-300">
              <Thermometer className="w-8 h-8 text-red-400 mx-auto mb-3 animate-pulse" />
              <p className="text-xs text-gray-400 mb-1">Temperature</p>
              <p className="text-lg font-bold text-white">{planet.temperature}K</p>
            </div>
            <div className="text-center p-4 backdrop-blur-sm bg-black/40 rounded-xl border border-yellow-500/30 transform hover:scale-105 transition-all duration-300">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3 animate-pulse" />
              <p className="text-xs text-gray-400 mb-1">Mass</p>
              <p className="text-lg font-bold text-white">{planet.mass}M⊕</p>
            </div>
            <div className="text-center p-4 backdrop-blur-sm bg-black/40 rounded-xl border border-green-500/30 transform hover:scale-105 transition-all duration-300">
              <Clock className="w-8 h-8 text-green-400 mx-auto mb-3 animate-pulse" />
              <p className="text-xs text-gray-400 mb-1">Orbit</p>
              <p className="text-lg font-bold text-white">{planet.orbitalPeriod}d</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-400 font-medium">Habitability Score</p>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-black/60 rounded-full h-4 overflow-hidden border border-gray-700/30">
                <div
                  className={`h-4 rounded-full shadow-lg transition-all duration-1000 ${
                    planet.habitabilityScore >= 80
                      ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-500'
                      : planet.habitabilityScore >= 60
                      ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400'
                      : 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-500'
                  }`}
                  style={{ width: `${planet.habitabilityScore}%` }}
                ></div>
              </div>
              <span className="text-lg font-bold text-white">{planet.habitabilityScore}%</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium">Key Minerals</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-black/40 rounded-lg border border-cyan-500/20">
                <span className="text-gray-300">Water:</span>
                <span className="text-cyan-400 font-bold">{planet.minerals.water}%</span>
              </div>
              <div className="flex justify-between p-2 bg-black/40 rounded-lg border border-orange-500/20">
                <span className="text-gray-300">Iron:</span>
                <span className="text-orange-400 font-bold">{planet.minerals.iron}%</span>
              </div>
              <div className="flex justify-between p-2 bg-black/40 rounded-lg border border-purple-500/20">
                <span className="text-gray-300">Carbon:</span>
                <span className="text-purple-400 font-bold">{planet.minerals.carbon}%</span>
              </div>
              <div className="flex justify-between p-2 bg-black/40 rounded-lg border border-gray-500/20">
                <span className="text-gray-300">Silicon:</span>
                <span className="text-gray-400 font-bold">{planet.minerals.silicon}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Deep Space Background */}
      <div className="absolute inset-0">
        {/* Deep Space Black Background */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Subtle Space Nebula */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[450px] bg-gradient-radial from-purple-900/5 via-purple-900/2 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[450px] h-[350px] bg-gradient-radial from-blue-900/4 via-blue-900/1 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-[250px] h-[250px] bg-gradient-radial from-indigo-900/3 via-indigo-900/1 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Realistic Star Field */}
        <div className="absolute inset-0">
          {/* Tiny distant stars */}
          <div className="absolute top-[11%] left-[16%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[26%] left-[36%] w-px h-px bg-white rounded-full opacity-65"></div>
          <div className="absolute top-[42%] left-[73%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[57%] left-[22%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[73%] left-[81%] w-px h-px bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[16%] left-[84%] w-px h-px bg-white rounded-full opacity-60"></div>
          <div className="absolute top-[34%] left-[8%] w-px h-px bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[49%] left-[46%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[66%] left-[13%] w-px h-px bg-white rounded-full opacity-65"></div>
          <div className="absolute top-[84%] left-[56%] w-px h-px bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[8%] left-[52%] w-px h-px bg-white rounded-full opacity-60"></div>
          <div className="absolute top-[38%] left-[91%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[61%] left-[5%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[79%] left-[39%] w-px h-px bg-white rounded-full opacity-65"></div>
          <div className="absolute top-[21%] left-[71%] w-px h-px bg-white rounded-full opacity-85"></div>
          
          {/* Small stars */}
          <div className="absolute top-[28%] left-[24%] w-0.5 h-0.5 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[64%] left-[67%] w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[46%] left-[87%] w-0.5 h-0.5 bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[12%] left-[61%] w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[86%] left-[26%] w-0.5 h-0.5 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[33%] left-[14%] w-0.5 h-0.5 bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[71%] left-[93%] w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          
          {/* Medium bright stars */}
          <div className="absolute top-[19%] left-[58%] w-1 h-1 bg-white rounded-full opacity-90"></div>
          <div className="absolute top-[68%] left-[35%] w-1 h-1 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[47%] left-[29%] w-1 h-1 bg-white rounded-full opacity-80"></div>
          
          {/* Bright prominent stars */}
          <div className="absolute top-[32%] left-[66%] w-1.5 h-1.5 bg-white rounded-full opacity-95"></div>
          <div className="absolute top-[59%] left-[18%] w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
          
          {/* Very distant galaxies */}
          <div className="absolute top-[23%] left-[88%] w-2 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-sm transform rotate-18"></div>
          <div className="absolute top-[74%] left-[7%] w-3 h-0.5 bg-gradient-to-r from-transparent via-white/8 to-transparent rounded-full blur-sm transform -rotate-22"></div>
        </div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto px-2 md:px-0">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 md:space-x-3 text-white hover:text-cyan-400 transition-all duration-300 backdrop-blur-xl bg-black/40 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-cyan-500/30 hover:border-cyan-400/70 transform hover:scale-105 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 md:w-5 h-4 md:h-5" />
              <span>Return to Cosmos</span>
            </button>
          </div>

          <div className="text-center mb-8 md:mb-12 transform hover:scale-105 transition-transform duration-500">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Cosmic World Comparison
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto backdrop-blur-sm bg-black/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-500/20">
              Compare two exoplanets side by side to analyze their unique characteristics and potential for life
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <ComparisonCard planet={selectedPlanets[0]} index={0} />
            <ComparisonCard planet={selectedPlanets[1]} index={1} />
          </div>

          {selectedPlanets[0] && selectedPlanets[1] && (
            <div className="backdrop-blur-xl bg-black/40 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-500/30 shadow-2xl shadow-purple-500/20 transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">Comparison Analysis</h3>
              <div className="grid md:grid-cols-3 gap-4 md:gap-8">
                <div className="text-center p-4 md:p-6 backdrop-blur-sm bg-black/40 rounded-xl border border-emerald-500/30 transform hover:scale-105 transition-all duration-300">
                  <h4 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">More Habitable</h4>
                  <p className="text-lg md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent break-words">
                    {selectedPlanets[0].habitabilityScore > selectedPlanets[1].habitabilityScore
                      ? selectedPlanets[0].name
                      : selectedPlanets[1].name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
                    {Math.max(selectedPlanets[0].habitabilityScore, selectedPlanets[1].habitabilityScore)}% habitability
                  </p>
                </div>
                <div className="text-center p-4 md:p-6 backdrop-blur-sm bg-black/40 rounded-xl border border-blue-500/30 transform hover:scale-105 transition-all duration-300">
                  <h4 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">Closer to Earth</h4>
                  <p className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent break-words">
                    {selectedPlanets[0].distance < selectedPlanets[1].distance
                      ? selectedPlanets[0].name
                      : selectedPlanets[1].name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
                    {Math.min(selectedPlanets[0].distance, selectedPlanets[1].distance)} light years
                  </p>
                </div>
                <div className="text-center p-4 md:p-6 backdrop-blur-sm bg-black/40 rounded-xl border border-cyan-500/30 transform hover:scale-105 transition-all duration-300">
                  <h4 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">More Water</h4>
                  <p className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent break-words">
                    {selectedPlanets[0].minerals.water > selectedPlanets[1].minerals.water
                      ? selectedPlanets[0].name
                      : selectedPlanets[1].name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
                    {Math.max(selectedPlanets[0].minerals.water, selectedPlanets[1].minerals.water)}% water content
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};