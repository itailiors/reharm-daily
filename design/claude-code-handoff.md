# Reharm Daily — Claude Code Implementation Handoff Contract

> **Purpose:** Blueprint linking every asset, token, CSS class, `data-*` attribute, TypeScript interface, and state transition in `C:\Users\itail\Documents\claude-projects\IO_GAMES\ReharmLab-Dailys` to the production static web app built in Claude Code.  
> **Scope Reminder:** Everything in this repo is **100% design, SVG/PNG assets, tokens, specifications, and mocked prototype**—no production game logic, no audio engine, and no Reharm Lab / REHARM app code was modified.

---

## 1. Deliverables & Asset Inventory

```text
ReharmLab-Dailys/
├── assets/
│   ├── brand/
│   │   ├── logo.svg                 (268×48 Ink & Parchment masthead lockup)
│   │   ├── logo-dark.svg            (268×48 Northgate dark masthead lockup)
│   │   ├── favicon.svg              (32×32 hand-ruled folio browser icon)
│   │   ├── apple-touch-icon.png     (180×180 iOS home-screen folio icon)
│   │   ├── og-image.png             (1200×630 high-res social share card)
│   │   └── og-image.jpg             (1200×630 compressed social card, 87,572 bytes < 100 KB)
│   ├── covers/
│   │   ├── reharm.svg               (480×270 midnight studio hardware cover)
│   │   ├── chord-trench.svg         (480×270 abyssal sonar electric piano cover)
│   │   ├── stepwise.svg             (480×270 drafting-paper voice-leading cover)
│   │   ├── quartet.svg              (480×270 4×4 acoustic matrix cover)
│   │   ├── mend.svg                 (480×270 4-lane tape surgery cover)
│   │   ├── barline.svg              (480×270 7/8 Euclidean rhythm ring cover)
│   │   ├── tavdle.svg               (480×270 sketchbook placeholder cover)
│   │   ├── make-the-changes.svg     (480×270 Reharm Lab living lead-sheet cover)
│   │   └── coming-soon-stamp.svg    (168×58 tilted diagonal blueprint stamp)
│   ├── icons/
│   │   ├── sprite.svg               (Combined <symbol id="icon-*"> sprite)
│   │   └── [28 standalone 24×24 stroke SVGs: play, arrow-left, arrow-right, external-link,
│   │        check, check-stamp, flame, share, copy, settings, bell, bell-check, volume-on,
│   │        volume-muted, headphones, clock, calendar, trophy, sparkles, info, close, sun,
│   │        moon, monitor, wifi-off, shield-alert, book-open, chevron-right]
│   └── lab-entry/
│       ├── lab-daily-pill.svg              (132×36 Rough.js unplayed pill)
│       ├── lab-daily-pill-done.svg         (132×36 sage-checked completed pill)
│       ├── lab-daily-pill-northgate.svg    (132×36 Northgate dark pill)
│       ├── lab-daily-sidebar-icon.svg      (48×48 desktop left-rail icon)
│       ├── lab-bridge-mockup-desktop.png    (1280×800 composite over Reharm Lab)
│       ├── lab-bridge-mockup-mobile.png     (390×844 composite over Reharm Lab)
│       └── game-bridge-skins-comparison.png (1080×720 REHARM vs STEPWISE bridge skins)
├── design/
│   ├── explorations/
│   │   ├── exploration-a-daily-sheet.png    (390×844 CHOSEN direction mockup)
│   │   └── exploration-b-the-club.png       (390×844 alternative direction mockup)
│   ├── preview/
│   │   └── index.html               (Zero-build interactive prototype across all states)
│   ├── brand-bible.md               (Visual thesis, rationale, WCAG AA matrix, cover system)
│   ├── ux-spec.md                   (390×844 & 1280×800 specs across all 10 screens/states)
│   ├── bridge-spec.md               (Lab pill + game strip/next-card + Lab move chip specs)
│   ├── motion-spec.md               (Durations, easings, keyframes, reduced-motion, micro-audio)
│   ├── product-notes.md             (Daily loop, streak math, 3 share cards, non-goals, checklist)
│   ├── data-contract.md             (daily:v1:* + reharm:v1:* defensive reader)
│   ├── tokens.css                   (Production CSS variables, system theme + reduced motion)
│   ├── tokens.json                  (W3C Design Tokens JSON mirror)
│   ├── claude-code-handoff.md       (This contract)
│   └── DONE.md                      (Final summary + open questions)
└── reference/screens/
    ├── reharm-lab-1280.png
    ├── reharm-lab-390.png
    ├── reharm-game-1280.png
    └── reharm-game-390.png
```

---

