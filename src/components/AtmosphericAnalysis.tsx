import React from 'react';
import { Exoplanet } from '../types/exoplanet';
import { atmosphericPredictor, convertToAtmosphericInput } from '../utils/atmosphericPredictor';
import { Beaker, Atom, Wind, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface AtmosphericAnalysisProps {
  exoplanet: Exoplanet;
}

export const AtmosphericAnalysis: React.FC<AtmosphericAnalysisProps> = ({ exoplanet }) => {
  // Generate atmospheric prediction
  const atmosphericInput = convertToAtmosphericInput(exoplanet);
  const report = atmosphericPredictor.generateReport(atmosphericInput);
  
  // Validate the atmospheric input parameters
  console.log('Atmospheric Analysis Input:', {
    planetName: exoplanet.name,
    density: atmosphericInput.pl_dens,
    orbitalPeriod: atmosphericInput.pl_orbper,
    temperature: atmosphericInput.pl_eqtstr,
    stellarRadius: atmosphericInput.st_rad,
    stellarLuminosity: atmosphericInput.st_lum,
    planetMass: atmosphericInput.pl_bmassj,
    radiusRatio: atmosphericInput.pl_ratror,
    stellarMetallicity: atmosphericInput.st_met
  });
  
  console.log('Atmospheric Composition Report:', {
    planetName: exoplanet.name,
    dominantGas: report.dominantGas,
    majorComponents: report.majorComponents,
    habitabilityImpact: report.habitabilityImpact,
    composition: report.composition
  });

  const getGasIcon = (gas: string) => {
    switch (gas) {
      case 'O2': return <Atom className="w-4 h-4 text-green-400" />;
      case 'N2': return <Wind className="w-4 h-4 text-blue-400" />;
      case 'CO2': return <Beaker className="w-4 h-4 text-orange-400" />;
      case 'H2O': return <Atom className="w-4 h-4 text-cyan-400" />;
      case 'CH4': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'H2': return <Atom className="w-4 h-4 text-yellow-400" />;
      case 'He': return <Atom className="w-4 h-4 text-pink-400" />;
      case 'Ar': return <Atom className="w-4 h-4 text-indigo-400" />;
      default: return <Atom className="w-4 h-4 text-gray-400" />;
    }
  };

  const getGasColor = (gas: string) => {
    switch (gas) {
      case 'O2': return 'from-green-400 to-emerald-500';
      case 'N2': return 'from-blue-400 to-cyan-500';
      case 'CO2': return 'from-orange-400 to-red-500';
      case 'H2O': return 'from-cyan-400 to-blue-500';
      case 'CH4': return 'from-purple-400 to-violet-500';
      case 'H2': return 'from-yellow-400 to-orange-500';
      case 'He': return 'from-pink-400 to-rose-500';
      case 'Ar': return 'from-indigo-400 to-blue-500';
      case 'SO2': return 'from-red-400 to-pink-500';
      case 'O3': return 'from-indigo-400 to-purple-500';
      case 'NH3': return 'from-teal-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getGasName = (gas: string) => {
    const names: { [key: string]: string } = {
      'CO2': 'Carbon Dioxide',
      'N2': 'Nitrogen',
      'O2': 'Oxygen',
      'H2O': 'Water Vapor',
      'CH4': 'Methane',
      'H2': 'Hydrogen',
      'He': 'Helium',
      'Ar': 'Argon',
      'Ne': 'Neon',
      'SO2': 'Sulfur Dioxide',
      'O3': 'Ozone',
      'NH3': 'Ammonia'
    };
    return names[gas] || gas;
  };

  const getHabitabilityIcon = () => {
    if (report.habitabilityImpact.startsWith('Excellent') || report.habitabilityImpact.startsWith('Good')) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (report.habitabilityImpact.startsWith('Moderate')) {
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-red-400" />;
    }
  };

  // Sort gases by percentage for display
  const sortedGases = Object.entries(report.composition)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6); // Show top 6 gases

  return (
    <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
        <span>Advanced Atmospheric Analysis</span>
      </h3>

      {/* Input Parameters Display */}
      <div className="mb-8 p-6 backdrop-blur-sm bg-black/40 rounded-xl border border-gray-700/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Beaker className="w-5 h-5 text-purple-400" />
          <span>Analysis Parameters</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-400">Density</p>
            <p className="text-white font-bold">{atmosphericInput.pl_dens.toFixed(2)} g/cm³</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Orbital Period</p>
            <p className="text-white font-bold">{atmosphericInput.pl_orbper.toFixed(1)} days</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Temperature</p>
            <p className="text-white font-bold">{atmosphericInput.pl_eqtstr.toFixed(0)} K</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Mass</p>
            <p className="text-white font-bold">{atmosphericInput.pl_bmassj.toFixed(3)} M♃</p>
          </div>
        </div>
      </div>

      {/* Gas Composition */}
      <div className="space-y-6 mb-8">
        {sortedGases.map(([gas, percentage], index) => (
          <div key={gas} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${getGasColor(gas)}/20 border border-gray-700/30`}>
                  {getGasIcon(gas)}
                </div>
                <div>
                  <span className="text-white font-medium text-lg">{getGasName(gas)} ({gas === 'CO2' ? 'CO₂' : gas === 'N2' ? 'N₂' : gas === 'O2' ? 'O₂' : gas === 'H2O' ? 'H₂O' : gas === 'CH4' ? 'CH₄' : gas === 'H2' ? 'H₂' : gas === 'SO2' ? 'SO₂' : gas === 'O3' ? 'O₃' : gas === 'NH3' ? 'NH₃' : gas})</span>
                  <p className="text-xs text-gray-400">
                    {report.majorComponents.includes(gas) ? 'Major component' :
                     report.minorComponents.includes(gas) ? 'Minor component' :
                     report.dominantGas === gas ? 'Dominant gas' : 'Trace presence'}
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-white">{percentage.toFixed(2)}%</span>
            </div>
            <div className="relative">
              <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-gray-700/30">
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${getGasColor(gas)} shadow-lg transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(100, percentage * 2)}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Habitability Impact */}
      <div className="mb-6 p-6 backdrop-blur-sm bg-black/40 rounded-xl border border-gray-700/30">
        <div className="flex items-center space-x-3 mb-4">
          {getHabitabilityIcon()}
          <h4 className="text-lg font-semibold text-white">Habitability Impact</h4>
        </div>
        <p className="text-gray-300 leading-relaxed">{report.habitabilityImpact}</p>
      </div>

      {/* Scientific Notes */}
      <div className="p-6 backdrop-blur-sm bg-black/40 rounded-xl border border-gray-700/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Atom className="w-5 h-5 text-cyan-400" />
          <span>Scientific Analysis</span>
        </h4>
        <div className="space-y-3">
          {report.scientificNotes.map((note, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-300 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};