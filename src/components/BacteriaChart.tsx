import React from 'react';
import { Exoplanet } from '../types/exoplanet';
import { Bug, Zap, Sun, Wind } from 'lucide-react';

interface BacteriaChartProps {
  exoplanet: Exoplanet;
}

export const BacteriaChart: React.FC<BacteriaChartProps> = ({ exoplanet }) => {
  const bacteriaTypes = [
    {
      name: 'Extremophiles',
      value: exoplanet.bacteria.extremophiles,
      icon: Bug,
      color: 'from-red-400 via-pink-500 to-rose-500',
      bgColor: 'from-red-900/40 to-pink-900/40',
      description: 'Survive in extreme conditions'
    },
    {
      name: 'Photosynthetic',
      value: exoplanet.bacteria.photosynthetic,
      icon: Sun,
      color: 'from-yellow-400 via-orange-500 to-amber-500',
      bgColor: 'from-yellow-900/40 to-orange-900/40',
      description: 'Use light for energy production'
    },
    {
      name: 'Chemosynthetic',
      value: exoplanet.bacteria.chemosynthetic,
      icon: Zap,
      color: 'from-green-400 via-emerald-500 to-teal-500',
      bgColor: 'from-green-900/40 to-emerald-900/40',
      description: 'Derive energy from chemicals'
    },
    {
      name: 'Anaerobic',
      value: exoplanet.bacteria.anaerobic,
      icon: Wind,
      color: 'from-blue-400 via-cyan-500 to-sky-500',
      bgColor: 'from-blue-900/40 to-cyan-900/40',
      description: 'Thrive without oxygen'
    }
  ];

  const averagePotential = Math.round(
    (exoplanet.bacteria.extremophiles + exoplanet.bacteria.photosynthetic + 
     exoplanet.bacteria.chemosynthetic + exoplanet.bacteria.anaerobic) / 4
  );

  return (
    <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-green-500/30 shadow-2xl shadow-green-500/20">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
        <span>Bacterial Life Potential</span>
      </h3>
      
      <div className="space-y-6">
        {bacteriaTypes.map((bacteria, index) => {
          const IconComponent = bacteria.icon;
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${bacteria.bgColor} border border-gray-700/30`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-medium text-lg">{bacteria.name}</span>
                    <p className="text-xs text-gray-400">{bacteria.description}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">{bacteria.value}%</span>
              </div>
              <div className="relative">
                <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-gray-700/30">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${bacteria.color} shadow-lg transition-all duration-1000 ease-out`}
                    style={{ width: `${bacteria.value}%` }}
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
            <Bug className="w-5 h-5 text-green-400" />
            <span>Life Potential Score</span>
          </h4>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{averagePotential}%</span>
        </div>
        <div className="relative mb-4">
          <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-gray-700/30">
            <div 
              className={`h-3 rounded-full shadow-lg transition-all duration-1000 ease-out ${
                averagePotential >= 80 
                  ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500'
                  : averagePotential >= 60
                  ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500'
                  : 'bg-gradient-to-r from-red-400 via-pink-500 to-rose-500'
              }`}
              style={{ width: `${averagePotential}%` }}
            ></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Based on environmental conditions, this cosmic world shows <span className="text-emerald-400 font-semibold">{averagePotential > 70 ? 'exceptional' : averagePotential > 50 ? 'moderate' : 'limited'}</span>
          {' '}potential for supporting diverse forms of bacterial life across multiple ecological niches.
        </p>
      </div>
    </div>
  );
};