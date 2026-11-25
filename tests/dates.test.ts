import { describe, expect, it } from 'vitest';
import {
  addDays,
  daysBetween,
  formatCountdown,
  getLocalDateKey,
  msUntilLocalMidnight,
  puzzleNoFor,
  utcPuzzleNumber,
} from '../src/lib/dates';
import { parseGameRecord, resolveForToday } from '../src/lib/records';

describe('local date keys', () => {
  it('formats the local calendar day, not UTC', () => {
    expect(getLocalDateKey(new Date(2026, 10, 26, 23, 59, 59))).toBe('2026-11-26');
    expect(getLocalDateKey(new Date(2026, 10, 27, 0, 0, 0))).toBe('2026-11-27');
    expect(getLocalDateKey(new Date(2027, 0, 5))).toBe('2027-01-05');
  });

  it('rolls over at local midnight', () => {
    const before = new Date(2026, 10, 26, 23, 59, 59, 999);
    const after = new Date(before.getTime() + 1);
    expect(getLocalDateKey(before)).not.toBe(getLocalDateKey(after));
    expect(getLocalDateKey(after)).toBe(addDays(getLocalDateKey(before), 1));
  });

  it('adds days across month, year and leap boundaries', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('counts whole days between keys', () => {
    expect(daysBetween('2026-11-25', '2026-11-25')).toBe(0);
    expect(daysBetween('2026-11-25', '2027-01-03')).toBe(39);
    expect(daysBetween('2026-11-26', '2026-11-25')).toBe(-1);
  });

  it('numbers editions from the epoch (#1 on launch day, never below 1)', () => {
    expect(puzzleNoFor('2026-11-25', '2026-11-25')).toBe(1);
    expect(puzzleNoFor('2026-11-26', '2026-11-25')).toBe(2);
    expect(puzzleNoFor('2026-01-01', '2026-11-25')).toBe(1);
  });

  it('matches REHARM’s UTC puzzle numbering', () => {
    expect(utcPuzzleNumber(new Date(Date.UTC(2026, 10, 25, 0, 0)), '2026-11-25')).toBe(1);
    expect(utcPuzzleNumber(new Date(Date.UTC(2026, 10, 26, 23, 59)), '2026-11-25')).toBe(2);
  });

  it('counts down to local midnight', () => {
    expect(msUntilLocalMidnight(new Date(2026, 10, 26, 23, 0, 0))).toBe(3_600_000);
    expect(formatCountdown(3_600_000 + 61_000)).toBe('01:01:01');
    expect(formatCountdown(-5)).toBe('00:00:00');
  });
});

describe('stale-day rule', () => {
  const rec = (over: Record<string, unknown>) =>
    parseGameRecord({ v: 1, gameId: 'stepwise', dateKey: '2026-11-25', puzzleNo: 1, status: 'done', score: 3, scoreLabel: '3 moves', streak: 4, bestScore: 2, playedCount: 9, updatedAt: 1, ...over }, 'stepwise');

  it("keeps today's record as-is", () => {
    const r = resolveForToday(rec({}), 'stepwise', '2026-11-25', 1);
    expect(r.status).toBe('done');
  });

  it('turns a record from yesterday into "new" today but keeps the streak alive', () => {
    const r = resolveForToday(rec({}), 'stepwise', '2026-11-26', 2);
    expect(r).toMatchObject({ status: 'new', streak: 4, bestScore: 2, playedCount: 9, dateKey: '2026-11-26', puzzleNo: 2 });
  });

  it('resets the streak when the last finish was two or more days ago', () => {
    expect(resolveForToday(rec({}), 'stepwise', '2026-11-27', 3).streak).toBe(0);
  });

  it('resets the streak when yesterday was only in progress', () => {
    expect(resolveForToday(rec({ status: 'in_progress' }), 'stepwise', '2026-11-26', 2).streak).toBe(0);
  });

  it('isolates corrupt records to null', () => {
    expect(parseGameRecord({ v: 2 }, 'x')).toBeNull();
    expect(parseGameRecord({ v: 1, dateKey: 'yesterday', status: 'done' }, 'x')).toBeNull();
    expect(parseGameRecord({ v: 1, gameId: 'other', dateKey: '2026-11-25', status: 'done' }, 'x')).toBeNull();
    expect(parseGameRecord('nope', 'x')).toBeNull();
  });
});
