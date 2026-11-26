/** Dialog bodies: game detail, share, stats, settings, first-visit intro. */
import { labMoveUrl } from '../data/games';
import type { BoardSnapshot } from '../lib/board';
import { weekdayInitial, formatShortDate } from '../lib/dates';
import { lastSevenDays } from '../lib/streak';
import type { CombinedSharePayload, DailyGameRecord, GameCatalogEntry, HubPrefs } from '../types';
import { esc, icon } from './dom';
import { logoPair, mutedPill, statusPill, timePill } from './render';

const badgeUrls = import.meta.glob('../../reference/reharm-game/assets/badges/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const BADGES: Array<{ id: string; label: string }> = [
  { id: 'tritone-sub', label: 'Tritone Sub' },
  { id: 'backdoor-dominant', label: 'Backdoor Dom' },
  { id: 'modal-borrow', label: 'Modal Borrow' },
  { id: 'chromatic-mediant', label: 'Chrom. Mediant' },
  { id: 'sharp11-melody', label: '#11 Melody' },
  { id: 'smooth-bass', label: 'Smooth Bass' },
  { id: 'radio-safe', label: 'Radio Safe' },
  { id: 'jazz-trench', label: 'Jazz Trench' },
];

function badgeUrl(id: string): string {
  return badgeUrls[`../../reference/reharm-game/assets/badges/${id}.svg`] ?? '';
}

function sheetHead(title: string, sub = ''): string {
  return `<div class="sheet-handle" aria-hidden="true"></div>
    <div class="sheet-head">
      <div><h2 class="sheet-title" id="sheet-title">${esc(title)}</h2>${sub ? `<p class="sheet-sub">${esc(sub)}</p>` : ''}</div>
      <button class="icon-btn" type="button" data-action="close-sheet" aria-label="Close">${icon('close', 'ico')}</button>
    </div>`;
}

export function formatBest(g: GameCatalogEntry, best: number | null | undefined): string {
  if (best === null || best === undefined) return '—';
  return g.id === 'reharm' ? `${best}/100` : String(best);
}

function statTiles(g: GameCatalogEntry, r: DailyGameRecord): string {
  return `<div class="kpi-grid is-three">
    <div class="kpi-tile"><div class="kpi-val">${r.playedCount ?? 0}</div><div class="kpi-lbl">Played</div></div>
    <div class="kpi-tile"><div class="kpi-val">${r.streak}d</div><div class="kpi-lbl">Streak</div></div>
    <div class="kpi-tile"><div class="kpi-val">${esc(formatBest(g, r.bestScore))}</div><div class="kpi-lbl">Best</div></div>
  </div>`;
}

export function labChipHTML(move: { slug: string; label: string }): string {
  return `<a class="daily-lab-chip" href="${esc(labMoveUrl(move.slug))}">
    <span class="daily-lab-chip-main"><span class="daily-lab-chip-mark" aria-hidden="true">RL</span>
      <span><span class="daily-lab-chip-title">Learn ${esc(move.label)}</span><br /><span class="daily-lab-chip-sub">Practice this move in Reharm Lab</span></span></span>
    <span class="daily-lab-chip-go">Open Lab ↗</span>
  </a>`;
}

