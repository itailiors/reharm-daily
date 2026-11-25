import type { DailyGameRecord, DailyPlayState, LabLink } from '../types';
import { addDays, isDateKey } from './dates';
import type { SafeStorage } from './storage';

export const gameKey = (gameId: string): string => `daily:v1:${gameId}`;

const STATES: readonly DailyPlayState[] = ['new', 'in_progress', 'done'];

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);

function labMove(v: unknown): LabLink | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  return typeof o.slug === 'string' && typeof o.label === 'string' ? { slug: o.slug, label: o.label } : null;
}

/**
 * Validate one `daily:v1:<gameId>` payload. Returns null for anything unusable so a corrupt
 * record isolates to "New Today" for that game only (ux-spec.md §2 State 10.4).
 */
export function parseGameRecord(raw: unknown, gameId: string): DailyGameRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1) return null;
  if (o.gameId !== undefined && o.gameId !== gameId) return null;
  if (!isDateKey(o.dateKey)) return null;
  if (!STATES.includes(o.status as DailyPlayState)) return null;
  return {
    v: 1,
    gameId,
    dateKey: o.dateKey,
    puzzleNo: num(o.puzzleNo) ?? 0,
    status: o.status as DailyPlayState,
    score: num(o.score),
    scoreLabel: str(o.scoreLabel) ?? '',
    tierIcon: str(o.tierIcon),
    streak: Math.max(0, Math.floor(num(o.streak) ?? 0)),
    bestScore: num(o.bestScore),
    playedCount: num(o.playedCount) ?? undefined,
    progressLabel: str(o.progressLabel),
    shareText: str(o.shareText),
    labMove: labMove(o.labMove),
    updatedAt: num(o.updatedAt) ?? 0,
  };
}

/** A blank "New Today" record. */
export function newRecord(gameId: string, todayKey: string, puzzleNo: number): DailyGameRecord {
  return { v: 1, gameId, dateKey: todayKey, puzzleNo, status: 'new', score: null, scoreLabel: '', streak: 0, updatedAt: 0 };
}

/**
 * Stale-day rule (data-contract.md §4): a record from another day shows as "new" today,
 * keeping lifetime fields; its streak survives only if it was finished yesterday.
 */
export function resolveForToday(rec: DailyGameRecord | null, gameId: string, todayKey: string, puzzleNo: number): DailyGameRecord {
  if (!rec) return newRecord(gameId, todayKey, puzzleNo);
  if (rec.dateKey === todayKey) return rec;
  const alive = rec.dateKey === addDays(todayKey, -1) && rec.status === 'done';
  return {
    ...newRecord(gameId, todayKey, puzzleNo),
    streak: alive ? rec.streak : 0,
    bestScore: rec.bestScore,
    playedCount: rec.playedCount,
  };
}

export function readGameRecord(store: SafeStorage, gameId: string): DailyGameRecord | null {
  return parseGameRecord(store.getJSON(gameKey(gameId)), gameId);
}
