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

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<GameStatus | 'ALL'>(GameStatus.DEAD);
  const [sortBy, setSortBy] = useState<'death_desc' | 'death_asc' | 'name_asc' | 'name_desc'>('death_desc');

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

  const filteredAndSortedGames = useMemo(() => {
    return [...allGames]
      .filter(game => {
        // Status Filter
        if (statusFilter !== 'ALL' && game.status !== statusFilter) return false;
        
        // Search Filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return game.name.toLowerCase().includes(term) || 
                 game.description.toLowerCase().includes(term);
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort Logic
        switch (sortBy) {
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'death_asc':
            return parseDeathDate(a.deathDate).getTime() - parseDeathDate(b.deathDate).getTime();
          case 'death_desc':
          default:
            return parseDeathDate(b.deathDate).getTime() - parseDeathDate(a.deathDate).getTime();
        }
      });
  }, [allGames, statusFilter, searchTerm, sortBy]);

  const handleTombstoneClick = (game: Game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1b1a2b] text-gray-300 font-sans relative">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(187, 211, 45, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(187, 211, 45, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">An Archive for dead web3 games</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">Click on a tombstone to learn about the rise and fall of these web3 games.</p>
        </div>

        {/* Controls Section */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 justify-center items-center max-w-4xl mx-auto bg-[#342f52]/30 p-6 rounded-2xl border border-[#5e59a5]/30 backdrop-blur-sm">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1b1a2b]/80 text-white border border-[#5e59a5]/50 rounded-lg px-4 py-2 focus:outline-none focus:border-[#bbd32d] focus:ring-1 focus:ring-[#bbd32d] transition-colors"
            />
            <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-1/4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as GameStatus | 'ALL')}
              className="w-full bg-[#1b1a2b]/80 text-white border border-[#5e59a5]/50 rounded-lg px-4 py-2 focus:outline-none focus:border-[#bbd32d] focus:ring-1 focus:ring-[#bbd32d] transition-colors appearance-none cursor-pointer"
            >
              <option value={GameStatus.DEAD}>Dead Games</option>
              <option value={GameStatus.DYING}>Dying Games</option>
              <option value={GameStatus.GHOST}>Ghost Towns</option>
              <option value="ALL">All Statuses</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="w-full md:w-1/3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#1b1a2b]/80 text-white border border-[#5e59a5]/50 rounded-lg px-4 py-2 focus:outline-none focus:border-[#bbd32d] focus:ring-1 focus:ring-[#bbd32d] transition-colors appearance-none cursor-pointer"
            >
              <option value="death_desc">Latest Death (Default)</option>
              <option value="death_asc">Oldest Death</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
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
            {filteredAndSortedGames.map((game) => (
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