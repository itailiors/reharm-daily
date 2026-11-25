/** Hub-owned keys (data-contract.md §2): prefs, waitlist, and the "seen" ledger used for stamp detection. */
import type { HubPrefs, ThemeMode, Waitlist } from '../types';
import { isDateKey } from './dates';
import type { SafeStorage } from './storage';

export const PREFS_KEY = 'daily:v1:hub:prefs';
export const WAITLIST_KEY = 'daily:v1:hub:waitlist';
/** Which games the hub has already stamped Done today (so a return visit animates only new ones). */
export const SEEN_KEY = 'daily:v1:hub:seen';

export const DEFAULT_PREFS: HubPrefs = {
  theme: 'system',
  reducedMotion: false,
  mutedDefault: false,
  uiSounds: false,
  seenIntro: false,
};

const THEMES: readonly ThemeMode[] = ['system', 'light', 'dark'];

export function parsePrefs(raw: unknown): HubPrefs {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const bool = (k: keyof HubPrefs, d: boolean) => (typeof o[k] === 'boolean' ? (o[k] as boolean) : d);
  return {
    theme: THEMES.includes(o.theme as ThemeMode) ? (o.theme as ThemeMode) : 'system',
    reducedMotion: bool('reducedMotion', false),
    mutedDefault: bool('mutedDefault', false),
    uiSounds: bool('uiSounds', false),
    seenIntro: bool('seenIntro', false),
    bannerDismissedDate: isDateKey(o.bannerDismissedDate) ? o.bannerDismissedDate : undefined,
  };
}

export function loadPrefs(store: SafeStorage, seed?: { mutedDefault?: boolean }): HubPrefs {
  const raw = store.getJSON(PREFS_KEY);
  if (raw === null && seed) return { ...DEFAULT_PREFS, ...seed }; // never overrides an explicit hub choice
  return parsePrefs(raw);
}

export function savePrefs(store: SafeStorage, p: HubPrefs): void {
  store.setJSON(PREFS_KEY, p);
}

export function parseWaitlist(raw: unknown): Waitlist {
  if (!raw || typeof raw !== 'object') return {};
  const out: Waitlist = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (v === true) out[k] = 0; // tolerate older boolean shape
  }
  return out;
}

export function toggleWaitlist(w: Waitlist, gameId: string, now: number): { waitlist: Waitlist; enabled: boolean } {
  const next = { ...w };
  if (gameId in next) {
    delete next[gameId];
    return { waitlist: next, enabled: false };
  }
  next[gameId] = now;
  return { waitlist: next, enabled: true };
}

export interface SeenLedger {
  dateKey: string;
  done: string[];
  clean: boolean;
}

export function parseSeen(raw: unknown, todayKey: string): SeenLedger {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null;
  if (!o || o.dateKey !== todayKey) return { dateKey: todayKey, done: [], clean: false };
  return {
    dateKey: todayKey,
    done: Array.isArray(o.done) ? o.done.filter((x): x is string => typeof x === 'string') : [],
    clean: o.clean === true,
  };
}
