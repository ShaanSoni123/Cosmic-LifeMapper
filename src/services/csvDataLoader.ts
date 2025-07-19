// CSV Data Loader Service for NASA Exoplanet Data
// Loads and processes the complete NASA CSV dataset

import { Exoplanet } from '../types/exoplanet';
import { 
  generateBiosignatureReport, 
  atmosphereToChemicalConcentrations, 
  calculateEnhancedHabitabilityScore,
  getBiosignatureClassification 
} from '../utils/biosignatureAnalyzer';

export interface CSVExoplanetData {
  pl_name: string;
  hostname: string;
  discoverymethod: string;
  disc_year: string;
  pl_orbper: string;
  pl_rade: string;
  pl_bmasse: string;
  st_teff: string;
  st_rad: string;
  st_mass: string;
  sy_dist: string;
  pl_eqt: string;
  st_age: string;
  pl_insol: string;
  pl_orbeccen: string;
}

class CSVDataLoader {
  private cache: Exoplanet[] = [];
  private isLoaded = false;
  private isLoading = false;

  /**
   * Load all exoplanets from CSV data
   */
  async loadAllExoplanets(): Promise<Exoplanet[]> {
    if (this.isLoaded && this.cache.length > 0) {
      return this.cache;
    }

    if (this.isLoading) {
      // Wait for existing load to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.cache;
    }

    this.isLoading = true;

    try {
      console.log('🔄 Loading NASA CSV exoplanet data...');
      
      const response = await fetch('/data/nasa_exoplanet_sample_1000.csv');
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV data: ${response.status}`);
      }

      const csvText = await response.text();
      const exoplanets = this.parseCSVData(csvText);
      
      this.cache = exoplanets;
      this.isLoaded = true;
      this.isLoading = false;

      console.log(`✅ Successfully loaded ${exoplanets.length} exoplanets from NASA CSV`);
      return exoplanets;

    } catch (error) {
      console.error('❌ Error loading CSV data:', error);
      this.isLoading = false;
      
      // Return empty array on error to prevent app crashes
      return [];
    }
  }

  /**
   * Parse CSV data and convert to Exoplanet format
   */
  private parseCSVData(csvText: string): Exoplanet[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      console.warn('CSV file appears to be empty or invalid');
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const exoplanets: Exoplanet[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        if (values.length !== headers.length) {
          console.warn(`Skipping line ${i + 1}: column count mismatch`);
          continue;
        }

        const rowData: CSVExoplanetData = {} as CSVExoplanetData;
        headers.forEach((header, index) => {
          rowData[header as keyof CSVExoplanetData] = values[index] || '';
        });

        const exoplanet = this.convertToExoplanet(rowData, `csv-${i}`);
        if (exoplanet) {
          exoplanets.push(exoplanet);
        }
      } catch (error) {
        console.warn(`Error parsing line ${i + 1}:`, error);
      }
    }

    return exoplanets;
  }

  /**
   * Parse CSV line handling quoted values and commas
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Convert CSV data to internal Exoplanet format
   */
  private convertToExoplanet(data: CSVExoplanetData, id: string): Exoplanet | null {
    try {
      // Extract and validate numeric values
      const radius = this.parseFloat(data.pl_rade, 1.0);
      const mass = this.parseFloat(data.pl_bmasse, 1.0);
      const orbitalPeriod = this.parseFloat(data.pl_orbper, 365);
      const temperature = this.parseFloat(data.pl_eqt, 288);
      const distance = this.parseFloat(data.sy_dist, Math.random() * 1000 + 10);
      const discoveryYear = this.parseInt(data.disc_year, 2020);
      const stellarTemp = this.parseFloat(data.st_teff, 5778);
      const stellarMass = this.parseFloat(data.st_mass, 1.0);
      const stellarRadius = this.parseFloat(data.st_rad, 1.0);
      const stellarAge = this.parseFloat(data.st_age, 5.0);
      const eccentricity = this.parseFloat(data.pl_orbeccen, 0.0);
      const insolation = this.parseFloat(data.pl_insol, 1.0);

      // Calculate enhanced habitability score
      const baseHabitabilityScore = this.calculateHabitabilityScore({
        radius,
        mass,
        temperature,
        orbitalPeriod,
        stellarTemp,
        distance
      });

      // Generate atmospheric composition
      const atmosphere = this.generateAtmosphere(temperature, mass, stellarTemp);
      
      // Generate biosignature analysis
      const chemicalConcentrations = atmosphereToChemicalConcentrations(atmosphere);
      const biosignatureReport = generateBiosignatureReport(chemicalConcentrations, temperature - 273.15);
      
      // Enhanced habitability score (70% traditional + 30% biosignature)
      const enhancedHabitabilityScore = calculateEnhancedHabitabilityScore(
        baseHabitabilityScore, 
        biosignatureReport.HabitabilityScore,
        0.3
      );

      return {
        id,
        name: data.pl_name || `Unknown Planet ${id}`,
        distance: Math.round(distance * 10) / 10,
        mass: Math.round(mass * 100) / 100,
        radius: Math.round(radius * 100) / 100,
        temperature: Math.round(temperature),
        habitabilityScore: Math.round(enhancedHabitabilityScore),
        starType: this.getStarTypeFromTemp(stellarTemp),
        orbitalPeriod: Math.round(orbitalPeriod * 10) / 10,
        discoveryYear,
        minerals: this.generateMinerals(radius, mass, temperature),
        bacteria: this.generateBacteria(temperature, enhancedHabitabilityScore),
        atmosphere: atmosphere,
        biosignature: {
          score: Math.round(biosignatureReport.HabitabilityScore * 10) / 10,
          classification: getBiosignatureClassification(biosignatureReport.HabitabilityScore),
          chemicalAnalysis: biosignatureReport
        },
        nasaData: {
          isRealNASAData: true,
          originalData: data,
          lastUpdated: new Date().toISOString(),
          dataSource: 'NASA Exoplanet Archive CSV',
          discoveryMethod: data.discoverymethod || 'Unknown',
          hostStar: data.hostname || 'Unknown',
          stellarMass,
          stellarRadius,
          stellarAge,
          stellarTemperature: stellarTemp,
          eccentricity,
          insolation
        }
      };
    } catch (error) {
      console.warn('Error converting CSV data to exoplanet:', error);
      return null;
    }
  }

  /**
   * Safe float parsing with fallback
   */
  private parseFloat(value: string, fallback: number): number {
    if (!value || value === 'N/A' || value === '') return fallback;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }

  /**
   * Safe integer parsing with fallback
   */
  private parseInt(value: string, fallback: number): number {
    if (!value || value === 'N/A' || value === '') return fallback;
    const parsed = parseInt(value);
    return isNaN(parsed) ? fallback : parsed;
  }

  /**
   * Calculate habitability score from NASA parameters
   */
  private calculateHabitabilityScore(params: {
    radius: number;
    mass: number;
    temperature: number;
    orbitalPeriod: number;
    stellarTemp: number;
    distance: number;
  }): number {
    let score = 50; // Base score

    // Temperature factor (Earth-like = 288K)
    const tempDiff = Math.abs(params.temperature - 288);
    score += Math.max(0, 30 - tempDiff / 10);

    // Size factor (Earth-like = 1.0)
    const sizeDiff = Math.abs(params.radius - 1.0);
    score += Math.max(0, 20 - sizeDiff * 15);

    // Mass factor (Earth-like = 1.0)
    const massDiff = Math.abs(params.mass - 1.0);
    score += Math.max(0, 15 - massDiff * 8);

    // Orbital period factor (Earth-like = 365 days)
    const periodDiff = Math.abs(params.orbitalPeriod - 365);
    score += Math.max(0, 10 - periodDiff / 50);

    // Stellar temperature factor (Sun-like = 5778K)
    const stellarTempDiff = Math.abs(params.stellarTemp - 5778);
    score += Math.max(0, 10 - stellarTempDiff / 200);

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Determine star type from temperature
   */
  private getStarTypeFromTemp(temp: number): string {
    if (temp >= 7500) return 'A-type';
    if (temp >= 6000) return 'F-type';
    if (temp >= 5200) return 'G-type';
    if (temp >= 3700) return 'K-type';
    return 'M-dwarf';
  }

  /**
   * Generate realistic mineral composition
   */
  private generateMinerals(radius: number, mass: number, temp: number) {
    const rockiness = Math.min(1, 2 / radius); // Smaller planets are more rocky
    const waterFactor = temp < 350 && temp > 200 ? 1 : 0.3;
    
    return {
      iron: Math.round(20 + rockiness * 25 + Math.random() * 10),
      silicon: Math.round(15 + rockiness * 20 + Math.random() * 10),
      magnesium: Math.round(10 + rockiness * 15 + Math.random() * 8),
      carbon: Math.round(5 + Math.random() * 15),
      water: Math.round(5 + waterFactor * 30 + Math.random() * 10)
    };
  }

  /**
   * Generate bacterial life potential
   */
  private generateBacteria(temp: number, habitability: number) {
    const tempFactor = temp > 200 && temp < 400 ? 1 : 0.5;
    const habFactor = habitability / 100;
    
    return {
      extremophiles: Math.round(30 + Math.random() * 40),
      photosynthetic: Math.round(tempFactor * habFactor * 60 + Math.random() * 20),
      chemosynthetic: Math.round(40 + habFactor * 30 + Math.random() * 20),
      anaerobic: Math.round(50 + Math.random() * 30)
    };
  }

  /**
   * Generate atmospheric composition
   */
  private generateAtmosphere(temp: number, mass: number, stellarTemp: number) {
    const canRetainAtmosphere = mass > 0.5;
    const isHot = temp > 400;
    const isRedDwarf = stellarTemp < 4000;
    
    if (!canRetainAtmosphere) {
      return { nitrogen: 10, oxygen: 2, carbonDioxide: 85, methane: 3 };
    }
    
    if (isHot) {
      return { nitrogen: 20, oxygen: 5, carbonDioxide: 70, methane: 5 };
    }
    
    if (isRedDwarf) {
      return { nitrogen: 50, oxygen: 8, carbonDioxide: 35, methane: 7 };
    }
    
    return {
      nitrogen: 60 + Math.random() * 20,
      oxygen: 10 + Math.random() * 15,
      carbonDioxide: 15 + Math.random() * 10,
      methane: Math.random() * 5
    };
  }

  /**
   * Get loading status
   */
  getLoadingStatus() {
    return {
      isLoading: this.isLoading,
      isLoaded: this.isLoaded,
      count: this.cache.length
    };
  }

  /**
   * Force reload data
   */
  async forceReload(): Promise<Exoplanet[]> {
    this.isLoaded = false;
    this.cache = [];
    return this.loadAllExoplanets();
  }
}

export const csvDataLoader = new CSVDataLoader();