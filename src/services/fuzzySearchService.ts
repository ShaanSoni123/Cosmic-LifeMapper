import Fuse from 'fuse.js';

export interface FuzzySearchMatch {
  name: string;
  score: number;
  index: number;
}

export interface PlanetSearchResult {
  matches: FuzzySearchMatch[];
  totalFound: number;
  searchTime: number;
}

/**
 * Enhanced Fuzzy Search Service using Fuse.js (JavaScript equivalent of RapidFuzz)
 * Provides fast, accurate fuzzy matching for exoplanet names
 */
class FuzzySearchService {
  private fuse: Fuse<string> | null = null;
  private planetNames: string[] = [];
  private isInitialized = false;

  /**
   * Initialize the fuzzy search engine with planet names
   */
  async initialize(planetNames: string[]): Promise<void> {
    if (this.isInitialized && this.planetNames.length === planetNames.length) {
      return; // Already initialized with same data
    }

    console.log('🔍 Initializing fuzzy search engine...');
    
    this.planetNames = planetNames.filter(name => name && name.trim().length > 0);
    
    // Configure Fuse.js for optimal exoplanet name matching
    const fuseOptions = {
      // Threshold: 0.0 = perfect match, 1.0 = match anything
      threshold: 0.4, // Allow moderate fuzziness (equivalent to 60% match in Python)
      
      // Location and distance for positional matching
      location: 0,
      distance: 100,
      
      // Include score and index in results
      includeScore: true,
      includeMatches: true,
      
      // Search algorithm settings
      minMatchCharLength: 2,
      shouldSort: true,
      
      // Keys to search (since we're searching strings directly, this is not needed)
      keys: undefined,
      
      // Use extended search for better pattern matching
      useExtendedSearch: true,
      
      // Ignore location for better fuzzy matching
      ignoreLocation: true,
      
      // Field normalization
      getFn: (obj: string) => obj,
      
      // Custom scoring weights
      fieldNormWeight: 1
    };

    this.fuse = new Fuse(this.planetNames, fuseOptions);
    this.isInitialized = true;
    
    console.log(`✅ Fuzzy search initialized with ${this.planetNames.length} planet names`);
  }

  /**
   * Search for planets using fuzzy matching (equivalent to Python's process.extract)
   */
  searchPlanets(query: string, limit: number = 5): PlanetSearchResult {
    const startTime = performance.now();
    
    if (!this.fuse || !this.isInitialized) {
      console.warn('⚠️ Fuzzy search not initialized');
      return {
        matches: [],
        totalFound: 0,
        searchTime: 0
      };
    }

    if (!query || query.trim().length < 2) {
      return {
        matches: [],
        totalFound: 0,
        searchTime: performance.now() - startTime
      };
    }

    // Perform fuzzy search
    const fuseResults = this.fuse.search(query, { limit: Math.max(limit, 10) });
    
    // Convert Fuse.js results to our format (similar to Python rapidfuzz)
    const matches: FuzzySearchMatch[] = fuseResults.map(result => {
      // Convert Fuse.js score (0 = perfect, 1 = worst) to percentage (100 = perfect, 0 = worst)
      const score = Math.round((1 - (result.score || 0)) * 100);
      
      return {
        name: result.item,
        score: Math.max(0, Math.min(100, score)), // Ensure 0-100 range
        index: result.refIndex || 0
      };
    });

    // Filter matches with score >= 60 (equivalent to Python threshold)
    const filteredMatches = matches
      .filter(match => match.score >= 60)
      .slice(0, limit);

    const searchTime = performance.now() - startTime;

    return {
      matches: filteredMatches,
      totalFound: filteredMatches.length,
      searchTime: Math.round(searchTime * 100) / 100
    };
  }

  /**
   * Get exact match or best fuzzy match for a planet name
   */
  getBestMatch(query: string): FuzzySearchMatch | null {
    const results = this.searchPlanets(query, 1);
    return results.matches.length > 0 ? results.matches[0] : null;
  }

  /**
   * Check if search engine is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.fuse !== null;
  }

  /**
   * Get total number of searchable planets
   */
  getTotalPlanets(): number {
    return this.planetNames.length;
  }

  /**
   * Advanced search with multiple strategies
   */
  advancedSearch(query: string, limit: number = 5): PlanetSearchResult {
    const startTime = performance.now();
    
    if (!this.isReady()) {
      return { matches: [], totalFound: 0, searchTime: 0 };
    }

    const allMatches: FuzzySearchMatch[] = [];
    
    // Strategy 1: Exact match
    const exactMatch = this.planetNames.find(name => 
      name.toLowerCase() === query.toLowerCase()
    );
    if (exactMatch) {
      allMatches.push({
        name: exactMatch,
        score: 100,
        index: this.planetNames.indexOf(exactMatch)
      });
    }

    // Strategy 2: Starts with query
    const startsWithMatches = this.planetNames
      .filter(name => 
        name.toLowerCase().startsWith(query.toLowerCase()) && 
        name.toLowerCase() !== query.toLowerCase()
      )
      .map(name => ({
        name,
        score: 95 - (name.length - query.length),
        index: this.planetNames.indexOf(name)
      }));
    allMatches.push(...startsWithMatches);

    // Strategy 3: Fuzzy search for remaining slots
    const fuzzyResults = this.searchPlanets(query, limit * 2);
    const fuzzyMatches = fuzzyResults.matches.filter(match => 
      !allMatches.some(existing => existing.name === match.name)
    );
    allMatches.push(...fuzzyMatches);

    // Sort by score and limit results
    const finalMatches = allMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const searchTime = performance.now() - startTime;

    return {
      matches: finalMatches,
      totalFound: finalMatches.length,
      searchTime: Math.round(searchTime * 100) / 100
    };
  }
}

// Export singleton instance
export const fuzzySearchService = new FuzzySearchService();

/**
 * Utility function to highlight matched characters in search results
 */
export function highlightMatch(text: string, query: string): string {
  if (!query || query.length < 2) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(query: string, planetNames: string[], limit: number = 3): string[] {
  if (!query || query.length < 2) return [];
  
  const suggestions = planetNames
    .filter(name => name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      // Prioritize names that start with the query
      const aStarts = a.toLowerCase().startsWith(query.toLowerCase());
      const bStarts = b.toLowerCase().startsWith(query.toLowerCase());
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Then sort by length (shorter names first)
      return a.length - b.length;
    })
    .slice(0, limit);
    
  return suggestions;
}