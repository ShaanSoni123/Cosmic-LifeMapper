import { Exoplanet } from '../types/exoplanet';
import { csvDataLoader } from '../services/csvDataLoader';

// Real NASA CSV data
let realNASAExoplanets: Exoplanet[] = [];
let NASA_EXOPLANET_COUNT = 0;
let isLoadingNASAData = false;

// Load real NASA CSV data
async function loadRealNASAData() {
  if (isLoadingNASAData) return;
  isLoadingNASAData = true;
  
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
    realNASAExoplanets = [];
    NASA_EXOPLANET_COUNT = 0;
  } finally {
    isLoadingNASAData = false;
  }
}

// Start loading real NASA data immediately
loadRealNASAData();

// Start with empty array, will be populated with real NASA data
export let exoplanets: Exoplanet[] = [];

// Export counts and utility functions
export let EXOPLANET_COUNT = exoplanets.length;
export let LOCAL_EXOPLANET_COUNT = 0; // No local data anymore, all from NASA
export { NASA_EXOPLANET_COUNT };

// Update exoplanets array when real NASA data is loaded
loadRealNASAData().then(() => {
  exoplanets = [...realNASAExoplanets];
  EXOPLANET_COUNT = exoplanets.length;
});

// Refresh function for future NASA API integration
export const refreshExoplanets = async (): Promise<void> => {
  console.log('🔄 Refreshing real NASA exoplanet data...');
  await loadRealNASAData();
  exoplanets = [...realNASAExoplanets];
  EXOPLANET_COUNT = exoplanets.length;
};

// Get exoplanets by source
export const getLocalExoplanets = () => []; // No local data anymore
export const getNASAExoplanets = () => realNASAExoplanets;
export const getAllExoplanets = () => [...realNASAExoplanets];

export const isExoplanetsLoading = () => isLoadingNASAData;

console.log(`🌟 Cosmic-LifeMapper initializing with real NASA CSV data...`);
console.log(`📊 Loading ${NASA_EXOPLANET_COUNT || '1000+'} real NASA exoplanets...`);