/* ------------------------------------------------------------------ detail */
export function detailHTML(snap: BoardSnapshot, g: GameCatalogEntry, waitlisted: boolean): string {
  const live = snap.live.find((l) => l.game.id === g.id);
  const r = live?.record ?? null;
  const title = g.status === 'live' && r ? `${g.name} #${r.puzzleNo || snap.puzzleNo}` : g.name;

  const how = g.howToPlay.map((s, i) => `<li><span class="how-num" aria-hidden="true">${i + 1}</span><span>${esc(s)}</span></li>`).join('');
  const parts: string[] = [
    sheetHead(title, g.archetype),
    `<div class="cover-window"><img class="cover-img" src="${g.cover}" alt="" width="480" height="270" /></div>`,
    `<div class="badge-row">${statusPill(g, r, waitlisted)}${timePill(g)}${mutedPill(g)}<span class="pill pill-neutral">${esc(g.scoreUnit)}</span></div>`,
    `<p class="sheet-sub">${esc(g.mutedNote)}</p>`,
    `<div class="sheet-section"><h3 class="sheet-label">How to play</h3><ol class="how-list">${how}</ol></div>`,
  ];

  if (g.status === 'live' && r) {
    if (r.status === 'done') {
      parts.push(`<div class="sheet-section"><h3 class="sheet-label">Today</h3><p class="today-result">${icon('check-stamp', 'ico')}${esc(r.scoreLabel || 'Done')}</p></div>`);
      if (r.labMove) parts.push(labChipHTML(r.labMove));
    } else if (r.status === 'in_progress') {
      parts.push(`<div class="status-note">In progress: ${esc(r.progressLabel || r.scoreLabel)}. Pick up where you left off.</div>`);
    }
    parts.push(`<div class="sheet-section"><h3 class="sheet-label">Your stats</h3>${statTiles(g, r)}</div>`);
    const cta = r.status === 'done' ? 'Hear &amp; compare' : r.status === 'in_progress' ? 'Resume' : 'Play now';
    parts.push(`<div class="sheet-actions"><button class="btn-primary btn-lg btn-block" type="button" data-action="launch" data-id="${g.id}">${icon('play')}<span>${cta}</span></button>
      ${g.archiveUrl ? `<a class="text-link" href="${esc(g.archiveUrl)}">Archive ${icon('arrow-right')}</a>` : ''}</div>`);
  } else if (g.status === 'planned') {
    parts.push(`<div class="status-note">In design and build. No account needed: turn on a local reminder and it will be highlighted here on launch day.</div>`);
    parts.push(`<div class="sheet-actions">
      <button class="btn-primary btn-lg btn-block bell-btn" type="button" data-action="bell" data-id="${g.id}" aria-pressed="${waitlisted}">${icon(waitlisted ? 'bell-check' : 'bell')}<span>${waitlisted ? 'Reminder on (tap to turn off)' : 'Notify me on this device'}</span></button>
      <button class="btn-secondary btn-block" type="button" data-action="close-sheet">Close</button></div>`);
  } else {
    parts.push(`<div class="status-note">Practice only: it never expires at midnight and never touches your daily streak.</div>`);
    parts.push(`<div class="sheet-actions"><button class="btn-primary btn-lg btn-block" type="button" data-action="launch" data-id="${g.id}">${icon('external-link')}<span>Open in Reharm Lab</span></button></div>`);
  }
  return parts.join('');
}

/* ------------------------------------------------------------------ share */
export function shareHTML(p: CombinedSharePayload, format: 'full' | 'compact', fallback: boolean): string {
  const text = format === 'full' ? p.fullText : p.compactText;
  return `${sheetHead("Today's share card", 'Spoiler-free: scores only, never your chords.')}
    <div class="segmented" role="radiogroup" aria-label="Share format">
      <button class="seg-btn" type="button" role="radio" aria-checked="${format === 'full'}" data-action="share-format" data-id="full">Full sheet</button>
      <button class="seg-btn" type="button" role="radio" aria-checked="${format === 'compact'}" data-action="share-format" data-id="compact">Compact 1-liner</button>
    </div>
    <pre class="share-preview" data-format="${format}" aria-label="Share card preview">${esc(text)}</pre>
    ${fallback ? `<label class="sheet-section"><span class="sheet-label">Press Ctrl/Cmd + C to copy</span><textarea class="share-fallback" id="share-fallback" readonly>${esc(text)}</textarea></label>` : ''}
    <div class="sheet-actions"><button class="btn-primary btn-lg btn-block" type="button" data-action="copy-share" id="copy-btn">${icon('copy')}<span>Copy share card</span></button></div>`;
}

