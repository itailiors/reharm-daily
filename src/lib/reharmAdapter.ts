/**
 * Defensive, strictly read-only adapter for REHARM's own `reharm:v1:*` keys
 * (data-contract.md §3). Shapes match Reharm/src/share/storage.ts:
 *   reharm:v1:history  Record<puzzleNumber, HistoryEntry>
 *   reharm:v1:draft    { puzzleNumber, symbols: (string|null)[] }  (locked bar is null)
 *   reharm:v1:settings { theme, isMuted, ... }
 *
 * REHARM numbers puzzles by LOCAL calendar day (rolls over at local midnight, epoch day = #1),
 * the same as the hub, so "done today" means "today's local puzzle is in REHARM's history".
 */
import type { DailyGameRecord, LabLink } from '../types';
import { isDateKey, localPuzzleNumber } from './dates';
import { gameKey, parseGameRecord } from './records';
import type { SafeStorage } from './storage';

export const REHARM_EPOCH = '2026-11-25';
export const REHARM_KEYS = {
  settings: 'reharm:v1:settings',
  history: 'reharm:v1:history',
  draft: 'reharm:v1:draft',
} as const;

export interface ReharmHistoryEntry {
  puzzleNumber: number;
  dateISO: string;
  total: number;
  tier?: string;
  percentileLabel?: string;
  badges: string[];
}

const TIER_ICON: Record<string, string> = {
  'radio-safe': '●',
  'jazz-standard': '◆',
  'modal-interchange': '◐',
  'deep-reharm': '▲',
};

/** REHARM badge → Reharm Lab move slug (bridge-spec.md §3 canonical slugs), in priority order. */
const BADGE_TO_MOVE: ReadonlyArray<[string, LabLink]> = [
  ['tritone-sub', { slug: 'tritone-sub', label: 'Tritone Sub' }],
  ['backdoor-dominant', { slug: 'backdoor-dominant', label: 'Backdoor Dominant' }],
  ['modal-borrow', { slug: 'modal-interchange', label: 'Modal Interchange' }],
  ['chromatic-mediant', { slug: 'chromatic-mediant', label: 'Chromatic Mediant' }],
];

/** Read and sanitize REHARM history. Bad entries are dropped individually. */
export function readReharmHistory(store: SafeStorage): ReharmHistoryEntry[] {
  const raw = store.getJSON<unknown>(REHARM_KEYS.history);
  if (!raw || typeof raw !== 'object') return [];
  const out: ReharmHistoryEntry[] = [];
  for (const v of Object.values(raw as Record<string, unknown>)) {
    if (!v || typeof v !== 'object') continue;
    const e = v as Record<string, unknown>;
    const n = e.puzzleNumber;
    const total = e.total;
    if (typeof n !== 'number' || !Number.isFinite(n) || typeof total !== 'number' || !Number.isFinite(total)) continue;
    out.push({
      puzzleNumber: Math.floor(n),
      dateISO: isDateKey(e.dateISO) ? e.dateISO : '',
      total: Math.round(total),
      tier: typeof e.tier === 'string' ? e.tier : undefined,
      percentileLabel: typeof e.percentileLabel === 'string' ? e.percentileLabel : undefined,
      badges: Array.isArray(e.badges) ? e.badges.filter((b): b is string => typeof b === 'string') : [],
    });
  }
  return out.sort((a, b) => a.puzzleNumber - b.puzzleNumber);
}

/** Consecutive solves ending at `today` (or yesterday while today is still open), like REHARM. */
export function reharmStreak(history: ReharmHistoryEntry[], todayNumber: number): number {
  const solved = new Set(history.map((h) => h.puzzleNumber));
  let cursor = solved.has(todayNumber) ? todayNumber : todayNumber - 1;
  let n = 0;
  while (solved.has(cursor)) {
    n++;
    cursor--;
  }
  return n;
}

function labMoveFor(badges: string[]): LabLink | null {
  for (const [badge, move] of BADGE_TO_MOVE) if (badges.includes(badge)) return move;
  return null;
}

/** Synthesize today's REHARM record from `reharm:v1:*`, or null if REHARM has no data at all. */
export function synthesizeReharmRecord(store: SafeStorage, todayKey: string, now: Date): DailyGameRecord | null {
  const history = readReharmHistory(store);
  const todayNumber = localPuzzleNumber(now, REHARM_EPOCH);
  const best = history.length ? Math.max(...history.map((h) => h.total)) : null;
  const base = {
    v: 1 as const,
    gameId: 'reharm',
    dateKey: todayKey,
    puzzleNo: todayNumber,
    streak: reharmStreak(history, todayNumber),
    bestScore: best,
    playedCount: history.length,
    updatedAt: 0,
  };

  const today = history.find((h) => h.puzzleNumber === todayNumber);
  if (today) {
    const icon = (today.tier && TIER_ICON[today.tier]) || undefined;
    const pct = today.percentileLabel ?? '';
    const tail = [icon, pct].filter(Boolean).join(' ');
    return {
      ...base,
      status: 'done',
      score: today.total,
      scoreLabel: pct ? `${today.total}/100 · ${pct}` : `${today.total}/100`,
      tierIcon: icon,
      shareText: `🎛️ REHARM: ${today.total}/100${tail ? ` · ${tail}` : ''}`,
      labMove: labMoveFor(today.badges),
    };
  }

  const draft = store.getJSON<unknown>(REHARM_KEYS.draft);
  if (draft && typeof draft === 'object') {
    const d = draft as Record<string, unknown>;
    const symbols = Array.isArray(d.symbols) ? d.symbols : [];
    const filled = symbols.filter((s) => typeof s === 'string' && s.length > 0).length;
    if (d.puzzleNumber === todayNumber && filled > 0) {
      // 4 bars, one locked anchor (stored as null) → 3 open bars.
      const label = `${Math.min(filled, 3)}/3 bars`;
      return { ...base, status: 'in_progress', score: null, scoreLabel: label, progressLabel: label };
    }
  }

  if (!history.length) return null;
  return { ...base, status: 'new', score: null, scoreLabel: '' };
}

/** Priority 1: a native `daily:v1:reharm` record for today. Priority 2: the adapter. */
export function readReharmToday(store: SafeStorage, todayKey: string, now: Date): DailyGameRecord | null {
  const native = parseGameRecord(store.getJSON(gameKey('reharm')), 'reharm');
  if (native && native.dateKey === todayKey) return native;
  return synthesizeReharmRecord(store, todayKey, now) ?? native;
}

/** Dates REHARM recorded solves on (used to back-fill the hub streak for days the hub wasn't opened). */
export function reharmPlayedDates(history: ReharmHistoryEntry[]): string[] {
  return history.map((h) => h.dateISO).filter(Boolean);
}

/** Unlocked REHARM badge ids across all history (stats drawer badge shelf). */
export function reharmUnlockedBadges(history: ReharmHistoryEntry[]): Set<string> {
  return new Set(history.flatMap((h) => h.badges));
}

/** `isMuted` from REHARM settings, if it exists (used once to seed hub prefs). */
export function reharmMutedSetting(store: SafeStorage): boolean | null {
  const s = store.getJSON<unknown>(REHARM_KEYS.settings);
  if (!s || typeof s !== 'object') return null;
  const m = (s as Record<string, unknown>).isMuted;
  return typeof m === 'boolean' ? m : null;
}
