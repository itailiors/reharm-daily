/** Board rendering: masthead, banners, ritual strip, celebration, cards, footer. Pure string builders. */
import type { BoardSnapshot } from '../lib/board';
import { formatCountdown, formatShortDate, msUntilLocalMidnight } from '../lib/dates';
import type { DailyGameRecord, GameCatalogEntry, HubPrefs } from '../types';
import { esc, icon } from './dom';
import logoUrl from '../../assets/brand/logo.svg?url';
import logoDarkUrl from '../../assets/brand/logo-dark.svg?url';
import comingSoonUrl from '../../assets/covers/coming-soon-stamp.svg?url';

export interface ViewState {
  snap: BoardSnapshot;
  prefs: HubPrefs;
  storageBlocked: boolean;
  offline: boolean;
  dismissed: Set<string>;
  /** Game ids whose card should play the red-pen stamp this render. */
  stamping: Set<string>;
}

export { logoUrl, logoDarkUrl };

export function logoPair(cls = 'logo-img'): string {
  return `<img class="${cls} logo-light" src="${logoUrl}" alt="Reharm Daily" width="268" height="48" />` +
    `<img class="${cls} logo-dark" src="${logoDarkUrl}" alt="Reharm Daily" width="268" height="48" />`;
}

export function countdownNow(): string {
  return formatCountdown(msUntilLocalMidnight());
}

/* ------------------------------------------------------------------ banners */
export function bannersHTML(v: ViewState): string {
  const out: string[] = [];
  if (v.storageBlocked && !v.dismissed.has('storage')) {
    out.push(banner('storage', 'shield-alert',
      "<strong>Private / storage blocked.</strong> All games still play, but streaks and scores won't save after you close this tab."));
  }
  if (v.offline && !v.dismissed.has('offline')) {
    out.push(banner('offline', 'wifi-off',
      "<strong>You're offline.</strong> Today's sheet stays readable; games may need a connection to load."));
  }
  return out.join('');
}

function banner(kind: string, ico: string, html: string): string {
  return `<div class="system-banner" role="status" data-kind="${kind}">
    <div class="system-banner-body">${icon(ico, 'ico')}<span>${html}</span></div>
    <button class="system-banner-close" type="button" data-action="dismiss-banner" data-id="${kind}" aria-label="Dismiss notice">${icon('close', 'ico')}</button>
  </div>`;
}

/* ------------------------------------------------------------------ masthead */
export function mastheadHTML(v: ViewState): string {
  const { snap } = v;
  return `<a class="brand-link" href="./" aria-label="Reharm Daily, today's sheet"><h1>${logoPair()}</h1></a>
    <div class="header-actions">
      <button class="edition-chip" type="button" data-action="open-stats" aria-label="Edition ${snap.puzzleNo}, ${esc(formatShortDate(snap.todayKey))}. Open stats">
        <span>#${snap.puzzleNo}</span><span class="edition-date">· ${esc(formatShortDate(snap.todayKey))}</span>
      </button>
      <button class="icon-btn" type="button" data-action="open-intro" aria-label="How Reharm Daily works">${icon('info', 'ico')}</button>
      <button class="icon-btn" type="button" data-action="open-settings" aria-label="Settings">${icon('settings', 'ico')}</button>
    </div>`;
}

/* ------------------------------------------------------------------ ritual strip */
function segState(r: DailyGameRecord): string {
  return r.status === 'done' ? 'done' : r.status === 'in_progress' ? 'in_progress' : 'new';
}

