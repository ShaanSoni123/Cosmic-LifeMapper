// Scientific habitability calculation utilities integrated from Python backend
import { Exoplanet } from '../types/exoplanet';
import { 
  generateBiosignatureReport, 
  atmosphereToChemicalConcentrations, 
  calculateEnhancedHabitabilityScore,
  getBiosignatureClassification 
} from './biosignatureAnalyzer';

export interface HabitabilityFactors {
  habitableZone: number;
  planetRadius: number;
  atmosphericPressure: number;
  stellarLuminosity: number;
  waterRetention: number;
  radiationHazard: number;
}

export interface RawExoplanetData {
  planet_name: string;
  planet_radius: number;
  star_temperature: number;
  orbital_distance: number;
  atmospheric_pressure: number;
  stellar_luminosity: number;
  planet_mass: number;
  eccentricity: number;
  orbital_period: number;
  albedo: number;
  host_star_metallicity: number;
  host_star_age: number;
}

/**
 * Calculate habitable zone boundaries using Kopparapu et al. 2013 model
 */
export function calculateHabitableZoneBounds(starTemp: number): { inner: number; outer: number } {
  const T_star = starTemp;
  
  // Empirical coefficients for runaway greenhouse (inner) and maximum greenhouse (outer)
  const S_inner = 1.107 + 1.332e-4 * (T_star - 5780) + 1.580e-8 * Math.pow(T_star - 5780, 2);
  const S_outer = 0.356 + 6.171e-5 * (T_star - 5780) + 1.698e-9 * Math.pow(T_star - 5780, 2);
  const L_star = Math.pow(T_star / 5778, 4); // Approximate luminosity
  
  const inner = Math.sqrt(L_star / S_inner);
  const outer = Math.sqrt(L_star / S_outer);
  
  return { inner, outer };
}

/**
 * Estimate equilibrium surface temperature
 */
export function estimateSurfaceTemperature(
  starTemp: number,
  orbitalDistance: number,
  albedo: number = 0.3
): number {
  const R_sun_AU = 0.00465047; // Solar radius in AU
  const T_eq = starTemp * Math.sqrt(R_sun_AU / (2 * orbitalDistance)) * Math.pow(1 - albedo, 0.25);
  return T_eq;
}

/**
 * Calculate surface gravity relative to Earth
 */
export function calculateSurfaceGravity(planetMass: number, planetRadius: number): number {
  return planetMass / Math.pow(planetRadius, 2);
}

/**
 * Calculate water retention potential (0-1)
 */
export function calculateWaterRetentionPotential(
  planetMass: number,
  planetRadius: number,
  starTemp: number,
  orbitalDistance: number
): number {
  const gravity = calculateSurfaceGravity(planetMass, planetRadius);
  const T_eq = estimateSurfaceTemperature(starTemp, orbitalDistance, 0.3);
  
  // Gravity factor: planets with gravity > 0.5g can retain water
  const gravityFactor = gravity >= 0.5 ? 1 : gravity / 0.5;
  
  // Temperature factor: too hot planets lose water
  let tempFactor: number;
  if (T_eq <= 320) {
    tempFactor = 1.0;
  } else if (T_eq >= 400) {
    tempFactor = 0.0;
  } else {
    tempFactor = (400 - T_eq) / 80;
  }
  
  const score = gravityFactor * tempFactor;
  return Math.max(0, Math.min(1, score));
}

/**
 * Calculate radiation hazard index (0-1)
 */
export function calculateRadiationHazardIndex(
  starTemp: number,
  stellarLuminosity: number,
  orbitalDistance: number,
  hostStarAge: number
): number {
  // Normalize star temp between 2500K and 7000K
  const tempNorm = Math.max(0, Math.min(1, (starTemp - 2500) / (7000 - 2500)));
  
  // Base radiation proportional to stellar luminosity / distance^2
  const baseRadiation = stellarLuminosity / Math.pow(orbitalDistance, 2);
  
  // Age factor: younger stars more active
  const ageFactor = hostStarAge < 1 ? 1.0 : Math.max(0, 1 - (hostStarAge - 1) / 9);
  
  const rawIndex = baseRadiation * tempNorm * ageFactor;
  const maxExpected = 10; // arbitrary scaling
  
  return Math.max(0, Math.min(1, rawIndex / maxExpected));
}

