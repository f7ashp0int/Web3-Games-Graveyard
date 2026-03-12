import type { Game } from '../types';
import { GameStatus } from '../types';
import { gamesData } from '../data/games';

// Replace this URL with your deployed Apps Script web app URL (from the Google Form response sheet)
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbx0or4k7pO6ihVUzk-VcPpa1EgEP7wtXkJL9hePTLOxAbwYRKeIOhYzMl-Q912AoGPk/exec';

export class SheetService {
  private static async fetchGamesFromSheet(): Promise<Game[]> {
    try {
      const response = await fetch(SHEET_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Transform sheet data to match our Game interface
      return data.map((game: any) => ({
        id: game.id,
        name: game.name || 'Unknown Game',
        logoUrl: game.logoUrl || './wgd-Light.svg',
        status: this.mapStatus(game.status || ''),
        description: game.description || 'No description available.',
        reasonForDemise: game.reasonForDemise || 'Unknown',
        launchDate: this.formatDate(game.launchDate),
        deathDate: game.deathDate || game.endDate || game['End Date'] || this.formatDate('', this.mapStatus(game.status || '')),
        category: game.category,
        source: game.source,
        blockchain: game.blockchain,
        developer: game.developer,
        fundingRaised: game.fundingRaised,
        peakPlayers: game.peakPlayers,
        tags: game.tags,
        addedBy: game.addedBy,
        lastUpdated: game.lastUpdated,
        verified: game.verified
      }));
    } catch (error) {
      console.error('Error fetching games from sheet:', error);
      return []; // Return empty array if sheet fetch fails
    }
  }

  private static formatDate(dateStr: string, status?: GameStatus): string {
    if (!dateStr || dateStr.toLowerCase() === 'unknown') {
      if (status === GameStatus.DYING) return 'Dying';
      return 'TBA';
    }

    // Check if it's an ISO string (contains 'T' and looks like a date)
    const date = new Date(dateStr);
    if (!isNaN(date.getTime()) && dateStr.includes('T')) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    return dateStr;
  }

  private static mapStatus(status: string): GameStatus {
    const s = status.toLowerCase();
    if (s.includes('dying')) return GameStatus.DYING;
    if (s.includes('ghost')) return GameStatus.GHOST;
    // Default to DEAD if it contains 'dead' or if unknown, but checking 'dead' explicitly helps if we have other stati later
    if (s.includes('dead')) return GameStatus.DEAD;

    return GameStatus.DEAD;
  }

  public static async getAllGames(): Promise<Game[]> {
    try {
      // Fetch both existing games and new games from sheet
      const [existingGames, sheetGames] = await Promise.all([
        Promise.resolve(gamesData),
        this.fetchGamesFromSheet()
      ]);

      // Use a Map for deduplication based on normalized name
      const gamesMap = new Map<string, Game>();

      // 1. Load hardcoded games first
      existingGames.forEach(game => {
        gamesMap.set(game.name.toLowerCase().trim(), game);
      });

      // 2. Load/Merge sheet games
      sheetGames.forEach(sheetGame => {
        const normalizedName = sheetGame.name.toLowerCase().trim();
        const existingGame = gamesMap.get(normalizedName);

        if (existingGame) {
          // Merge: Prefer sheet data, but fallback to hardcoded data if sheet is missing info
          gamesMap.set(normalizedName, {
            ...existingGame,
            ...sheetGame,
            // Explicitly fallback for deathDate if sheet version is TBA
            deathDate: (sheetGame.deathDate && sheetGame.deathDate !== 'TBA') 
              ? sheetGame.deathDate 
              : existingGame.deathDate,
            // Keep original ID or take sheet ID? Usually existing ID is fine
            id: existingGame.id
          });
        } else {
          // New game from sheet
          gamesMap.set(normalizedName, sheetGame);
        }
      });

      return Array.from(gamesMap.values());
    } catch (error) {
      console.error('Error in getAllGames:', error);
      return gamesData;
    }
  }
}
