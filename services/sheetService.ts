import type { Game } from '../types';
import { GameStatus } from '../types';
import { gamesData } from '../data/games';

// Replace this URL with your deployed Apps Script web app URL
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbxC3nFFSjApJWXLCjhkCuimirIBTd8yXMKmDYWaUKSeJCO_rfJG-5Nwq2sYM-Kv2G1bxg/exec';

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
        name: game.name,
        logoUrl: game.logoUrl,
        status: this.mapStatus(game.status),
        description: game.description,
        reasonForDemise: game.reasonForDemise,
        launchDate: game.launchDate,
        deathDate: game.deathDate,
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

  private static mapStatus(status: string): GameStatus {
    switch (status.toLowerCase()) {
      case 'dead':
        return GameStatus.DEAD;
      case 'dying':
        return GameStatus.DYING;
      case 'ghost town':
      case 'ghost':
        return GameStatus.GHOST;
      default:
        return GameStatus.DEAD; // Default to DEAD if unknown
    }
  }

  public static async getAllGames(): Promise<Game[]> {
    // Fetch both existing games and new games from sheet
    const [existingGames, sheetGames] = await Promise.all([
      Promise.resolve(gamesData), // Use direct import instead of dynamic import
      this.fetchGamesFromSheet()
    ]);

    // Combine both arrays
    return [...existingGames, ...sheetGames];
  }
}
