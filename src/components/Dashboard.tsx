import { Exoplanet } from '../types/exoplanet';
import { csvDataLoader } from '../services/csvDataLoader';

// Initialize with empty arrays to prevent blocking
let allExoplanets: Exoplanet[] = [];
let isLoading = false;
let isLoaded = false;

// Load CSV data asynchronously without blocking initial render
async function initializeCSVData() {
  if (isLoaded || isLoading) return allExoplanets;
  
  isLoading = true;
  try {
    console.log('🔄 Loading NASA CSV exoplanet data...');
    const csvExoplanets = await csvDataLoader.loadAllExoplanets();
    allExoplanets = csvExoplanets;
    isLoaded = true;
    console.log(`✅ Successfully loaded ${allExoplanets.length} exoplanets from NASA CSV`);
  } catch (error) {
    console.error('❌ Failed to load CSV data:', error);
    allExoplanets = [];
  } finally {
    isLoading = false;
  }
  
  return allExoplanets;
}

// Start loading data immediately but don't block
initializeCSVData();

// Export current state
export let exoplanets: Exoplanet[] = allExoplanets;
export let EXOPLANET_COUNT = allExoplanets.length;
export let LOCAL_EXOPLANET_COUNT = 0; // No local data anymore
export let NASA_EXOPLANET_COUNT = allExoplanets.length;

// Refresh function to reload CSV data
export const refreshExoplanets = async (): Promise<void> => {
  console.log('🔄 Refreshing NASA CSV exoplanet data...');
  isLoaded = false;
  const refreshedData = await initializeCSVData();
  exoplanets = refreshedData;
  EXOPLANET_COUNT = refreshedData.length;
  NASA_EXOPLANET_COUNT = refreshedData.length;
};

// Get all exoplanets (now all from CSV)
export const getAllExoplanets = async (): Promise<Exoplanet[]> => {
  if (!isLoaded && !isLoading) {
    await initializeCSVData();
  }
  return allExoplanets;
};

// Get exoplanets synchronously (may be empty initially)
export const getAllExoplanetsSync = (): Exoplanet[] => allExoplanets;

// Check if data is loading
export const isExoplanetsLoading = () => isLoading;

// Get NASA exoplanets (all data is now NASA data)
export const getNASAExoplanets = () => allExoplanets;
export const getLocalExoplanets = () => []; // No local data anymore

console.log(`🌟 Cosmic-LifeMapper initializing with NASA CSV data...`);
console.log(`📊 Loading ${allExoplanets.length} exoplanets from NASA archive`);

// Update exports when data loads
initializeCSVData().then(() => {
  exoplanets = allExoplanets;
}
)