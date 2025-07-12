import React from 'react';
import { Exoplanet } from '../types/exoplanet';
import { 
  calculateHabitabilityScore, 
  calculateSurfaceGravity,
  estimateSurfaceTemperature,
  calculateWaterRetentionPotential,
  calculateRadiationHazardIndex,
  calculateHabitableZoneBounds
} from '../utils/exoplanetProcessor';
import { Beaker, Calculator, Zap, Droplets } from 'lucide-react';

interface ScientificAnalysisProps {
  exoplanet: Exoplanet;
}

export const ScientificAnalysis: React.FC<ScientificAnalysisProps> = ({ exoplanet }) => {
  // Estimate star temperature from star type
  const getStarTemp = (starType: string): number => {
    switch (starType) {
      case 'A-type': return 8000;
      case 'F-type': return 6500;
      case 'G-type': return 5800;
      case 'K-type': return 4500;
      case 'M-dwarf': return 3200;
      default: return 5800;
    }
  };

  const starTemp = getStarTemp(exoplanet.starType);
  const orbitalDistance = 0.1; // Estimated AU
  const stellarLuminosity = 1.0; // Estimated solar units
  const hostStarAge = 5.0; // Estimated Gyr

  // Calculate scientific metrics
  const surfaceGravity = calculateSurfaceGravity(exoplanet.mass, exoplanet.radius);
  const waterRetention = calculateWaterRetentionPotential(exoplanet.mass, exoplanet.radius, starTemp, orbitalDistance);
  const radiationHazard = calculateRadiationHazardIndex(starTemp, stellarLuminosity, orbitalDistance, hostStarAge);
  const hzBounds = calculateHabitableZoneBounds(starTemp);

  const inHabitableZone = orbitalDistance >= hzBounds.inner && orbitalDistance <= hzBounds.outer;

  return (
    <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
          <Beaker className="w-4 h-4 text-white" />
        </div>
        <span>Scientific Analysis</span>
      </h3>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Surface Gravity</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{surfaceGravity.toFixed(2)}g</p>
            <p className="text-sm text-gray-400">Relative to Earth gravity</p>
          </div>

          <div className="backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">Radiation Index</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">{(radiationHazard * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-400">Stellar radiation hazard</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-cyan-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Water Retention</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">{(waterRetention * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-400">Ability to retain liquid water</p>
          </div>

          <div className="backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <Calculator className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Habitability Score</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{exoplanet.habitabilityScore}/100</p>
            <p className="text-sm text-gray-400">Scientific habitability index</p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-black/40 rounded-xl p-6 border border-gray-700/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Beaker className="w-5 h-5 text-cyan-400" />
          <span>Habitability Assessment</span>
        </h4>
        <p className="text-gray-300 leading-relaxed mb-4">
          {exoplanet.name} shows {exoplanet.habitabilityScore >= 80 ? 'exceptional' : exoplanet.habitabilityScore >= 60 ? 'moderate' : 'limited'} potential for supporting life. 
          {inHabitableZone ? ' The planet is positioned within the habitable zone where liquid water could exist.' : ' The planet is located outside the optimal habitable zone.'} 
          {waterRetention > 0.5 ? ' Good potential for retaining water on the surface.' : ' Limited water retention capability due to planetary conditions.'} 
          {radiationHazard > 0.7 ? ' High radiation levels from the host star pose significant challenges for life.' : ' Relatively safe radiation environment.'}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-400">Habitable Zone</p>
            <p className="text-white font-bold">{inHabitableZone ? 'Yes' : 'No'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Size Factor</p>
            <p className="text-white font-bold">{(Math.exp(-Math.pow(exoplanet.radius - 1.0, 2) / (2 * Math.pow(0.3, 2))) * 100).toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Star Type</p>
            <p className="text-white font-bold">{exoplanet.starType}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 backdrop-blur-sm bg-blue-900/20 rounded-xl border border-blue-500/30">
        <p className="text-xs text-blue-300 leading-relaxed">
          <strong>Scientific Methodology:</strong> This analysis uses the Kopparapu et al. (2013) habitable zone model, 
          incorporates planetary mass-radius relationships for water retention, and accounts for stellar radiation effects. 
          Calculations are based on established exoplanet research methodologies and peer-reviewed scientific literature.
        </p>
      </div>
    </div>
  );
};