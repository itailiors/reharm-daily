import '../design/tokens.css';
import './styles/app.css';
import spriteSvg from '../assets/icons/sprite.svg?raw';

import { CATALOG, HUB_URL } from './data/games';
import { playCue, setSoundsEnabled, unlockAudio } from './lib/audio';
import { loadBoard, type BoardSnapshot } from './lib/board';
import { getLocalDateKey } from './lib/dates';
import { WAITLIST_KEY, loadPrefs, savePrefs, toggleWaitlist } from './lib/prefs';
import { reharmMutedSetting } from './lib/reharmAdapter';
import { buildCombinedShare } from './lib/share';
import { SafeStorage } from './lib/storage';
import { STREAK_KEY, emptyStreak } from './lib/streak';
import type { CombinedSharePayload, GameCatalogEntry, HubPrefs } from './types';
import { $, esc, icon, prefersReducedMotion } from './ui/dom';
import {
  bannersHTML,
  boardHTML,
  celebrationHTML,
  countdownNow,
  footerHTML,
  mastheadHTML,
  ritualHTML,
  type ViewState,
} from './ui/render';
import { detailHTML, introHTML, settingsHTML, shareHTML, statsHTML } from './ui/sheets';

/* ================================================================== state */
const store = SafeStorage.browser();
const seedMuted = reharmMutedSetting(store);
let prefs: HubPrefs = loadPrefs(store, seedMuted ? { mutedDefault: true } : undefined);
let snap: BoardSnapshot;
let lastSig = '';
const dismissed = new Set<string>();

type SheetKind = { kind: 'detail'; id: string } | { kind: 'share' } | { kind: 'stats' } | { kind: 'settings' } | { kind: 'intro' };
let sheet: SheetKind | null = null;
let sheetOpener: HTMLElement | null = null;
let shareFormat: 'full' | 'compact' = 'full';
let shareFallback = false;
let resetArmed = false;

const osReducedQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
const emit = <T>(name: string, detail: T) => window.dispatchEvent(new CustomEvent(name, { detail }));

/* ================================================================== prefs */
function applyPrefs(): void {
  const root = document.documentElement;
  if (prefs.theme === 'system') delete root.dataset.theme;
  else root.dataset.theme = prefs.theme;
  if (prefs.reducedMotion) root.dataset.reducedMotion = 'true';
  else delete root.dataset.reducedMotion;
  setSoundsEnabled(prefs.uiSounds && !prefs.mutedDefault);
  $('app').dataset.mutedMode = String(prefs.mutedDefault);
  const meta = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
  const forced = prefs.theme === 'dark' ? '#1C1916' : prefs.theme === 'light' ? '#F6E9C9' : null;
  meta.forEach((m, i) => (m.content = forced ?? (i === 0 ? '#F6E9C9' : '#1C1916')));
}

function setPrefs(patch: Partial<HubPrefs>): void {
  prefs = { ...prefs, ...patch };
  savePrefs(store, prefs);
  applyPrefs();
}

/* ================================================================== render */
function focusKey(el: Element | null): string | null {
  if (!(el instanceof HTMLElement) || !el.dataset.action) return null;
  return `${el.dataset.action}|${el.dataset.id ?? ''}`;
}

function restoreFocus(key: string | null, scope: ParentNode = document): void {
  if (!key) return;
  const [action, id] = key.split('|');
  const sel = `[data-action="${CSS.escape(action!)}"]${id ? `[data-id="${CSS.escape(id)}"]` : ''}`;
  const el = scope.querySelector<HTMLElement>(sel);
  el?.focus({ preventScroll: true });
}

function view(stamping: string[] = []): ViewState {
  return {
    snap,
    prefs,
    storageBlocked: store.blocked,
    offline: typeof navigator !== 'undefined' && navigator.onLine === false,
    dismissed,
    stamping: new Set(stamping),
  };
}

