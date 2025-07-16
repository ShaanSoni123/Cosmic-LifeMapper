// NASA Parameter Definitions System
// Based on param_uni.txt - NASA Exoplanet Archive parameter definitions

export interface NASAParameter {
  name: string;
  type: string;
  description: string;
  unit?: string;
  category: 'planet' | 'star' | 'system' | 'discovery' | 'observation';
}

// Parse and organize NASA parameters from param_uni.txt
export const NASA_PARAMETERS: { [key: string]: NASAParameter } = {
  // Planet Parameters
  'pl_dens': {
    name: 'pl_dens',
    type: 'double',
    description: 'Planet Density',
    unit: 'g/cm³',
    category: 'planet'
  },
  'pl_insolstr': {
    name: 'pl_insolstr',
    type: 'char',
    description: 'Insolation Flux',
    unit: 'Earth flux',
    category: 'planet'
  },
  'pl_eqtstr': {
    name: 'pl_eqtstr',
    type: 'char',
    description: 'Equilibrium Temperature',
    unit: 'K',
    category: 'planet'
  },
  'pl_orbeccenstr': {
    name: 'pl_orbeccenstr',
    type: 'char',
    description: 'Eccentricity',
    unit: 'dimensionless',
    category: 'planet'
  },
  'pl_orbinclstr': {
    name: 'pl_orbinclstr',
    type: 'char',
    description: 'Inclination',
    unit: 'degrees',
    category: 'planet'
  },
  'pl_orbper': {
    name: 'pl_orbper',
    type: 'double',
    description: 'Orbital Period',
    unit: 'days',
    category: 'planet'
  },
  'pl_angsepstr': {
    name: 'pl_angsepstr',
    type: 'char',
    description: 'Angular Separation',
    unit: 'arcsec',
    category: 'planet'
  },
  'pl_bmassj': {
    name: 'pl_bmassj',
    type: 'double',
    description: 'Planet Mass or Mass*sin(i)',
    unit: 'Jupiter masses',
    category: 'planet'
  },
  'pl_ratror': {
    name: 'pl_ratror',
    type: 'double',
    description: 'Ratio of Planet to Stellar Radius',
    unit: 'dimensionless',
    category: 'planet'
  },

  // Stellar Parameters
  'st_rad': {
    name: 'st_rad',
    type: 'double',
    description: 'Stellar Radius',
    unit: 'Solar radii',
    category: 'star'
  },
  'st_dens': {
    name: 'st_dens',
    type: 'double',
    description: 'Stellar Density',
    unit: 'g/cm³',
    category: 'star'
  },
  'st_mass': {
    name: 'st_mass',
    type: 'double',
    description: 'Stellar Mass',
    unit: 'Solar masses',
    category: 'star'
  },
  'st_age': {
    name: 'st_age',
    type: 'double',
    description: 'Stellar Age',
    unit: 'Gyr',
    category: 'star'
  },
  'st_logg': {
    name: 'st_logg',
    type: 'double',
    description: 'Stellar Surface Gravity',
    unit: 'log10(cm/s²)',
    category: 'star'
  },
  'st_lum': {
    name: 'st_lum',
    type: 'double',
    description: 'Stellar Luminosity',
    unit: 'Solar luminosities',
    category: 'star'
  },
  'st_met': {
    name: 'st_met',
    type: 'double',
    description: 'Stellar Metallicity',
    unit: '[Fe/H]',
    category: 'star'
  },

  // System Parameters
  'sy_snum': {
    name: 'sy_snum',
    type: 'int',
    description: 'Number of Stars',
    unit: 'count',
    category: 'system'
  },
  'sy_pnum': {
    name: 'sy_pnum',
    type: 'int',
    description: 'Number of Planets',
    unit: 'count',
    category: 'system'
  },
  'sy_mnum': {
    name: 'sy_mnum',
    type: 'int',
    description: 'Number of Moons',
    unit: 'count',
    category: 'system'
  },

  // Observation Parameters
  'st_nphot': {
    name: 'st_nphot',
    type: 'int',
    description: 'Number of Photometry Time Series',
    unit: 'count',
    category: 'observation'
  },
  'st_nrvc': {
    name: 'st_nrvc',
    type: 'int',
    description: 'Number of Radial Velocity Time Series',
    unit: 'count',
    category: 'observation'
  },
  'st_nspec': {
    name: 'st_nspec',
    type: 'int',
    description: 'Number of Stellar Spectra Measurements',
    unit: 'count',
    category: 'observation'
  },
  'pl_nnotes': {
    name: 'pl_nnotes',
    type: 'int',
    description: 'Number of Notes',
    unit: 'count',
    category: 'observation'
  },
  'pl_ntranspec': {
    name: 'pl_ntranspec',
    type: 'int',
    description: 'Number of Transmission Spectra',
    unit: 'count',
    category: 'observation'
  },
  'pl_nespec': {
    name: 'pl_nespec',
    type: 'int',
    description: 'Number of Eclipse Spectra',
    unit: 'count',
    category: 'observation'
  },
  'pl_ndispec': {
    name: 'pl_ndispec',
    type: 'int',
    description: 'Number of Direct Imaging Spectra',
    unit: 'count',
    category: 'observation'
  },

  // Discovery Parameters
  'disc_pubdate': {
    name: 'disc_pubdate',
    type: 'char',
    description: 'Discovery Publication Date',
    unit: 'YYYY-MM-DD',
    category: 'discovery'
  },
  'disc_year': {
    name: 'disc_year',
    type: 'int',
    description: 'Discovery Year',
    unit: 'year',
    category: 'discovery'
  },
  'discoverymethod': {
    name: 'discoverymethod',
    type: 'char',
    description: 'Discovery Method',
    category: 'discovery'
  },
  'disc_locale': {
    name: 'disc_locale',
    type: 'char',
    description: 'Discovery Locale',
    category: 'discovery'
  },
  'disc_facility': {
    name: 'disc_facility',
    type: 'char',
    description: 'Discovery Facility',
    category: 'discovery'
  },
  'disc_instrument': {
    name: 'disc_instrument',
    type: 'char',
    description: 'Discovery Instrument',
    category: 'discovery'
  },
  'disc_telescope': {
    name: 'disc_telescope',
    type: 'char',
    description: 'Discovery Telescope',
    category: 'discovery'
  },
  'disc_refname': {
    name: 'disc_refname',
    type: 'char',
    description: 'Discovery Reference',
    category: 'discovery'
  },

  // Identification Parameters
  'pl_name': {
    name: 'pl_name',
    type: 'char',
    description: 'Planet Name',
    category: 'planet'
  },
  'pl_letter': {
    name: 'pl_letter',
    type: 'char',
    description: 'Planet Letter',
    category: 'planet'
  },
  'hostname': {
    name: 'hostname',
    type: 'char',
    description: 'Host Name',
    category: 'star'
  },
  'hd_name': {
    name: 'hd_name',
    type: 'char',
    description: 'HD ID',
    category: 'star'
  },
  'hip_name': {
    name: 'hip_name',
    type: 'char',
    description: 'HIP ID',
    category: 'star'
  },
  'tic_id': {
    name: 'tic_id',
    type: 'char',
    description: 'TIC ID',
    category: 'star'
  }
};

