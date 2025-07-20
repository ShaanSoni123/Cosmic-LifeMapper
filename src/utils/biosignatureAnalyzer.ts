// Biosignature Analysis System for Enhanced Habitability Scoring
// Based on atmospheric chemical composition and survival rates

// Atmospheric Gas Survival Analysis System
export interface AtmosphericGasData {
  H2: number;
  O2: number;
  N2: number;
  CO2: number;
  NH3: number;
  C2H6: number;
  SO2: number;
  H2S: number;
}

export interface SurvivalRange {
  range: [number, number];
  survival: number;
}

// Gas survival data mapping (concentration ranges to survival percentages)
const GAS_SURVIVAL_RANGES: { [key: string]: SurvivalRange[] } = {
  H2: [
    { range: [0, 2.5], survival: 20 },
    { range: [2.5, 5.0], survival: 25 },
    { range: [5.0, 7.5], survival: 30 },
    { range: [7.5, 10.0], survival: 35 },
    { range: [10.0, 12.5], survival: 40 }
  ],
  O2: [
    { range: [0, 2.5], survival: 0 },
    { range: [2.5, 5.0], survival: 0 },
    { range: [5.0, 7.5], survival: 30 },
    { range: [7.5, 10.0], survival: 42.5 },
    { range: [10.0, 12.5], survival: 75 }
  ],
  N2: [
    { range: [0, 2.5], survival: 0 },
    { range: [2.5, 5.0], survival: 20 },
    { range: [5.0, 7.5], survival: 23.75 },
    { range: [7.5, 10.0], survival: 27.5 },
    { range: [10.0, 12.5], survival: 31.25 }
  ],
  CO2: [
    { range: [0, 2.5], survival: 65 },
    { range: [2.5, 5.0], survival: 52.5 },
    { range: [5.0, 7.5], survival: 38.75 },
    { range: [7.5, 10.0], survival: 25 },
    { range: [10.0, 12.5], survival: 0 }
  ],
  NH3: [
    { range: [0, 2.5], survival: 30 },
    { range: [2.5, 5.0], survival: 50 },
    { range: [5.0, 7.5], survival: 37.5 },
    { range: [7.5, 10.0], survival: 25 },
    { range: [10.0, 12.5], survival: 12.5 }
  ],
  C2H6: [
    { range: [0, 2.5], survival: 100 },
    { range: [2.5, 5.0], survival: 97.75 },
    { range: [5.0, 7.5], survival: 94 },
    { range: [7.5, 10.0], survival: 89 },
    { range: [10.0, 12.5], survival: 84 }
  ],
  SO2: [
    { range: [0, 2.5], survival: 100 },
    { range: [2.5, 5.0], survival: 0 },
    { range: [5.0, 7.5], survival: 0 },
    { range: [7.5, 10.0], survival: 0 },
    { range: [10.0, 12.5], survival: 0 }
  ],
  H2S: [
    { range: [0, 2.5], survival: 100 },
    { range: [2.5, 5.0], survival: 0 },
    { range: [5.0, 7.5], survival: 0 },
    { range: [7.5, 10.0], survival: 0 },
    { range: [10.0, 12.5], survival: 0 }
  ]
};

/**
 * Calculate survival score for a specific gas concentration
 */
function getGasSurvivalScore(gas: keyof AtmosphericGasData, concentration: number): number {
  const ranges = GAS_SURVIVAL_RANGES[gas];
  if (!ranges) return 0;

  for (const range of ranges) {
    const [low, high] = range.range;
    if (concentration >= low && concentration < high) {
      return range.survival;
    }
  }
  
  // If concentration is above all ranges, use the last range's survival score
  return ranges[ranges.length - 1].survival;
}

/**
 * Calculate atmospheric survival analysis
 */
export function calculateAtmosphericSurvival(gasData: AtmosphericGasData): {
  individualScores: { [key: string]: number };
  averageScore: number;
  totalScore: number;
} {
  const individualScores: { [key: string]: number } = {};
  let totalScore = 0;
  let gasCount = 0;

  // Calculate survival score for each gas
  for (const [gas, concentration] of Object.entries(gasData)) {
    const survivalScore = getGasSurvivalScore(gas as keyof AtmosphericGasData, concentration);
    individualScores[gas] = survivalScore;
    totalScore += survivalScore;
    gasCount++;
  }

  const averageScore = gasCount > 0 ? totalScore / gasCount : 0;

  return {
    individualScores,
    averageScore: Math.round(averageScore * 100) / 100,
    totalScore: Math.round(averageScore) // Final survival score out of 100
  };
}

export interface ChemicalConcentration {
  H2?: number;
  O2?: number;
  N2?: number;
  CO2?: number;
  NH3?: number;
  C2H6?: number;
  SO2?: number;
  H2S?: number;
  He?: number;
  Ar?: number;
  Ne?: number;
}

export interface BiosignatureReport {
  H2?: number;
  O2?: number;
  N2?: number;
  CO2?: number;
  NH3?: number;
  C2H6?: number;
  SO2?: number;
  H2S?: number;
  He?: number;
  Ar?: number;
  Ne?: number;
  Temperature: number;
  HabitabilityScore: number;
}

