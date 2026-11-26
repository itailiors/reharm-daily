/** Aggregates every storage source into one snapshot the UI renders from. */
import type { DailyCatalog, DailyGameRecord, GameCatalogEntry, HubStreak, Waitlist } from '../types';
import { getLocalDateKey, localPuzzleNumber, puzzleNoFor } from './dates';
import { WAITLIST_KEY, SEEN_KEY, parseSeen, parseWaitlist, type SeenLedger } from './prefs';
import { readGameRecord, resolveForToday } from './records';
import {
  REHARM_EPOCH,
  readReharmHistory,
  readReharmToday,
  reharmPlayedDates,
  reharmUnlockedBadges,
  type ReharmHistoryEntry,
} from './reharmAdapter';
import type { SafeStorage } from './storage';
import { STREAK_KEY, parseStreak, updateStreak } from './streak';

export interface LiveEntry {
  game: GameCatalogEntry;
  record: DailyGameRecord;
}

export interface BoardSnapshot {
  todayKey: string;
  puzzleNo: number;
  live: LiveEntry[];
  planned: GameCatalogEntry[];
  lab: GameCatalogEntry | null;
  played: number;
  total: number;
  allDone: boolean;
  streak: HubStreak;
  waitlist: Waitlist;
  reharmHistory: ReharmHistoryEntry[];
  unlockedBadges: Set<string>;
  /** Games that turned Done since the hub last looked today (→ red-pen stamp). */
  newlyDone: string[];
  /** Today just became a Clean Sheet (→ celebration). */
  newlyClean: boolean;
  /** Hub streak went up since the stored value (→ flame pop). */
  streakIncreased: boolean;
}

export function readLiveRecord(store: SafeStorage, game: GameCatalogEntry, todayKey: string, puzzleNo: number, now: Date): DailyGameRecord {
  if (game.id === 'reharm') {
    // Show REHARM's own puzzle number (its epoch, local day) so the hub and the game agree on "#N".
    return resolveForToday(readReharmToday(store, todayKey, now), game.id, todayKey, localPuzzleNumber(now, REHARM_EPOCH));
  }
  const no = game.epoch ? localPuzzleNumber(now, game.epoch) : puzzleNo;
  return resolveForToday(readGameRecord(store, game.id), game.id, todayKey, no);
}

/**
 * Build the board and persist derived hub state (streak + seen ledger).
 * Safe to call on every refresh: all writes are idempotent.
 */
export function loadBoard(store: SafeStorage, catalog: DailyCatalog, now: Date = new Date()): BoardSnapshot {
  const todayKey = getLocalDateKey(now);
  const puzzleNo = puzzleNoFor(todayKey, catalog.hub.epoch);

  const live: LiveEntry[] = catalog.games
    .filter((g) => g.status === 'live')
    .map((game) => ({ game, record: readLiveRecord(store, game, todayKey, puzzleNo, now) }));
  const planned = catalog.games.filter((g) => g.status === 'planned');
  const lab = catalog.games.find((g) => g.status === 'lab') ?? null;

  const played = live.filter((l) => l.record.status === 'done').length;
  const total = live.length;
  const allDone = total > 0 && played === total;

  const reharmHistory = readReharmHistory(store);
  const extraPlayedDates = [
    ...reharmPlayedDates(reharmHistory),
    // Native records finished on an earlier day still prove that day was played.
    ...live.map((l) => readGameRecord(store, l.game.id)).filter((r) => r?.status === 'done').map((r) => r!.dateKey),
  ];

  const prevStreak = parseStreak(store.getJSON(STREAK_KEY));
  const streak = updateStreak(prevStreak, { todayKey, played, total, extraPlayedDates });
  if (JSON.stringify(streak) !== JSON.stringify(prevStreak)) store.setJSON(STREAK_KEY, streak);

  const seen = parseSeen(store.getJSON(SEEN_KEY), todayKey);
  const doneIds = live.filter((l) => l.record.status === 'done').map((l) => l.game.id);
  const newlyDone = doneIds.filter((id) => !seen.done.includes(id));
  const newlyClean = allDone && !seen.clean;
  const nextSeen: SeenLedger = { dateKey: todayKey, done: doneIds, clean: allDone || seen.clean };
  if (newlyDone.length || newlyClean || seen.done.length !== doneIds.length || seen.dateKey !== todayKey) {
    store.setJSON(SEEN_KEY, nextSeen);
  }

  return {
    todayKey,
    puzzleNo,
    live,
    planned,
    lab,
    played,
    total,
    allDone,
    streak,
    waitlist: parseWaitlist(store.getJSON(WAITLIST_KEY)),
    reharmHistory,
    unlockedBadges: reharmUnlockedBadges(reharmHistory),
    newlyDone,
    newlyClean,
    streakIncreased: streak.current > prevStreak.current,
  };
}
