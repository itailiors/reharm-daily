import { describe, expect, it } from 'vitest';
import { currentStreak, emptyStreak, lastSevenDays, parseStreak, updateStreak } from '../src/lib/streak';
import type { HubStreak } from '../src/types';

/** Simulate one hub visit per day with the given tally. */
function playDays(days: Array<[string, number, number]>, start: HubStreak = emptyStreak()): HubStreak {
  return days.reduce((s, [todayKey, played, total]) => updateStreak(s, { todayKey, played, total }), start);
}

describe('hub streak', () => {
  it('increments on consecutive days with at least one live daily done', () => {
    const s = playDays([
      ['2026-11-25', 1, 7],
      ['2026-11-26', 2, 7],
      ['2026-11-27', 1, 7],
    ]);
    expect(s.current).toBe(3);
    expect(s.longest).toBe(3);
    expect(s.lastPlayedDate).toBe('2026-11-27');
  });

  it('stays alive through today until midnight, then breaks after a missed day', () => {
    const s = playDays([['2026-11-25', 1, 1], ['2026-11-26', 1, 1]]);
    // Next day, nothing played yet: yesterday still counts.
    const morning = updateStreak(s, { todayKey: '2026-11-27', played: 0, total: 1 });
    expect(morning.current).toBe(2);
    // A whole day missed: streak gone, longest remembered.
    const later = updateStreak(s, { todayKey: '2026-11-28', played: 0, total: 1 });
    expect(later.current).toBe(0);
    expect(later.longest).toBe(2);
    const restart = updateStreak(later, { todayKey: '2026-11-28', played: 1, total: 1 });
    expect(restart.current).toBe(1);
  });

  it('does not record a day where nothing was played', () => {
    const s = updateStreak(emptyStreak(), { todayKey: '2026-11-25', played: 0, total: 1 });
    expect(s.recentDays).toEqual({});
  });

  it('is idempotent across repeated refreshes of the same day', () => {
    const once = updateStreak(emptyStreak(), { todayKey: '2026-11-25', played: 1, total: 1 });
    const twice = updateStreak(once, { todayKey: '2026-11-25', played: 1, total: 1 });
    expect(twice).toEqual(once);
    expect(twice.cleanSheets).toBe(1);
  });

  it('back-fills days REHARM was played without opening the hub', () => {
    const s = updateStreak(emptyStreak(), {
      todayKey: '2026-11-28',
      played: 1,
      total: 1,
      extraPlayedDates: ['2026-11-26', '2026-11-27', '2026-11-29' /* future (UTC ahead): ignored */],
    });
    expect(s.current).toBe(3);
    expect(s.recentDays['2026-11-29']).toBeUndefined();
  });

  it('ignores back-fill before a reset', () => {
    const reset: HubStreak = { ...emptyStreak(), since: '2026-11-28' };
    const s = updateStreak(reset, { todayKey: '2026-11-28', played: 1, total: 1, extraPlayedDates: ['2026-11-27'] });
    expect(s.current).toBe(1);
  });
});

describe('Clean Sheet', () => {
  it('is awarded when every live daily is done (launch roster 1/1)', () => {
    const s = playDays([['2026-11-25', 1, 1]]);
    expect(s.cleanSheets).toBe(1);
    expect(s.recentDays['2026-11-25']).toEqual({ played: 1, total: 1, clean: true });
  });

  it('is not awarded for a partial day on a full roster, but the streak still counts', () => {
    const s = playDays([['2026-11-25', 3, 7]]);
    expect(s.cleanSheets).toBe(0);
    expect(s.current).toBe(1);
  });

  it('is awarded once when a day becomes complete later in the day', () => {
    let s = updateStreak(emptyStreak(), { todayKey: '2026-11-25', played: 3, total: 7 });
    s = updateStreak(s, { todayKey: '2026-11-25', played: 7, total: 7 });
    s = updateStreak(s, { todayKey: '2026-11-25', played: 7, total: 7 });
    expect(s.cleanSheets).toBe(1);
  });

  it('accumulates across days', () => {
    const s = playDays([
      ['2026-11-25', 1, 1],
      ['2026-11-26', 1, 1],
      ['2026-11-27', 1, 2],
    ]);
    expect(s.cleanSheets).toBe(2);
  });

  it('never counts a zero-game day as clean', () => {
    const s = updateStreak(emptyStreak(), { todayKey: '2026-11-25', played: 0, total: 0 });
    expect(s.cleanSheets).toBe(0);
  });
});

describe('streak parsing & helpers', () => {
  it('survives corrupt payloads', () => {
    expect(parseStreak('{nope')).toEqual(emptyStreak());
    expect(parseStreak({ current: -3, recentDays: { bad: {}, '2026-11-25': { played: 1, total: 1, clean: true } } }).recentDays).toEqual({
      '2026-11-25': { played: 1, total: 1, clean: true },
    });
  });

  it('computes current streak from a day map', () => {
    const days = { '2026-11-24': { played: 1, total: 1, clean: true }, '2026-11-25': { played: 1, total: 1, clean: true } };
    expect(currentStreak(days, '2026-11-25')).toBe(2);
    expect(currentStreak(days, '2026-11-26')).toBe(2);
    expect(currentStreak(days, '2026-11-27')).toBe(0);
  });

  it('lists the last 7 days oldest first', () => {
    const week = lastSevenDays({}, '2026-11-26');
    expect(week.map((d) => d.key)).toEqual([
      '2026-11-20', '2026-11-21', '2026-11-22', '2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26',
    ]);
  });
});
