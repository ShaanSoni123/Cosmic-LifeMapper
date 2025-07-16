import React from 'react';
import { useEffect } from 'react';
import { Exoplanet } from '../types/exoplanet';
import { ArrowLeft, Calendar, Globe, Thermometer, Star, Clock, Gauge } from 'lucide-react';
import { HabitabilityCard } from './HabitabilityCard';
import { MineralsChart } from './MineralsChart';
import { BacteriaChart } from './BacteriaChart';
import { BiosignatureChart } from './BiosignatureChart';
import { ScientificAnalysis } from './ScientificAnalysis';
import { AtmosphericAnalysis } from './AtmosphericAnalysis';

interface ExoplanetDetailProps {
  exoplanet: Exoplanet;
  onBack: () => void;
}

export const ExoplanetDetail: React.FC<ExoplanetDetailProps> = ({ exoplanet, onBack }) => {
  // Auto-scroll to top when component mounts (when planet is selected)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [exoplanet.id]); // Trigger when planet changes

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Deep Space Background */}
      <div className="absolute inset-0">
        {/* Deep Space Black Background */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Subtle Space Nebula */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-gradient-radial from-purple-900/6 via-purple-900/2 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-gradient-radial from-blue-900/5 via-blue-900/2 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-gradient-radial from-indigo-900/4 via-indigo-900/1 to-transparent rounded-full blur-2xl"></div>
        </div>
        
        {/* Realistic Star Field */}
        <div className="absolute inset-0">
          {/* Tiny distant stars */}
          <div className="absolute top-[9%] left-[14%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[24%] left-[32%] w-px h-px bg-white rounded-full opacity-65"></div>
          <div className="absolute top-[39%] left-[71%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[56%] left-[17%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[74%] left-[79%] w-px h-px bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[13%] left-[86%] w-px h-px bg-white rounded-full opacity-60"></div>
          <div className="absolute top-[33%] left-[6%] w-px h-px bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[48%] left-[43%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[67%] left-[11%] w-px h-px bg-white rounded-full opacity-65"></div>
          <div className="absolute top-[83%] left-[54%] w-px h-px bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[7%] left-[51%] w-px h-px bg-white rounded-full opacity-60"></div>
          <div className="absolute top-[41%] left-[89%] w-px h-px bg-white rounded-full opacity-70"></div>
          <div className="absolute top-[62%] left-[4%] w-px h-px bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[81%] left-[37%] w-px h-px bg-white rounded-full opacity-65"></div>
          <div className="absolute top-[19%] left-[73%] w-px h-px bg-white rounded-full opacity-85"></div>
          
          {/* Small stars */}
          <div className="absolute top-[27%] left-[21%] w-0.5 h-0.5 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[63%] left-[68%] w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[44%] left-[88%] w-0.5 h-0.5 bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[8%] left-[59%] w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[87%] left-[23%] w-0.5 h-0.5 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[31%] left-[12%] w-0.5 h-0.5 bg-white rounded-full opacity-75"></div>
          <div className="absolute top-[76%] left-[92%] w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          
          {/* Medium bright stars */}
          <div className="absolute top-[18%] left-[57%] w-1 h-1 bg-white rounded-full opacity-90"></div>
          <div className="absolute top-[69%] left-[34%] w-1 h-1 bg-white rounded-full opacity-85"></div>
          <div className="absolute top-[15%] left-[77%] w-1 h-1 bg-white rounded-full opacity-90"></div>
          <div className="absolute top-[52%] left-[25%] w-1 h-1 bg-white rounded-full opacity-80"></div>
          
          {/* Bright prominent stars */}
          <div className="absolute top-[35%] left-[64%] w-1.5 h-1.5 bg-white rounded-full opacity-95"></div>
          <div className="absolute top-[58%] left-[16%] w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
          
          {/* Very distant galaxies */}
          <div className="absolute top-[21%] left-[84%] w-2 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-sm transform rotate-15"></div>
          <div className="absolute top-[71%] left-[9%] w-3 h-0.5 bg-gradient-to-r from-transparent via-white/8 to-transparent rounded-full blur-sm transform -rotate-20"></div>
        </div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto px-2 md:px-0">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 md:space-x-3 text-white hover:text-cyan-400 transition-all duration-300 backdrop-blur-xl bg-black/40 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-cyan-500/30 hover:border-cyan-400/70 transform hover:scale-105 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 md:w-5 h-4 md:h-5" />
              <span>Return to Cosmos</span>
            </button>
          </div>

          <div className="backdrop-blur-xl bg-black/40 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform hover:scale-105 transition-all duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 md:mb-3 break-words">{exoplanet.name}</h1>
                <div className="flex items-center space-x-2 flex-wrap">
                  <Calendar className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
                  <p className="text-gray-300 text-base md:text-lg">Discovered in {exoplanet.discoveryYear}</p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                  <Gauge className="w-5 md:w-6 h-5 md:h-6 text-cyan-400" />
                  <span className="text-white font-semibold text-base md:text-lg">Habitability Score</span>
                </div>
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{exoplanet.habitabilityScore}/100</div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-blue-500/30 hover:border-blue-400/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2">
                <div className="w-8 md:w-12 h-8 md:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4 animate-pulse">
                  <Globe className="w-4 md:w-6 h-4 md:h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Distance</h3>
                <p className="text-xl md:text-3xl font-bold text-blue-400 mb-1">{exoplanet.distance}</p>
                <p className="text-xs md:text-sm text-gray-400">light years</p>
              </div>
              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-red-500/30 hover:border-red-400/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2">
                <div className="w-8 md:w-12 h-8 md:h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4 animate-pulse">
                  <Thermometer className="w-4 md:w-6 h-4 md:h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Temperature</h3>
                <p className="text-xl md:text-3xl font-bold text-red-400 mb-1">{exoplanet.temperature}</p>
                <p className="text-xs md:text-sm text-gray-400">Kelvin</p>
              </div>
              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-yellow-500/30 hover:border-yellow-400/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2">
                <div className="w-8 md:w-12 h-8 md:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4 animate-pulse">
                  <Star className="w-4 md:w-6 h-4 md:h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Mass</h3>
                <p className="text-xl md:text-3xl font-bold text-yellow-400 mb-1">{exoplanet.mass}</p>
                <p className="text-xs md:text-sm text-gray-400">Earth masses</p>
              </div>
              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-green-500/30 hover:border-green-400/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2">
                <div className="w-8 md:w-12 h-8 md:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4 animate-pulse">
                  <Clock className="w-4 md:w-6 h-4 md:h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Orbital Period</h3>
                <p className="text-xl md:text-3xl font-bold text-green-400 mb-1">{exoplanet.orbitalPeriod}</p>
                <p className="text-xs md:text-sm text-gray-400">Earth days</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500">
              <HabitabilityCard exoplanet={exoplanet} />
            </div>
            <div className="transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500">
              <ScientificAnalysis exoplanet={exoplanet} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500">
              <AtmosphericAnalysis exoplanet={exoplanet} />
            </div>
            <div className="transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500">
              <MineralsChart exoplanet={exoplanet} />
            </div>
            <div className="transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500">
              <BiosignatureChart exoplanet={exoplanet} />
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-4 md:gap-8">
            <div className="transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500">
              <BacteriaChart exoplanet={exoplanet} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};