/**
 * Calculate comprehensive habitability score (0-1) - DEBUGGED VERSION
 */
export function calculateHabitabilityScore(data: RawExoplanetData): number {
  // Step 1: Habitable Zone Check
  const hzBounds = calculateHabitableZoneBounds(data.star_temperature);
  const inHz = data.orbital_distance >= hzBounds.inner && data.orbital_distance <= hzBounds.outer;
  const hzCenter = (hzBounds.inner + hzBounds.outer) / 2;
  const hzWidth = hzBounds.outer - hzBounds.inner;
  const hzFactor = inHz ? 1.0 : Math.max(0.1, 1.0 - Math.abs(data.orbital_distance - hzCenter) / hzWidth);

  // Step 2: Planet Size Factor (Earth-like = 1.0)
  const radiusFactor = Math.exp(-Math.pow(data.planet_radius - 1.0, 2) / (2 * Math.pow(0.5, 2)));
  
  // Step 3: Atmospheric Pressure Factor (Earth-like = 1.0)
  const pressureFactor = Math.exp(-Math.pow(data.atmospheric_pressure - 1.0, 2) / (2 * Math.pow(0.6, 2)));
  
  // Step 4: Stellar Luminosity Factor (Sun-like = 1.0)
  const luminosityFactor = Math.exp(-Math.pow(data.stellar_luminosity - 1.0, 2) / (2 * Math.pow(0.8, 2)));
  
  // Step 5: Water Retention Potential
  const waterPotential = calculateWaterRetentionPotential(data.planet_mass, data.planet_radius, data.star_temperature, data.orbital_distance);
  
  // Step 6: Radiation Safety (1 = safe, 0 = dangerous)
  const radiationSafety = 1 - calculateRadiationHazardIndex(data.star_temperature, data.stellar_luminosity, data.orbital_distance, data.host_star_age);
  
  // Step 7: Mass Factor (too small = can't hold atmosphere, too large = gas giant)
  let massFactor: number;
  if (data.planet_mass < 0.3) {
    massFactor = 0.1; // Too small to retain atmosphere
  } else if (data.planet_mass > 15) {
    massFactor = 0.2; // Too large, likely gas giant
  } else {
    // Optimal range around 1-5 Earth masses
    massFactor = Math.exp(-Math.pow(data.planet_mass - 2.0, 2) / (2 * Math.pow(2.5, 2)));
  }

  // Combine all factors with proper weighting
  const scoreRaw = hzFactor * 0.25 +           // 25% - Must be in habitable zone
                   radiusFactor * 0.15 +       // 15% - Earth-like size
                   pressureFactor * 0.15 +     // 15% - Atmospheric pressure
                   luminosityFactor * 0.10 +   // 10% - Star luminosity
                   waterPotential * 0.20 +     // 20% - Water retention
                   radiationSafety * 0.10 +    // 10% - Radiation safety
                   massFactor * 0.05;          // 5% - Planet mass

  return Math.max(0, Math.min(1, scoreRaw));
}

/**
 * Generate realistic mineral composition based on planet characteristics - DEBUGGED
 */
