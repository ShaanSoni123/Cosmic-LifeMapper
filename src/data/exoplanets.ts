import { Exoplanet } from '../types/exoplanet';
import { RAW_EXOPLANET_DATA } from './rawExoplanetData';
import { convertToExoplanet, RawExoplanetData } from '../utils/exoplanetProcessor';

// Parse CSV data and convert to exoplanet objects
function parseCSVData(): Exoplanet[] {
  const lines = RAW_EXOPLANET_DATA.trim().split('\n');
  const headers = lines[0].split(',');
  const exoplanets: Exoplanet[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
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

    // Convert raw data to frontend format with scientific calculations
    const exoplanet = convertToExoplanet(rawData, i - 1);
    exoplanets.push(exoplanet);
  }

  return exoplanets;
}

// Export all 63 scientifically processed exoplanets
export const exoplanets: Exoplanet[] = parseCSVData();

// Export count for verification
export const EXOPLANET_COUNT = exoplanets.length;

console.log(`✨ Loaded ${EXOPLANET_COUNT} exoplanets from scientific backend data`);