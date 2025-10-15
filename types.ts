export enum GameStatus {
  DEAD = 'Dead',
  DYING = 'Dying',
  GHOST = 'Ghost Town'
}

export interface Game {
  id: number | string; // Support both numeric IDs and string IDs from sheet
  name: string;
  logoUrl: string;
  status: GameStatus;
  description: string;
  reasonForDemise: string;
  launchDate: string;
  deathDate: string;
  // New optional fields from Google Sheet
  category?: string;
  source?: string;
  blockchain?: string;
  developer?: string;
  fundingRaised?: string;
  peakPlayers?: string;
  tags?: string;
  addedBy?: string;
  lastUpdated?: string;
  verified?: boolean;
}