## 2. Token & Accessibility Rules

1. Import [tokens.css](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/tokens.css) at root scope before component CSS.
2. Stamp `data-theme="light"` or `data-theme="dark"` on `<html>` only when user chooses Light/Dark explicitly; omit `data-theme` (or set `data-theme="system"`) when set to System so `@media (prefers-color-scheme: dark)` drives theme automatically.
3. Stamp `data-reduced-motion="true"` on `<html>` when Reduced Motion toggle is enabled (`@media (prefers-reduced-motion: reduce)` already zeros `--dur-*` automatically).
4. Never hardcode colors, radii, or easings—always reference `--bg-*`, `--text-*`, `--status-*`, `--accent-*`, `--dur-*`, `--ease-*`.
5. Enforce `min-height: 44px; min-width: 44px` on every interactive button, pill, close icon, and card action, plus clear `:focus-visible` double-ring outlines (`outline: 2px solid var(--focus-ring); box-shadow: 0 0 0 4px var(--focus-gap);`).

---

## 3. UI State Machine

```text
[HUB_BOOT] (SafeStorage probe + dateKey check + read daily:v1:* & reharm:v1:*)
   │
   ├──► (prefs.seenIntro === false) ──► [FIRST_VISIT_MODAL] ──(1 tap)──┐
   │                                                                   ▼
   └──► [TODAY_BOARD] ◄────────────────────────────────────────────────┤
           │  ├── Banners: [STORAGE_BLOCKED] | [OFFLINE]               │
           │  ├── Header/Ritual: progress meter, streak, All-Done seal │
           │  ├── Live Cards: status = 'new' | 'in_progress' | 'done'  │
           │  ├── Planned Cards: status = 'planned', bell = true|false │
           │  └── Lab Card: status = 'lab' (Make the Changes)          │
           │                                                           │
           ├──► (Tap card / Details) ──► [GAME_DETAIL_SHEET]           │
           ├──► (Tap Play CTA) ────────► [LAUNCH_HANDOFF] ─► Game URL  │
           ├──► (Tap Share CTA) ───────► [SHARE_MODAL]                 │
           ├──► (Tap Streak / Trophy) ─► [STATS_DRAWER]                │
           └──► (Tap Settings Gear) ───► [SETTINGS_SHEET]              │
```

---

## 4. Component List, CSS Classes & `data-*` Attributes

| Component | Class | Key `data-*` / ARIA Attributes | Notes |
| :--- | :--- | :--- | :--- |
| **Root Shell** | `.daily-shell` | `data-roster="launch\|full"`, `data-all-done="true\|false"` | Switches seamlessly from 1+6 Launch layout to 7+ Full Roster grid |
| **System Notice** | `.system-banner` | `role="status"`, `data-kind="storage\|offline"` | Shown when `SafeStorage.blocked` or `!navigator.onLine` |
| **Masthead** | `.daily-header` | `role="banner"` | Holds logo SVG, `#puzzleNo`, Stats button, `?`, `⚙` (`>=44px` each) |
| **Ritual Strip** | `.ritual-card` | `data-complete="true\|false"` | Segmented meter (`.meter-seg[data-seg-state="done\|progress\|new"]`), streak pill, Share CTA |
| **All-Done Banner** | `.celebration-card` | `aria-live="polite"`, `data-visible="true\|false"` | Shows red `CLEAN SHEET ✓` stamp, countdown, combined share & Lab nudge |
| **Game Cartridge** | `.game-card` | `data-game-id`, `data-status="new\|in_progress\|done\|planned\|lab"`, `data-stamping="true"` | Houses `.cover-window`, `.stamp-done`, muted pill, pitch, and primary action |
| **Game Detail Sheet** | `.detail-sheet` | `role="dialog"`, `aria-modal="true"`, `data-open="true\|false"` | Bottom sheet on `<768px`, centered modal on `>=768px` |
| **Share Modal** | `.share-modal` | `role="dialog"`, `data-format="full\|compact"` | Monospace `.share-preview`, clipboard copy + `<textarea>` fallback |
| **Stats Drawer** | `.stats-drawer` | `role="dialog"`, `aria-modal="true"` | 4 KPIs, 7-day punch card, per-game streaks, REHARM badge shelf |
| **Settings Sheet** | `.settings-sheet` | `role="dialog"`, `aria-modal="true"` | Theme radio group, reduced motion, muted default, UI sounds, 2-tap reset |
| **First Visit** | `.intro-modal` | `role="dialog"`, `aria-modal="true"` | 3 scannable rows + 1-tap `Open Today's Sheet` & `Play REHARM` |
| **Launch Veil** | `.launch-veil` | `role="status"`, `data-active="true\|false"` | `200ms` visual cross-fade before navigating to external game URL |

