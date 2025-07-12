// Scientific habitability calculation utilities based on the Python analysis

export interface HabitabilityFactors {
  habitableZone: number;
  planetRadius: number;
  atmosphericPressure: number;
  stellarLuminosity: number;
  waterRetention: number;
  radiationHazard: number;
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
 * Calculate comprehensive habitability score (0-100)
 */
export function calculateHabitabilityScore(
  planetRadius: number,
  starTemperature: number,
  orbitalDistance: number,
  atmosphericPressure: number,
  stellarLuminosity: number,
  planetMass: number,
  albedo: number = 0.3,
  hostStarAge: number = 5.0
): { score: number; factors: HabitabilityFactors } {
  const hzBounds = calculateHabitableZoneBounds(starTemperature);
  const inHz = orbitalDistance >= hzBounds.inner && orbitalDistance <= hzBounds.outer;
  const hzFactor = inHz ? 1.0 : 0.0;

  const radiusFactor = Math.exp(-Math.pow(planetRadius - 1.0, 2) / (2 * Math.pow(0.3, 2)));
  const pressureFactor = Math.exp(-Math.pow(atmosphericPressure - 1.0, 2) / (2 * Math.pow(0.5, 2)));
  const luminosityFactor = Math.exp(-Math.pow(stellarLuminosity - 1.0, 2) / (2 * Math.pow(0.7, 2)));
  const waterPotential = calculateWaterRetentionPotential(planetMass, planetRadius, starTemperature, orbitalDistance);
  const radiationPenalty = 1 - calculateRadiationHazardIndex(starTemperature, stellarLuminosity, orbitalDistance, hostStarAge);

  const scoreRaw = hzFactor * radiusFactor * pressureFactor * luminosityFactor * waterPotential * radiationPenalty;
  const score = Math.round(Math.max(0, Math.min(100, scoreRaw * 100)));

  const factors: HabitabilityFactors = {
    habitableZone: hzFactor,
    planetRadius: radiusFactor,
    atmosphericPressure: pressureFactor,
    stellarLuminosity: luminosityFactor,
    waterRetention: waterPotential,
    radiationHazard: 1 - radiationPenalty
  };

  return { score, factors };
}

/**
 * Get habitability classification
 */
export function getHabitabilityClassification(score: number): string {
  if (score >= 80) return 'Very High Potential';
  if (score >= 60) return 'High Potential';
  if (score >= 40) return 'Moderate Potential';
  if (score >= 20) return 'Low Potential';
  return 'Very Low Potential';
}

/**
 * Get detailed habitability analysis
 */
export function getHabitabilityAnalysis(
  planetName: string,
  score: number,
  factors: HabitabilityFactors
): string {
  const classification = getHabitabilityClassification(score);
  
  let analysis = `${planetName} shows ${classification.toLowerCase()} for supporting life. `;
  
  if (factors.habitableZone === 0) {
    analysis += "The planet is located outside the habitable zone, making liquid water unlikely. ";
  } else {
    analysis += "The planet is positioned within the habitable zone where liquid water could exist. ";
  }
  
  if (factors.waterRetention < 0.5) {
    analysis += "Low water retention capability due to insufficient gravity or excessive heat. ";
  } else {
    analysis += "Good potential for retaining water on the surface. ";
  }
  
  if (factors.radiationHazard > 0.7) {
    analysis += "High radiation levels from the host star pose significant challenges for life. ";
  } else if (factors.radiationHazard > 0.3) {
    analysis += "Moderate radiation levels that could affect atmospheric stability. ";
  } else {
    analysis += "Relatively safe radiation environment. ";
  }
  
  return analysis;
}