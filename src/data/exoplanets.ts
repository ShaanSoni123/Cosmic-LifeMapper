import { Exoplanet } from '../types/exoplanet';
import { RAW_EXOPLANET_DATA } from './rawExoplanetData';
import { convertToExoplanet, RawExoplanetData } from '../utils/exoplanetProcessor';

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
export const exoplanets: Exoplanet[] = parseRawExoplanetData();

// Export count and utility functions
export const EXOPLANET_COUNT = exoplanets.length;

// Refresh function for future NASA API integration
export const refreshExoplanets = async (): Promise<Exoplanet[]> => {
  console.log('🔄 Refreshing exoplanet data...');
  // For now, return the current data
  // In the future, this could fetch from NASA API
  return exoplanets;
};

export const isExoplanetsLoading = () => false;

console.log(`🌟 Cosmic-LifeMapper initialized with ${EXOPLANET_COUNT} scientifically accurate exoplanets`);