---

## 5. TypeScript Interfaces (Copy-Paste Ready for Claude Code)

```ts
export type GameStatus = 'live' | 'planned' | 'lab';
export type DailyPlayState = 'new' | 'in_progress' | 'done';
export type MutedRating = 'yes' | 'partly' | 'no' | 'tbd';
export type ThemeMode = 'system' | 'light' | 'dark';

export interface GameCatalogEntry {
  id: string;
  name: string;
  status: GameStatus;
  url?: string;
  archiveUrl?: string;
  coverAsset: string;         // e.g. "assets/covers/reharm.svg"
  pitch: string;
  archetype: string;
  estMinutes: number;
  mutedFriendly: MutedRating;
  mutedNote: string;          // e.g. "Visual playhead; audio recommended"
  scoreUnit: string;
  howToPlay: [string, string, string];
  storagePrefix?: string;
  labLinks?: Array<{ slug: string; label: string }>;
}

export interface DailyCatalog {
  hub: {
    name: string;
    plannedUrl: string;
    epoch: string;            // ISO YYYY-MM-DD (puzzle #1 anchor)
  };
  lab: {
    name: string;
    url: string;
  };
  games: GameCatalogEntry[];
}

export interface DailyGameRecord {
  v: 1;
  gameId: string;
  dateKey: string;            // Local YYYY-MM-DD
  puzzleNo: number;
  status: DailyPlayState;
  score: number | null;
  scoreLabel: string;
  tierIcon?: string;
  streak: number;
  bestScore?: number | null;
  playedCount?: number;
  progressLabel?: string;
  shareText?: string;
  labMove?: { slug: string; label: string } | null;
  updatedAt: number;
}

export interface HubPrefs {
  theme: ThemeMode;
  reducedMotion: boolean;
  mutedDefault: boolean;
  uiSounds: boolean;
  seenIntro: boolean;
  bannerDismissedDate?: string;
}

export interface HubStreak {
  current: number;
  longest: number;
  lastPlayedDate: string | null;
  cleanSheets: number;
  recentDays: Record<string, { played: number; total: number; clean: boolean }>;
}

export interface CombinedSharePayload {
  puzzleNo: number;
  dateKey: string;
  playedCount: number;
  totalLive: number;
  isCleanSheet: boolean;
  hubStreak: number;
  fullText: string;
  compactText: string;
}
```

---

## 6. Custom Event Names

| Event Name | `detail` Payload | Trigger |
| :--- | :--- | :--- |
| `daily:state-change` | `{ played: number; total: number; isAllDone: boolean }` | Any game record or roster load updates daily completion |
| `daily:stamp-done` | `{ gameId: string; scoreLabel: string }` | Game newly transitions to `done` on hub return |
| `daily:bell-toggle` | `{ gameId: string; enabled: boolean }` | Local waitlist reminder toggled for a planned game |
| `daily:launch-game` | `{ gameId: string; url: string; mutedDefault: boolean }` | User initiates launch transition into a game or Lab |
| `daily:share-copy` | `{ format: 'full' \| 'compact'; success: boolean }` | Combined share card copied to clipboard |

---

## 7. Boundary: Prototype Mock vs. Claude Code Production

| Responsibility | Provided in `design/preview/index.html` (Mocked) | To Build in Claude Code (Production) |
| :--- | :--- | :--- |
| **Game Catalog (`games.json`)** | Inlined copy of `brief/games.json` augmented with 3-line rules & cover paths | Single typed `src/data/games.ts` catalog shared across hub and bridge |
| **Daily Play State** | State switcher presets (`Launch`, `Mid-Day`, `All Done`) + in-session `Stamp Done` simulation | Real `localStorage` reader/aggregator across `daily:v1:*` + defensive `reharm:v1:*` adapter + `storage`/`visibilitychange` sync |
| **Lab & Game Bridges** | Interactive Bridge Preview Drawer showcasing Lab pill, REHARM & STEPWISE skins | Ship lightweight `@reharm-daily/bridge` CSS+JS drop-in into `Reharm` game, `Reharm Lab` (`?move=` / `?mode=changes`), and future games |
| **Puzzle `#` & Midnight Clock** | Mocked `#42` + live ticking local-midnight countdown | Deterministic day index from `epoch` (`2026-11-25` -> `#1`) using `getLocalDateKey()` |
| **Audio Synthesis** | Silent visual prototype (no Tone.js bundled) | Optional `< 40`-line Web Audio micro-sound synthesizer matching `motion-spec.md §3` (off when muted) |
