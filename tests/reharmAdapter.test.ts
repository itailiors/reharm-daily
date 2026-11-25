import { describe, expect, it } from 'vitest';
import { loadBoard } from '../src/lib/board';
import { getLocalDateKey } from '../src/lib/dates';
import {
  readReharmHistory,
  readReharmToday,
  reharmMutedSetting,
  reharmStreak,
  synthesizeReharmRecord,
} from '../src/lib/reharmAdapter';
import { SafeStorage, memoryBackend } from '../src/lib/storage';
import type { DailyCatalog } from '../src/types';

// Noon UTC on 2026-11-27 → REHARM puzzle #3 (epoch 2026-11-25 = #1).
const NOW = new Date(Date.UTC(2026, 10, 27, 12, 0, 0));
const TODAY = '2026-11-27';

function entry(n: number, dateISO: string, total: number, badges: string[] = [], tier = 'deep-reharm') {
  return { puzzleNumber: n, dateISO, symbols: ['C', 'F', 'G', 'C'], total, rarity: 50, melodyColor: 10, bassFlow: 10, tier, percentileLabel: 'Top 4% Spice', badges, barTiers: [] };
}

function storeWith(seed: Record<string, unknown>): { store: SafeStorage; raw: Record<string, string> } {
  const raw = Object.fromEntries(Object.entries(seed).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)]));
  const backend = memoryBackend(raw);
  return { store: new SafeStorage(backend), raw: { ...raw } };
}

describe('reharm:v1:* adapter', () => {
  it('synthesizes a Done record from history for REHARM’s current puzzle', () => {
    const { store } = storeWith({
      'reharm:v1:history': { 1: entry(1, '2026-11-25', 70), 2: entry(2, '2026-11-26', 96), 3: entry(3, TODAY, 91, ['smooth-bass', 'tritone-sub']) },
    });
    const r = synthesizeReharmRecord(store, TODAY, NOW)!;
    expect(r).toMatchObject({
      gameId: 'reharm',
      status: 'done',
      puzzleNo: 3,
      score: 91,
      scoreLabel: '91/100 · Top 4% Spice',
      tierIcon: '▲',
      shareText: '🎛️ REHARM: 91/100 · ▲ Top 4% Spice',
      streak: 3,
      bestScore: 96,
      playedCount: 3,
      labMove: { slug: 'tritone-sub', label: 'Tritone Sub' },
    });
  });

  it('maps modal-borrow to the modal-interchange Lab move', () => {
    const { store } = storeWith({ 'reharm:v1:history': { 3: entry(3, TODAY, 80, ['modal-borrow'], 'modal-interchange') } });
    expect(synthesizeReharmRecord(store, TODAY, NOW)!.labMove).toEqual({ slug: 'modal-interchange', label: 'Modal Interchange' });
  });

  it('reports In Progress from a draft for today’s puzzle (locked bar is null)', () => {
    const { store } = storeWith({ 'reharm:v1:draft': { puzzleNumber: 3, symbols: [null, 'Dm7', null, 'G7'] } });
    const r = synthesizeReharmRecord(store, TODAY, NOW)!;
    expect(r).toMatchObject({ status: 'in_progress', progressLabel: '2/3 bars', score: null });
  });

  it('ignores an empty or stale draft', () => {
    expect(synthesizeReharmRecord(storeWith({ 'reharm:v1:draft': { puzzleNumber: 3, symbols: [null, null, null, null] } }).store, TODAY, NOW)).toBeNull();
    expect(synthesizeReharmRecord(storeWith({ 'reharm:v1:draft': { puzzleNumber: 2, symbols: [null, 'C', 'F', 'G'] } }).store, TODAY, NOW)).toBeNull();
  });

  it('returns "new" with lifetime stats when only older puzzles were played', () => {
    const { store } = storeWith({ 'reharm:v1:history': { 2: entry(2, '2026-11-26', 64) } });
    const r = synthesizeReharmRecord(store, TODAY, NOW)!;
    expect(r).toMatchObject({ status: 'new', streak: 1, bestScore: 64, playedCount: 1 });
  });

  it('returns null when REHARM has never been played', () => {
    expect(synthesizeReharmRecord(storeWith({}).store, TODAY, NOW)).toBeNull();
  });

  it('survives corrupt payloads without throwing', () => {
    const { store } = storeWith({
      'reharm:v1:history': '{not json',
      'reharm:v1:draft': '[1,2',
      'reharm:v1:settings': 'null',
    });
    expect(readReharmHistory(store)).toEqual([]);
    expect(synthesizeReharmRecord(store, TODAY, NOW)).toBeNull();
    expect(reharmMutedSetting(store)).toBeNull();
  });

  it('drops malformed history entries individually', () => {
    const { store } = storeWith({ 'reharm:v1:history': { 1: { puzzleNumber: 'x' }, 2: null, 3: entry(3, TODAY, 88) } });
    expect(readReharmHistory(store).map((h) => h.puzzleNumber)).toEqual([3]);
  });

  it('prefers a native daily:v1:reharm record for today', () => {
    const { store } = storeWith({
      'daily:v1:reharm': { v: 1, gameId: 'reharm', dateKey: TODAY, puzzleNo: 3, status: 'done', score: 99, scoreLabel: '99/100', streak: 7, updatedAt: 1 },
      'reharm:v1:history': { 3: entry(3, TODAY, 91) },
    });
    expect(readReharmToday(store, TODAY, NOW)!.score).toBe(99);
  });

  it('falls back to the adapter when the native record is from another day', () => {
    const { store } = storeWith({
      'daily:v1:reharm': { v: 1, gameId: 'reharm', dateKey: '2026-11-20', puzzleNo: 1, status: 'done', score: 99, scoreLabel: '99/100', streak: 7, updatedAt: 1 },
      'reharm:v1:history': { 3: entry(3, TODAY, 91) },
    });
    expect(readReharmToday(store, TODAY, NOW)!.score).toBe(91);
  });

  it('never writes to reharm:v1:* keys', () => {
    const seed = {
      'reharm:v1:history': { 3: entry(3, TODAY, 91) },
      'reharm:v1:draft': { puzzleNumber: 3, symbols: [null, 'C', null, null] },
      'reharm:v1:settings': { isMuted: true, theme: 'dark' },
    };
    const backend = memoryBackend(Object.fromEntries(Object.entries(seed).map(([k, v]) => [k, JSON.stringify(v)])));
    const before = Object.fromEntries(Object.keys(seed).map((k) => [k, backend.getItem(k)]));
    const store = new SafeStorage(backend);
    const catalog: DailyCatalog = {
      hub: { name: 'Reharm Daily', url: 'x', epoch: '2026-11-25' },
      lab: { name: 'Lab', url: 'x' },
      games: [
        { id: 'reharm', name: 'REHARM', status: 'live', cover: '', shareEmoji: '🎛️', pitch: '', archetype: '', estMinutes: 3, mutedFriendly: 'partly', mutedLabel: '', mutedNote: '', scoreUnit: '', howToPlay: ['', '', ''] },
      ],
    };
    loadBoard(store, catalog, NOW);
    expect(reharmMutedSetting(store)).toBe(true);
    for (const k of Object.keys(seed)) expect(backend.getItem(k)).toBe(before[k]);
  });

  it('computes REHARM’s own streak (today or yesterday still open)', () => {
    const h = [1, 2, 3].map((n) => ({ puzzleNumber: n, dateISO: '', total: 1, badges: [] }));
    expect(reharmStreak(h, 3)).toBe(3);
    expect(reharmStreak(h, 4)).toBe(3);
    expect(reharmStreak(h, 5)).toBe(0);
  });
});

