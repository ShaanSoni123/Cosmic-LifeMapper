import React from 'react';
import { Exoplanet } from '../types/exoplanet';
import { Globe, Thermometer, Clock, Star } from 'lucide-react';

interface ExoplanetCardProps {
  exoplanet: Exoplanet;
  onClick: () => void;
}

export const ExoplanetCard: React.FC<ExoplanetCardProps> = ({ exoplanet, onClick }) => {
  const getHabitabilityColor = (score: number) => {
    if (score >= 80) return 'from-emerald-400 via-green-400 to-cyan-400';
    if (score >= 60) return 'from-yellow-400 via-orange-400 to-red-400';
    return 'from-red-500 via-pink-500 to-purple-500';
  };

  const getHabitabilityText = (score: number) => {
    if (score >= 80) return 'High Potential';
    if (score >= 60) return 'Moderate';
    return 'Low Potential';
  };

  const getGlowColor = (score: number) => {
    if (score >= 80) return 'shadow-emerald-500/30 hover:shadow-emerald-500/60';
    if (score >= 60) return 'shadow-orange-500/30 hover:shadow-orange-500/60';
    return 'shadow-purple-500/30 hover:shadow-purple-500/60';
  };

  return (
    <div 
      onClick={onClick}
      className={`backdrop-blur-xl bg-black/50 rounded-3xl p-6 cursor-pointer transform hover:scale-110 hover:-translate-y-6 transition-all duration-700 hover:shadow-2xl border border-cyan-500/30 hover:border-cyan-400/70 ${getGlowColor(exoplanet.habitabilityScore)} group relative overflow-hidden`}
    >
      {/* Floating particle effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
      </div>

      {/* Cosmic glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">{exoplanet.name}</h3>
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getHabitabilityColor(exoplanet.habitabilityScore)} shadow-lg animate-pulse`}></div>
            <span className="text-sm text-gray-300 font-medium">{getHabitabilityText(exoplanet.habitabilityScore)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm text-gray-300">Distance</span>
            </div>
            <span className="text-sm font-bold text-white">{exoplanet.distance} ly</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-red-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Thermometer className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-sm text-gray-300">Temperature</span>
            </div>
            <span className="text-sm font-bold text-white">{exoplanet.temperature}K</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-green-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Clock className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm text-gray-300">Orbital Period</span>
            </div>
            <span className="text-sm font-bold text-white">{exoplanet.orbitalPeriod} days</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-yellow-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-sm text-gray-300">Star Type</span>
            </div>
            <span className="text-sm font-bold text-white">{exoplanet.starType}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300 font-medium">Habitability Score</span>
            <span className="text-lg font-bold text-white">{exoplanet.habitabilityScore}/100</span>
          </div>
          <div className="relative">
            <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-gray-700/30">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getHabitabilityColor(exoplanet.habitabilityScore)} shadow-lg transition-all duration-1000 ease-out`}
                style={{ width: `${exoplanet.habitabilityScore}%` }}
              ></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};