export function ritualHTML(v: ViewState, streakTick: boolean): string {
  const { snap } = v;
  const { played, total, allDone } = snap;
  const title = allDone
    ? `Today · ${played} of ${total} · Clean Sheet ✓`
    : `Today · ${played} of ${total} played`;
  const prompt = played === 0
    ? 'Pick a puzzle below. Even 2 minutes keeps your streak alive.'
    : allDone
      ? 'All done for today. Share your sheet or keep practicing.'
      : `${total - played} left on today's sheet.`;

  // Launch roster: 1 live segment + dashed ghost ticks for the planned games (the family roadmap).
  const segs = snap.live.map((l, i) =>
    `<div class="meter-seg" data-seg-state="${segState(l.record)}" style="--seg-index:${i}" title="${esc(l.game.name)}"></div>`);
  if (total <= 1) for (const g of snap.planned) segs.push(`<div class="meter-seg" data-seg-state="ghost" title="${esc(g.name)} (coming soon)"></div>`);
  const cols = segs.length || 1;

  const streak = snap.streak.current;
  return `<div class="ritual-top">
      <div class="ritual-heading">
        <h2 class="ritual-title">${esc(title)}</h2>
        <p class="ritual-sub">Resets in <span class="mono" data-countdown>${countdownNow()}</span></p>
      </div>
      <div class="ritual-controls">
        <button class="streak-pill${streakTick ? ' is-ticking' : ''}" type="button" data-action="open-stats" aria-label="Hub streak ${streak} ${streak === 1 ? 'day' : 'days'}. Open streaks and stats">
          ${icon('flame')}<span class="streak-num">${streak}d</span>
        </button>
        <button class="btn-primary" type="button" data-action="open-share" ${played === 0 ? 'disabled aria-describedby="share-hint"' : ''}>
          ${icon('share')}<span>Share</span>
        </button>
      </div>
    </div>
    <div class="meter-track" role="progressbar" aria-label="Live puzzles played today" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${played}" aria-valuetext="${played} of ${total} played" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${segs.join('')}</div>
    <p class="ritual-prompt"${played === 0 ? ' id="share-hint"' : ''}>${esc(prompt)}${played === 0 ? ' Finish 1 puzzle to unlock today’s share card.' : ''}</p>`;
}

/* ------------------------------------------------------------------ celebration */
const CONFETTI: Array<[number, number, number, number, string]> = [
  [14, 18, -28, -18, '--wash-blue'], [26, 40, -18, 22, '--wash-mustard'], [44, 12, 16, -24, '--wash-brick'], [58, 48, 26, 20, '--wash-sage'],
  [74, 20, -22, -26, '--wash-blue'], [85, 34, 24, -18, '--wash-mustard'], [92, 58, 20, 24, '--wash-brick'], [34, 62, -24, 18, '--wash-sage'],
];

export function celebrationHTML(v: ViewState): string {
  const { snap } = v;
  const done = snap.live.filter((l) => l.record.status === 'done');
  const scores = done.map((l) => l.record.score).filter((s): s is number => s !== null);
  const avg = scores.length > 1 ? ` · Average ${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}` : '';
  const title = snap.total === 1 ? "Today's sheet is complete!" : `All ${snap.total} puzzles played today!`;
  const dots = CONFETTI.map(([x, y, dx, dy, c], i) =>
    `<span class="confetti-dot" style="left:${x}%;top:${y}%;--dx:${dx}px;--dy:${dy}px;background:var(${c});${i % 2 ? 'border-radius:50%;' : ''}"></span>`).join('');
  return `<div class="confetti-burst" aria-hidden="true">${dots}</div>
    <div>
      <div class="clean-stamp">${icon('check-stamp')}<span>CLEAN SHEET ✓</span></div>
      <h2 class="celebration-title">${esc(title)}</h2>
      <p class="celebration-meta">${snap.played} of ${snap.total}${avg} · 🔥 ${snap.streak.current}-day streak · Next sheet in <span class="mono" data-countdown>${countdownNow()}</span></p>
    </div>
    <div class="celebration-actions">
      <button class="btn-primary btn-lg" type="button" data-action="copy-share-direct">${icon('copy')}<span>Copy Combined Share Card</span></button>
      <button class="btn-secondary btn-lg" type="button" data-action="launch" data-id="make-the-changes">${icon('book-open')}<span>Keep practicing in Reharm Lab</span></button>
    </div>`;
}

