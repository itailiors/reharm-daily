/** Local-calendar date helpers. The hub resets at local midnight (product-notes.md §2). */

const DAY_MS = 86_400_000;

export function getLocalDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const KEY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDateKey(s: unknown): s is string {
  if (typeof s !== 'string') return false;
  const m = KEY_RE.exec(s);
  if (!m) return false;
  const month = Number(m[2]);
  const day = Number(m[3]);
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

function parts(key: string): [number, number, number] {
  const m = KEY_RE.exec(key);
  if (!m) throw new Error(`Bad date key: ${key}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** Shift a date key by whole calendar days (DST-safe: works on calendar parts, not ms). */
export function addDays(key: string, n: number): string {
  const [y, m, d] = parts(key);
  return getLocalDateKey(new Date(y, m - 1, d + n));
}

/** Whole calendar days from `a` to `b` (b − a). */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = parts(a);
  const [by, bm, bd] = parts(b);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / DAY_MS);
}

/** Hub edition number: epoch day is #1. */
export function puzzleNoFor(todayKey: string, epochKey: string): number {
  return Math.max(1, daysBetween(epochKey, todayKey) + 1);
}

/**
 * Puzzle number for the LOCAL calendar day of `now`, rolling over at local midnight
 * (mirrors Reharm/src/puzzles/index.ts: puzzleNumberForDate). Works on calendar parts,
 * so a 23h or 25h DST day still counts as one day.
 */
export function localPuzzleNumber(now: Date, epochKey: string): number {
  const dayStart = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(1, Math.floor((dayStart - Date.parse(`${epochKey}T00:00:00Z`)) / DAY_MS) + 1);
}

export function msUntilLocalMidnight(now: Date = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(0, next.getTime() - now.getTime());
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Thu, Nov 26" */
export function formatShortDate(key: string): string {
  const [y, m, d] = parts(key);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAY[date.getDay()]}, ${MONTH[m - 1]} ${d}`;
}

/** Single-letter weekday for the 7-day rhythm strip. */
export function weekdayInitial(key: string): string {
  const [y, m, d] = parts(key);
  return WEEKDAY[new Date(y, m - 1, d).getDay()]!.charAt(0);
}
