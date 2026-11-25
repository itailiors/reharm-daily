/**
 * Hub streak & Clean Sheet math (product-notes.md §2):
 *  - Hub Streak: consecutive local days with >= 1 live daily puzzle done.
 *  - Clean Sheet: lifetime count of days where every live daily was done.
 *  - Lab practice never counts (callers pass live dailies only).
 */
import type { DayTally, HubStreak } from '../types';
import { addDays, daysBetween, isDateKey } from './dates';

export const STREAK_KEY = 'daily:v1:hub:streak';
/** Days of history kept in `recentDays` (lifetime counters live outside it). */
export const RECENT_DAYS_KEPT = 400;

export function emptyStreak(): HubStreak {
  return { current: 0, longest: 0, lastPlayedDate: null, cleanSheets: 0, recentDays: {} };
}

const int = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);

export function parseStreak(raw: unknown): HubStreak {
  if (!raw || typeof raw !== 'object') return emptyStreak();
  const o = raw as Record<string, unknown>;
  const days: Record<string, DayTally> = {};
  if (o.recentDays && typeof o.recentDays === 'object') {
    for (const [k, v] of Object.entries(o.recentDays as Record<string, unknown>)) {
      if (!isDateKey(k) || !v || typeof v !== 'object') continue;
      const t = v as Record<string, unknown>;
      const played = int(t.played);
      const total = int(t.total);
      days[k] = { played, total, clean: t.clean === true && played > 0 };
    }
  }
  return {
    current: int(o.current),
    longest: int(o.longest),
    lastPlayedDate: isDateKey(o.lastPlayedDate) ? o.lastPlayedDate : null,
    cleanSheets: int(o.cleanSheets),
    recentDays: days,
    since: isDateKey(o.since) ? o.since : undefined,
  };
}

/** Consecutive played days ending today, or yesterday while today is still open. */
export function currentStreak(days: Record<string, DayTally>, todayKey: string): number {
  const played = (k: string) => (days[k]?.played ?? 0) > 0;
  let cursor = played(todayKey) ? todayKey : addDays(todayKey, -1);
  let n = 0;
  while (played(cursor)) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

/** Longest run of consecutive played days found in `days`. */
export function longestRun(days: Record<string, DayTally>): number {
  const keys = Object.keys(days)
    .filter((k) => days[k]!.played > 0)
    .sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of keys) {
    run = prev !== null && daysBetween(prev, k) === 1 ? run + 1 : 1;
    prev = k;
    best = Math.max(best, run);
  }
  return best;
}

export interface TodayTally {
  todayKey: string;
  /** Live dailies done today. */
  played: number;
  /** Live dailies on today's sheet. */
  total: number;
  /** Other local days on which some live daily was finished (from game history), for back-fill. */
  extraPlayedDates?: string[];
}

/**
 * Pure update: fold today's tally (and any back-filled play dates) into the stored streak.
 * Idempotent — calling it repeatedly with the same input yields the same record.
 */
export function updateStreak(prev: HubStreak, t: TodayTally): HubStreak {
  const days: Record<string, DayTally> = { ...prev.recentDays };
  let cleanSheets = prev.cleanSheets;

  const put = (key: string, tally: DayTally) => {
    const before = days[key];
    // Never lower a day's tally (a game's record for that day can be overwritten later).
    const merged: DayTally = before
      ? { played: Math.max(before.played, tally.played), total: Math.max(before.total, tally.total), clean: before.clean || tally.clean }
      : tally;
    if (merged.clean && !before?.clean) cleanSheets++;
    days[key] = merged;
  };

  for (const k of t.extraPlayedDates ?? []) {
    if (!isDateKey(k) || k === t.todayKey) continue;
    if (daysBetween(k, t.todayKey) < 0) continue; // future (UTC ahead of local): skip
    if (prev.since && k < prev.since) continue;
    if (days[k]) continue; // the hub saw that day itself; trust its tally
    // Back-filled days only prove >= 1 play; with a 1-game roster that is a Clean Sheet.
    put(k, { played: 1, total: Math.max(1, t.total), clean: t.total === 1 });
  }

  if (t.played > 0 || days[t.todayKey]) {
    put(t.todayKey, { played: t.played, total: t.total, clean: t.total > 0 && t.played >= t.total });
  }

  // Prune old days.
  const cutoff = addDays(t.todayKey, -RECENT_DAYS_KEPT);
  for (const k of Object.keys(days)) if (k < cutoff) delete days[k];

  const current = currentStreak(days, t.todayKey);
  const playedKeys = Object.keys(days)
    .filter((k) => days[k]!.played > 0)
    .sort();
  return {
    current,
    longest: Math.max(prev.longest, current, longestRun(days)),
    lastPlayedDate: playedKeys.at(-1) ?? prev.lastPlayedDate,
    cleanSheets,
    recentDays: days,
    since: prev.since,
  };
}

/** The last 7 local days, oldest first, for the rhythm strip. */
export function lastSevenDays(days: Record<string, DayTally>, todayKey: string): Array<{ key: string; tally: DayTally | null }> {
  return Array.from({ length: 7 }, (_, i) => {
    const key = addDays(todayKey, i - 6);
    return { key, tally: days[key] ?? null };
  });
}