/* ------------------------------------------------------------------ cards */
export function mutedPill(g: GameCatalogEntry): string {
  const cls = g.mutedFriendly === 'yes' || g.mutedFriendly === 'partly' ? 'pill-muted-ok' : g.mutedFriendly === 'no' ? 'pill-audio' : 'pill-neutral';
  const ico = g.mutedFriendly === 'yes' ? 'volume-muted' : g.mutedFriendly === 'partly' ? 'check' : g.mutedFriendly === 'no' ? 'headphones' : 'info';
  return `<span class="pill ${cls}" title="${esc(g.mutedNote)}">${icon(ico)}${esc(g.mutedLabel)}</span>`;
}

export function timePill(g: GameCatalogEntry): string {
  return `<span class="pill pill-neutral">${icon('clock')}~${g.estMinutes} min</span>`;
}

export function statusPill(g: GameCatalogEntry, r: DailyGameRecord | null, waitlisted: boolean): string {
  if (g.status === 'planned') return `<span class="pill pill-soon">◌ Planned</span>`;
  if (g.status === 'lab') return `<span class="pill pill-lab">${icon('book-open')}Practice</span>`;
  if (!r || r.status === 'new') {
    return waitlisted
      ? `<span class="pill pill-wish">● New · You asked for this!</span>`
      : `<span class="pill pill-new">● New today</span>`;
  }
  if (r.status === 'in_progress') return `<span class="pill pill-progress">◐ ${esc(r.progressLabel || r.scoreLabel || 'In progress')}</span>`;
  return `<span class="pill pill-done">${icon('check')}Done${r.scoreLabel ? ` · ${esc(r.scoreLabel.split(' · ')[0])}` : ''}</span>`;
}

function doneStampText(r: DailyGameRecord): string {
  const head = r.scoreLabel.split(' · ')[0]?.trim();
  return head ? `DONE · ${head} ✓` : 'DONE ✓';
}

export function gameCardHTML(v: ViewState, g: GameCatalogEntry, r: DailyGameRecord | null, index: number, featured = false): string {
  const waitlisted = g.id in v.snap.waitlist;
  const dataStatus = g.status === 'live' ? (r?.status ?? 'new') : g.status;
  const stamping = v.stamping.has(g.id);

  let overlay = '';
  if (g.status === 'planned') overlay = `<img class="coming-stamp-overlay" src="${comingSoonUrl}" alt="" />`;
  else if (r?.status === 'done') overlay = `<div class="stamp-done" aria-hidden="true">${esc(doneStampText(r))}</div>`;

  let actions = '';
  if (g.status === 'live') {
    const label = r?.status === 'done' ? 'Hear &amp; compare' : r?.status === 'in_progress' ? 'Resume' : `Play ${esc(g.name)}`;
    const cls = r?.status === 'done' ? 'btn-secondary' : 'btn-primary';
    actions = `<button class="${cls} btn-lg" type="button" data-action="launch" data-id="${g.id}">${icon(r?.status === 'in_progress' ? 'arrow-right' : 'play')}<span>${label}</span></button>`;
    // "Learn move" opens the same detail sheet as (i), so it replaces it rather than wrapping a third button.
    if (r?.status === 'done' && r.labMove) {
      actions += `<button class="btn-secondary" type="button" data-action="detail" data-id="${g.id}" aria-label="Learn move, plus ${esc(g.name)} rules and stats">${icon('book-open')}<span>Learn move</span></button>`;
    } else actions += `<button class="btn-icon-only" type="button" data-action="detail" data-id="${g.id}" aria-label="${esc(g.name)}: rules and stats">${icon('info', 'ico')}</button>`;
  } else if (g.status === 'planned') {
    actions = `<button class="btn-secondary bell-btn" type="button" data-action="bell" data-id="${g.id}" aria-pressed="${waitlisted}" aria-label="${waitlisted ? `Reminder on for ${esc(g.name)}` : `Notify me when ${esc(g.name)} launches`}">
        ${icon(waitlisted ? 'bell-check' : 'bell')}<span>${waitlisted ? 'Notified ✓' : 'Notify me'}</span></button>`;
  } else {
    actions = `<button class="btn-secondary btn-lg" type="button" data-action="launch" data-id="${g.id}">${icon('external-link')}<span>Open in Reharm Lab</span></button>
      <button class="btn-icon-only" type="button" data-action="detail" data-id="${g.id}" aria-label="About ${esc(g.name)}">${icon('info', 'ico')}</button>`;
  }

  const practice = g.status === 'lab' ? `<p class="practice-note">PRACTICE · NOT IN DAILY STREAK</p>` : '';

  return `<article class="game-card" data-game-id="${g.id}" data-status="${dataStatus}"${featured ? ' data-featured="true"' : ''}${stamping ? ' data-stamping="true"' : ''} style="--card-index:${index}" aria-labelledby="title-${g.id}">
    <button class="cover-btn" type="button" data-action="detail" data-id="${g.id}" tabindex="-1" aria-hidden="true">
      <div class="cover-window"><img class="cover-img" src="${g.cover}" alt="" width="480" height="270" ${index > 2 ? 'loading="lazy"' : ''} />${overlay}</div>
    </button>
    <div class="card-header">
      <h3 style="margin:0;display:contents"><button class="card-title-btn" id="title-${g.id}" type="button" data-action="detail" data-id="${g.id}">${esc(g.name)}</button></h3>
      ${statusPill(g, r, waitlisted)}
    </div>
    ${practice}
    <div class="badge-row">${timePill(g)}${mutedPill(g)}</div>
    <p class="card-pitch">${esc(g.pitch)}</p>
    <div class="card-actions">${actions}</div>
  </article>`;
}

