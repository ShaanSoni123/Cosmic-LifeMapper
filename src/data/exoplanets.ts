import { Exoplanet } from '../types/exoplanet';
import { csvDataLoader } from '../services/csvDataLoader';

// Initialize with empty array and load data immediately
let realNASAExoplanets: Exoplanet[] = [];
let NASA_EXOPLANET_COUNT = 0;
let isLoadingNASAData = true;

// Load real NASA CSV data immediately
async function loadRealNASAData() {
  try {
    console.log('🔄 Loading real NASA CSV data...');
    const csvData = await csvDataLoader.loadNASACSV();
    
    realNASAExoplanets = csvData.map((nasaData, index) => 
      csvDataLoader.convertToExoplanet(nasaData, index)
    );
    
    NASA_EXOPLANET_COUNT = realNASAExoplanets.length;
    console.log(`✅ Successfully loaded ${NASA_EXOPLANET_COUNT} real NASA exoplanets from CSV`);
    
  } catch (error) {
    console.error('❌ Failed to load real NASA CSV data:', error);
    // Generate fallback data if CSV fails
    realNASAExoplanets = generateFallbackExoplanets();
    NASA_EXOPLANET_COUNT = realNASAExoplanets.length;
  } finally {
    isLoadingNASAData = false;
  }
}

// Generate fallback exoplanets if needed
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
    const habitabilityScore = calculateHabitabilityScore(planet);
    return {
      id: `fallback-${index}`,
      name: planet.name,
      distance: planet.distance,
      mass: planet.mass,
      radius: planet.radius,
      temperature: planet.temp,
      habitabilityScore,
      starType: getStarType(planet.temp),
      orbitalPeriod: planet.period,
      discoveryYear: planet.year,
      minerals: generateMinerals(planet),
      bacteria: generateBacteria(planet, habitabilityScore),
      atmosphere: generateAtmosphere(planet),
      biosignature: {
        score: habitabilityScore * 0.8 + Math.random() * 20,
        classification: getClassification(habitabilityScore),
        chemicalAnalysis: generateChemicalAnalysis(planet)
      }
    };
  });
}

function calculateHabitabilityScore(planet: any): number {
  let score = 50;
  const tempDiff = Math.abs(planet.temp - 288);
  score += Math.max(0, 30 - tempDiff / 10);
  const sizeDiff = Math.abs(planet.radius - 1.0);
  score += Math.max(0, 20 - sizeDiff * 15);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getStarType(temp: number): string {
  if (temp >= 350) return 'F-type';
  if (temp >= 250) return 'G-type';
  if (temp >= 200) return 'K-type';
  return 'M-dwarf';
}

function getClassification(score: number): string {
  if (score >= 80) return 'Excellent Potential';
  if (score >= 60) return 'High Potential';
  if (score >= 40) return 'Moderate Potential';
  return 'Low Potential';
}

function generateMinerals(planet: any) {
  return {
    iron: 25 + Math.random() * 20,
    silicon: 20 + Math.random() * 15,
    magnesium: 15 + Math.random() * 10,
    carbon: 10 + Math.random() * 15,
    water: 15 + Math.random() * 25
  };
}

function generateBacteria(planet: any, habitability: number) {
  return {
    extremophiles: 40 + Math.random() * 30,
    photosynthetic: 30 + habitability * 0.4,
    chemosynthetic: 50 + Math.random() * 30,
    anaerobic: 60 + Math.random() * 25
  };
}

function generateAtmosphere(planet: any) {
  return {
    nitrogen: 70 + Math.random() * 20,
    oxygen: 15 + Math.random() * 10,
    carbonDioxide: 10 + Math.random() * 15,
    methane: Math.random() * 5
  };
}

function generateChemicalAnalysis(planet: any) {
  return {
    O2: 10 + Math.random() * 20,
    H2: 5 + Math.random() * 15,
    N2: 50 + Math.random() * 30,
    CO2: 20 + Math.random() * 25,
    Temperature: planet.temp - 273.15,
    HabitabilityScore: calculateHabitabilityScore(planet)
  };
}

// Initialize data loading
loadRealNASAData();

// Export the exoplanets array
export let exoplanets: Exoplanet[] = realNASAExoplanets;

// Export counts
export let EXOPLANET_COUNT = 0;
export let LOCAL_EXOPLANET_COUNT = 0;
export { NASA_EXOPLANET_COUNT };

// Refresh function for future NASA API integration
export const refreshExoplanets = async (): Promise<void> => {
  console.log('🔄 Refreshing real NASA exoplanet data...');
  await loadRealNASAData();
};

// Get exoplanets by source
export const getLocalExoplanets = () => [];
export const getNASAExoplanets = () => realNASAExoplanets;
export const getAllExoplanets = () => realNASAExoplanets;

export const isExoplanetsLoading = () => isLoadingNASAData;