/* ------------------------------------------------------------------ stats */
export function statsHTML(snap: BoardSnapshot): string {
  const s = snap.streak;
  const totalPuzzles = snap.live.reduce((n, l) => n + (l.record.playedCount ?? 0), 0);
  const week = lastSevenDays(s.recentDays, snap.todayKey).map(({ key, tally }) => {
    const hit = (tally?.played ?? 0) > 0;
    const clean = !!tally?.clean;
    const label = `${formatShortDate(key)}: ${clean ? 'Clean Sheet' : hit ? 'played' : 'not played'}`;
    return `<li class="day-cell${hit ? ' is-hit' : ''}${clean ? ' is-clean' : ''}${key === snap.todayKey ? ' is-today' : ''}" aria-label="${esc(label)}">
      <span aria-hidden="true">${weekdayInitial(key)}</span><span aria-hidden="true">${hit ? icon('check') : '–'}</span></li>`;
  }).join('');

  const rows = snap.live.map((l) => `<tr><th scope="row" style="text-transform:none;font-family:var(--font-sans);font-size:13px;color:var(--text-primary)">${esc(l.game.name)}</th>
      <td class="num">${l.record.streak}d</td><td class="num">${esc(formatBest(l.game, l.record.bestScore))}</td><td class="num">${l.record.playedCount ?? 0}</td></tr>`).join('');

  const hasReharm = snap.live.some((l) => l.game.id === 'reharm');
  const shelf = hasReharm
    ? `<div class="sheet-section"><h3 class="sheet-label">REHARM badges</h3><ul class="badge-shelf">${BADGES.map((b) => {
        const on = snap.unlockedBadges.has(b.id);
        return `<li class="trophy-pin${on ? '' : ' is-locked'}"><img src="${badgeUrl(b.id)}" alt="" width="40" height="40" loading="lazy" /><span>${esc(b.label)}${on ? '' : '<span class="sr-only"> (locked)</span>'}</span></li>`;
      }).join('')}</ul></div>`
    : '';

  return `${sheetHead('Streaks & stats', 'Kept on this device. A day counts when you finish at least one daily.')}
    <div class="kpi-grid">
      <div class="kpi-tile"><div class="kpi-val">🔥 ${s.current}d</div><div class="kpi-lbl">Hub streak</div></div>
      <div class="kpi-tile"><div class="kpi-val">${s.longest}d</div><div class="kpi-lbl">Longest streak</div></div>
      <div class="kpi-tile"><div class="kpi-val">${totalPuzzles}</div><div class="kpi-lbl">Total puzzles</div></div>
      <div class="kpi-tile"><div class="kpi-val">${s.cleanSheets}</div><div class="kpi-lbl">Clean Sheets</div></div>
    </div>
    <div class="sheet-section"><h3 class="sheet-label">Last 7 days</h3><ul class="week-row">${week}</ul>
      <p class="sheet-sub" style="font-size:12px">${icon('check')} played · brass ring = Clean Sheet (every live daily done)</p></div>
    <div class="sheet-section"><h3 class="sheet-label">Per-game ledger</h3>
      <div style="overflow-x:auto"><table class="ledger"><thead><tr><th scope="col">Game</th><th scope="col" class="num">Streak</th><th scope="col" class="num">Best</th><th scope="col" class="num">Played</th></tr></thead><tbody>${rows}</tbody></table></div></div>
    ${shelf}`;
}

/* ------------------------------------------------------------------ settings */
function toggle(action: string, on: boolean, label: string, disabled = false): string {
  return `<button class="toggle-pill" type="button" role="switch" aria-checked="${on}" aria-label="${esc(label)}" data-action="${action}"${disabled ? ' disabled' : ''}>${on ? 'On' : 'Off'}</button>`;
}

