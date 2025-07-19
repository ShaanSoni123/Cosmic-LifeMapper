// NASA Data Processing Utilities
// Enhanced data processing for NASA exoplanet archive integration

export interface ProcessedNASAData {
  totalPlanets: number;
  discoveryMethods: string[];
  yearRange: { min: number; max: number };
  habitableCount: number;
  averageOrbitalPeriod: number;
  commonStarTypes: { [key: string]: number };
}

export interface NASADataStats {
  totalRecords: number;
  completenessScore: number;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  missingDataPercentage: number;
  lastUpdated: string;
}

/**
 * Process and analyze NASA exoplanet data
 */
export function processNASAData(data: any[]): ProcessedNASAData {
  const discoveryMethods = [...new Set(data.map(p => p.discoverymethod).filter(Boolean))];
  
  const years = data
    .map(p => parseInt(p.disc_year))
    .filter(year => !isNaN(year) && year > 1990);
  
  const yearRange = {
    min: Math.min(...years),
    max: Math.max(...years)
  };

  // Calculate habitability based on temperature and size
  const habitableCount = data.filter(planet => {
    const temp = parseFloat(planet.pl_eqt);
    const radius = parseFloat(planet.pl_rade);
    return temp >= 200 && temp <= 350 && radius >= 0.5 && radius <= 2.0;
  }).length;

  // Calculate average orbital period
  const orbitalPeriods = data
    .map(p => parseFloat(p.pl_orbper))
    .filter(period => !isNaN(period) && period > 0);
  
  const averageOrbitalPeriod = orbitalPeriods.length > 0 
    ? orbitalPeriods.reduce((sum, period) => sum + period, 0) / orbitalPeriods.length
    : 0;

  // Analyze star types based on temperature
  const commonStarTypes: { [key: string]: number } = {};
  data.forEach(planet => {
    const temp = parseFloat(planet.st_teff);
    if (!isNaN(temp)) {
      let starType = 'Unknown';
      if (temp >= 7500) starType = 'A-type';
      else if (temp >= 6000) starType = 'F-type';
      else if (temp >= 5200) starType = 'G-type';
      else if (temp >= 3700) starType = 'K-type';
      else starType = 'M-dwarf';
      
      commonStarTypes[starType] = (commonStarTypes[starType] || 0) + 1;
    }
  });

  return {
    totalPlanets: data.length,
    discoveryMethods,
    yearRange,
    habitableCount,
    averageOrbitalPeriod: Math.round(averageOrbitalPeriod * 100) / 100,
    commonStarTypes
  };
}

/**
 * Calculate data quality metrics
 */
export function calculateDataQuality(data: any[]): NASADataStats {
  if (data.length === 0) {
    return {
      totalRecords: 0,
      completenessScore: 0,
      dataQuality: 'poor',
      missingDataPercentage: 100,
      lastUpdated: new Date().toISOString()
    };
  }

  const essentialFields = ['pl_name', 'hostname', 'discoverymethod', 'disc_year', 'pl_orbper'];
  const optionalFields = ['pl_rade', 'pl_bmasse', 'st_teff', 'pl_eqt'];
  
  let totalFields = 0;
  let filledFields = 0;

  data.forEach(planet => {
    [...essentialFields, ...optionalFields].forEach(field => {
      totalFields++;
      if (planet[field] && planet[field] !== 'N/A' && planet[field] !== '') {
        filledFields++;
      }
    });
  });

  const completenessScore = Math.round((filledFields / totalFields) * 100);
  const missingDataPercentage = Math.round(((totalFields - filledFields) / totalFields) * 100);

  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  if (completenessScore >= 90) dataQuality = 'excellent';
  else if (completenessScore >= 75) dataQuality = 'good';
  else if (completenessScore >= 50) dataQuality = 'fair';
  else dataQuality = 'poor';

  return {
    totalRecords: data.length,
    completenessScore,
    dataQuality,
    missingDataPercentage,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Export data in various formats
 */
export function exportNASAData(data: any[], format: 'csv' | 'json' | 'excel'): string | Blob {
  switch (format) {
    case 'csv':
      return exportToCSV(data);
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'excel':
      return exportToExcel(data);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

function exportToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => `"${row[header] || ''}"`).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

function exportToExcel(data: any[]): Blob {
  // This would require a library like xlsx
  // For now, return CSV as blob
  const csvContent = exportToCSV(data);
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Validate NASA data structure
 */
export function validateNASAData(data: any[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(data)) {
    errors.push('Data must be an array');
    return { isValid: false, errors, warnings };
  }

  if (data.length === 0) {
    warnings.push('No data records found');
  }

  const requiredFields = ['pl_name'];
  const recommendedFields = ['hostname', 'discoverymethod', 'disc_year'];

  data.forEach((planet, index) => {
    requiredFields.forEach(field => {
      if (!planet[field]) {
        errors.push(`Missing required field '${field}' in record ${index + 1}`);
      }
    });

    recommendedFields.forEach(field => {
      if (!planet[field]) {
        warnings.push(`Missing recommended field '${field}' in record ${index + 1}`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Filter NASA data by various criteria
 */
export function filterNASAData(
  data: any[],
  filters: {
    discoveryMethod?: string;
    yearRange?: { min: number; max: number };
    habitableOnly?: boolean;
    hasRadius?: boolean;
    hasMass?: boolean;
  }
): any[] {
  return data.filter(planet => {
    // Discovery method filter
    if (filters.discoveryMethod && filters.discoveryMethod !== 'all') {
      if (!planet.discoverymethod?.toLowerCase().includes(filters.discoveryMethod.toLowerCase())) {
        return false;
      }
    }

    // Year range filter
    if (filters.yearRange) {
      const year = parseInt(planet.disc_year);
      if (isNaN(year) || year < filters.yearRange.min || year > filters.yearRange.max) {
        return false;
      }
    }

    // Habitable zone filter
    if (filters.habitableOnly) {
      const temp = parseFloat(planet.pl_eqt);
      const radius = parseFloat(planet.pl_rade);
      if (isNaN(temp) || isNaN(radius) || temp < 200 || temp > 350 || radius < 0.5 || radius > 2.0) {
        return false;
      }
    }

    // Has radius data
    if (filters.hasRadius) {
      const radius = parseFloat(planet.pl_rade);
      if (isNaN(radius)) return false;
    }

    // Has mass data
    if (filters.hasMass) {
      const mass = parseFloat(planet.pl_bmasse);
      if (isNaN(mass)) return false;
    }

    return true;
  });
}