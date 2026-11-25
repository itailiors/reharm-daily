import { describe, expect, it } from 'vitest';
import { buildCombinedShare, compactScore, shareRow, type ShareGame } from '../src/lib/share';
import type { DailyGameRecord } from '../src/types';

const URL = 'https://itailiors.github.io/reharm-daily/';

function rec(gameId: string, over: Partial<DailyGameRecord> = {}): DailyGameRecord {
  return { v: 1, gameId, dateKey: '2026-11-25', puzzleNo: 42, status: 'new', score: null, scoreLabel: '', streak: 0, updatedAt: 0, ...over };
}

const reharmDone: ShareGame = {
  name: 'REHARM',
  shareEmoji: '🎛️',
  record: rec('reharm', { status: 'done', score: 91, scoreLabel: '91/100 · Top 4% Spice', shareText: '🎛️ REHARM: 91/100 · ▲ Top 4% Spice' }),
};

describe('combined share card', () => {
  it('formats Example A: launch day 1/1 Clean Sheet', () => {
    const p = buildCombinedShare({ puzzleNo: 42, dateKey: '2026-11-25', hubStreak: 5, hubUrl: URL, games: [reharmDone] });
    expect(p.fullText).toBe(
      ['🎹 Reharm Daily · #42 (1/1 ✓)', '🎛️ REHARM: 91/100 · ▲ Top 4% Spice', '🔥 Streak: 5d · Clean Sheet!', `Play today: ${URL}`].join('\n'),
    );
    expect(p).toMatchObject({ playedCount: 1, totalLive: 1, isCleanSheet: true, hubStreak: 5 });
  });

  it('formats Example B: mid-day 3/7, only finished games listed, no spoilers for others', () => {
    const games: ShareGame[] = [
      { ...reharmDone, record: { ...reharmDone.record, shareText: '🎛️ REHARM: 88/100 · ◐ Modal', scoreLabel: '88/100 · Modal', score: 88 } },
      { name: 'CHORD TRENCH', shareEmoji: '🌊', record: rec('chord-trench', { status: 'in_progress', progressLabel: 'Round 3/6' }) },
      { name: 'STEPWISE', shareEmoji: '🪜', record: rec('stepwise', { status: 'done', score: 3, scoreLabel: '3 moves (PAR)', shareText: '🪜 STEPWISE: 3 moves (PAR)' }) },
      { name: 'QUARTET', shareEmoji: '🎼', record: rec('quartet') },
      { name: 'MEND', shareEmoji: '🩺', record: rec('mend') },
      { name: 'BARLINE', shareEmoji: '🥁', record: rec('barline', { status: 'done', score: 11, scoreLabel: '±11ms pocket' }) },
      { name: 'TAVDLE', shareEmoji: '🎵', record: rec('tavdle') },
    ];
    const p = buildCombinedShare({ puzzleNo: 88, dateKey: '2026-11-25', hubStreak: 9, hubUrl: URL, games });
    expect(p.fullText).toBe(
      [
        '🎹 Reharm Daily · #88 (3/7)',
        '🎛️ REHARM: 88/100 · ◐ Modal',
        '🪜 STEPWISE: 3 moves (PAR)',
        '🥁 BARLINE: ±11ms pocket',
        "🔥 Streak: 9d · 4 left on today's sheet",
        `Play today: ${URL}`,
      ].join('\n'),
    );
    expect(p.compactText).toBe(
      '🎹 Reharm Daily #88 — 3/7 played (REHARM 88 · STEPWISE 3 · BARLINE ±11ms) · 🔥 9d · itailiors.github.io/reharm-daily/',
    );
    expect(p.isCleanSheet).toBe(false);
    expect(p.fullText).not.toContain('Round 3/6');
  });

  it('marks a full-roster Clean Sheet in the header', () => {
    const games: ShareGame[] = [reharmDone, { name: 'STEPWISE', shareEmoji: '🪜', record: rec('stepwise', { status: 'done', scoreLabel: 'Par -1 (Eagle)' }) }];
    const p = buildCombinedShare({ puzzleNo: 120, dateKey: '2026-11-25', hubStreak: 14, hubUrl: URL, games });
    expect(p.fullText.split('\n')[0]).toBe('🎹 Reharm Daily · #120 (2/2 ✓ CLEAN SHEET)');
    expect(p.fullText).toContain('🪜 STEPWISE: Par -1 (Eagle)');
    expect(p.fullText).toContain('🔥 Streak: 14d\n');
    expect(p.compactText.startsWith('🎹 Reharm Daily #120 — 2/2 ✓ Clean Sheet (REHARM 91 · STEPWISE Par)')).toBe(true);
  });

  it('builds a row from emoji + name + label when a game sends no shareText', () => {
    expect(shareRow({ name: 'MEND', shareEmoji: '🩺', record: rec('mend', { status: 'done', scoreLabel: '4/4 restored' }) })).toBe('🩺 MEND: 4/4 restored');
    expect(shareRow({ name: 'MEND', shareEmoji: '🩺', record: rec('mend', { status: 'done', score: 7 }) })).toBe('🩺 MEND: 7');
  });

  it('compacts score labels', () => {
    expect(compactScore(rec('a', { scoreLabel: '91/100 · Top 4%' }))).toBe('91');
    expect(compactScore(rec('a', { scoreLabel: '512m / 600m' }))).toBe('512m');
    expect(compactScore(rec('a', { scoreLabel: '', score: 5 }))).toBe('5');
    expect(compactScore(rec('a'))).toBe('✓');
  });
});