function renderBoard(opts: { stamping?: string[]; streakTick?: boolean; celebrate?: boolean } = {}): void {
  const key = focusKey(document.activeElement);
  const boardHasFocus = $('app').contains(document.activeElement);
  const v = view(opts.stamping);
  const app = $('app');
  app.dataset.roster = snap.total > 1 ? 'full' : 'launch';
  app.dataset.allDone = String(snap.allDone);

  $('banners').innerHTML = bannersHTML(v);
  $('masthead').innerHTML = mastheadHTML(v);
  const ritual = $('ritual');
  ritual.dataset.complete = String(snap.allDone);
  ritual.innerHTML = ritualHTML(v, !!opts.streakTick);
  const cel = $('celebration');
  cel.dataset.visible = String(snap.allDone);
  cel.innerHTML = snap.allDone ? celebrationHTML(v) : '';
  cel.classList.toggle('is-entering', !!opts.celebrate);
  $('board').innerHTML = boardHTML(v);

  // Meter fill: newly done segments start empty and fill on the next frame (motion-spec §2.5).
  const segs = [...ritual.querySelectorAll<HTMLElement>('.meter-seg')];
  const fresh = (opts.stamping ?? [])
    .map((id) => snap.live.findIndex((l) => l.game.id === id))
    .filter((i) => i >= 0)
    .map((i) => segs[i])
    .filter((s): s is HTMLElement => !!s);
  if (fresh.length && !prefersReducedMotion()) {
    fresh.forEach((s) => (s.dataset.segState = 'new'));
    requestAnimationFrame(() => requestAnimationFrame(() => fresh.forEach((s) => (s.dataset.segState = 'done'))));
  }

  if (boardHasFocus) restoreFocus(key, app);
}

function signature(): string {
  return JSON.stringify([
    snap.todayKey,
    snap.live.map((l) => l.record),
    snap.streak,
    snap.waitlist,
    store.blocked,
    navigator.onLine,
    [...dismissed],
    prefs,
  ]);
}

/** Re-read all storage and redraw if anything changed (sync from other tabs / returning from a game). */
function refresh(force = false): void {
  snap = loadBoard(store, CATALOG, new Date());
  const sig = signature();
  const stamping = snap.newlyDone;
  if (!force && sig === lastSig && !stamping.length) return;
  const first = lastSig === '';
  lastSig = sig;

  renderBoard({ stamping, streakTick: snap.streakIncreased, celebrate: snap.newlyClean });
  if (!first) $('board').classList.add('is-settled');

  for (const id of stamping) {
    const rec = snap.live.find((l) => l.game.id === id)?.record;
    emit('daily:stamp-done', { gameId: id, scoreLabel: rec?.scoreLabel ?? '' });
  }
  if (snap.newlyClean) playCue('clean');
  else if (stamping.length) playCue('stamp');
  emit('daily:state-change', { played: snap.played, total: snap.total, isAllDone: snap.allDone });

  if (sheet && sheet.kind !== 'intro') rerenderSheet();
}

/* ================================================================== sheets */
function sharePayload(): CombinedSharePayload {
  return buildCombinedShare({
    puzzleNo: snap.puzzleNo,
    dateKey: snap.todayKey,
    hubStreak: snap.streak.current,
    hubUrl: HUB_URL,
    games: snap.live.map((l) => ({ name: l.game.name, shareEmoji: l.game.shareEmoji, record: l.record })),
  });
}

function sheetHTML(s: SheetKind): string {
  switch (s.kind) {
    case 'detail': {
      const g = CATALOG.games.find((x) => x.id === s.id);
      return g ? detailHTML(snap, g, g.id in snap.waitlist) : '';
    }
    case 'share':
      return shareHTML(sharePayload(), shareFormat, shareFallback);
    case 'stats':
      return statsHTML(snap);
    case 'settings':
      return settingsHTML(prefs, !!osReducedQuery?.matches, store.blocked, resetArmed);
    case 'intro':
      return introHTML(snap);
  }
}

