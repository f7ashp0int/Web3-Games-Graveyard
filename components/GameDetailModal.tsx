import React, { useEffect } from 'react';
import type { Game } from '../types';
import { GameStatus } from '../types';

interface GameDetailModalProps {
  game: Game;
  onClose: () => void;
}

const statusStyles: { [key in GameStatus]: string } = {
  [GameStatus.DEAD]: 'bg-red-500/20 text-red-400 border-red-500/30',
  [GameStatus.DYING]: 'bg-[#bbd32d]/20 text-[#bbd32d] border-[#bbd32d]/30',
  [GameStatus.GHOST]: 'bg-[#5e59a5]/20 text-[#5e59a5] border-[#5e59a5]/30',
};

const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#342f52]/80 border border-[#5e59a5] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fade-in-scale 0.3s ease-out forwards' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="flex-shrink-0 w-24 h-24 bg-[#5e59a5] rounded-full flex items-center justify-center border-2 border-[#bbd32d] overflow-hidden">
             <img src={game.logoUrl} alt={`${game.name} logo`} className="w-full h-full object-contain p-2" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-white">{game.name}</h2>
            <div className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${statusStyles[game.status]}`}>
              Status: {game.status}
            </div>
          </div>
        </div>

        <div className="space-y-6 text-gray-300">
          <div>
            <h3 className="font-semibold text-[#bbd32d] text-lg mb-2">The Story</h3>
            <p>{game.description}</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#bbd32d] text-lg mb-2">Cause of Death</h3>
            <p>{game.reasonForDemise}</p>
          </div>
          <div className="flex justify-between text-sm text-gray-400 border-t border-[#5e59a5] pt-4">
            <span><strong>Launched:</strong> {game.launchDate}</span>
            <span><strong>Faded:</strong> {game.deathDate}</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameDetailModal;
