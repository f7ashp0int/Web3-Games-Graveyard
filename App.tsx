import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Tombstone from './components/Tombstone';
import GameDetailModal from './components/GameDetailModal';
import { gamesData } from './data/games';
import { SheetService } from './services/sheetService';
import type { Game } from './types';
import { GameStatus } from './types';

// Helper function to parse non-standard date strings into comparable Date objects
const parseDeathDate = (dateStr: string): Date => {
  if (dateStr.toLowerCase().includes('ongoing')) {
    // Treat "Ongoing" as the most recent date possible to appear first
    return new Date();
  }

  // Clean up string for better parsing
  let cleanStr = dateStr.replace(/\(.*\)/, '').trim(); // Removes (Pivot), (Transition), etc.
  cleanStr = cleanStr.replace('Early', 'January');
  cleanStr = cleanStr.replace('Mid-', 'June ');
  cleanStr = cleanStr.replace('Late', 'December');

  // Attempt to parse standard formats like "Month YYYY" or "Month Day, YYYY"
  const date = new Date(cleanStr);
  
  // Check for valid date from direct parsing
  if (!isNaN(date.getTime())) {
    // If only a year was provided (e.g., "2023"), JS defaults to Jan 1.
    // We adjust it to Dec 31 to ensure it's sorted as the end of that year.
    if (/^\d{4}$/.test(cleanStr.trim())) {
      return new Date(`${cleanStr.trim()}-12-31T23:59:59Z`);
    }
    return date;
  }
  
  // Fallback for years if direct parsing fails
  const yearMatch = cleanStr.match(/\d{4}/);
  if (yearMatch) {
    return new Date(`${yearMatch[0]}-12-31T23:59:59Z`);
  }

  // Return a very old date for unparseable strings to sort them last
  return new Date('1970-01-01');
};


const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [allGames, setAllGames] = useState<Game[]>(gamesData); // Start with existing games
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const games = await SheetService.getAllGames();
        setAllGames(games);
      } catch (error) {
        console.error('Error loading games:', error);
        // Keep existing games if sheet fails
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  const sortedGames = useMemo(() => {
    return [...allGames]
      .filter(game => game.status === GameStatus.DEAD) // Only show dead games
      .sort((a, b) => {
        const dateA = parseDeathDate(a.deathDate);
        const dateB = parseDeathDate(b.deathDate);
        // Sort in descending order (newest first)
        return dateB.getTime() - dateA.getTime();
      });
  }, [allGames]);

  const handleTombstoneClick = (game: Game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1b1a2b] text-gray-300 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">A Resting Place for Digital Dreams</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">Click on a tombstone to learn about the rise and fall of these web3 games.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="text-lg text-gray-400">Loading games from community...</div>
          </div>
        ) : (
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16"
            style={{ perspective: '1000px' }}
          >
            {sortedGames.map((game) => (
              <Tombstone key={game.id} game={game} onClick={handleTombstoneClick} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      {selectedGame && (
        <GameDetailModal game={selectedGame} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;