// NASA Exoplanet Archive API Integration Service
// Updated with proper proxy endpoints

export interface NASAExoplanetData {
  pl_name: string;
  pl_rade?: number; // Planet radius in Earth radii
  pl_bmasse?: number; // Planet mass in Earth masses
  pl_orbper?: number; // Orbital period in days
  pl_eqt?: number; // Equilibrium temperature in Kelvin
  st_teff?: number; // Stellar effective temperature
  st_age?: number; // Stellar age in Gyr
  st_mass?: number; // Stellar mass in solar masses
  st_dens?: number; // Stellar density
  st_rad?: number; // Stellar radius
  st_lum?: number; // Stellar luminosity
  pl_dens?: number; // Planet density
  st_met?: number; // Stellar metallicity
  pl_ratror?: number; // Planet-to-star radius ratio
  disc_year?: number; // Discovery year
  pl_nespec?: number; // Number of spectra
  discoverymethod?: string; // Discovery method
  disc_locale?: string; // Discovery locale
  disc_facility?: string; // Discovery facility
}

export interface FuzzyMatch {
  name: string;
  score: number;
}

class NASAExoplanetService {
  private baseUrl = 'http://localhost:8000/api/nasa';

  /**
   * Load all planet names from NASA Exoplanet Archive
   */
  async loadPlanetNames(): Promise<string[]> {
    try {
      console.log('🌌 Loading planet names from NASA Archive...');
      
      const response = await fetch(`${this.baseUrl}/planets`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      console.log(`✨ Successfully loaded ${data.count} exoplanet names from NASA Archive`);
      return data.planets || [];
      
    } catch (error) {
      console.error('Failed to load planet names from NASA:', error);
      
      // Fallback to some well-known exoplanets if API fails
      const fallbackPlanets = [
        'Kepler-452b', 'Proxima Centauri b', 'TRAPPIST-1e', 'TRAPPIST-1f', 'TRAPPIST-1g',
        'TOI-715 b', 'K2-18b', 'Kepler-438b', 'Kepler-442b', 'Gliese 667 Cc',
        'HD 40307g', 'Kepler-186f', 'Kepler-62f', 'Kepler-62e', 'Wolf 1061c',
        'Ross 128b', 'LHS 1140b', 'Kepler-1649c', 'TOI-849b', 'WASP-121b'
      ];
      
      console.log('🔄 Using fallback planet list');
      return fallbackPlanets;
    }
  }

  /**
   * Fetch detailed data for a specific planet
   */
  async fetchPlanetDetails(planetName: string): Promise<NASAExoplanetData | null> {
    try {
      console.log(`🔍 Fetching details for ${planetName}...`);
      
      const response = await fetch(`${this.baseUrl}/planet/${encodeURIComponent(planetName)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Planet ${planetName} not found in NASA database`);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const planetData = await response.json();
      
      if (planetData.error) {
        throw new Error(planetData.error);
      }

      console.log(`✅ Successfully fetched data for ${planetName}`);
      return planetData as NASAExoplanetData;
      
    } catch (error) {
      console.error(`Failed to fetch planet details for ${planetName}:`, error);
      return null;
    }
  }

  /**
   * Fuzzy search for planet names (client-side implementation)
   */
  fuzzySearch(query: string, planetNames: string[], limit: number = 8): FuzzyMatch[] {
    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();
    const matches: FuzzyMatch[] = [];

    planetNames.forEach(name => {
      const nameLower = name.toLowerCase();
      let score = 0;

      // Exact match gets highest score
      if (nameLower === queryLower) {
        score = 100;
      }
      // Starts with query gets high score
      else if (nameLower.startsWith(queryLower)) {
        score = 90 - (name.length - query.length) * 2;
      }
      // Contains query gets medium score
      else if (nameLower.includes(queryLower)) {
        const index = nameLower.indexOf(queryLower);
        score = 70 - index * 2 - (name.length - query.length);
      }
      // Levenshtein-like distance for partial matches
      else {
        score = this.calculateSimilarity(queryLower, nameLower);
      }

      if (score > 30) { // Minimum threshold
        matches.push({ name, score: Math.max(0, Math.min(100, score)) });
      }
    });

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Simple similarity calculation (simplified Levenshtein)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return Math.round(((longer.length - editDistance) / longer.length) * 100);
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Convert NASA data to our internal Exoplanet format
   */
  convertToExoplanet(nasaData: NASAExoplanetData, id: string): any {
    // Calculate enhanced properties from NASA data
    const habitabilityScore = this.calculateHabitabilityFromNASA(nasaData);
    const distance = this.estimateDistance(nasaData);
    const minerals = this.generateMineralsFromNASA(nasaData);
    const bacteria = this.generateBacteriaFromNASA(nasaData);
    const atmosphere = this.generateAtmosphereFromNASA(nasaData);

    return {
      id,
      name: nasaData.pl_name,
      distance,
      mass: nasaData.pl_bmasse || 1.0,
      radius: nasaData.pl_rade || 1.0,
      temperature: nasaData.pl_eqt || nasaData.st_teff || 288,
      habitabilityScore,
      starType: this.getStarTypeFromTemp(nasaData.st_teff),
      orbitalPeriod: nasaData.pl_orbper || 365,
      discoveryYear: nasaData.disc_year || 2020,
      discoveryMethod: nasaData.discoverymethod || 'Unknown',
      discoveryFacility: nasaData.disc_facility || 'Unknown',
      discoveryLocale: nasaData.disc_locale || 'Unknown',
      stellarAge: nasaData.st_age,
      stellarMass: nasaData.st_mass,
      stellarRadius: nasaData.st_rad,
      stellarDensity: nasaData.st_dens,
      stellarLuminosity: nasaData.st_lum,
      planetDensity: nasaData.pl_dens,
      stellarMetallicity: nasaData.st_met,
      planetToStarRadiusRatio: nasaData.pl_ratror,
      numberOfSpectra: nasaData.pl_nespec,
      minerals,
      bacteria,
      atmosphere,
      biosignature: {
        score: habitabilityScore * 0.8 + Math.random() * 20,
        classification: this.getBiosignatureClassification(habitabilityScore),
        chemicalAnalysis: this.generateChemicalAnalysis(atmosphere)
      }
    };
  }

  private calculateHabitabilityFromNASA(data: NASAExoplanetData): number {
    let score = 50; // Base score

    // Temperature factor (Earth-like ~288K)
    if (data.pl_eqt) {
      const tempDiff = Math.abs(data.pl_eqt - 288);
      score += Math.max(0, 30 - tempDiff / 10);
    } else if (data.st_teff) {
      // Estimate from stellar temperature
      const tempDiff = Math.abs(data.st_teff - 5778); // Sun-like
      score += Math.max(0, 15 - tempDiff / 100);
    }

    // Size factor (Earth-like ~1.0)
    if (data.pl_rade) {
      const sizeDiff = Math.abs(data.pl_rade - 1.0);
      score += Math.max(0, 20 - sizeDiff * 15);
    }

    // Mass factor (Earth-like ~1.0)
    if (data.pl_bmasse) {
      const massDiff = Math.abs(data.pl_bmasse - 1.0);
      score += Math.max(0, 15 - massDiff * 8);
    }

    // Orbital period factor (Earth-like ~365 days)
    if (data.pl_orbper) {
      const periodDiff = Math.abs(Math.log10(data.pl_orbper) - Math.log10(365));
      score += Math.max(0, 10 - periodDiff * 5);
    }

    // Stellar properties
    if (data.st_mass && data.st_mass > 0.5 && data.st_mass < 2.0) {
      score += 5; // Stable star
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private estimateDistance(data: NASAExoplanetData): number {
    // Estimate distance based on discovery method and year
    let baseDistance = 100 + Math.random() * 500;
    
    if (data.discoverymethod?.includes('Transit')) {
      baseDistance *= 0.8; // Transit planets often closer
    }
    if (data.discoverymethod?.includes('Radial Velocity')) {
      baseDistance *= 0.6; // RV planets typically closer
    }
    if (data.disc_year && data.disc_year < 2015) {
      baseDistance *= 0.7; // Earlier discoveries often closer
    }
    
    return Math.round(baseDistance * 10) / 10;
  }

  private getStarTypeFromTemp(temp?: number): string {
    if (!temp) return 'Unknown';
    if (temp >= 7500) return 'A-type';
    if (temp >= 6000) return 'F-type';
    if (temp >= 5200) return 'G-type';
    if (temp >= 3700) return 'K-type';
    return 'M-dwarf';
  }

  private generateMineralsFromNASA(data: NASAExoplanetData): any {
    const temp = data.pl_eqt || data.st_teff || 288;
    const mass = data.pl_bmasse || 1.0;
    const radius = data.pl_rade || 1.0;
    
    // Estimate based on planet characteristics
    const density = mass / Math.pow(radius, 3);
    const isRocky = density > 0.8;
    
    let baseIron = isRocky ? 30 + Math.random() * 10 : 20 + Math.random() * 10;
    let baseSilicon = isRocky ? 25 + Math.random() * 10 : 20 + Math.random() * 10;
    let baseMagnesium = 15 + Math.random() * 8;
    let baseCarbon = 10 + Math.random() * 8;
    let baseWater = temp < 350 ? 20 + Math.random() * 15 : 5 + Math.random() * 10;

    return {
      iron: Math.round(Math.max(10, Math.min(45, baseIron))),
      silicon: Math.round(Math.max(15, Math.min(35, baseSilicon))),
      magnesium: Math.round(Math.max(8, Math.min(25, baseMagnesium))),
      carbon: Math.round(Math.max(3, Math.min(20, baseCarbon))),
      water: Math.round(Math.max(2, Math.min(40, baseWater)))
    };
  }

  private generateBacteriaFromNASA(data: NASAExoplanetData): any {
    const habitability = this.calculateHabitabilityFromNASA(data);
    const temp = data.pl_eqt || 288;
    
    return {
      extremophiles: Math.round(40 + habitability * 0.3 + Math.random() * 20),
      photosynthetic: Math.round(Math.max(10, habitability * 0.6 + Math.random() * 15)),
      chemosynthetic: Math.round(45 + habitability * 0.4 + Math.random() * 20),
      anaerobic: Math.round(60 + habitability * 0.2 + Math.random() * 15)
    };
  }

  private generateAtmosphereFromNASA(data: NASAExoplanetData): any {
    const temp = data.pl_eqt || 288;
    const mass = data.pl_bmasse || 1.0;
    const isHot = temp > 350;
    const isLowMass = mass < 0.5;
    
    let nitrogen = isHot ? 40 + Math.random() * 20 : 70 + Math.random() * 15;
    let oxygen = isHot ? Math.random() * 5 : 15 + Math.random() * 10;
    let carbonDioxide = isHot ? 20 + Math.random() * 30 : 5 + Math.random() * 10;
    let methane = Math.random() * 2;
    
    if (isLowMass) {
      // Low mass planets lose atmosphere
      nitrogen *= 0.7;
      oxygen *= 0.5;
    }
    
    // Normalize
    const total = nitrogen + oxygen + carbonDioxide + methane;
    return {
      nitrogen: Math.round((nitrogen / total) * 100 * 100) / 100,
      oxygen: Math.round((oxygen / total) * 100 * 100) / 100,
      carbonDioxide: Math.round((carbonDioxide / total) * 100 * 100) / 100,
      methane: Math.round((methane / total) * 100 * 1000) / 1000
    };
  }

  private getBiosignatureClassification(score: number): string {
    if (score >= 80) return 'Excellent Biosignature Potential';
    if (score >= 65) return 'High Biosignature Potential';
    if (score >= 50) return 'Moderate Biosignature Potential';
    if (score >= 35) return 'Low Biosignature Potential';
    return 'Poor Biosignature Potential';
  }

  private generateChemicalAnalysis(atmosphere: any): any {
    return {
      O2: atmosphere.oxygen,
      N2: atmosphere.nitrogen,
      CO2: atmosphere.carbonDioxide,
      Temperature: 50 + Math.random() * 40
    };
  }
}

export const nasaExoplanetService = new NASAExoplanetService();