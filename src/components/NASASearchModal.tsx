import React, { useState, useEffect } from 'react';
import { Search, X, Satellite, Globe, Calendar, Zap, Loader } from 'lucide-react';
import { nasaExoplanetService, FuzzyMatch, NASAExoplanetData } from '../services/nasaExoplanetService';

interface NASASearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanetSelect: (planetData: any) => void;
}

export const NASASearchModal: React.FC<NASASearchModalProps> = ({ isOpen, onClose, onPlanetSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [planetNames, setPlanetNames] = useState<string[]>([]);
  const [fuzzyMatches, setFuzzyMatches] = useState<FuzzyMatch[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<NASAExoplanetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load planet names when modal opens
  useEffect(() => {
    if (isOpen && planetNames.length === 0) {
      loadPlanetNames();
    }
  }, [isOpen]);

  // Perform fuzzy search when query changes
  useEffect(() => {
    if (searchQuery.trim() && planetNames.length > 0) {
      const matches = nasaExoplanetService.fuzzySearch(searchQuery, planetNames, 8);
      setFuzzyMatches(matches);
    } else {
      setFuzzyMatches([]);
    }
  }, [searchQuery, planetNames]);

  const loadPlanetNames = async () => {
    setIsLoadingNames(true);
    setError(null);
    try {
      const names = await nasaExoplanetService.loadPlanetNames();
      setPlanetNames(names);
      if (names.length === 0) {
        setError('No planet names could be loaded from NASA Archive');
      }
    } catch (err) {
      setError('Failed to connect to NASA Exoplanet Archive');
    } finally {
      setIsLoadingNames(false);
    }
  };

  const handlePlanetSelect = async (planetName: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedPlanet(null);

    try {
      const planetData = await nasaExoplanetService.fetchPlanetDetails(planetName);
      if (planetData) {
        setSelectedPlanet(planetData);
      } else {
        setError('No detailed data found for this planet');
      }
    } catch (err) {
      setError('Failed to fetch planet details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToApp = () => {
    if (selectedPlanet) {
      const convertedPlanet = nasaExoplanetService.convertToExoplanet(
        selectedPlanet, 
        `nasa-${Date.now()}`
      );
      onPlanetSelect(convertedPlanet);
      onClose();
      setSearchQuery('');
      setSelectedPlanet(null);
      setFuzzyMatches([]);
    }
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
    setSelectedPlanet(null);
    setFuzzyMatches([]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-black/90 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NASA Exoplanet Archive
              </h2>
              <p className="text-gray-400 text-sm">
                Search {planetNames.length.toLocaleString()} real exoplanets from NASA's database
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Search Panel */}
          <div className="w-1/2 p-6 border-r border-cyan-500/30">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search exoplanets (e.g., Kepler-452b, TRAPPIST-1e)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoadingNames}
                className="w-full pl-12 pr-4 py-3 bg-black/60 border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-400 backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
              />
            </div>

            {isLoadingNames && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3 text-cyan-400">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Loading NASA database...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-xl mb-4">
                <p className="text-red-300 text-sm">{error}</p>
                <button
                  onClick={loadPlanetNames}
                  className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Search Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {fuzzyMatches.map((match, index) => (
                <button
                  key={index}
                  onClick={() => handlePlanetSelect(match.name)}
                  disabled={isLoading}
                  className="w-full text-left p-4 rounded-xl backdrop-blur-sm bg-black/40 hover:bg-black/60 transition-all duration-300 text-white border border-cyan-500/20 hover:border-cyan-400/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium">{match.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">{match.score}% match</span>
                      <div 
                        className="w-12 h-1 bg-black/60 rounded-full overflow-hidden"
                      >
                        <div 
                          className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                          style={{ width: `${match.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {searchQuery && fuzzyMatches.length === 0 && !isLoadingNames && (
                <div className="text-center py-8 text-gray-400">
                  <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No matching exoplanets found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-1/2 p-6">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-3 text-cyan-400">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Fetching planet data...</span>
                </div>
              </div>
            )}

            {selectedPlanet && !isLoading && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span>{selectedPlanet.pl_name}</span>
                  </h3>

                  <div className="space-y-4">
                    {/* Physical Properties */}
                    <div className="backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-gray-700/30">
                      <h4 className="text-white font-semibold mb-3">Physical Properties</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {selectedPlanet.pl_rade && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Radius:</span>
                            <span className="text-white">{selectedPlanet.pl_rade.toFixed(2)} R⊕</span>
                          </div>
                        )}
                        {selectedPlanet.pl_bmasse && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Mass:</span>
                            <span className="text-white">{selectedPlanet.pl_bmasse.toFixed(2)} M⊕</span>
                          </div>
                        )}
                        {selectedPlanet.pl_eqt && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Temperature:</span>
                            <span className="text-white">{Math.round(selectedPlanet.pl_eqt)} K</span>
                          </div>
                        )}
                        {selectedPlanet.pl_orbper && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Orbital Period:</span>
                            <span className="text-white">{selectedPlanet.pl_orbper.toFixed(1)} days</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stellar Properties */}
                    <div className="backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-gray-700/30">
                      <h4 className="text-white font-semibold mb-3">Host Star</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {selectedPlanet.st_teff && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Temperature:</span>
                            <span className="text-white">{Math.round(selectedPlanet.st_teff)} K</span>
                          </div>
                        )}
                        {selectedPlanet.st_mass && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Mass:</span>
                            <span className="text-white">{selectedPlanet.st_mass.toFixed(2)} M☉</span>
                          </div>
                        )}
                        {selectedPlanet.st_rad && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Radius:</span>
                            <span className="text-white">{selectedPlanet.st_rad.toFixed(2)} R☉</span>
                          </div>
                        )}
                        {selectedPlanet.st_age && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Age:</span>
                            <span className="text-white">{selectedPlanet.st_age.toFixed(1)} Gyr</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Discovery Information */}
                    <div className="backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-gray-700/30">
                      <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>Discovery</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        {selectedPlanet.disc_year && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Year:</span>
                            <span className="text-white">{selectedPlanet.disc_year}</span>
                          </div>
                        )}
                        {selectedPlanet.discoverymethod && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Method:</span>
                            <span className="text-white text-xs">{selectedPlanet.discoverymethod}</span>
                          </div>
                        )}
                        {selectedPlanet.disc_facility && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Facility:</span>
                            <span className="text-white text-xs">{selectedPlanet.disc_facility}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <div className="mt-6 pt-4 border-t border-gray-700/30">
                  <button
                    onClick={handleAddToApp}
                    className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Add to Cosmic-LifeMapper</span>
                  </button>
                </div>
              </div>
            )}

            {!selectedPlanet && !isLoading && (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Satellite className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select an exoplanet</p>
                  <p className="text-sm">Search and click on a planet to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};