function openSheet(s: SheetKind, opener: HTMLElement | null = null): void {
  const el = $('sheet');
  sheet = s;
  sheetOpener = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  shareFallback = false;
  resetArmed = false;
  el.dataset.kind = s.kind;
  el.className = s.kind === 'detail' ? 'sheet detail-sheet' : s.kind === 'share' ? 'sheet share-modal' : s.kind === 'stats' ? 'sheet stats-drawer' : s.kind === 'settings' ? 'sheet settings-sheet' : 'sheet intro-modal';
  el.innerHTML = sheetHTML(s);
  $('backdrop').dataset.open = 'true';
  el.dataset.open = 'true';
  document.body.classList.add('is-locked');
  $('app').setAttribute('inert', '');
  el.scrollTop = 0;
  const first = el.querySelector<HTMLElement>('.sheet-head [data-action="close-sheet"], .sheet-head [data-action="intro-start"]');
  (s.kind === 'intro' ? el.querySelector<HTMLElement>('.btn-primary') : first)?.focus({ preventScroll: true }) ?? el.focus();
}

function rerenderSheet(): void {
  if (!sheet) return;
  const el = $('sheet');
  const key = focusKey(document.activeElement);
  const scroll = el.scrollTop;
  el.innerHTML = sheetHTML(sheet);
  el.style.animation = 'none';
  el.scrollTop = scroll;
  restoreFocus(key, el);
  if (!el.contains(document.activeElement)) el.focus({ preventScroll: true });
}

function closeSheet(): void {
  if (!sheet) return;
  if (sheet.kind === 'intro' && !prefs.seenIntro) setPrefs({ seenIntro: true });
  sheet = null;
  const el = $('sheet');
  $('backdrop').dataset.open = 'false';
  el.dataset.open = 'false';
  el.style.animation = '';
  el.innerHTML = '';
  document.body.classList.remove('is-locked');
  $('app').removeAttribute('inert');
  const opener = sheetOpener;
  sheetOpener = null;
  if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  else restoreFocus(focusKey(opener));
}

function trapTab(e: KeyboardEvent): void {
  const el = $('sheet');
  const items = [...el.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], textarea, [tabindex]:not([tabindex="-1"])')].filter(
    (n) => n.offsetParent !== null,
  );
  if (!items.length) return;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* ================================================================== toast & veil */
let toastTimer = 0;
function toast(msg: string): void {
  const t = $('toast');
  t.textContent = msg;
  t.dataset.visible = 'true';
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (t.dataset.visible = 'false'), 2800);
}

function hideVeil(): void {
  const veil = $('veil');
  veil.dataset.active = 'false';
  veil.innerHTML = '';
}

function launch(g: GameCatalogEntry, btn: HTMLElement | null): void {
  if (!g.url) return;
  const url = g.url;
  if (navigator.onLine === false && g.status === 'lab') {
    toast("You're offline: Reharm Lab needs a connection unless your browser cached it.");
    return;
  }
  emit('daily:launch-game', { gameId: g.id, url, mutedDefault: prefs.mutedDefault });
  const rm = prefersReducedMotion();
  if (btn) {
    btn.classList.remove('btn-pulse');
    void btn.offsetWidth;
    btn.classList.add('btn-pulse');
  }
  const rec = snap.live.find((l) => l.game.id === g.id)?.record;
  const label = g.status === 'live' ? `${g.name} #${rec?.puzzleNo || snap.puzzleNo}` : g.name;
  window.setTimeout(() => {
    const veil = $('veil');
    veil.innerHTML = `<div class="launch-card">
        <div class="cover-window"><img class="cover-img" src="${g.cover}" alt="" width="480" height="270" /></div>
        <p class="launch-title">Opening ${esc(label)}…</p>
        <p class="launch-sub">${g.status === 'lab' ? 'Practice in Reharm Lab. Your daily streak is safe.' : 'Use your browser’s Back button to return to today’s sheet.'}</p>
        <a class="text-link" href="${esc(url)}" style="justify-content:center">Not opening? Tap here ${icon('external-link')}</a>
      </div>`;
    veil.dataset.active = 'true';
    window.setTimeout(() => window.location.assign(url), rm ? 0 : 200);
  }, rm ? 0 : 80);
}

/* ================================================================== share copy */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  return false;
}