// Chemical survival data mapping (concentration ranges to survival percentages)
const CHEMICAL_SURVIVAL_DATA = {
  H2: [
    { range: [0, 0.1], survival: 95 },
    { range: [0.1, 1.0], survival: 85 },
    { range: [1.0, 10.0], survival: 70 },
    { range: [10.0, 50.0], survival: 45 },
    { range: [50.0, 100.0], survival: 20 },
    { range: [100.0, Infinity], survival: 5 }
  ],
  O2: [
    { range: [0, 5], survival: 30 },
    { range: [5, 15], survival: 70 },
    { range: [15, 25], survival: 95 },
    { range: [25, 35], survival: 85 },
    { range: [35, 50], survival: 60 },
    { range: [50, Infinity], survival: 25 }
  ],
  N2: [
    { range: [0, 20], survival: 40 },
    { range: [20, 60], survival: 85 },
    { range: [60, 80], survival: 95 },
    { range: [80, 90], survival: 90 },
    { range: [90, 95], survival: 75 },
    { range: [95, Infinity], survival: 50 }
  ],
  CO2: [
    { range: [0, 0.1], survival: 95 },
    { range: [0.1, 1.0], survival: 90 },
    { range: [1.0, 5.0], survival: 75 },
    { range: [5.0, 15.0], survival: 50 },
    { range: [15.0, 30.0], survival: 25 },
    { range: [30.0, Infinity], survival: 10 }
  ],
  NH3: [
    { range: [0, 0.01], survival: 90 },
    { range: [0.01, 0.1], survival: 70 },
    { range: [0.1, 1.0], survival: 45 },
    { range: [1.0, 5.0], survival: 20 },
    { range: [5.0, Infinity], survival: 5 }
  ],
  C2H6: [
    { range: [0, 0.001], survival: 85 },
    { range: [0.001, 0.01], survival: 75 },
    { range: [0.01, 0.1], survival: 60 },
    { range: [0.1, 1.0], survival: 40 },
    { range: [1.0, Infinity], survival: 15 }
  ],
  SO2: [
    { range: [0, 0.001], survival: 90 },
    { range: [0.001, 0.01], survival: 65 },
    { range: [0.01, 0.1], survival: 35 },
    { range: [0.1, 1.0], survival: 15 },
    { range: [1.0, Infinity], survival: 5 }
  ],
  H2S: [
    { range: [0, 0.001], survival: 85 },
    { range: [0.001, 0.01], survival: 60 },
    { range: [0.01, 0.1], survival: 30 },
    { range: [0.1, 1.0], survival: 10 },
    { range: [1.0, Infinity], survival: 2 }
  ],
  He: [
    { range: [0, 1.0], survival: 95 },
    { range: [1.0, 5.0], survival: 90 },
    { range: [5.0, 15.0], survival: 85 },
    { range: [15.0, 30.0], survival: 75 },
    { range: [30.0, 50.0], survival: 60 },
    { range: [50.0, Infinity], survival: 40 }
  ],
  Ar: [
    { range: [0, 0.5], survival: 95 },
    { range: [0.5, 2.0], survival: 90 },
    { range: [2.0, 5.0], survival: 85 },
    { range: [5.0, 10.0], survival: 75 },
    { range: [10.0, 20.0], survival: 60 },
    { range: [20.0, Infinity], survival: 45 }
  ],
  Ne: [
    { range: [0, 0.1], survival: 95 },
    { range: [0.1, 0.5], survival: 90 },
    { range: [0.5, 2.0], survival: 85 },
    { range: [2.0, 5.0], survival: 75 },
    { range: [5.0, 10.0], survival: 60 },
    { range: [10.0, Infinity], survival: 40 }
  ]
};

/**
 * Get survival percentage for a chemical based on its concentration
 */
function getSurvivalValue(chemical: keyof typeof CHEMICAL_SURVIVAL_DATA, concentration: number): number {
  const survivalData = CHEMICAL_SURVIVAL_DATA[chemical];
  
  for (const entry of survivalData) {
    const [low, high] = entry.range;
    if (concentration >= low && concentration < high) {
      return entry.survival;
    }
  }
  
  return 0; // Default if no range matches
}

/**
 * Calculate temperature survival score
 */
function getTemperatureSurvival(tempCelsius: number): number {
  // Optimal temperature range for life (0-40°C gets 100%, outside gets reduced score)
  if (tempCelsius >= 0 && tempCelsius <= 40) {
    return 100;
  } else if (tempCelsius >= -20 && tempCelsius < 0) {
    return 80; // Cold but survivable
  } else if (tempCelsius > 40 && tempCelsius <= 60) {
    return 70; // Hot but survivable
  } else if (tempCelsius >= -50 && tempCelsius < -20) {
    return 50; // Very cold
  } else if (tempCelsius > 60 && tempCelsius <= 100) {
    return 40; // Very hot
  } else {
    return 10; // Extreme conditions
  }
}

/**
 * Generate comprehensive biosignature report
 */
