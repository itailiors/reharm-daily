/** Spoiler-free Combined Share Card (product-notes.md §3). */
import type { CombinedSharePayload, DailyGameRecord } from '../types';

export interface ShareGame {
  name: string;
  shareEmoji: string;
  record: DailyGameRecord;
}

export interface ShareInput {
  puzzleNo: number;
  dateKey: string;
  hubStreak: number;
  hubUrl: string;
  /** Every live daily on today's sheet, in board order (done or not). */
  games: ShareGame[];
}

/** One full-format row: the game's own `shareText`, else "<emoji> NAME: scoreLabel". */
export function shareRow(g: ShareGame): string {
  const own = g.record.shareText?.trim();
  if (own) return own;
  const label = g.record.scoreLabel.trim() || (g.record.score !== null ? String(g.record.score) : 'done');
  return `${g.shareEmoji} ${g.name}: ${label}`;
}

/** Short score for the 1-liner: "91/100 · Top 4%" → "91", "±11ms pocket" → "±11ms". */
export function compactScore(r: DailyGameRecord): string {
  const head = r.scoreLabel.split(' · ')[0]!.trim();
  const frac = /^(-?\d+(?:\.\d+)?)\s*\/\s*\d+$/.exec(head);
  if (frac) return frac[1]!;
  if (head) return head.split(/\s+/)[0]!;
  return r.score !== null ? String(r.score) : '✓';
}

const bareUrl = (url: string): string => url.replace(/^https?:\/\//, '');

export function buildCombinedShare(input: ShareInput): CombinedSharePayload {
  const done = input.games.filter((g) => g.record.status === 'done');
  const total = input.games.length;
  const played = done.length;
  const clean = total > 0 && played === total;
  const left = total - played;

  const head = `🎹 Reharm Daily · #${input.puzzleNo} (${played}/${total}${clean ? (total > 1 ? ' ✓ CLEAN SHEET' : ' ✓') : ''})`;
  const streakTail = clean ? (total === 1 ? ' · Clean Sheet!' : '') : left > 0 ? ` · ${left} left on today's sheet` : '';
  const lines = [
    head,
    ...done.map(shareRow),
    `🔥 Streak: ${input.hubStreak}d${streakTail}`,
    `Play today: ${input.hubUrl}`,
  ];

  const scores = done.map((g) => `${g.name} ${compactScore(g.record)}`).join(' · ');
  const compact = [
    `🎹 Reharm Daily #${input.puzzleNo} — ${played}/${total} ${clean ? '✓ Clean Sheet' : 'played'}${scores ? ` (${scores})` : ''}`,
    `🔥 ${input.hubStreak}d`,
    bareUrl(input.hubUrl),
  ].join(' · ');

  return {
    puzzleNo: input.puzzleNo,
    dateKey: input.dateKey,
    playedCount: played,
    totalLive: total,
    isCleanSheet: clean,
    hubStreak: input.hubStreak,
    fullText: lines.join('\n'),
    compactText: compact,
  };
}