async function copyShare(direct: boolean): Promise<void> {
  if (snap.played === 0) return;
  const p = sharePayload();
  const format = direct ? 'full' : shareFormat;
  const ok = await writeClipboard(format === 'full' ? p.fullText : p.compactText);
  emit('daily:share-copy', { format, success: ok });
  if (ok) {
    playCue('copy');
    if (direct) {
      toast('Combined share card copied!');
      return;
    }
    const btn = document.getElementById('copy-btn');
    if (btn) {
      btn.classList.add('is-copied');
      btn.innerHTML = `${icon('check')}<span>Copied to clipboard!</span>`;
      window.setTimeout(() => {
        if (!btn.isConnected) return;
        btn.classList.remove('is-copied');
        btn.innerHTML = `${icon('copy')}<span>Copy share card</span>`;
      }, 2000);
    }
    return;
  }
  // Clipboard blocked: show a selectable textarea.
  shareFallback = true;
  if (direct || sheet?.kind !== 'share') {
    openSheet({ kind: 'share' });
    shareFallback = true;
    shareFormat = format;
    rerenderSheet();
  } else rerenderSheet();
  const ta = document.getElementById('share-fallback') as HTMLTextAreaElement | null;
  ta?.focus();
  ta?.select();
}

/* ================================================================== actions */
function gameById(id: string | undefined): GameCatalogEntry | undefined {
  return CATALOG.games.find((g) => g.id === id);
}

function onAction(btn: HTMLElement): void {
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  switch (action) {
    case 'detail': {
      if (id) openSheet({ kind: 'detail', id }, btn.closest('.game-card')?.querySelector<HTMLElement>('.card-title-btn') ?? btn);
      break;
    }
    case 'launch': {
      const g = gameById(id);
      if (g) launch(g, btn);
      break;
    }
    case 'bell': {
      const g = gameById(id);
      if (!g) break;
      const { waitlist, enabled } = toggleWaitlist(snap.waitlist, g.id, Date.now());
      store.setJSON(WAITLIST_KEY, waitlist);
      emit('daily:bell-toggle', { gameId: g.id, enabled });
      if (enabled) playCue('bell');
      toast(enabled ? `Saved locally: we'll spotlight ${g.name} on this sheet when it launches.` : `Reminder off for ${g.name}.`);
      refresh(true);
      document.querySelectorAll<HTMLElement>(`[data-action="bell"][data-id="${g.id}"]`).forEach((b) => enabled && b.classList.add('is-ringing'));
      break;
    }
    case 'open-share':
      if (snap.played > 0) openSheet({ kind: 'share' }, btn);
      break;
    case 'share-format':
      shareFormat = id === 'compact' ? 'compact' : 'full';
      shareFallback = false;
      rerenderSheet();
      break;
    case 'copy-share':
      void copyShare(false);
      break;
    case 'copy-share-direct':
      void copyShare(true);
      break;
    case 'open-stats':
      openSheet({ kind: 'stats' }, btn);
      break;
    case 'open-settings':
      openSheet({ kind: 'settings' }, btn);
      break;
    case 'open-intro':
      openSheet({ kind: 'intro' }, btn);
      break;
    case 'close-sheet':
      closeSheet();
      break;
    case 'intro-start':
      setPrefs({ seenIntro: true });
      closeSheet();
      break;
    case 'intro-play': {
      setPrefs({ seenIntro: true });
      const g = gameById(id);
      closeSheet();
      if (g) launch(g, null);
      break;
    }
    case 'dismiss-banner':
      if (id) dismissed.add(id);
      refresh(true);
      $('board').focus({ preventScroll: true });
      break;
    case 'theme':
      if (id === 'system' || id === 'light' || id === 'dark') setPrefs({ theme: id });
      rerenderSheet();
      break;
    case 'muted-default':
      setPrefs({ mutedDefault: id === 'true' });
      toast(prefs.mutedDefault ? 'Muted default saved: silent-friendly games are highlighted.' : 'Sound on by default.');
      refresh(true);
      break;
    case 'toggle-motion':
      setPrefs({ reducedMotion: !prefs.reducedMotion });
      rerenderSheet();
      break;
    case 'toggle-sounds':
      setPrefs({ uiSounds: !prefs.uiSounds });
      unlockAudio();
      if (prefs.uiSounds) playCue('bell');
      rerenderSheet();
      break;
    case 'reset-arm':
      resetArmed = true;
      rerenderSheet();
      ($('sheet').querySelector('[data-action="reset-cancel"]') as HTMLElement | null)?.focus();
      break;
    case 'reset-cancel':
      resetArmed = false;
      rerenderSheet();
      ($('sheet').querySelector('[data-action="reset-arm"]') as HTMLElement | null)?.focus();
      break;
    case 'reset-confirm':
      store.setJSON(STREAK_KEY, { ...emptyStreak(), since: getLocalDateKey() });
      store.remove(WAITLIST_KEY);
      resetArmed = false;
      refresh(true);
      rerenderSheet();
      ($('sheet').querySelector('[data-action="reset-arm"]') as HTMLElement | null)?.focus();
      toast('Hub history reset. Game saves were not touched.');
      break;
  }
}

