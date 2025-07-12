export interface Exoplanet {
  id: string;
  name: string;
  distance: number; // light years
  mass: number; // Earth masses
  radius: number; // Earth radii
  temperature: number; // Kelvin
  habitabilityScore: number; // 0-100
  starType: string;
  orbitalPeriod: number; // days
  discoveryYear: number;
  minerals: {
    iron: number;
    silicon: number;
    magnesium: number;
    carbon: number;
    water: number;
  };
  bacteria: {
    extremophiles: number;
    photosynthetic: number;
    chemosynthetic: number;
    anaerobic: number;
  };
  atmosphere: {
    oxygen: number;
    nitrogen: number;
    carbonDioxide: number;
    methane: number;
  };
  biosignature?: {
    score: number;
    classification: string;
    chemicalAnalysis: any;
  };
}