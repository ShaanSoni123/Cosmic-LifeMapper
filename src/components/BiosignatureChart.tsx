import React from 'react';
import { Exoplanet } from '../types/exoplanet';
import { Atom, Beaker, Thermometer, Activity } from 'lucide-react';

interface BiosignatureChartProps {
  exoplanet: Exoplanet;
}

export const BiosignatureChart: React.FC<BiosignatureChartProps> = ({ exoplanet }) => {
  const biosignature = exoplanet.biosignature;
  
  if (!biosignature) {
    return null;
  }

  const chemicalData = [
    {
      name: 'Oxygen (O₂)',
      value: biosignature.chemicalAnalysis.O2 || 0,
      icon: Activity,
      color: 'from-green-400 via-emerald-500 to-teal-500',
      bgColor: 'from-green-900/40 to-emerald-900/40',
      description: 'Essential for aerobic life'
    },
    {
      name: 'Hydrogen (H₂)',
      value: biosignature.chemicalAnalysis.H2 || 0,
      icon: Atom,
      color: 'from-yellow-400 via-orange-500 to-red-500',
      bgColor: 'from-yellow-900/40 to-orange-900/40',
      description: 'Reducing gas indicator'
    },
    {
      name: 'Nitrogen (N₂)',
      value: biosignature.chemicalAnalysis.N2 || 0,
      icon: Atom,
      color: 'from-blue-400 via-cyan-500 to-sky-500',
      bgColor: 'from-blue-900/40 to-cyan-900/40',
      description: 'Atmospheric stability'
    },
    {
      name: 'Carbon Dioxide (CO₂)',
      value: biosignature.chemicalAnalysis.CO2 || 0,
      icon: Beaker,
      color: 'from-orange-400 via-red-500 to-pink-500',
      bgColor: 'from-orange-900/40 to-red-900/40',
      description: 'Greenhouse gas indicator'
    },
    {
      name: 'Helium (He)',
      value: biosignature.chemicalAnalysis.He || 0,
      icon: Atom,
      color: 'from-pink-400 via-purple-500 to-indigo-500',
      bgColor: 'from-pink-900/40 to-purple-900/40',
      description: 'Noble gas presence'
    },
    {
      name: 'Argon (Ar)',
      value: biosignature.chemicalAnalysis.Ar || 0,
      icon: Atom,
      color: 'from-indigo-400 via-blue-500 to-cyan-500',
      bgColor: 'from-indigo-900/40 to-blue-900/40',
      description: 'Inert atmospheric component'
    },
    {
      name: 'Temperature',
      value: biosignature.chemicalAnalysis.Temperature || 0,
      icon: Thermometer,
      color: 'from-purple-400 via-violet-500 to-indigo-500',
      bgColor: 'from-purple-900/40 to-indigo-900/40',
      description: 'Thermal habitability'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-400 via-green-400 to-cyan-400';
    if (score >= 60) return 'from-yellow-400 via-orange-400 to-red-400';
    return 'from-red-500 via-pink-500 to-purple-500';
  };

  return (
    <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse"></div>
        <span>Biosignature Analysis</span>
      </h3>
      
      <div className="space-y-6">
        {chemicalData.map((chemical, index) => {
          const IconComponent = chemical.icon;
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${chemical.bgColor} border border-gray-700/30`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-medium text-lg">{chemical.name}</span>
                    <p className="text-xs text-gray-400">{chemical.description}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">{Math.round(chemical.value)}%</span>
              </div>
              <div className="relative">
                <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-gray-700/30">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${chemical.color} shadow-lg transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(100, Math.max(0, chemical.value))}%` }}
                  ></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 backdrop-blur-sm bg-black/40 rounded-xl border border-gray-700/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Beaker className="w-5 h-5 text-cyan-400" />
            <span>Biosignature Score</span>
          </h4>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {Math.round(biosignature.score)}%
          </span>
        </div>
        <div className="relative mb-4">
          <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-gray-700/30">
            <div 
              className={`h-3 rounded-full shadow-lg transition-all duration-1000 ease-out bg-gradient-to-r ${getScoreColor(biosignature.score)}`}
              style={{ width: `${biosignature.score}%` }}
            ></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-3">
          <span className="text-cyan-400 font-semibold">{biosignature.classification}</span>
        </p>
        
        {/* Individual Gas Survival Scores */}
        <div className="mt-4 p-4 bg-black/60 rounded-lg border border-cyan-500/20">
          <h5 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Individual Gas Survival Scores (out of 100)</span>
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {Object.entries(biosignature.chemicalAnalysis)
              .filter(([key, value]) => key !== 'Temperature' && key !== 'HabitabilityScore' && typeof value === 'number')
              .map(([gas, score]) => (
                <div key={gas} className="flex justify-between items-center p-2 bg-black/40 rounded border border-gray-600/30">
                  <span className="text-gray-300">{gas}:</span>
                  <span className={`font-bold ${
                    score >= 80 ? 'text-green-400' : 
                    score >= 60 ? 'text-yellow-400' : 
                    score >= 40 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {Math.round(score)}/100
                  </span>
                </div>
              ))}
          </div>
        </div>
        
        <p className="text-xs text-gray-400 leading-relaxed">
          This analysis evaluates atmospheric chemical composition and temperature conditions to assess the potential for life-supporting biosignatures. 
          Higher scores indicate more favorable chemical environments for biological processes.
        </p>
      </div>
    </div>
  );
};