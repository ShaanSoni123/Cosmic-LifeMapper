import React from 'react';
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-3 text-white hover:text-cyan-400 transition-all duration-300 backdrop-blur-xl bg-black/40 px-6 py-3 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/70 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Cosmos</span>
            </button>
          </div>

          <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 mb-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform hover:scale-105 transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">{exoplanet.name}</h1>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-300 text-lg">Discovered in {exoplanet.discoveryYear}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-3 mb-3">
                  <Gauge className="w-6 h-6 text-cyan-400" />
                  <span className="text-white font-semibold text-lg">Habitability Score</span>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{exoplanet.habitabilityScore}/100</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="backdrop-blur-xl bg-black/40 rounded-2xl p-6 text-center border border-blue-500/30 hover:border-blue-400/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Distance</h3>
                <p className="text-3xl font-bold text-blue-400 mb-1">{exoplanet.distance}</p>
                <p className="text-sm text-gray-400">light years</p>
              </div>
              <div className="backdrop-blur-xl bg-black/40 rounded-2xl p-6 text-center border border-red-500/30 hover:border-red-400/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Temperature</h3>
                <p className="text-3xl font-bold text-red-400 mb-1">{exoplanet.temperature}</p>
                <p className="text-sm text-gray-400">Kelvin</p>
              </div>
              <div className="backdrop-blur-xl bg-black/40 rounded-2xl p-6 text-center border border-yellow-500/30 hover:border-yellow-400/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Mass</h3>
                <p className="text-3xl font-bold text-yellow-400 mb-1">{exoplanet.mass}</p>
                <p className="text-sm text-gray-400">Earth masses</p>
              </div>
              <div className="backdrop-blur-xl bg-black/40 rounded-2xl p-6 text-center border border-green-500/30 hover:border-green-400/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Orbital Period</h3>
                <p className="text-3xl font-bold text-green-400 mb-1">{exoplanet.orbitalPeriod}</p>
                <p className="text-sm text-gray-400">Earth days</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <HabitabilityCard exoplanet={exoplanet} />
            </div>
            <div className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <ScientificAnalysis exoplanet={exoplanet} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <AtmosphericAnalysis exoplanet={exoplanet} />
            </div>
            <div className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <MineralsChart exoplanet={exoplanet} />
            </div>
            <div className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <BiosignatureChart exoplanet={exoplanet} />
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-8">
            <div className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <BacteriaChart exoplanet={exoplanet} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};