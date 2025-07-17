import React, { useState, useEffect } from 'react';
import { Search, X, Satellite, Globe, Calendar, Zap, Loader, Book, Info } from 'lucide-react';
import { nasaExoplanetService, FuzzyMatch, NASAExoplanetData } from '../services/nasaExoplanetService';
import { NASAParameterGuide } from './NASAParameterGuide';
import { formatParameterValue, getParameterDefinition } from '../utils/nasaParameterDefinitions';

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
  const [showParameterGuide, setShowParameterGuide] = useState(false);

  // Add connection status
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'fallback'>('checking');

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
    setConnectionStatus('checking');
    try {
      const names = await nasaExoplanetService.loadPlanetNames();
      setPlanetNames(names);
      if (names.length === 0) {
        setError('No planet names could be loaded from NASA Archive');
        setConnectionStatus('fallback');
      } else if (names.length < 100) {
        // If we got a small number, it might be fallback data
        setConnectionStatus('fallback');
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
        setConnectionStatus('connected');
        setError('No detailed data found for this planet');
      }
    } catch (err) {
      setError('Failed to fetch planet details');
      setConnectionStatus('fallback');
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
      <div className="backdrop-blur-xl bg-black/90 rounded-2xl md:rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Satellite className="w-4 md:w-5 h-4 md:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NASA Exoplanet Archive
                {connectionStatus === 'fallback' && (
                  <span className="text-yellow-400 text-sm ml-2">(Offline Mode)</span>
                )}
              </h2>
              <p className="text-gray-400 text-xs md:text-sm">
                {connectionStatus === 'connected' 
                  ? `Search ${planetNames.length.toLocaleString()} real exoplanets from NASA's database`
                  : connectionStatus === 'fallback'
                  ? `Offline mode: ${planetNames.length} sample exoplanets available`
                  : 'Connecting to NASA database...'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={() => setShowParameterGuide(true)}
              className="hidden md:flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg"
              title="Parameter Guide"
            >
              <Book className="w-5 h-5" />
              <span className="text-sm">Guide</span>
            </button>
            <button
              onClick={() => setShowParameterGuide(true)}
              className="md:hidden text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg"
              title="Parameter Guide"
            >
              <Book className="w-5 h-5" />
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 md:w-6 h-5 md:h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-[500px] md:h-[600px]">
          {/* Search Panel */}
          <div className="w-full md:w-1/2 p-3 md:p-6 border-b md:border-b-0 md:border-r border-cyan-500/30">
            <div className="relative mb-4 md:mb-6">
              <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 md:w-5 h-4 md:h-5" />
              <input
                type="text"
                placeholder="Search exoplanets (e.g., Kepler-452b, TRAPPIST-1e)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoadingNames}
                className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 bg-black/60 border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-400 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
              />
            </div>

            {isLoadingNames && (
              <div className="flex items-center justify-center py-8 md:py-12">
                <div className="flex items-center space-x-2 md:space-x-3 text-cyan-400">
                  <Loader className="w-5 md:w-6 h-5 md:h-6 animate-spin" />
                  <span className="text-sm md:text-base">Loading NASA database...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 md:p-4 bg-red-900/40 border border-red-500/50 rounded-xl mb-3 md:mb-4">
                <p className="text-red-300 text-xs md:text-sm">{error}</p>
                {connectionStatus === 'fallback' && (
                  <p className="text-yellow-300 text-xs mt-2">
                    Using offline mode with sample planets. Some features may be limited.
                  </p>
                )}
                <button
                  onClick={loadPlanetNames}
                  className="mt-1 md:mt-2 text-red-400 hover:text-red-300 text-xs md:text-sm underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Search Results */}
            <div className="space-y-2 max-h-64 md:max-h-96 overflow-y-auto">
              {fuzzyMatches.map((match, index) => (
                <button
                  key={index}
                  onClick={() => handlePlanetSelect(match.name)}
                  disabled={isLoading}
                  className="w-full text-left p-3 md:p-4 rounded-lg md:rounded-xl backdrop-blur-sm bg-black/40 hover:bg-black/60 transition-all duration-300 text-white border border-cyan-500/20 hover:border-cyan-400/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Globe className="w-3 md:w-4 h-3 md:h-4 text-cyan-400" />
                      <span className="font-medium text-sm md:text-base truncate">{match.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">{match.score}% match</span>
                      <div 
                        className="w-8 md:w-12 h-1 bg-black/60 rounded-full overflow-hidden"
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
                <div className="text-center py-6 md:py-8 text-gray-400">
                  <Globe className="w-8 md:w-12 h-8 md:h-12 mx-auto mb-2 md:mb-3 opacity-50" />
                  <p className="text-sm md:text-base">No matching exoplanets found</p>
                  <p className="text-xs md:text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-full md:w-1/2 p-3 md:p-6">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-2 md:space-x-3 text-cyan-400">
                  <Loader className="w-5 md:w-6 h-5 md:h-6 animate-spin" />
                  <span className="text-sm md:text-base">Fetching planet data...</span>
                </div>
              </div>
            )}

            {selectedPlanet && !isLoading && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center space-x-2">
                    <Globe className="w-4 md:w-5 h-4 md:h-5 text-cyan-400" />
                    <span className="truncate">{selectedPlanet.pl_name}</span>
                  </h3>

                  <div className="space-y-3 md:space-y-4">
                    {/* Physical Properties */}
                    <div className="backdrop-blur-sm bg-black/40 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-700/30">
                      <h4 className="text-white font-semibold mb-2 md:mb-3 flex items-center space-x-2 text-sm md:text-base">
                        <Globe className="w-3 md:w-4 h-3 md:h-4 text-cyan-400" />
                        <span>Physical Properties</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                        {selectedPlanet.pl_rade && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Radius (pl_rade):</span>
                            </span>
                            <span className="text-white text-right">{formatParameterValue('pl_rade', selectedPlanet.pl_rade)}</span>
                          </div>
                        )}
                        {selectedPlanet.pl_bmasse && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Mass (pl_bmasse):</span>
                            </span>
                            <span className="text-white text-right">{formatParameterValue('pl_bmasse', selectedPlanet.pl_bmasse)}</span>
                          </div>
                        )}
                        {selectedPlanet.pl_eqt && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Temperature (pl_eqt):</span>
                            </span>
                            <span className="text-white text-right">{formatParameterValue('pl_eqt', selectedPlanet.pl_eqt)}</span>
                          </div>
                        )}
                        {selectedPlanet.pl_orbper && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Orbital Period (pl_orbper):</span>
                            </span>
                            <span className="text-white text-right">{formatParameterValue('pl_orbper', selectedPlanet.pl_orbper)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stellar Properties */}
                    <div className="backdrop-blur-sm bg-black/40 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-700/30">
                      <h4 className="text-white font-semibold mb-2 md:mb-3 flex items-center space-x-2 text-sm md:text-base">
                        <Star className="w-3 md:w-4 h-3 md:h-4 text-yellow-400" />
                        <span>Host Star</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                        {selectedPlanet.st_teff && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Temperature (st_teff):</span>
                            </span>
                            <span className="text-white text-right">{formatParameterValue('st_teff', selectedPlanet.st_teff)}</span>
                          </div>
                        )}
                        {selectedPlanet.st_mass && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Mass (st_mass):</span>
                            </span>
                            <span className="text-white text-right">{formatParameterValue('st_mass', selectedPlanet.st_mass)}</span>
                          </div>
                        )}
                        {selectedPlanet.st_rad && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Radius (st_rad):</span>
                            </span>
                            <span className="text-white text-right">{formatParameterValue('st_rad', selectedPlanet.st_rad)}</span>
                          </div>
                        )}
                        {selectedPlanet.st_age && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Age (st_age):</span>
                            </span>
                            <span className="text-white text-right">{formatParameterValue('st_age', selectedPlanet.st_age)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Discovery Information */}
                    <div className="backdrop-blur-sm bg-black/40 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-700/30">
                      <h4 className="text-white font-semibold mb-2 md:mb-3 flex items-center space-x-2 text-sm md:text-base">
                        <Calendar className="w-3 md:w-4 h-3 md:h-4 text-cyan-400" />
                        <span>Discovery</span>
                      </h4>
                      <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                        {selectedPlanet.disc_year && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Year (disc_year):</span>
                            </span>
                            <span className="text-white text-right">{formatParameterValue('disc_year', selectedPlanet.disc_year)}</span>
                          </div>
                        )}
                        {selectedPlanet.discoverymethod && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Method:</span>
                            </span>
                            <span className="text-white text-right text-xs truncate max-w-32">{selectedPlanet.discoverymethod}</span>
                          </div>
                        )}
                        {selectedPlanet.disc_facility && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center space-x-1 truncate">
                              <Info className="w-2 md:w-3 h-2 md:h-3 flex-shrink-0" />
                              <span>Facility:</span>
                            </span>
                            <span className="text-white text-right text-xs truncate max-w-32">{selectedPlanet.disc_facility}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <div className="mt-3 md:mt-6 pt-3 md:pt-4 border-t border-gray-700/30">
                  <button
                    onClick={handleAddToApp}
                    className="w-full flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 px-4 md:px-6 py-2 md:py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30 text-sm md:text-base"
                  >
                    <Zap className="w-4 md:w-5 h-4 md:h-5" />
                    <span>Add to Cosmic-LifeMapper</span>
                  </button>
                </div>
              </div>
            )}

            {!selectedPlanet && !isLoading && (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Satellite className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-3 md:mb-4 opacity-50" />
                  <p className="text-base md:text-lg">Select an exoplanet</p>
                  <p className="text-xs md:text-sm">Search and click on a planet to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parameter Guide Modal */}
      <NASAParameterGuide
        isOpen={showParameterGuide}
        onClose={() => setShowParameterGuide(false)}
      />
    </div>
  );
};