/**
 * Get parameter definition by name
 */
export function getParameterDefinition(paramName: string): NASAParameter | null {
  return NASA_PARAMETERS[paramName] || null;
}

/**
 * Get parameters by category
 */
export function getParametersByCategory(category: NASAParameter['category']): NASAParameter[] {
  return Object.values(NASA_PARAMETERS).filter(param => param.category === category);
}

/**
 * Get all available parameters
 */
export function getAllParameters(): NASAParameter[] {
  return Object.values(NASA_PARAMETERS);
}

/**
 * Format parameter value with proper unit
 */
export function formatParameterValue(paramName: string, value: any): string {
  const param = getParameterDefinition(paramName);
  if (!param || value === null || value === undefined) {
    return 'N/A';
  }

  if (param.type === 'double' || param.type === 'int') {
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return 'N/A';
    
    const formatted = param.type === 'int' ? numValue.toString() : numValue.toFixed(3);
    return param.unit ? `${formatted} ${param.unit}` : formatted;
  }

  return value.toString();
}

/**
 * Validate parameter value against type
 */
export function validateParameterValue(paramName: string, value: any): boolean {
  const param = getParameterDefinition(paramName);
  if (!param) return false;

  switch (param.type) {
    case 'double':
      return !isNaN(parseFloat(value));
    case 'int':
      return Number.isInteger(parseFloat(value));
    case 'char':
      return typeof value === 'string' || value === null || value === undefined;
    default:
      return true;
  }
}

/**
 * Get essential parameters for atmospheric analysis
 */
export function getAtmosphericAnalysisParameters(): string[] {
  return [
    'pl_dens',      // Planet Density
    'pl_orbper',    // Orbital Period
    'pl_eqtstr',    // Equilibrium Temperature
    'st_rad',       // Stellar Radius
    'st_lum',       // Stellar Luminosity
    'pl_bmassj',    // Planet Mass
    'pl_ratror',    // Planet-to-Star Radius Ratio
    'st_met'        // Stellar Metallicity
  ];
}

/**
 * Get recommended parameters for habitability analysis
 */
export function getHabitabilityParameters(): string[] {
  return [
    'pl_orbper',    // Orbital Period
    'pl_eqtstr',    // Equilibrium Temperature
    'pl_bmassj',    // Planet Mass
    'st_rad',       // Stellar Radius
    'st_lum',       // Stellar Luminosity
    'st_age',       // Stellar Age
    'st_met'        // Stellar Metallicity
  ];
}