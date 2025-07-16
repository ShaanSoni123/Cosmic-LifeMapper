// NASA Exoplanet Archive API Integration Service
// Based on the Python integration2.py functionality

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
  private baseUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Cosmic-LifeMapper/1.0)',
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  /**
   * Load all planet names from NASA Exoplanet Archive (lightweight query)
   */
  async loadPlanetNames(): Promise<string[]> {
    const query = 'SELECT pl_name FROM pscomppars';
    const params = new URLSearchParams({
      query,
      format: 'csv'
    });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: params
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const lines = csvText.trim().split('\n');
      
      // Skip header row and extract planet names
      const planetNames = lines.slice(1)
        .map(line => line.trim())
        .filter(line => line && line !== 'null')
        .sort();

      console.log(`✨ Loaded ${planetNames.length} exoplanet names from NASA Archive`);
      return planetNames;
    } catch (error) {
      console.error('Failed to load planet names from NASA:', error);
      return [];
    }
  }

  /**
   * Fetch detailed data for a specific planet
   */
  async fetchPlanetDetails(planetName: string): Promise<NASAExoplanetData | null> {
    // SQL escape single quotes
    const safeName = planetName.replace(/'/g, "''");
    
    const query = `
      SELECT pl_name, pl_rade, pl_bmasse, pl_orbper, pl_eqt, 
             st_teff, st_age, st_mass, st_dens, disc_year, 
             pl_nespec, discoverymethod, disc_locale, disc_facility, st_rad 
      FROM pscomppars 
      WHERE pl_name = '${safeName}'
    `;

    const params = new URLSearchParams({
      query: query.trim(),
      format: 'csv'
    });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: params
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const lines = csvText.trim().split('\n');

      if (lines.length < 2) {
        return null; // No data found
      }

      const headers = lines[0].split(',');
      const values = lines[1].split(',');

      const planetData: any = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (value && value !== 'null') {
          // Convert numeric fields
          if (['pl_rade', 'pl_bmasse', 'pl_orbper', 'pl_eqt', 'st_teff', 'st_age', 'st_mass', 'st_dens', 'st_rad', 'disc_year', 'pl_nespec'].includes(header)) {
            planetData[header] = parseFloat(value);
          } else {
            planetData[header] = value;
          }
        }
      });

      return planetData as NASAExoplanetData;
    } catch (error) {
      console.error('Failed to fetch planet details:', error);
      return null;
    }
  }

  /**
   * Fuzzy search for planet names (client-side implementation)
   */
  fuzzySearch(query: string, planetNames: string[], limit: number = 5): FuzzyMatch[] {
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
    return {
      id,
      name: nasaData.pl_name,
      distance: Math.random() * 1000 + 10, // Estimated - not in NASA data
      mass: nasaData.pl_bmasse || 1.0,
      radius: nasaData.pl_rade || 1.0,
      temperature: nasaData.pl_eqt || nasaData.st_teff || 288,
      habitabilityScore: this.calculateHabitabilityFromNASA(nasaData),
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
      numberOfSpectra: nasaData.pl_nespec,
      // Generate estimated compositions based on available data
      minerals: this.generateMineralsFromNASA(nasaData),
      bacteria: this.generateBacteriaFromNASA(nasaData),
      atmosphere: this.generateAtmosphereFromNASA(nasaData)
    };
  }

  private calculateHabitabilityFromNASA(data: NASAExoplanetData): number {
    let score = 50; // Base score

    // Temperature factor
    if (data.pl_eqt) {
      const tempDiff = Math.abs(data.pl_eqt - 288); // Earth-like temperature
      score += Math.max(0, 30 - tempDiff / 10);
    }

    // Size factor
    if (data.pl_rade) {
      const sizeDiff = Math.abs(data.pl_rade - 1.0); // Earth-like size
      score += Math.max(0, 20 - sizeDiff * 10);
    }

    // Mass factor
    if (data.pl_bmasse) {
      const massDiff = Math.abs(data.pl_bmasse - 1.0); // Earth-like mass
      score += Math.max(0, 20 - massDiff * 5);
    }

    return Math.max(0, Math.min(100, Math.round(score)));
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
    // Estimate based on planet characteristics
    const baseIron = 30 + (Math.random() * 10);
    const baseSilicon = 25 + (Math.random() * 10);
    const baseMagnesium = 15 + (Math.random() * 8);
    const baseCarbon = 10 + (Math.random() * 8);
    const baseWater = data.pl_eqt && data.pl_eqt < 350 ? 20 + (Math.random() * 15) : 5 + (Math.random() * 10);

    return {
      iron: Math.round(baseIron),
      silicon: Math.round(baseSilicon),
      magnesium: Math.round(baseMagnesium),
      carbon: Math.round(baseCarbon),
      water: Math.round(baseWater)
    };
  }

  private generateBacteriaFromNASA(data: NASAExoplanetData): any {
    const habitability = this.calculateHabitabilityFromNASA(data);
    
    return {
      extremophiles: Math.round(40 + habitability * 0.3 + Math.random() * 20),
      photosynthetic: Math.round(Math.max(10, habitability * 0.6 + Math.random() * 15)),
      chemosynthetic: Math.round(45 + habitability * 0.4 + Math.random() * 20),
      anaerobic: Math.round(60 + habitability * 0.2 + Math.random() * 15)
    };
  }

  private generateAtmosphereFromNASA(data: NASAExoplanetData): any {
    // Estimate based on temperature and other factors
    const temp = data.pl_eqt || 288;
    const isHot = temp > 350;
    
    return {
      nitrogen: isHot ? 40 + Math.random() * 20 : 70 + Math.random() * 15,
      oxygen: isHot ? Math.random() * 5 : 15 + Math.random() * 10,
      carbonDioxide: isHot ? 20 + Math.random() * 30 : 5 + Math.random() * 10,
      methane: Math.random() * 2
    };
  }
}

export const nasaExoplanetService = new NASAExoplanetService();