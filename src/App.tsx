import React from 'react';
import { Exoplanet } from '../types/exoplanet';
import { Mountain, Gem, Zap, Droplets } from 'lucide-react';

// Dummy exoplanet data to test rendering
const dummyExoplanet: Exoplanet = {
  name: 'Kepler-22b',
  minerals: {
    iron: 30,
    silicon: 20,
    magnesium: 15,
    carbon: 12,
    water: 25
  }
};

interface MineralsChartProps {
  exoplanet: Exoplanet;
}

const MineralsChart: React.FC<MineralsChartProps> = ({ exoplanet }) => {
  const minerals = [
    {
      name: 'Iron',
      value: exoplanet.minerals.iron,
      icon: Mountain,
      color: 'from-orange-400 via-red-500 to-pink-500',
      bgColor: 'from-orange-900/40 to-red-900/40',
      description: 'Essential for planetary core formation'
    },
    {
      name: 'Silicon',
      value: exoplanet.minerals.silicon,
      icon: Gem,
      color: 'from-gray-400 via-slate-500 to-zinc-500',
      bgColor: 'from-gray-900/40 to-slate-900/40',
      description: 'Primary component of rocky surfaces'
    },
    {
      name: 'Magnesium',
      value: exoplanet.minerals.magnesium,
      icon: Zap,
      color: 'from-green-400 via-emerald-500 to-teal-500',
      bgColor: 'from-green-900/40 to-emerald-900/40',
      description: 'Important for mantle composition'
    },
    {
      name: 'Carbon',
      value: exoplanet.minerals.carbon,
      icon: Gem,
      color: 'from-purple-400 via-violet-500 to-indigo-500',
      bgColor: 'from-purple-900/40 to-indigo-900/40',
      description: 'Building block of organic compounds'
    },
    {
      name: 'Water',
      value: exoplanet.minerals.water,
      icon: Droplets,
      color: 'from-blue-400 via-cyan-500 to-teal-500',
      bgColor: 'from-blue-900/40 to-cyan-900/40',
      description: 'Critical for life as we know it'
    }
  ];

  return (
    <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-orange-500/30 shadow-2xl shadow-orange-500/20">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
        <span>Mineral Composition</span>
      </h3>

      <div className="space-y-6">
        {minerals.map((mineral, index) => {
          const IconComponent = mineral.icon;
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${mineral.bgColor} border border-gray-700/30`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-medium text-lg">{mineral.name}</span>
                    <p className="text-xs text-gray-400">{mineral.description}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">{mineral.value}%</span>
              </div>
              <div className="relative">
                <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-gray-700/30">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${mineral.color} shadow-lg transition-all duration-1000 ease-out`}
                    style={{ width: `${mineral.value}%` }}
                  ></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 backdrop-blur-sm bg-black/40 rounded-xl border border-gray-700/30">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <Gem className="w-5 h-5 text-orange-400" />
          <span>Geological Assessment</span>
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed">
          This cosmic world shows{' '}
          <span className="text-cyan-400 font-semibold">
            {exoplanet.minerals.water > 20
              ? 'abundant'
              : exoplanet.minerals.water > 10
              ? 'moderate'
              : 'limited'}
          </span>{' '}
          water presence and{' '}
          <span className="text-purple-400 font-semibold">
            {exoplanet.minerals.carbon > 10 ? 'significant' : 'minimal'}
          </span>{' '}
          carbon deposits, indicating{' '}
          <span className="text-emerald-400 font-semibold">
            {exoplanet.minerals.water > 15 && exoplanet.minerals.carbon > 8
              ? 'promising'
              : 'challenging'}
          </span>{' '}
          conditions for potential life formation and geological stability.
        </p>
      </div>
    </div>
  );
};

// ✅ Wrap this in an App component for main.tsx
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black p-10">
      <MineralsChart exoplanet={dummyExoplanet} />
    </div>
  );
};

export default App;
