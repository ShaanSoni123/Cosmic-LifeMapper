import React, { useState, useEffect } from 'react';
import { Download, Search, Database, FileSpreadsheet, Filter, Globe, Star, Calendar } from 'lucide-react';

interface ExoplanetData {
  pl_name: string;
  hostname: string;
  discoverymethod: string;
  disc_year: string;
  pl_orbper: string;
  pl_rade: string;
  pl_bmasse: string;
  st_teff: string;
  st_rad: string;
  st_mass: string;
  sy_dist: string;
  pl_eqt: string;
  st_age: string;
  pl_insol: string;
  pl_orbeccen: string;
  [key: string]: string;
}

interface CSVDataViewerProps {
  isOpen: boolean;
  onClose: () => void;
  allExoplanets?: any[];
  onPlanetSelect?: (planetData: any) => void;
}

export const CSVDataViewer: React.FC<CSVDataViewerProps> = ({ 
  isOpen, 
  onClose, 
  allExoplanets = [],
  onPlanetSelect 
}) => {
  const [data, setData] = useState<ExoplanetData[]>([]);
  const [filteredData, setFilteredData] = useState<ExoplanetData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'distance' | 'habitability'>('name');
  const [filterMethod, setFilterMethod] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      loadCSVData();
    }
  }, [isOpen]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, data, sortBy, filterMethod]);

  const loadCSVData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/data/nasa_exoplanet_sample_1000.csv');
      if (!response.ok) {
        throw new Error('Failed to load CSV data');
      }

      const csvText = await response.text();
      const parsedData = parseCSV(csvText);
      
      setData(parsedData);
      setLoading(false);
    } catch (err) {
      setError(`Failed to load CSV data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const parseCSV = (csvText: string): ExoplanetData[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const result: ExoplanetData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row: ExoplanetData = {} as ExoplanetData;
        headers.forEach((header, index) => {
          row[header as keyof ExoplanetData] = values[index] || '';
        });
        result.push(row);
      }
    }

    return result;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const applyFilters = () => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply discovery method filter
    if (filterMethod !== 'all') {
      filtered = filtered.filter(item => 
        item.discoverymethod?.toLowerCase().includes(filterMethod.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.pl_name.localeCompare(b.pl_name);
        case 'year':
          return parseInt(b.disc_year || '0') - parseInt(a.disc_year || '0');
        case 'distance':
          return parseFloat(a.sy_dist || '0') - parseFloat(b.sy_dist || '0');
        case 'habitability':
          // Sort by temperature (closer to Earth's temp = more habitable)
          const earthTemp = 288;
          const aTempDiff = Math.abs(parseFloat(a.pl_eqt || '0') - earthTemp);
          const bTempDiff = Math.abs(parseFloat(b.pl_eqt || '0') - earthTemp);
          return aTempDiff - bTempDiff;
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `nasa_exoplanet_data_${date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const displayData = filteredData.slice(0, 100);
  const discoveryMethods = [...new Set(data.map(p => p.discoverymethod).filter(Boolean))];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-black/90 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NASA CSV Data Archive
              </h2>
              <p className="text-gray-400 text-sm">
                {data.length} confirmed exoplanets • Complete NASA dataset
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg"
          >
            ✕
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Database className="w-12 h-12 animate-pulse text-cyan-400 mx-auto mb-4" />
              <p className="text-white text-lg">Loading NASA CSV Data...</p>
              <p className="text-gray-400 text-sm">Processing complete exoplanet archive</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-6">
            <div className="backdrop-blur-sm bg-red-900/40 rounded-xl p-4 border border-red-500/50">
              <p className="text-red-300">{error}</p>
              <button
                onClick={loadCSVData}
                className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search exoplanets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/60 border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-400 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-black/60 border border-purple-500/50 rounded-xl text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/70 backdrop-blur-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="year">Sort by Discovery Year</option>
                  <option value="habitability">Sort by Habitability</option>
                </select>

                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="bg-black/60 border border-green-500/50 rounded-xl text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/70 backdrop-blur-sm"
                >
                  <option value="all">All Methods</option>
                  {discoveryMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>

                <button
                  onClick={exportToCSV}
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-lg text-sm">
                Total: {data.length}
              </div>
              <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm">
                Filtered: {filteredData.length}
              </div>
              <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm">
                Showing: {displayData.length}
              </div>
            </div>

            {/* Data Table */}
            <div className="backdrop-blur-sm bg-black/40 rounded-xl border border-gray-700/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/60">
                    <tr>
                      <th className="text-left p-3 text-cyan-400 font-semibold">Planet Name</th>
                      <th className="text-left p-3 text-yellow-400 font-semibold">Host Star</th>
                      <th className="text-left p-3 text-green-400 font-semibold">Discovery Method</th>
                      <th className="text-left p-3 text-purple-400 font-semibold">Year</th>
                      <th className="text-left p-3 text-blue-400 font-semibold">Period (days)</th>
                      <th className="text-left p-3 text-orange-400 font-semibold">Radius (R⊕)</th>
                      <th className="text-left p-3 text-pink-400 font-semibold">Mass (M⊕)</th>
                      <th className="text-left p-3 text-red-400 font-semibold">Temp (K)</th>
                      <th className="text-left p-3 text-gray-400 font-semibold">Distance (pc)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((planet, index) => (
                      <tr key={index} className="border-t border-gray-700/30 hover:bg-black/40 transition-colors duration-200">
                        <td className="p-3 text-white font-medium">{planet.pl_name}</td>
                        <td className="p-3 text-gray-300">{planet.hostname}</td>
                        <td className="p-3 text-gray-300">{planet.discoverymethod}</td>
                        <td className="p-3 text-gray-300">{planet.disc_year}</td>
                        <td className="p-3 text-gray-300">{planet.pl_orbper}</td>
                        <td className="p-3 text-gray-300">{planet.pl_rade}</td>
                        <td className="p-3 text-gray-300">{planet.pl_bmasse}</td>
                        <td className="p-3 text-gray-300">{planet.pl_eqt}</td>
                        <td className="p-3 text-gray-300">{planet.sy_dist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredData.length > 100 && (
              <p className="text-gray-400 text-sm text-center mt-4">
                Showing first 100 results. Use search and filters to narrow down results.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};