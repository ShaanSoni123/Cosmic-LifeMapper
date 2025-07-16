import React, { useState } from 'react';
import { 
  NASA_PARAMETERS, 
  getParametersByCategory, 
  formatParameterValue,
  NASAParameter 
} from '../utils/nasaParameterDefinitions';
import { 
  Book, 
  Globe, 
  Star, 
  Settings, 
  Search, 
  Telescope, 
  Info,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface NASAParameterGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NASAParameterGuide: React.FC<NASAParameterGuideProps> = ({ isOpen, onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('planet');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const categories = [
    { key: 'planet', name: 'Planet Parameters', icon: Globe, color: 'from-blue-500 to-cyan-500' },
    { key: 'star', name: 'Stellar Parameters', icon: Star, color: 'from-yellow-500 to-orange-500' },
    { key: 'system', name: 'System Parameters', icon: Settings, color: 'from-purple-500 to-indigo-500' },
    { key: 'discovery', name: 'Discovery Parameters', icon: Telescope, color: 'from-green-500 to-emerald-500' },
    { key: 'observation', name: 'Observation Parameters', icon: Search, color: 'from-pink-500 to-rose-500' }
  ];

  const filteredParameters = Object.values(NASA_PARAMETERS).filter(param =>
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryParameters = (categoryKey: string) => {
    return getParametersByCategory(categoryKey as NASAParameter['category'])
      .filter(param => 
        searchTerm === '' || 
        param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        param.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-black/90 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Book className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NASA Parameter Guide
              </h2>
              <p className="text-gray-400 text-sm">
                Complete reference for NASA Exoplanet Archive parameters
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

        <div className="flex h-[600px]">
          {/* Categories Sidebar */}
          <div className="w-1/3 p-6 border-r border-cyan-500/30 overflow-y-auto">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search parameters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/60 border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-400 backdrop-blur-sm transition-all duration-300 text-sm"
              />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const paramCount = getCategoryParameters(category.key).length;
                const isExpanded = expandedCategory === category.key;

                return (
                  <div key={category.key}>
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category.key)}
                      className="w-full flex items-center justify-between p-3 rounded-xl backdrop-blur-sm bg-black/40 hover:bg-black/60 transition-all duration-300 text-white border border-gray-700/30 hover:border-cyan-400/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}/20`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <span className="font-medium text-sm">{category.name}</span>
                          <p className="text-xs text-gray-400">{paramCount} parameters</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parameters Detail */}
          <div className="w-2/3 p-6 overflow-y-auto">
            {expandedCategory && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {categories.find(c => c.key === expandedCategory)?.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {getCategoryParameters(expandedCategory).length} parameters available
                  </p>
                </div>

                <div className="space-y-4">
                  {getCategoryParameters(expandedCategory).map((param) => (
                    <div
                      key={param.name}
                      className="backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-gray-700/30 hover:border-cyan-400/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                            <Info className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{param.name}</h4>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">{param.type}</p>
                          </div>
                        </div>
                        {param.unit && (
                          <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-lg">
                            {param.unit}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {param.description}
                      </p>

                      {/* Example values for common parameters */}
                      {param.name === 'pl_orbper' && (
                        <div className="mt-3 p-2 bg-black/40 rounded-lg">
                          <p className="text-xs text-gray-400">Example: Earth = 365.25 days</p>
                        </div>
                      )}
                      {param.name === 'pl_bmassj' && (
                        <div className="mt-3 p-2 bg-black/40 rounded-lg">
                          <p className="text-xs text-gray-400">Example: Earth = 0.00315 Jupiter masses</p>
                        </div>
                      )}
                      {param.name === 'st_rad' && (
                        <div className="mt-3 p-2 bg-black/40 rounded-lg">
                          <p className="text-xs text-gray-400">Example: Sun = 1.0 Solar radii</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!expandedCategory && (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Book className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a category</p>
                  <p className="text-sm">Choose a parameter category to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/30 bg-black/20">
          <p className="text-xs text-gray-400 text-center">
            Parameter definitions from NASA Exoplanet Archive • 
            <span className="text-cyan-400 ml-1">Total: {Object.keys(NASA_PARAMETERS).length} parameters</span>
          </p>
        </div>
      </div>
    </div>
  );
};