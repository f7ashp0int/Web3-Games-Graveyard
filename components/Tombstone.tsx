import React from 'react';
import type { Game } from '../types';

interface TombstoneProps {
  game: Game;
  onClick: (game: Game) => void;
}

const Tombstone: React.FC<TombstoneProps> = ({ game, onClick }) => {
  return (
    <div
      className="group cursor-pointer flex flex-col items-center"
      onClick={() => onClick(game)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative w-full aspect-[3/4] transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl" style={{ transform: 'rotateX(10deg)' }}>
        {/* Tombstone body */}
        <div className="absolute inset-0 bg-[#342f52] rounded-t-full rounded-b-md shadow-lg border-b-4 border-[#5e59a5] flex flex-col items-center justify-center p-4">
          <div className="w-3/4 aspect-square bg-[#5e59a5]/50 rounded-full flex items-center justify-center shadow-inner overflow-hidden mb-2">
             <img 
                src={game.logoUrl} 
                alt={`${game.name} logo`} 
                className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300" 
             />
          </div>
          {/* Game name and dates */}
          <div className="text-center text-xs text-[#bbd32d] space-y-1">
            <div className="font-semibold text-white text-xs mb-2">{game.name}</div>
            <div className="font-semibold">📅 {game.launchDate}</div>
            <div className="font-semibold">💀 {game.deathDate}</div>
          </div>
        </div>
      </div>
      {/* Base of the tombstone */}
      <div className="w-full h-4 bg-[#342f52] rounded-b-md shadow-inner -mt-1"></div>
      <div className="w-11/12 h-3 bg-[#1b1a2b] rounded-b-md"></div>
    </div>
  );
};

export default Tombstone;