describe('board integration', () => {
  const catalog: DailyCatalog = {
    hub: { name: 'Reharm Daily', url: 'x', epoch: '2026-11-25' },
    lab: { name: 'Lab', url: 'x' },
    games: [
      { id: 'reharm', name: 'REHARM', status: 'live', cover: '', shareEmoji: '🎛️', pitch: '', archetype: '', estMinutes: 3, mutedFriendly: 'partly', mutedLabel: '', mutedNote: '', scoreUnit: '', howToPlay: ['', '', ''] },
      { id: 'stepwise', name: 'STEPWISE', status: 'planned', cover: '', shareEmoji: '🪜', pitch: '', archetype: '', estMinutes: 2, mutedFriendly: 'yes', mutedLabel: '', mutedNote: '', scoreUnit: '', howToPlay: ['', '', ''] },
      { id: 'make-the-changes', name: 'Make the Changes', status: 'lab', url: 'x', cover: '', shareEmoji: '🎹', pitch: '', archetype: '', estMinutes: 5, mutedFriendly: 'no', mutedLabel: '', mutedNote: '', scoreUnit: '', howToPlay: ['', '', ''] },
    ],
  };

  it('shows a REHARM play immediately, stamps it once, and awards the launch-day Clean Sheet', () => {
    const backend = memoryBackend();
    const store = new SafeStorage(backend);
    const now = new Date(2026, 10, 27, 12, 0, 0); // local noon
    const first = loadBoard(store, catalog, now);
    expect(first.played).toBe(0);
    expect(first.total).toBe(1); // planned + lab never enter the denominator

    const n = first.live[0]!.record.puzzleNo;
    backend.setItem('reharm:v1:history', JSON.stringify({ [n]: entry(n, getLocalDateKey(now), 91) }));
    const second = loadBoard(store, catalog, now);
    expect(second.played).toBe(1);
    expect(second.allDone).toBe(true);
    expect(second.newlyDone).toEqual(['reharm']);
    expect(second.newlyClean).toBe(true);
    expect(second.streak.current).toBe(1);
    expect(second.streak.cleanSheets).toBe(1);

    const third = loadBoard(store, catalog, now);
    expect(third.newlyDone).toEqual([]);
    expect(third.newlyClean).toBe(false);
    expect(third.streak.cleanSheets).toBe(1);
  });

  it('keeps working when storage is blocked', () => {
    const store = new SafeStorage(null);
    const snap = loadBoard(store, catalog, new Date(2026, 10, 27, 12));
    expect(snap.total).toBe(1);
    expect(store.blocked).toBe(true);
  });
});
