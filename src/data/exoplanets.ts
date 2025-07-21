import { Exoplanet } from '../types/exoplanet';

// Simple fallback data to get app working
const FALLBACK_EXOPLANETS: Exoplanet[] = [
  {
    id: '1',
    name: 'Kepler-452b',
    distance: 1402,
    mass: 5.0,
    radius: 1.63,
    temperature: 265,
    habitabilityScore: 83,
    starType: 'G-type',
    orbitalPeriod: 384.8,
    discoveryYear: 2015,
    minerals: { iron: 32, silicon: 28, magnesium: 16, carbon: 8, water: 16 },
    bacteria: { extremophiles: 45, photosynthetic: 65, chemosynthetic: 55, anaerobic: 70 },
    atmosphere: { nitrogen: 78, oxygen: 21, carbonDioxide: 0.04, methane: 0.0002 }
  },
  {
    id: '2',
    name: 'TRAPPIST-1e',
    distance: 40.7,
    mass: 0.77,
    radius: 0.92,
    temperature: 251,
    habitabilityScore: 78,
    starType: 'M-dwarf',
    orbitalPeriod: 6.1,
    discoveryYear: 2017,
    minerals: { iron: 28, silicon: 25, magnesium: 18, carbon: 12, water: 17 },
    bacteria: { extremophiles: 55, photosynthetic: 45, chemosynthetic: 65, anaerobic: 75 },
    atmosphere: { nitrogen: 75, oxygen: 18, carbonDioxide: 6, methane: 1 }
  },
  {
    id: '3',
    name: 'Proxima Centauri b',
    distance: 4.24,
    mass: 1.27,
    radius: 1.1,
    temperature: 234,
    habitabilityScore: 72,
    starType: 'M-dwarf',
    orbitalPeriod: 11.2,
    discoveryYear: 2016,
    minerals: { iron: 30, silicon: 26, magnesium: 17, carbon: 10, water: 17 },
    bacteria: { extremophiles: 60, photosynthetic: 40, chemosynthetic: 70, anaerobic: 80 },
    atmosphere: { nitrogen: 72, oxygen: 15, carbonDioxide: 12, methane: 1 }
  }
];

// Generate more planets
function generateMorePlanets(): Exoplanet[] {
  const planets: Exoplanet[] = [...FALLBACK_EXOPLANETS];
  
  for (let i = 4; i <= 100; i++) {
    planets.push({
      id: i.toString(),
      name: `Exoplanet-${i}`,
      distance: 10 + Math.random() * 1000,
      mass: 0.5 + Math.random() * 10,
      radius: 0.5 + Math.random() * 3,
      temperature: 150 + Math.random() * 800,
      habitabilityScore: Math.floor(Math.random() * 100),
      starType: ['M-dwarf', 'K-type', 'G-type', 'F-type'][Math.floor(Math.random() * 4)],
      orbitalPeriod: 1 + Math.random() * 1000,
      discoveryYear: 2009 + Math.floor(Math.random() * 16),
      minerals: {
        iron: 20 + Math.random() * 20,
        silicon: 15 + Math.random() * 20,
        magnesium: 10 + Math.random() * 15,
        carbon: 5 + Math.random() * 15,
        water: 5 + Math.random() * 30
      },
      bacteria: {
        extremophiles: 30 + Math.random() * 40,
        photosynthetic: 20 + Math.random() * 50,
        chemosynthetic: 40 + Math.random() * 40,
        anaerobic: 50 + Math.random() * 40
      },
      atmosphere: {
        nitrogen: 60 + Math.random() * 20,
        oxygen: 10 + Math.random() * 15,
        carbonDioxide: 5 + Math.random() * 15,
        methane: Math.random() * 5
      }
    });
  }
  
  return planets;
}

let allExoplanets: Exoplanet[] = generateMorePlanets();

export const getAllExoplanets = (): Exoplanet[] => allExoplanets;
export const EXOPLANET_COUNT = () => allExoplanets.length;
export const LOCAL_EXOPLANET_COUNT = 100;
export const NASA_EXOPLANET_COUNT = () => 0;
export const isExoplanetsLoading = () => false;
export const refreshExoplanets = async (): Promise<void> => {
  allExoplanets = generateMorePlanets();
};