/* ================================================================== boot */
function injectSprite(): void {
  const host = $('sprite-host');
  host.innerHTML = spriteSvg;
  host.querySelector('svg')?.setAttribute('aria-hidden', 'true');
}

function loadGoatCounter(): void {
  if (!import.meta.env.PROD || !/\.github\.io$/.test(location.hostname)) return;
  const add = () => {
    const s = document.createElement('script');
    s.async = true;
    s.dataset.goatcounter = 'https://reharm-lab.goatcounter.com/count';
    s.src = 'https://gc.zgo.at/count.js';
    document.body.appendChild(s);
  };
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(add, { timeout: 4000 });
  else globalThis.setTimeout(add, 2000);
}

function handleDeepLink(): void {
  const params = new URLSearchParams(location.search);
  const open = params.get('open');
  if (!open) return;
  params.delete('open');
  const qs = params.toString();
  history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  if (open === 'share' && snap.played > 0) openSheet({ kind: 'share' });
  else if (open === 'stats') openSheet({ kind: 'stats' });
  else if (open === 'settings') openSheet({ kind: 'settings' });
}

function boot(): void {
  injectSprite();
  applyPrefs();
  $('footer').innerHTML = footerHTML();
  refresh(true);
  $('app').removeAttribute('aria-busy');

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === $('backdrop')) {
      closeSheet();
      return;
    }
    const btn = target.closest<HTMLElement>('[data-action]');
    if (btn && !(btn as HTMLButtonElement).disabled) onAction(btn);
  });
  document.addEventListener('keydown', (e) => {
    if (!sheet) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
    } else if (e.key === 'Tab') trapTab(e);
  });
  // Unlock Web Audio lazily inside a real gesture.
  document.addEventListener('pointerdown', unlockAudio, { capture: true });
  document.addEventListener('keydown', unlockAudio, { capture: true });

  // Cross-tab and return-to-tab sync (data-contract.md §4).
  window.addEventListener('storage', (e) => {
    if (e.key === null || e.key.startsWith('daily:v1:') || e.key.startsWith('reharm:v1:') || e.key.startsWith('stepwise:')) {
      if (e.key === 'daily:v1:hub:prefs') {
        prefs = loadPrefs(store);
        applyPrefs();
      }
      refresh();
    }
  });
  window.addEventListener('pageshow', (e) => {
    hideVeil();
    if (e.persisted) refresh();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      hideVeil();
      refresh();
    }
  });
  window.addEventListener('online', () => refresh(true));
  window.addEventListener('offline', () => {
    dismissed.delete('offline');
    refresh(true);
  });
  osReducedQuery?.addEventListener?.('change', () => sheet?.kind === 'settings' && rerenderSheet());

  // Midnight countdown + rollover.
  window.setInterval(() => {
    if (getLocalDateKey() !== snap.todayKey) {
      refresh(true);
      return;
    }
    const txt = countdownNow();
    document.querySelectorAll('[data-countdown]').forEach((n) => (n.textContent = txt));
  }, 1000);

  if (!prefs.seenIntro) openSheet({ kind: 'intro' });
  else handleDeepLink();
  loadGoatCounter();
}

boot();
