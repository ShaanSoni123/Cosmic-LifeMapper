import React from 'react';
import { Exoplanet } from '../types/exoplanet';
import { Atom, Beaker, Thermometer, Activity, Shield, AlertTriangle } from 'lucide-react';
import { 
  calculateAtmosphericSurvival, 
  AtmosphericGasData,
  atmosphereToChemicalConcentrations 
} from '../utils/biosignatureAnalyzer';

interface BiosignatureChartProps {
  exoplanet: Exoplanet;
}

export const BiosignatureChart: React.FC<BiosignatureChartProps> = ({ exoplanet }) => {
  const biosignature = exoplanet.biosignature;
  
  if (!biosignature) {
    return null;
  }

  // Calculate atmospheric survival analysis
  const chemicalConcentrations = atmosphereToChemicalConcentrations(exoplanet.atmosphere);
  const atmosphericGasData: AtmosphericGasData = {
    H2: chemicalConcentrations.H2 || 0,
    O2: chemicalConcentrations.O2 || 0,
    N2: chemicalConcentrations.N2 || 0,
    CO2: chemicalConcentrations.CO2 || 0,
    NH3: chemicalConcentrations.NH3 || 0,
    C2H6: chemicalConcentrations.C2H6 || 0,
    SO2: chemicalConcentrations.SO2 || 0,
    H2S: chemicalConcentrations.H2S || 0
  };
  
  const survivalAnalysis = calculateAtmosphericSurvival(atmosphericGasData);

  const chemicalData = [
    {
      name: 'Oxygen (O₂)',
      value: biosignature.chemicalAnalysis.O2 || 0,
      concentration: atmosphericGasData.O2,
      survivalScore: survivalAnalysis.individualScores.O2,
      icon: Activity,
      color: 'from-green-400 via-emerald-500 to-teal-500',
      bgColor: 'from-green-900/40 to-emerald-900/40',
      description: 'Essential for aerobic life'
    },
    {
      name: 'Hydrogen (H₂)',
      value: biosignature.chemicalAnalysis.H2 || 0,
      concentration: atmosphericGasData.H2,
      survivalScore: survivalAnalysis.individualScores.H2,
      icon: Atom,
      color: 'from-yellow-400 via-orange-500 to-red-500',
      bgColor: 'from-yellow-900/40 to-orange-900/40',
      description: 'Reducing gas indicator'
    },
    {
      name: 'Nitrogen (N₂)',
      value: biosignature.chemicalAnalysis.N2 || 0,
      concentration: atmosphericGasData.N2,
      survivalScore: survivalAnalysis.individualScores.N2,
      icon: Atom,
      color: 'from-blue-400 via-cyan-500 to-sky-500',
      bgColor: 'from-blue-900/40 to-cyan-900/40',
      description: 'Atmospheric stability'
    },
    {
      name: 'Carbon Dioxide (CO₂)',
      value: biosignature.chemicalAnalysis.CO2 || 0,
      concentration: atmosphericGasData.CO2,
      survivalScore: survivalAnalysis.individualScores.CO2,
      icon: Beaker,
      color: 'from-orange-400 via-red-500 to-pink-500',
      bgColor: 'from-orange-900/40 to-red-900/40',
      description: 'Greenhouse gas indicator'
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-400 via-green-400 to-cyan-400';
    if (score >= 60) return 'from-yellow-400 via-orange-400 to-red-400';
    return 'from-red-500 via-pink-500 to-purple-500';
  };

  const getSurvivalColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 25) return 'text-orange-400';
    return 'text-red-400';
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
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">Conc: {chemical.concentration.toFixed(2)}</span>
                      <span className={`text-xs font-bold ${getSurvivalColor(chemical.survivalScore)}`}>
                        Survival: {chemical.survivalScore}%
                      </span>
                    </div>
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

      {/* Atmospheric Survival Analysis */}
      <div className="mt-8 p-6 backdrop-blur-sm bg-black/40 rounded-xl border border-gray-700/30">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>Atmospheric Survival Analysis</span>
          </h4>
          <div className="text-center">
            <span className={`text-3xl font-bold ${getSurvivalColor(survivalAnalysis.totalScore)}`}>
              {survivalAnalysis.totalScore}%
            </span>
            <p className="text-xs text-gray-400">Survival Score</p>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className="w-full bg-black/60 rounded-full h-4 overflow-hidden border border-gray-700/30">
            <div 
              className={`h-4 rounded-full shadow-lg transition-all duration-1000 ease-out bg-gradient-to-r ${getScoreColor(survivalAnalysis.totalScore)}`}
              style={{ width: `${survivalAnalysis.totalScore}%` }}
            ></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
        </div>

        {/* Individual Gas Analysis */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(survivalAnalysis.individualScores).map(([gas, score]) => (
            <div key={gas} className="p-3 bg-black/60 rounded-lg border border-gray-600/30 text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Atom className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300 font-medium">{gas}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">{atmosphericGasData[gas as keyof AtmosphericGasData].toFixed(1)}</span>
              </div>
              <div className={`text-sm font-bold ${getSurvivalColor(score)}`}>
                {score}%
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-lg border border-cyan-500/30">
          <div className="flex items-center space-x-2 mb-2">
            {survivalAnalysis.totalScore >= 50 ? (
              <Shield className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-white font-semibold text-sm">Analysis Summary</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Based on atmospheric gas concentrations, this world shows a <span className={`font-semibold ${getSurvivalColor(survivalAnalysis.totalScore)}`}>
              {survivalAnalysis.totalScore >= 75 ? 'high' : survivalAnalysis.totalScore >= 50 ? 'moderate' : survivalAnalysis.totalScore >= 25 ? 'low' : 'very low'}
            </span> survival potential for life forms. 
            The analysis considers optimal concentration ranges for each atmospheric component and their combined effect on biological viability.
          </p>
        </div>
      </div>
    </div>
  );
};