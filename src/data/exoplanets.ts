import { Exoplanet } from '../types/exoplanet';
import { 
  generateBiosignatureReport, 
  atmosphereToChemicalConcentrations, 
  calculateEnhancedHabitabilityScore,
  getBiosignatureClassification 
} from '../utils/biosignatureAnalyzer';

// Real NASA exoplanets data - will be populated from CSV
let realNASAExoplanets: Exoplanet[] = [];
let isDataLoaded = false;

/**
 * Parse CSV line handling quoted values and commas
 */
function parseCSVLine(line: string): string[] {
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
 * Safe float parsing with fallback
 */
function parseFloat(value: string, fallback: number): number {
  if (!value || value === '' || value === 'null' || value === 'N/A') {
    return fallback;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Calculate habitability score from NASA parameters
 */
function calculateHabitabilityFromNASA(params: {
  radius: number;
  mass: number;
  temperature: number;
  orbitalPeriod: number;
  stellarTemp: number;
}): number {
  let score = 50; // Base score

  // Temperature factor (Earth-like = 288K)
  const tempDiff = Math.abs(params.temperature - 288);
  score += Math.max(0, 25 - tempDiff / 15);

  // Size factor (Earth-like = 1.0)
  const sizeDiff = Math.abs(params.radius - 1.0);
  score += Math.max(0, 20 - sizeDiff * 12);

  // Mass factor (Earth-like = 1.0)
  const massDiff = Math.abs(params.mass - 1.0);
  score += Math.max(0, 15 - massDiff * 8);

  // Orbital period factor (Earth-like = 365 days)
  const periodScore = params.orbitalPeriod > 10 && params.orbitalPeriod < 1000 ? 10 : 5;
  score += periodScore;

  // Stellar temperature factor (Sun-like = 5778K)
  const stellarTempDiff = Math.abs(params.stellarTemp - 5778);
  score += Math.max(0, 10 - stellarTempDiff / 300);

  return Math.max(0, Math.min(100, score));
}

/**
 * Get star type from temperature
 */
function getStarTypeFromTemp(temp: number): string {
  if (temp >= 7500) return 'A-type';
  if (temp >= 6000) return 'F-type';
  if (temp >= 5200) return 'G-type';
  if (temp >= 3700) return 'K-type';
  return 'M-dwarf';
}

/**
 * Generate realistic atmospheric composition
 */
function generateAtmosphereFromNASA(params: {
  temperature: number;
  mass: number;
  radius: number;
}): Exoplanet['atmosphere'] {
  const { temperature, mass, radius } = params;
  const isHot = temperature > 350;
  const isLowMass = mass < 0.5;
  const planetType = radius < 1.5 ? 'rocky' : radius < 4 ? 'super-earth' : 'gas-giant';

  let nitrogen, oxygen, carbonDioxide, methane;

  if (planetType === 'gas-giant') {
    nitrogen = 15 + Math.random() * 25;
    oxygen = Math.random() * 8;
    carbonDioxide = 5 + Math.random() * 15;
    methane = 3 + Math.random() * 12;
  } else {
    // Rocky planets
    nitrogen = 60 + Math.random() * 20;
    oxygen = 15 + Math.random() * 10;
    carbonDioxide = 10 + Math.random() * 15;
    methane = Math.random() * 5;

    // Temperature adjustments
    if (isHot) {
      nitrogen -= 15;
      carbonDioxide += 20;
      oxygen -= 8;
    }

    // Mass adjustments
    if (isLowMass) {
      nitrogen -= 10;
      oxygen -= 5;
    }
  }

  // Normalize to 100%
  const total = nitrogen + oxygen + carbonDioxide + methane;
  return {
    nitrogen: Math.round((nitrogen / total) * 100 * 100) / 100,
    oxygen: Math.round((oxygen / total) * 100 * 100) / 100,
    carbonDioxide: Math.round((carbonDioxide / total) * 100 * 100) / 100,
    methane: Math.round((methane / total) * 100 * 1000) / 1000
  };
}

/**
 * Generate mineral composition based on NASA data
 */
function generateMineralsFromNASA(params: {
  temperature: number;
  mass: number;
  radius: number;
}): Exoplanet['minerals'] {
  const { temperature, mass, radius } = params;
  const planetType = radius < 1.5 ? 'rocky' : radius < 4 ? 'super-earth' : 'gas-giant';
  const waterFactor = temperature < 350 && temperature > 200 ? 1.2 : 0.6;

  let minerals = {
    iron: 25,
    silicon: 20,
    magnesium: 15,
    carbon: 10,
    water: 15
  };

  // Adjust based on planet type
  if (planetType === 'rocky') {
    minerals.iron += 8;
    minerals.silicon += 5;
    minerals.water *= waterFactor;
  } else if (planetType === 'gas-giant') {
    minerals.iron -= 10;
    minerals.water += 10;
  }

  // Mass effects
  if (mass > 2.0) {
    minerals.iron += 5;
    minerals.magnesium += 3;
  }

  // Add randomization and normalize
  Object.keys(minerals).forEach(key => {
    minerals[key as keyof typeof minerals] += Math.round((Math.random() - 0.5) * 8);
    minerals[key as keyof typeof minerals] = Math.max(2, Math.min(40, minerals[key as keyof typeof minerals]));
  });

  return minerals;
}

/**
 * Generate bacterial life potential
 */
function generateBacteriaFromNASA(params: {
  temperature: number;
  habitabilityScore: number;
}): Exoplanet['bacteria'] {
  const { temperature, habitabilityScore } = params;
  const tempFactor = temperature > 200 && temperature < 400 ? 1.2 : 0.8;
  const habFactor = habitabilityScore / 100;

  return {
    extremophiles: Math.round(35 + Math.random() * 30 + (temperature > 400 ? 15 : 0)),
    photosynthetic: Math.round(Math.max(10, tempFactor * habFactor * 50 + Math.random() * 25)),
    chemosynthetic: Math.round(40 + habFactor * 25 + Math.random() * 20),
    anaerobic: Math.round(55 + Math.random() * 25)
  };
}

/**
 * Convert NASA CSV row to Exoplanet format
 */
function convertNASARowToExoplanet(row: any, index: number): Exoplanet {
  // Parse numeric values with fallbacks
  const radius = parseFloat(row.pl_rade, 1.0);
  const mass = parseFloat(row.pl_bmasse, 1.0);
  const temperature = parseFloat(row.pl_eqt, 288);
  const orbitalPeriod = parseFloat(row.pl_orbper, 365);
  const stellarTemp = parseFloat(row.st_teff, 5778);
  const distance = parseFloat(row.sy_dist, Math.random() * 1000 + 10);
  const discoveryYear = parseInt(row.disc_year) || 2020;

  // Calculate habitability score
  const baseHabitabilityScore = calculateHabitabilityFromNASA({
    radius,
    mass,
    temperature,
    orbitalPeriod,
    stellarTemp
  });

  // Generate atmospheric composition
  const atmosphere = generateAtmosphereFromNASA({ temperature, mass, radius });

  // Generate biosignature analysis
  const chemicalConcentrations = atmosphereToChemicalConcentrations(atmosphere);
  const biosignatureReport = generateBiosignatureReport(chemicalConcentrations, temperature - 273.15);

  // Enhanced habitability score
  const enhancedHabitabilityScore = calculateEnhancedHabitabilityScore(
    baseHabitabilityScore,
    biosignatureReport.HabitabilityScore,
    0.3
  );

  return {
    id: `nasa-${index}`,
    name: row.pl_name || `Exoplanet-${index}`,
    distance: Math.round(distance * 10) / 10,
    mass: Math.round(mass * 1000) / 1000,
    radius: Math.round(radius * 1000) / 1000,
    temperature: Math.round(temperature),
    habitabilityScore: Math.round(enhancedHabitabilityScore),
    starType: getStarTypeFromTemp(stellarTemp),
    orbitalPeriod: Math.round(orbitalPeriod * 100) / 100,
    discoveryYear,
    minerals: generateMineralsFromNASA({ temperature, mass, radius }),
    bacteria: generateBacteriaFromNASA({ temperature, habitabilityScore: enhancedHabitabilityScore }),
    atmosphere,
    biosignature: {
      score: Math.round(biosignatureReport.HabitabilityScore * 10) / 10,
      classification: getBiosignatureClassification(biosignatureReport.HabitabilityScore),
      chemicalAnalysis: biosignatureReport
    },
    nasaData: {
      isRealNASAData: true,
      originalData: row,
      lastUpdated: new Date().toISOString(),
      dataSource: 'NASA Exoplanet Archive CSV'
    }
  };
}

/**
 * Load NASA CSV data immediately
 */
async function loadNASACSVData(): Promise<Exoplanet[]> {
  if (isDataLoaded && realNASAExoplanets.length > 0) {
    return realNASAExoplanets;
  }

  try {
    console.log('🔄 Loading NASA CSV data from /data/nasa_exoplanet_data_2025-07-19.csv...');
    
    const response = await fetch('/data/nasa_exoplanet_data_2025-07-19.csv');
    
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status}`);
    }

    const csvText = await response.text();
    console.log('📄 CSV loaded, length:', csvText.length);
    
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('Invalid CSV format');
    }

    const headers = parseCSVLine(lines[0]);
    console.log('📊 CSV headers:', headers);
    
    const exoplanets: Exoplanet[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || '';
        });
        
        // Only include rows with valid planet names
        if (row.pl_name && row.pl_name !== '' && row.pl_name !== 'null') {
          const exoplanet = convertNASARowToExoplanet(row, i - 1);
          exoplanets.push(exoplanet);
        }
      }
    }

    realNASAExoplanets = exoplanets;
    isDataLoaded = true;
    
    console.log(`✅ Successfully loaded ${realNASAExoplanets.length} real NASA exoplanets!`);
    return realNASAExoplanets;
    
  } catch (error) {
    console.error('❌ Error loading NASA CSV:', error);
    
    // Generate immediate fallback data to prevent 0 exoplanets
    realNASAExoplanets = generateFallbackExoplanets();
    isDataLoaded = true;
    
    console.log(`🔄 Using fallback data: ${realNASAExoplanets.length} exoplanets`);
    return realNASAExoplanets;
  }
}

/**
 * Generate fallback exoplanets if CSV fails
 */
function generateFallbackExoplanets(): Exoplanet[] {
  const fallbackPlanets = [
    { name: 'Kepler-452b', radius: 1.63, mass: 5.0, temp: 265, period: 384.8, year: 2015, distance: 1402 },
    { name: 'TRAPPIST-1e', radius: 0.92, mass: 0.77, temp: 251, period: 6.1, year: 2017, distance: 40.7 },
    { name: 'Proxima Centauri b', radius: 1.1, mass: 1.27, temp: 234, period: 11.2, year: 2016, distance: 4.24 },
    { name: 'Kepler-186f', radius: 1.11, mass: 1.44, temp: 188, period: 129.9, year: 2014, distance: 582 },
    { name: 'Gliese 667 Cc', radius: 1.54, mass: 3.8, temp: 277, period: 28.1, year: 2011, distance: 23.6 },
    { name: 'HD 40307g', radius: 2.1, mass: 7.1, temp: 227, period: 197.8, year: 2012, distance: 42 },
    { name: 'Kepler-62f', radius: 1.41, mass: 3.3, temp: 208, period: 267.3, year: 2013, distance: 1200 },
    { name: 'Tau Ceti e', radius: 1.9, mass: 4.5, temp: 241, period: 168.1, year: 2012, distance: 11.9 },
    { name: 'Wolf 1061c', radius: 1.6, mass: 4.3, temp: 223, period: 17.9, year: 2015, distance: 13.8 },
    { name: 'K2-18b', radius: 2.6, mass: 8.0, temp: 265, period: 33.0, year: 2015, distance: 124 }
  ];

  return fallbackPlanets.map((planet, index) => {
    const habitabilityScore = calculateHabitabilityFromNASA({
      radius: planet.radius,
      mass: planet.mass,
      temperature: planet.temp,
      orbitalPeriod: planet.period,
      stellarTemp: 5778
    });
    
    const atmosphere = generateAtmosphereFromNASA({
      temperature: planet.temp,
      mass: planet.mass,
      radius: planet.radius
    });
    
    const chemicalConcentrations = atmosphereToChemicalConcentrations(atmosphere);
    const biosignatureReport = generateBiosignatureReport(chemicalConcentrations, planet.temp - 273.15);
    
    return {
      id: `fallback-${index}`,
      name: planet.name,
      distance: planet.distance,
      mass: planet.mass,
      radius: planet.radius,
      temperature: planet.temp,
      habitabilityScore: Math.round(calculateEnhancedHabitabilityScore(habitabilityScore, biosignatureReport.HabitabilityScore, 0.3)),
      starType: getStarTypeFromTemp(5778),
      orbitalPeriod: planet.period,
      discoveryYear: planet.year,
      minerals: generateMineralsFromNASA({ temperature: planet.temp, mass: planet.mass, radius: planet.radius }),
      bacteria: generateBacteriaFromNASA({ temperature: planet.temp, habitabilityScore }),
      atmosphere,
      biosignature: {
        score: Math.round(biosignatureReport.HabitabilityScore * 10) / 10,
        classification: getBiosignatureClassification(biosignatureReport.HabitabilityScore),
        chemicalAnalysis: biosignatureReport
      }
    };
  });
}

// Initialize data loading immediately
const dataPromise = loadNASACSVData();

// Export the exoplanets - this will be populated once data loads
export let exoplanets: Exoplanet[] = [];

// Initialize with data
dataPromise.then(data => {
  exoplanets.length = 0; // Clear array
  exoplanets.push(...data); // Add all loaded data
});

// Export counts
export const EXOPLANET_COUNT = () => exoplanets.length;
export const LOCAL_EXOPLANET_COUNT = 0;
export const NASA_EXOPLANET_COUNT = () => exoplanets.length;

// Get all exoplanets
export const getAllExoplanets = () => exoplanets;

// Check if data is loading
export const isExoplanetsLoading = () => !isDataLoaded;

// Refresh function
export const refreshExoplanets = async (): Promise<void> => {
  console.log('🔄 Refreshing NASA exoplanet data...');
  isDataLoaded = false;
  const data = await loadNASACSVData();
  exoplanets.length = 0;
  exoplanets.push(...data);
};