export function settingsHTML(prefs: HubPrefs, osReduced: boolean, storageBlocked: boolean, resetArmed: boolean): string {
  const themeBtn = (mode: HubPrefs['theme'], ico: string, label: string) =>
    `<button class="seg-btn" type="button" role="radio" aria-checked="${prefs.theme === mode}" data-action="theme" data-id="${mode}">${icon(ico)}<span>${label}</span></button>`;
  const audioBtn = (muted: boolean, ico: string, label: string) =>
    `<button class="seg-btn" type="button" role="radio" aria-checked="${prefs.mutedDefault === muted}" data-action="muted-default" data-id="${muted}">${icon(ico)}<span>${label}</span></button>`;

  const reset = resetArmed
    ? `<div class="danger-confirm" role="group" aria-label="Confirm reset"><span class="setting-desc" style="flex-basis:100%">Are you sure? Streaks, Clean Sheets and reminders are cleared. Game saves are untouched.</span>
        <button class="btn-secondary" type="button" data-action="reset-cancel">Cancel</button>
        <button class="btn-danger" type="button" data-action="reset-confirm">Confirm reset</button></div>`
    : `<button class="btn-danger-outline" type="button" data-action="reset-arm">Reset hub history</button>`;

  return `${sheetHead('Settings')}
    <div class="sheet-section"><h3 class="sheet-label" id="theme-label">Theme</h3>
      <div class="segmented" role="radiogroup" aria-labelledby="theme-label">${themeBtn('system', 'monitor', 'System')}${themeBtn('light', 'sun', 'Parchment')}${themeBtn('dark', 'moon', 'Northgate')}</div></div>
    <div class="sheet-section"><h3 class="sheet-label" id="audio-label">Default audio</h3>
      <div class="segmented" role="radiogroup" aria-labelledby="audio-label">${audioBtn(false, 'volume-on', 'Sound on')}${audioBtn(true, 'volume-muted', 'Muted default')}</div>
      <p class="setting-desc">Muted default highlights silent-friendly games on the sheet.</p></div>
    <div>
      <div class="setting-row"><div><div class="setting-title">Reduced motion</div><div class="setting-desc">${osReduced ? 'On because your system asks for reduced motion.' : 'Turns off stamps, slides and confetti.'}</div></div>
        ${toggle('toggle-motion', prefs.reducedMotion || osReduced, 'Reduced motion', osReduced)}</div>
      <div class="setting-row"><div><div class="setting-title">Hub micro-sounds</div><div class="setting-desc">${prefs.mutedDefault ? 'Off while Muted default is on.' : 'Tiny cues for stamps, bells and copying.'}</div></div>
        ${toggle('toggle-sounds', prefs.uiSounds && !prefs.mutedDefault, 'Hub micro-sounds', prefs.mutedDefault)}</div>
      <div class="setting-row" style="flex-wrap:wrap"><div><div class="setting-title">Your data</div><div class="setting-desc">${storageBlocked ? 'Storage is blocked: nothing will be kept after this tab closes.' : 'Stored on this device only · 0 KB server data.'}</div></div>
        ${reset}</div>
    </div>`;
}

/* ------------------------------------------------------------------ intro */
export function introHTML(snap: BoardSnapshot): string {
  const lead = snap.live[0];
  const leadNo = lead ? lead.record.puzzleNo || snap.puzzleNo : snap.puzzleNo;
  const names = snap.live.map((l) => esc(l.game.name));
  const liveList = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] ?? '';
  const liveNote = names.length ? ` (${liveList} ${names.length > 1 ? 'are' : 'is'} live today)` : '';
  return `<div class="sheet-handle" aria-hidden="true"></div>
    <div class="sheet-head"><span>${logoPair('intro-logo')}</span>
      <button class="icon-btn" type="button" data-action="intro-start" aria-label="Close">${icon('close', 'ico')}</button></div>
    <h2 class="sheet-title" id="sheet-title">One daily sheet. Every music puzzle in one place.</h2>
    <ul class="intro-rows">
      <li><span class="intro-icon" aria-hidden="true">${icon('calendar', 'ico')}</span><div><strong>Play at your pace</strong><span>Pick any puzzle${liveNote}. A new sheet drops at local midnight.</span></div></li>
      <li><span class="intro-icon" aria-hidden="true">${icon('volume-muted', 'ico')}</span><div><strong>Commute-friendly flags</strong><span>Every card says upfront whether you can play it silently.</span></div></li>
      <li><span class="intro-icon" aria-hidden="true">${icon('book-open', 'ico')}</span><div><strong>Linked with Reharm Lab</strong><span>Streaks stay on this device (no login), and every result links to the move in the Lab.</span></div></li>
    </ul>
    <div class="sheet-actions">
      <button class="btn-primary btn-lg btn-block" type="button" data-action="intro-start">${icon('play')}<span>Open today's sheet</span></button>
      ${lead ? `<button class="btn-secondary btn-block" type="button" data-action="intro-play" data-id="${lead.game.id}">Jump straight to ${esc(lead.game.name)} #${leadNo} ${icon('arrow-right')}</button>` : ''}
    </div>`;
}