/* ------------------------------------------------------------------ board */
function sectionHead(title: string, kicker: string): string {
  return `<div class="section-head"><h2 class="section-title">${esc(title)}</h2><span class="section-kicker">${esc(kicker)}</span></div>`;
}

export function boardHTML(v: ViewState): string {
  const { snap } = v;
  const out: string[] = [];
  const notified = snap.planned.filter((g) => g.id in snap.waitlist).length;

  if (snap.total <= 1) {
    const lead = snap.live[0];
    out.push(sectionHead("Today's lead puzzle", lead ? '1 live now' : 'No live puzzle today'));
    out.push(`<div class="launch-grid">${lead ? gameCardHTML(v, lead.game, lead.record, 0, true) : ''}${snap.lab ? gameCardHTML(v, snap.lab, null, 1) : ''}</div>`);
  } else {
    // Actionable first: in progress → new → done (ux-spec State 2).
    const rank = { in_progress: 0, new: 1, done: 2 } as const;
    const sorted = [...snap.live].sort((a, b) => rank[a.record.status] - rank[b.record.status]);
    out.push(sectionHead("Today's sheet", `${snap.total - snap.played} remaining`));
    out.push(`<div class="live-grid">${sorted.map((l, i) => gameCardHTML(v, l.game, l.record, i)).join('')}</div>`);
    if (snap.lab) {
      out.push(sectionHead('Practice inside Reharm Lab', 'Does not affect streak'));
      out.push(`<div class="launch-grid">${gameCardHTML(v, snap.lab, null, sorted.length)}</div>`);
    }
  }

  if (snap.planned.length) {
    out.push(sectionHead(`On the workbench (${snap.planned.length} upcoming)`, `${notified} notified`));
    out.push(`<div class="soon-grid">${snap.planned.map((g, i) => gameCardHTML(v, g, null, i + 2)).join('')}</div>`);
  }
  return out.join('');
}

export function footerHTML(): string {
  return `<p>Stored on this device only · no account · no server data</p>
    <nav aria-label="Family links">
      <a href="https://itailiors.github.io/reharm/">REHARM</a>
      <a href="https://itailiors.github.io/reharm-lab/?from=reharm-daily">Reharm Lab</a>
    </nav>`;
}