function generateMinerals(data: RawExoplanetData): Exoplanet['minerals'] {
  // Base composition for rocky planets
  const planetType = data.planet_radius < 1.5 ? 'rocky' : data.planet_radius < 4 ? 'super-earth' : 'gas-giant';
  
  let baseIron, baseSilicon, baseMagnesium, baseCarbon, baseWater;
  
  if (planetType === 'rocky') {
    baseIron = 32 + (data.planet_mass - 1) * 3;
    baseSilicon = 28 + Math.random() * 6;
    baseMagnesium = 16 + Math.random() * 4;
    baseCarbon = 8 + Math.random() * 4;
  } else if (planetType === 'super-earth') {
    baseIron = 28 + (data.planet_mass - 1) * 2;
    baseSilicon = 25 + Math.random() * 8;
    baseMagnesium = 18 + Math.random() * 6;
    baseCarbon = 12 + Math.random() * 6;
  } else {
    // Gas giant - lower mineral content
    baseIron = 15 + Math.random() * 10;
    baseSilicon = 20 + Math.random() * 10;
    baseMagnesium = 10 + Math.random() * 8;
    baseCarbon = 15 + Math.random() * 10;
  }

  // Water content based on temperature and distance
  const waterPotential = calculateWaterRetentionPotential(data.planet_mass, data.planet_radius, data.star_temperature, data.orbital_distance);
  baseWater = waterPotential * 25 + Math.random() * 15;

  return {
    iron: Math.round(Math.max(10, Math.min(45, baseIron))),
    silicon: Math.round(Math.max(15, Math.min(35, baseSilicon))),
    magnesium: Math.round(Math.max(8, Math.min(25, baseMagnesium))),
    carbon: Math.round(Math.max(3, Math.min(20, baseCarbon))),
    water: Math.round(Math.max(2, Math.min(40, baseWater)))
  };
}

/**
 * Generate bacterial life potential based on planet characteristics - DEBUGGED
 */
function generateBacteria(data: RawExoplanetData): Exoplanet['bacteria'] {
  const surfaceTemp = estimateSurfaceTemperature(data.star_temperature, data.orbital_distance, data.albedo);
  const radiationIndex = calculateRadiationHazardIndex(data.star_temperature, data.stellar_luminosity, data.orbital_distance, data.host_star_age);
  const habitabilityScore = calculateHabitabilityScore(data);
  
  // Extremophiles thrive in harsh conditions but need some stability
  const extremophiles = Math.round(40 + radiationIndex * 35 + (1 - habitabilityScore) * 20 + Math.random() * 15);
  
  // Photosynthetic bacteria need light and moderate conditions
  const photosynthetic = Math.round(Math.max(10, 70 - radiationIndex * 30 - Math.abs(surfaceTemp - 288) / 8 + habitabilityScore * 20));
  
  // Chemosynthetic bacteria are versatile
  const chemosynthetic = Math.round(45 + habitabilityScore * 25 + Math.random() * 20);
  
  // Anaerobic bacteria are hardy
  const anaerobic = Math.round(60 + radiationIndex * 15 + (1 - habitabilityScore) * 10 + Math.random() * 15);

  return {
    extremophiles: Math.max(15, Math.min(95, extremophiles)),
    photosynthetic: Math.max(5, Math.min(85, photosynthetic)),
    chemosynthetic: Math.max(25, Math.min(90, chemosynthetic)),
    anaerobic: Math.max(35, Math.min(95, anaerobic))
  };
}

/**
 * Generate atmospheric composition based on planet characteristics - DEBUGGED
 */
function generateAtmosphere(data: RawExoplanetData): Exoplanet['atmosphere'] {
  const surfaceTemp = estimateSurfaceTemperature(data.star_temperature, data.orbital_distance, data.albedo);
  const habitabilityScore = calculateHabitabilityScore(data);
  const planetType = data.planet_radius < 1.5 ? 'rocky' : data.planet_radius < 4 ? 'super-earth' : 'gas-giant';
  
  let nitrogen, oxygen, carbonDioxide, methane;
  
  if (planetType === 'gas-giant') {
    // Gas giants have hydrogen-helium dominated atmospheres, but we model the trace gases
    nitrogen = 10 + Math.random() * 15;
    oxygen = Math.random() * 3;
    carbonDioxide = 2 + Math.random() * 8;
    methane = 8 + Math.random() * 20; // Higher methane for gas giants
    methane = 5 + Math.random() * 15;
  } else {
    nitrogen = 65 + Math.random() * 15;
    oxygen = 12 + Math.random() * 12;
    carbonDioxide = 8 + Math.random() * 12;
    methane = Math.random() * 3;
    methane = Math.random() * 3;
  }

  // Normalize to 100%
  const total = nitrogen + oxygen + carbonDioxide + methane;
  nitrogen = (nitrogen / total) * 100;
  oxygen = (oxygen / total) * 100;
  carbonDioxide = (carbonDioxide / total) * 100;
  methane = (methane / total) * 100;

  return {
    nitrogen: Math.round(nitrogen * 100) / 100,
    oxygen: Math.round(oxygen * 100) / 100,
    carbonDioxide: Math.round(carbonDioxide * 100) / 100,
    methane: Math.round(methane * 1000) / 1000
  };
}

