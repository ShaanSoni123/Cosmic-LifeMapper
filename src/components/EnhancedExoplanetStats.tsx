import React from 'react';
import { Globe, Star, Calendar, Database, TrendingUp, Zap } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <div className={`backdrop-blur-xl bg-black/40 rounded-2xl p-6 border border-${color}-500/30 shadow-2xl shadow-${color}-500/20 transform hover:scale-105 transition-all duration-300`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full flex items-center justify-center animate-pulse`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className="flex items-center space-x-1 text-green-400 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
    <p className={`text-3xl font-bold text-${color}-400 mb-1`}>{value}</p>
    {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
  </div>
);

interface EnhancedExoplanetStatsProps {
  totalExoplanets: number;
  nasaExoplanets: number;
  localExoplanets: number;
  userAddedExoplanets: number;
  habitablePlanets: number;
  discoveryMethods: number;
  latestDiscovery: string;
  averageDistance: number;
}

export const EnhancedExoplanetStats: React.FC<EnhancedExoplanetStatsProps> = ({
  totalExoplanets,
  nasaExoplanets,
  localExoplanets,
  userAddedExoplanets,
  habitablePlanets,
  discoveryMethods,
  latestDiscovery,
  averageDistance
}) => {
  const habitabilityRate = Math.round((habitablePlanets / totalExoplanets) * 100);
  const nasaPercentage = Math.round((nasaExoplanets / totalExoplanets) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Total Exoplanets"
        value={totalExoplanets.toLocaleString()}
        subtitle="Confirmed discoveries"
        icon={Globe}
        color="cyan"
        trend="+12% this year"
      />
      
      <StatsCard
        title="Local Database"
        value={localExoplanets.toLocaleString()}
        subtitle="Curated exoplanet collection"
        icon={Globe}
        color="blue"
      />
      
      <StatsCard
        title="NASA Archive"
        value={nasaExoplanets.toLocaleString()}
        subtitle="Real NASA CSV data"
        icon={Database}
        color="purple"
        trend="Accurate data"
      />
      
      {userAddedExoplanets > 0 && (
        <StatsCard
          title="User Added"
          value={userAddedExoplanets.toLocaleString()}
          subtitle="Custom additions"
          icon={Zap}
          color="yellow"
        />
      )}
      
      <StatsCard
        title="Potentially Habitable"
        value={habitablePlanets.toLocaleString()}
        subtitle={`${habitabilityRate}% habitability rate`}
        icon={Star}
        color="green"
        trend="+8% this month"
      />
      
      <StatsCard
        title="Discovery Methods"
        value={discoveryMethods}
        subtitle="Different detection techniques"
        icon={Zap}
        color="orange"
      />
      
      <StatsCard
        title="Latest Discovery"
        value={latestDiscovery}
        subtitle="Most recent in dataset"
        icon={Calendar}
        color="blue"
      />
      
      <StatsCard
        title="Average Distance"
        value={`${averageDistance} ly`}
        subtitle="Mean distance from Earth"
        icon={Globe}
        color="pink"
      />
    </div>
  );
};