import React from 'react';
import { Exoplanet } from '../types/exoplanet';
import { Droplets, Wind, Flame, Snowflake } from 'lucide-react';

interface HabitabilityCardProps {
  exoplanet: Exoplanet;
}

export const HabitabilityCard: React.FC<HabitabilityCardProps> = ({ exoplanet }) => {
  const factors = [
    {
      name: 'Water Presence',
      value: exoplanet.minerals.water,
      icon: Droplets,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-900/40 to-cyan-900/40'
    },
    {
      name: 'Atmospheric Pressure',
      value: Math.round((exoplanet.atmosphere.nitrogen + exoplanet.atmosphere.oxygen) * 0.8),
      icon: Wind,
      color: 'from-cyan-400 to-teal-500',
      bgColor: 'from-cyan-900/40 to-teal-900/40'
    },
    {
      name: 'Temperature Range',
      value: Math.max(0, 100 - Math.abs(exoplanet.temperature - 288) / 2),
      icon: exoplanet.temperature > 288 ? Flame : Snowflake,
      color: exoplanet.temperature > 288 ? 'from-red-400 to-orange-500' : 'from-blue-300 to-cyan-400',
      bgColor: exoplanet.temperature > 288 ? 'from-red-900/40 to-orange-900/40' : 'from-blue-900/40 to-cyan-900/40'
    },
    {
      name: 'Oxygen Levels',
      value: exoplanet.atmosphere.oxygen * 4.5,
      icon: Wind,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-900/40 to-emerald-900/40'
    }
  ];

  return (
    <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-pulse"></div>
        <span>Habitability Analysis</span>
      </h3>
      
      <div className="space-y-6">
        {factors.map((factor, index) => {
          const IconComponent = factor.icon;
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${factor.bgColor} border border-gray-700/30`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-300 font-medium">{factor.name}</span>
                </div>
                <span className="text-lg font-bold text-white">{Math.round(factor.value)}%</span>
              </div>
              <div className="relative">
                <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-gray-700/30">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${factor.color} shadow-lg transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(100, Math.max(0, factor.value))}%` }}
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
          <span className="text-xl font-semibold text-white">Overall Habitability</span>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{exoplanet.habitabilityScore}</span>
            <span className="text-gray-400 text-lg">/100</span>
          </div>
        </div>
        <div className="relative">
          <div className="w-full bg-black/60 rounded-full h-4 overflow-hidden border border-gray-700/30">
            <div 
              className={`h-4 rounded-full shadow-lg transition-all duration-1000 ease-out ${
                exoplanet.habitabilityScore >= 80 
                  ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-500'
                  : exoplanet.habitabilityScore >= 60
                  ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400'
                  : 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-500'
              }`}
              style={{ width: `${exoplanet.habitabilityScore}%` }}
            ></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};