import { Exoplanet } from '../types/exoplanet';

// Fetch live exoplanet data from NASA API
async function fetchNASAExoplanets(): Promise<Exoplanet[]> {
  try {
    console.log('🚀 Fetching live exoplanet data from NASA API...');
    
    const response = await fetch('http://localhost:3001/api/exoplanets', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch exoplanet data');
    }

    console.log(`✅ Successfully loaded ${data.count} exoplanets from NASA API`);
    console.log(`📊 Real NASA data: ${data.realDataCount}/${data.count} planets`);
    
    return data.exoplanets;
    
  } catch (error) {
    console.error('❌ Failed to fetch NASA data:', error);
    console.log('🔄 Falling back to static data...');
    
    // Return fallback static data if API fails
    return getFallbackExoplanets();
  }
}

// Fallback static data in case NASA API is unavailable
function getFallbackExoplanets(): Exoplanet[] {
  return [
    {
      id: "1",
      name: "Kepler-22b",
      distance: 620,
      mass: 2.4,
      radius: 2.4,
      temperature: 262,
      habitabilityScore: 75,
      starType: "G-type",
      orbitalPeriod: 289.9,
      discoveryYear: 2011,
      minerals: { iron: 32, silicon: 28, magnesium: 16, carbon: 8, water: 16 },
      bacteria: { extremophiles: 65, photosynthetic: 70, chemosynthetic: 75, anaerobic: 80 },
      atmosphere: { nitrogen: 68.5, oxygen: 18.2, carbonDioxide: 12.1, methane: 1.2 }
    },
    {
      id: "2", 
      name: "Proxima Centauri b",
      distance: 4.2,
      mass: 1.3,
      radius: 1.1,
      temperature: 234,
      habitabilityScore: 68,
      starType: "M-dwarf",
      orbitalPeriod: 11.2,
      discoveryYear: 2016,
      minerals: { iron: 30, silicon: 25, magnesium: 18, carbon: 12, water: 15 },
      bacteria: { extremophiles: 70, photosynthetic: 45, chemosynthetic: 80, anaerobic: 85 },
      atmosphere: { nitrogen: 65.3, oxygen: 15.8, carbonDioxide: 16.4, methane: 2.5 }
    },
    {
      id: "3",
      name: "TRAPPIST-1e", 
      distance: 40,
      mass: 0.77,
      radius: 0.92,
      temperature: 251,
      habitabilityScore: 82,
      starType: "M-dwarf",
      orbitalPeriod: 6.1,
      discoveryYear: 2017,
      minerals: { iron: 28, silicon: 30, magnesium: 20, carbon: 10, water: 12 },
      bacteria: { extremophiles: 60, photosynthetic: 75, chemosynthetic: 85, anaerobic: 90 },
      atmosphere: { nitrogen: 72.1, oxygen: 20.5, carbonDioxide: 6.2, methane: 1.2 }
    }
    // Add more fallback planets as needed...
  ];
}

// Initialize exoplanets data
let exoplanetsData: Exoplanet[] = [];
let isLoading = true;

// Load data immediately
fetchNASAExoplanets().then(data => {
  exoplanetsData = data;
  isLoading = false;
}).catch(error => {
  console.error('Failed to initialize exoplanet data:', error);
  exoplanetsData = getFallbackExoplanets();
  isLoading = false;
});

// Export exoplanets data
export const exoplanets: Exoplanet[] = exoplanetsData;

// Export count for verification
export const EXOPLANET_COUNT = exoplanetsData.length;

// Export loading state
export const isExoplanetsLoading = () => isLoading;

// Export refresh function
export const refreshExoplanets = async (): Promise<Exoplanet[]> => {
  const newData = await fetchNASAExoplanets();
  exoplanetsData.splice(0, exoplanetsData.length, ...newData);
  return newData;
};

console.log(`✨ Initializing NASA Exoplanet data loader...`);