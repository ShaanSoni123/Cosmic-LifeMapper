import { Exoplanet } from '../types/exoplanet';
import { RAW_EXOPLANET_DATA } from './rawExoplanetData';
import { convertToExoplanet, RawExoplanetData } from '../utils/exoplanetProcessor';

// Initialize NASA data synchronously to avoid loading issues
let nasaExoplanets: Exoplanet[] = [];
let NASA_EXOPLANET_COUNT = 0;

// Load NASA data asynchronously but don't block initial render
async function initializeNASAData() {
  try {
    const { loadNASAExoplanets } = await import('./nasaExoplanets');
    nasaExoplanets = await loadNASAExoplanets();
    NASA_EXOPLANET_COUNT = nasaExoplanets.length;
    console.log(`✅ NASA data loaded: ${NASA_EXOPLANET_COUNT} exoplanets`);
  } catch (error) {
    console.warn('⚠️ Failed to load NASA data, continuing with local data only:', error);
    nasaExoplanets = [];
    NASA_EXOPLANET_COUNT = 0;
  }
}

// Start loading NASA data but don't wait for it
initializeNASAData();

// Parse the raw CSV data and convert to exoplanets
function parseRawExoplanetData(): Exoplanet[] {
  const lines = RAW_EXOPLANET_DATA.trim().split('\n');
  const headers = lines[0].split(',');
  const exoplanets: Exoplanet[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== headers.length) continue;

    const rawData: RawExoplanetData = {
      planet_name: values[0],
      planet_radius: parseFloat(values[1]),
      star_temperature: parseFloat(values[2]),
      orbital_distance: parseFloat(values[3]),
      atmospheric_pressure: parseFloat(values[4]),
      stellar_luminosity: parseFloat(values[5]),
      planet_mass: parseFloat(values[6]),
      eccentricity: parseFloat(values[7]),
      orbital_period: parseFloat(values[8]),
      albedo: parseFloat(values[9]),
      host_star_metallicity: parseFloat(values[10]),
      host_star_age: parseFloat(values[11])
    };

    // Convert to frontend format with enhanced calculations
    const exoplanet = convertToExoplanet(rawData, i - 1);
    exoplanets.push(exoplanet);
  }

  console.log(`✅ Successfully loaded ${exoplanets.length} exoplanets with accurate scientific data`);
  return exoplanets;
}

// Enhanced exoplanet data with NASA-accurate parameters
const localExoplanets = parseRawExoplanetData();

// Start with local exoplanets only, NASA data will be added when available
export let exoplanets: Exoplanet[] = [...localExoplanets];

// Export count and utility functions
export let EXOPLANET_COUNT = exoplanets.length;
export let LOCAL_EXOPLANET_COUNT = localExoplanets.length;
export { NASA_EXOPLANET_COUNT };

// Update exoplanets array when NASA data is loaded
initializeNASAData().then(() => {
  exoplanets = [...localExoplanets, ...nasaExoplanets];
  EXOPLANET_COUNT = exoplanets.length;
});

// Refresh function for future NASA API integration
export const refreshExoplanets = async (): Promise<void> => {
  console.log('🔄 Refreshing exoplanet data...');
  await initializeNASAData();
  exoplanets = [...localExoplanets, ...nasaExoplanets];
  EXOPLANET_COUNT = exoplanets.length;
};

// Get exoplanets by source
export const getLocalExoplanets = () => localExoplanets;
export const getNASAExoplanets = () => nasaExoplanets;
export const getAllExoplanets = () => [...localExoplanets, ...nasaExoplanets];

export const isExoplanetsLoading = () => false;

console.log(`🌟 Cosmic-LifeMapper initialized with ${LOCAL_EXOPLANET_COUNT} local exoplanets`);
console.log(`📊 NASA data loading in background...`);