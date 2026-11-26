/** Shared types (design/claude-code-handoff.md §5, design/data-contract.md). */

export type GameStatus = 'live' | 'planned' | 'lab';
export type DailyPlayState = 'new' | 'in_progress' | 'done';
export type MutedRating = 'yes' | 'partly' | 'no' | 'tbd';
export type ThemeMode = 'system' | 'light' | 'dark';

export interface LabLink {
  slug: string;
  label: string;
}

export interface GameCatalogEntry {
  id: string;
  name: string;
  status: GameStatus;
  url?: string;
  archiveUrl?: string;
  /** Resolved URL of the 16:9 cover (bundled by Vite). */
  cover: string;
  /** Emoji used on this game's Combined Share Card row. */
  shareEmoji: string;
  pitch: string;
  archetype: string;
  estMinutes: number;
  mutedFriendly: MutedRating;
  /** Short pill label, e.g. "Silent OK". */
  mutedLabel: string;
  /** Detail-sheet sentence, e.g. "Visual playhead; audio recommended". */
  mutedNote: string;
  scoreUnit: string;
  howToPlay: [string, string, string];
  storagePrefix?: string;
  /** Puzzle #1 date (YYYY-MM-DD) when it differs from the hub epoch, so "#N" matches the game. */
  epoch?: string;
  labLinks?: LabLink[];
}

export interface DailyCatalog {
  hub: { name: string; url: string; epoch: string };
  lab: { name: string; url: string };
  games: GameCatalogEntry[];
}

export interface DailyGameRecord {
  v: 1;
  gameId: string;
  dateKey: string;
  puzzleNo: number;
  status: DailyPlayState;
  score: number | null;
  scoreLabel: string;
  tierIcon?: string;
  streak: number;
  bestScore?: number | null;
  playedCount?: number;
  progressLabel?: string;
  shareText?: string;
  labMove?: LabLink | null;
  updatedAt: number;
}

export interface HubPrefs {
  theme: ThemeMode;
  reducedMotion: boolean;
  mutedDefault: boolean;
  uiSounds: boolean;
  seenIntro: boolean;
  bannerDismissedDate?: string;
}

export interface DayTally {
  played: number;
  total: number;
  clean: boolean;
}

export interface HubStreak {
  current: number;
  longest: number;
  lastPlayedDate: string | null;
  cleanSheets: number;
  recentDays: Record<string, DayTally>;
  /** Set by "Reset Hub History": days before this key are ignored when back-filling from game history. */
  since?: string;
}

export interface CombinedSharePayload {
  puzzleNo: number;
  dateKey: string;
  playedCount: number;
  totalLive: number;
  isCleanSheet: boolean;
  hubStreak: number;
  fullText: string;
  compactText: string;
}

/** Waitlist: gameId → epoch ms when the bell was turned on. */
export type Waitlist = Record<string, number>;
