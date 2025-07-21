import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader, Zap, Globe, X } from 'lucide-react';
import { fuzzySearchService, FuzzySearchMatch, highlightMatch } from '../services/fuzzySearchService';
import { nasaExoplanetService } from '../services/nasaExoplanetService';

interface FuzzySearchBarProps {
  onPlanetSelect?: (planetData: any) => void;
  placeholder?: string;
  className?: string;
}

export const FuzzySearchBar: React.FC<FuzzySearchBarProps> = ({ 
  onPlanetSelect,
  placeholder = "Search exoplanets with fuzzy matching...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<FuzzySearchMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchTime, setSearchTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize fuzzy search when component mounts
  useEffect(() => {
    initializeFuzzySearch();
  }, []);

  // Handle search when query changes
  useEffect(() => {
    if (query.trim().length >= 2 && isReady) {
      performFuzzySearch(query);
    } else {
      setMatches([]);
      setShowResults(false);
    }
  }, [query, isReady]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showResults || matches.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, matches.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < matches.length) {
            handlePlanetSelect(matches[selectedIndex]);
          }
          break;
        case 'Escape':
          setShowResults(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    if (showResults) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showResults, matches, selectedIndex]);

  const initializeFuzzySearch = async () => {
    setIsInitializing(true);
    try {
      console.log('🔍 Initializing fuzzy search engine...');
      
      // Load planet names from NASA service
      const planetNames = await nasaExoplanetService.loadPlanetNames();
      
      if (planetNames.length === 0) {
        throw new Error('No planet names loaded');
      }
      
      // Initialize fuzzy search service
      await fuzzySearchService.initialize(planetNames);
      
      setIsReady(true);
      console.log(`✅ Fuzzy search ready with ${planetNames.length} planets`);
      
    } catch (error) {
      console.error('❌ Failed to initialize fuzzy search:', error);
      setIsReady(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const performFuzzySearch = async (searchQuery: string) => {
    if (!fuzzySearchService.isReady()) return;
    
    setIsLoading(true);
    
    try {
      // Use advanced search for better results
      const results = fuzzySearchService.advancedSearch(searchQuery, 8);
      
      setMatches(results.matches);
      setSearchTime(results.searchTime);
      setShowResults(results.matches.length > 0);
      setSelectedIndex(-1);
      
      console.log(`🔍 Found ${results.totalFound} matches in ${results.searchTime}ms`);
      
    } catch (error) {
      console.error('❌ Fuzzy search error:', error);
      setMatches([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanetSelect = async (match: FuzzySearchMatch) => {
    setQuery(match.name);
    setShowResults(false);
    setSelectedIndex(-1);
    
    if (onPlanetSelect) {
      try {
        console.log(`🌍 Fetching details for: ${match.name}`);
        
        // Fetch detailed planet data
        const planetData = await nasaExoplanetService.fetchPlanetDetails(match.name);
        
        if (planetData) {
          // Convert to internal format
          const convertedPlanet = nasaExoplanetService.convertToExoplanet(
            planetData,
            `fuzzy-${Date.now()}`
          );
          
          onPlanetSelect(convertedPlanet);
          console.log(`✅ Added ${match.name} to collection`);
        } else {
          console.warn(`⚠️ No detailed data found for ${match.name}`);
        }
        
      } catch (error) {
        console.error(`❌ Error fetching planet details:`, error);
      }
    }
  };

  const clearSearch = () => {
    setQuery('');
    setMatches([]);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 85) return 'text-cyan-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 65) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 95) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (score >= 85) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    if (score >= 75) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (score >= 65) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <Search className="w-4 h-4 text-cyan-400" />
          {isInitializing && (
            <Loader className="w-3 h-3 text-cyan-400 animate-spin" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder={isInitializing ? "Initializing fuzzy search..." : placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (matches.length > 0) setShowResults(true);
          }}
          disabled={isInitializing || !isReady}
          className="w-full pl-12 pr-12 py-3 bg-black/60 border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-400 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader className="w-4 h-4 text-cyan-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {!isInitializing && (
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-gray-400">
              {isReady 
                ? `Fuzzy search ready (${fuzzySearchService.getTotalPlanets()} planets)`
                : 'Fuzzy search unavailable'
              }
            </span>
          </div>
          {searchTime > 0 && (
            <span className="text-gray-500">
              {searchTime}ms
            </span>
          )}
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-black/90 rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 z-50 max-h-80 overflow-y-auto">
          <div className="p-3 border-b border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cyan-300 font-medium">
                🔍 Fuzzy Search Results
              </span>
              <span className="text-xs text-gray-400">
                {matches.length} matches • {searchTime}ms
              </span>
            </div>
          </div>
          
          <div className="py-2">
            {matches.map((match, index) => (
              <button
                key={`${match.name}-${index}`}
                onClick={() => handlePlanetSelect(match)}
                className={`w-full text-left px-4 py-3 hover:bg-black/60 transition-all duration-200 flex items-center justify-between group ${
                  selectedIndex === index ? 'bg-cyan-500/20 border-l-2 border-cyan-400' : ''
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div 
                      className="text-white font-medium truncate"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightMatch(match.name, query) 
                      }}
                    />
                    <div className="text-xs text-gray-400">
                      Exoplanet #{match.index + 1}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`text-xs font-bold ${getScoreColor(match.score)}`}>
                    {match.score}%
                  </span>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getScoreBadge(match.score)}`}>
                    {match.score >= 95 ? 'Perfect' : 
                     match.score >= 85 ? 'Excellent' : 
                     match.score >= 75 ? 'Good' : 
                     match.score >= 65 ? 'Fair' : 'Weak'}
                  </div>
                  <Zap className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 border-t border-cyan-500/20 bg-black/40">
            <p className="text-xs text-gray-400 text-center">
              💡 Use ↑↓ arrows to navigate, Enter to select, Esc to close
            </p>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showResults && matches.length === 0 && query.length >= 2 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-black/90 rounded-xl border border-gray-500/30 shadow-xl z-50">
          <div className="p-6 text-center">
            <Search className="w-8 h-8 text-gray-400 mx-auto mb-3 opacity-50" />
            <p className="text-gray-400 text-sm">
              No exoplanets found matching "{query}"
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Try different search terms or check spelling
            </p>
          </div>
        </div>
      )}
    </div>
  );
};