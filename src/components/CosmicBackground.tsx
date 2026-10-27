import React from 'react';
import { useNotebook } from '../context/NotebookContext';

export const CosmicBackground: React.FC = () => {
  const { settings } = useNotebook();
  const isLight = settings.theme === 'light';
  const animate = settings.animations_enabled;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-700">
      {/* Base Cosmic Gradient */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          isLight
            ? 'bg-gradient-to-br from-purple-50 via-pink-50/60 to-indigo-50/80'
            : 'bg-gradient-to-br from-[#0c081f] via-[#140e2e] to-[#0a0718]'
        }`}
      />

      {/* Galaxy Nebulae Highlights */}
      <div
        className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30 ${
          isLight ? 'bg-purple-300' : 'bg-purple-700'
        } ${animate ? 'animate-pulse-glow' : ''}`}
      />
      <div
        className={`absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 ${
          isLight ? 'bg-pink-300' : 'bg-fuchsia-800'
        }`}
      />
      <div
        className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isLight ? 'bg-indigo-200' : 'bg-indigo-900'
        }`}
      />

      {/* Twinkling Stars */}
      <div className="absolute inset-0">
        {/* Star 1 */}
        <div
          className={`absolute top-12 left-[15%] w-1.5 h-1.5 rounded-full ${
            isLight ? 'bg-purple-400' : 'bg-white'
          } ${animate ? 'animate-twinkle-1' : 'opacity-70'}`}
        />
        <div
          className={`absolute top-24 left-[35%] w-2 h-2 rounded-full ${
            isLight ? 'bg-pink-400' : 'bg-purple-200'
          } ${animate ? 'animate-twinkle-2' : 'opacity-80'}`}
        />
        <div
          className={`absolute top-16 right-[20%] w-1.5 h-1.5 rounded-full ${
            isLight ? 'bg-purple-400' : 'bg-fuchsia-300'
          } ${animate ? 'animate-twinkle-3' : 'opacity-60'}`}
        />
        <div
          className={`absolute top-48 right-[10%] w-2.5 h-2.5 rounded-full ${
            isLight ? 'bg-indigo-400' : 'bg-indigo-200'
          } ${animate ? 'animate-twinkle-1' : 'opacity-75'}`}
        />
        <div
          className={`absolute top-[60%] left-[8%] w-2 h-2 rounded-full ${
            isLight ? 'bg-pink-400' : 'bg-pink-200'
          } ${animate ? 'animate-twinkle-2' : 'opacity-60'}`}
        />
        <div
          className={`absolute bottom-32 right-[25%] w-1.5 h-1.5 rounded-full ${
            isLight ? 'bg-purple-400' : 'bg-white'
          } ${animate ? 'animate-twinkle-3' : 'opacity-70'}`}
        />
        <div
          className={`absolute bottom-16 left-[45%] w-2 h-2 rounded-full ${
            isLight ? 'bg-indigo-400' : 'bg-purple-300'
          } ${animate ? 'animate-twinkle-1' : 'opacity-80'}`}
        />
      </div>

      {/* Subtle Constellation Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="15%" y1="12%" x2="35%" y2="24%" stroke={isLight ? '#7c3aed' : '#c084fc'} strokeWidth="1" strokeDasharray="3,3" />
        <line x1="35%" y1="24%" x2="48%" y2="18%" stroke={isLight ? '#7c3aed' : '#c084fc'} strokeWidth="1" strokeDasharray="3,3" />
        <line x1="80%" y1="16%" x2="90%" y2="48%" stroke={isLight ? '#7c3aed' : '#c084fc'} strokeWidth="1" strokeDasharray="3,3" />
        <line x1="8%" y1="60%" x2="25%" y2="78%" stroke={isLight ? '#7c3aed' : '#c084fc'} strokeWidth="1" strokeDasharray="3,3" />
      </svg>
    </div>
  );
};