export function generateBiosignatureReport(
  chemicalConcentrations: ChemicalConcentration,
  temperatureCelsius: number
): BiosignatureReport {
  const report: Partial<BiosignatureReport> = {};
  let totalScore = 0;
  let componentCount = 0;

  // Analyze each chemical component
  for (const [chemical, concentration] of Object.entries(chemicalConcentrations)) {
    if (concentration !== undefined && chemical in CHEMICAL_SURVIVAL_DATA) {
      const survivalScore = getSurvivalValue(
        chemical as keyof typeof CHEMICAL_SURVIVAL_DATA, 
        concentration
      );
      report[chemical as keyof ChemicalConcentration] = survivalScore;
      totalScore += survivalScore;
      componentCount++;
    }
  }

  // Add temperature component
  const tempScore = getTemperatureSurvival(temperatureCelsius);
  report.Temperature = tempScore;
  totalScore += tempScore;
  componentCount++;

  // Calculate overall habitability score
  const habitabilityScore = componentCount > 0 ? Math.round((totalScore / componentCount) * 100) / 100 : 0;
  report.HabitabilityScore = habitabilityScore;

  return report as BiosignatureReport;
}

/**
 * Convert atmospheric composition to chemical concentrations (percentage to ppm/ppb)
 */
export function atmosphereToChemicalConcentrations(atmosphere: {
  oxygen: number;
  nitrogen: number;
  carbonDioxide: number;
  methane: number;
}): ChemicalConcentration {
  // Convert percentages to concentration ranges based on atmospheric composition
  // Scale atmospheric percentages to survival analysis ranges (0-12.5)
  const h2Concentration = atmosphere.methane > 1 ? 
    Math.min(12.5, 2.0 + atmosphere.methane * 0.8) : 
    Math.min(12.5, atmosphere.methane * 1.5);
  
  const nh3Concentration = Math.min(12.5, atmosphere.methane * 0.4 + (atmosphere.carbonDioxide > 10 ? 2.0 : 0.5));
  const c2h6Concentration = Math.min(12.5, atmosphere.methane * 0.6 + 0.5);
  const so2Concentration = atmosphere.carbonDioxide > 20 ? 
    Math.min(12.5, 1.5 + Math.random() * 2) : 
    Math.min(12.5, Math.random() * 1.0);
  const h2sConcentration = atmosphere.carbonDioxide > 15 ? 
    Math.min(12.5, 1.0 + Math.random() * 1.5) : 
    Math.min(12.5, Math.random() * 0.8);
  
  return {
    O2: Math.min(12.5, atmosphere.oxygen * 0.6),
    N2: Math.min(12.5, atmosphere.nitrogen * 0.15),
    CO2: Math.min(12.5, atmosphere.carbonDioxide * 0.8),
    H2: h2Concentration,
    NH3: nh3Concentration,
    C2H6: c2h6Concentration,
    SO2: so2Concentration,
    H2S: h2sConcentration
  };
}

/**
 * Enhanced habitability score that combines traditional metrics with biosignature analysis
 */
export function calculateEnhancedHabitabilityScore(
  traditionalScore: number,
  biosignatureScore: number,
  weight: number = 0.3
): number {
  // Ensure scores are in valid range
  const validTraditional = Math.max(0, Math.min(100, traditionalScore));
  const validBiosignature = Math.max(0, Math.min(100, biosignatureScore));
  
  // Combine traditional habitability with biosignature analysis
  const enhancedScore = (validTraditional * (1 - weight)) + (validBiosignature * weight);
  return Math.max(0, Math.min(100, Math.round(enhancedScore * 10) / 10));
}

/**
 * Get biosignature classification based on score
 */
export function getBiosignatureClassification(score: number): string {
  if (score >= 90) return 'Excellent Biosignature Potential';
  if (score >= 75) return 'High Biosignature Potential';
  if (score >= 60) return 'Moderate Biosignature Potential';
  if (score >= 40) return 'Low Biosignature Potential';
  if (score >= 20) return 'Poor Biosignature Potential';
  return 'Hostile Environment';
}

/**
 * Generate detailed biosignature analysis text
 */
export function getBiosignatureAnalysis(
  report: BiosignatureReport,
  planetName: string
): string {
  const classification = getBiosignatureClassification(report.HabitabilityScore);
  
  let analysis = `${planetName} shows ${classification.toLowerCase()} based on atmospheric chemical analysis. `;
  
  // Analyze key components
  if (report.O2 && report.O2 > 70) {
    analysis += "High oxygen levels indicate potential for aerobic life forms. ";
  } else if (report.O2 && report.O2 < 30) {
    analysis += "Low oxygen levels suggest anaerobic conditions predominate. ";
  }
  
  if (report.CO2 && report.CO2 > 50) {
    analysis += "Elevated CO2 levels may indicate greenhouse effects or volcanic activity. ";
  }
  
  if (report.N2 && report.N2 > 70) {
    analysis += "Nitrogen-rich atmosphere provides stable chemical environment. ";
  }
  
  if (report.Temperature > 80) {
    analysis += "High temperature survival score suggests favorable thermal conditions. ";
  } else if (report.Temperature < 40) {
    analysis += "Temperature conditions present challenges for most life forms. ";
  }
  
  return analysis;
}