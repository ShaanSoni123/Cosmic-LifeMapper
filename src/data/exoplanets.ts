import { Exoplanet } from '../types/exoplanet';
import { RAW_EXOPLANET_DATA } from './rawExoplanetData';
import { convertToExoplanet, RawExoplanetData } from '../utils/exoplanetProcessor';

// Parse CSV data and convert to exoplanet objects
function parseCSVData(): Exoplanet[] {
  const lines = RAW_EXOPLANET_DATA.trim().split('\n');
  const exoplanets: Exoplanet[] = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',');
      
      // Validate that we have enough values
      if (values.length < 12) {
        console.warn(`Skipping incomplete data row ${i}: ${lines[i]}`);
        continue;
      }
      
      // Parse and validate numeric values
      const parseFloat = (value: string, defaultValue: number = 0): number => {
        const parsed = Number(value);
        return isNaN(parsed) ? defaultValue : parsed;
      };
      
      const rawData: RawExoplanetData = {
        planet_name: values[0]?.trim() || `Unknown-${i}`,
        planet_radius: parseFloat(values[1], 1.0),
        star_temperature: parseFloat(values[2], 5778),
        orbital_distance: parseFloat(values[3], 1.0),
        atmospheric_pressure: parseFloat(values[4], 1.0),
        stellar_luminosity: parseFloat(values[5], 1.0),
        planet_mass: parseFloat(values[6], 1.0),
        eccentricity: parseFloat(values[7], 0.0),
        orbital_period: parseFloat(values[8], 365.25),
        albedo: parseFloat(values[9], 0.3),
        host_star_metallicity: parseFloat(values[10], 0.0),
        host_star_age: parseFloat(values[11], 5.0)
      };

      // Convert raw data to frontend format with scientific calculations
      const exoplanet = convertToExoplanet(rawData, i - 1);
      
      // Validate the converted exoplanet before adding
      if (exoplanet && exoplanet.name && typeof exoplanet.habitabilityScore === 'number') {
        exoplanets.push(exoplanet);
      } else {
        console.warn(`Invalid exoplanet generated for row ${i}:`, exoplanet);
      }
    } catch (error) {
      console.warn(`Error processing exoplanet data row ${i}:`, error);
      continue;
    }
  }

  console.log(`✨ Successfully loaded ${exoplanets.length} valid exoplanets from scientific backend data`);
  return exoplanets;
}

// Export all 63 scientifically processed exoplanets
export const exoplanets: Exoplanet[] = parseCSVData();

// Export count for verification
export const EXOPLANET_COUNT = exoplanets.length;