/**
 * Determine star type based on temperature - ACCURATE
 */
function getStarType(temperature: number): string {
  if (temperature >= 7500) return 'A-type';
  if (temperature >= 6000) return 'F-type';
  if (temperature >= 5200) return 'G-type';
  if (temperature >= 3700) return 'K-type';
  return 'M-dwarf';
}

/**
 * Convert raw exoplanet data to frontend format - DEBUGGED VERSION
 */
export function convertToExoplanet(data: RawExoplanetData, index: number): Exoplanet {
  // Calculate base habitability score
  const baseHabitabilityScore = calculateHabitabilityScore(data);
  const surfaceTemp = estimateSurfaceTemperature(data.star_temperature, data.orbital_distance, data.albedo);
  
  // Generate atmospheric composition
  const atmosphere = generateAtmosphere(data);
  
  // Generate biosignature analysis
  const chemicalConcentrations = atmosphereToChemicalConcentrations(atmosphere);
  const biosignatureReport = generateBiosignatureReport(chemicalConcentrations, surfaceTemp - 273.15);
  
  // Enhanced habitability score (70% traditional + 30% biosignature)
  const enhancedHabitabilityScore = calculateEnhancedHabitabilityScore(
    baseHabitabilityScore * 100, 
    biosignatureReport.HabitabilityScore,
    0.3
  );
  
  // Calculate realistic distance (light years)
  // Use a more realistic distance calculation based on stellar properties
  const baseDistance = 20 + Math.random() * 180; // 20-200 ly base range
  const tempFactor = data.star_temperature < 4000 ? 0.7 : data.star_temperature > 6000 ? 1.3 : 1.0;
  const lumFactor = data.stellar_luminosity < 0.1 ? 0.8 : data.stellar_luminosity > 2.0 ? 1.4 : 1.0;
  const distance = Math.max(4.2, Math.min(2000, baseDistance * tempFactor * lumFactor));

  // Discovery year based on planet characteristics (easier to find = earlier discovery)
  const discoveryYear = Math.max(2009, Math.min(2024, 
    2009 + Math.floor(Math.random() * 16) + 
    (enhancedHabitabilityScore > 70 ? -3 : 0) + // High habitability found earlier
    (distance > 1000 ? 5 : 0) // Distant planets found later
  ));

  return {
    id: (index + 1).toString(),
    name: data.planet_name,
    distance: Math.round(distance * 10) / 10,
    mass: Math.round(data.planet_mass * 100) / 100,
    radius: Math.round(data.planet_radius * 100) / 100,
    temperature: Math.round(surfaceTemp),
    habitabilityScore: Math.round(enhancedHabitabilityScore),
      nitrogen -= 15; // Low mass planets lose lighter gases
      oxygen -= 8;
      methane -= 1;
    discoveryYear,
    minerals: generateMinerals(data),
    bacteria: generateBacteria(data),
  // Ensure all values are positive
  nitrogen = Math.max(5, nitrogen);
  oxygen = Math.max(0.1, oxygen);
  carbonDioxide = Math.max(0.1, carbonDioxide);
  methane = Math.max(0.01, methane);

    atmosphere: atmosphere,
    biosignature: {
      nitrogen -= 20;
      carbonDioxide += 25;
      oxygen -= 10;
      methane += 2; // Hot planets can have more methane from thermal processes
    }
  };
}