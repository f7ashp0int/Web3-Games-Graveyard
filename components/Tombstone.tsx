import React from 'react';
import type { Game } from '../types';
import { GameStatus } from '../types';

interface TombstoneProps {
  game: Game;
  onClick: (game: Game) => void;
}

const Tombstone: React.FC<TombstoneProps> = ({ game, onClick }) => {
  return (
    <div
      className="group cursor-pointer flex flex-col items-center w-full"
      onClick={() => onClick(game)}
      style={{ perspective: '1000px' }}
    >
      <div 
        className="relative w-full aspect-[3/4] transition-all duration-500 group-hover:-translate-y-2" 
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg)' }}
      >
        {/* Tombstone body */}
        <div className="absolute inset-0 bg-[#342f52]/50 backdrop-blur-sm rounded-t-full rounded-b-md border border-[#5e59a5]/30 flex flex-col items-center p-4 pt-6 pb-4 transition-all duration-300 group-hover:border-[#bbd32d] group-hover:shadow-[0_0_20px_0px_rgba(187,211,45,0.3)]">

          <div className="w-2/3 aspect-square bg-[#5e59a5]/30 rounded-full flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
            <img
              src={game.logoUrl}
              alt={`${game.name} logo`}
              className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/wgd-Light.svg';
              }}
            />
          </div>
          
          {/* Game name and dates */}
          <div className="text-center text-[#bbd32d] w-full flex flex-col justify-end flex-grow mt-3 space-y-1">
            <div className="font-semibold text-white text-xs truncate px-1">{game.name}</div>

            <div>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block border ${game.status === GameStatus.DEAD ? 'bg-red-900/30 text-red-200 border-red-500/30' :
                game.status === GameStatus.DYING ? 'bg-yellow-900/30 text-yellow-200 border-yellow-500/30' :
                  'bg-gray-700/30 text-gray-300 border-gray-500/30'
                }`}>
                {game.status}
              </div>
            </div>

            <div className="font-semibold text-[10px]">📅 {game.launchDate}</div>
            <div className="font-semibold text-[10px]">💀 {game.deathDate}</div>

            {game.addedBy && (
              <div className="text-[9px] text-gray-400 mt-2 pt-2 border-t border-[#5e59a5]/30 w-full truncate">
                Added by {game.addedBy.split(',').map((handle, index, array) => (
                  <React.Fragment key={handle.trim()}>
                    <a
                      href={`https://x.com/${handle.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#bbd32d] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      @{handle.trim()}
                    </a>
                    {index < array.length - 1 && ', '}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Base of the tombstone */}
      <div className="w-full h-4 bg-[#342f52]/70 rounded-b-md shadow-inner -mt-1 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}></div>
      <div className="w-11/12 h-3 bg-[#1b1a2b]/70 rounded-b-md relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(5px)' }}></div>
    </div>
  );
};

export default Tombstone;
