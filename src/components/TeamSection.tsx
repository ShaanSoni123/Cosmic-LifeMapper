import React from 'react';
import { Users, Star } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const teamMembers = [
    'SHAAN SONI',
    'ARADHYA HALDIKAR', 
    'RAMYA PATEL',
    'RUDRA PATEL',
    'MAULIK KHATRI',
    'ATHARVA AGRAWAL',
    'HARI GANESH',
    'ANUSHA DESAI',
    'SANYAM PATEL',
    'ANANT JAISWAL'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="backdrop-blur-xl bg-black/40 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform hover:scale-105 transition-all duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse mr-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {teamMembers.map((name, index) => (
            <div
              key={index}
              className="group relative backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-gray-700/30 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Cosmic glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Member number and star */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>

              {/* Member name */}
              <div className="relative z-10">
                <h3 className="text-white font-semibold text-sm md:text-base group-hover:text-cyan-300 transition-colors duration-300 leading-tight">
                  {name}
                </h3>
                <div className="mt-2 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Floating particles effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-cyan-400/30 rounded-full animate-ping"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      width: `${Math.random() * 2 + 1}px`,
                      height: `${Math.random() * 2 + 1}px`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${Math.random() * 2 + 1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer decoration */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
          <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};