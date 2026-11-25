# REHARM — Claude Code Implementation Handoff Contract

> **Purpose:** Blueprint linking every visual asset, token, CSS class/state, and TypeScript data/event interface in `C:\Users\itail\Documents\claude-projects\IO_GAMES\Reharm` to the game logic & Web Audio engine built in Claude Code.  
> **Scope Reminder:** Everything currently inside `Reharm/` is **100% design, assets, tokens, and visual-only mocked prototype**—zero real audio synthesis, zero music-theory evaluators, and zero URL hash parsers are included yet.

---

## 1. Deliverables & Asset Inventory

```text
Reharm/
├── assets/
│   ├── brand/
│   │   ├── logo.svg                 (224×44 vector lockup, dark-first ivory wordmark + 4-bar mark)
│   │   ├── favicon.svg              (32×32 obsidian hardware square icon)
│   │   ├── apple-touch-icon.png     (180×180 brushed aluminum + 4-bar tactile keycaps)
│   │   └── og-image.png             (1200×630 Discord/X social share card)
│   ├── badges/
│   │   ├── badge-frame.svg          (64×64 reusable anodized circular medallion base)
│   │   ├── tritone-sub.png / .svg   (512×512 PNG pin + 64×64 inline SVG fallback)
│   │   ├── backdoor-dominant.png / .svg
│   │   ├── modal-borrow.png / .svg
│   │   ├── chromatic-mediant.png / .svg
│   │   ├── sharp11-melody.png / .svg
│   │   ├── smooth-bass.png / .svg
│   │   ├── radio-safe.png / .svg
│   │   └── jazz-trench.png / .svg
│   └── icons/
│       ├── sprite.svg               (Combined <symbol id="icon-*"> SVG sprite)
│       ├── grain-overlay.svg        (Subtle seamless matte studio noise tile)
│       └── [15 standalone 24×24 SVGs: play, pause, loop, lock, unlock, piano-keys,
│           grid-palette, helper-bulb, spice-flame, share, audio-on, audio-muted,
│           undo-reset, info, stats]
└── design/
    ├── brand-bible.md               (Aesthetic rules, typography, verified WCAG AA contrast matrix)
    ├── ux-spec.md                   (390×844 & 1280×800 specs across all 8 views)
    ├── motion-spec.md               (Curves, keyframes, reduced-motion fallbacks, audio hooks)
    ├── tokens.json                  (Structured theme, typography, spacing, motion JSON)
    ├── tokens.css                   (Production CSS variables for [data-theme="dark" | "light"])
    ├── claude-code-handoff.md       (This contract)
    └── preview/
        └── index.html               (Zero-build visual prototype with mocked Puzzle #42 fixtures)
```

### Token Usage Rules
1. Always import `design/tokens.css` at root scope. Set `data-theme="dark"` (default) or `data-theme="light"` on `<html>`.
2. Toggle `data-reduced-motion="true"` on `<html>` when the user enables Reduced Motion in Settings (OS `@media (prefers-reduced-motion: reduce)` is already respected automatically).
3. Never hardcode colors, radii, or easing values in component styles—reference `--bg-*`, `--text-*`, `--tier-*`, `--state-*`, `--dur-*`, `--ease-*`.
4. All chord names, bar labels, timers, and score readouts MUST use `font-family: var(--font-mono)` with `font-variant-numeric: tabular-nums`.

---

## 2. UI State Machine & Transitions

```text
[AUDIO_GATE]
   │  (Tap "Power Studio" -> iOS unlock OR "Continue Muted")
   ▼
[ACTIVE_STUDIO] ◄──────────────────────────────────────────┐
   │  ├── Bar Slot States: 'locked' | 'empty' | 'queued'   │
   │  │                    | 'legal' | 'clash'             │
   │  ├── Input Mode: 'palette' | 'piano'                  │
   │  ├── Helper Overlay: true | false                     │
   │  └── (All 4 bars legal -> Tap "Lock Mix")             │
   ▼                                                       │
[SCORE_REVEAL] ──► [SHARE_MODAL]                           │
   │                    │                                  │
   ▼                    ▼                                  │
[STATS_DRAWER]     (Copy Playable URL #42:...)             │
                                                           │
[SHARED_RECEIVER] (Loaded via URL hash #42:...)            │
   ├── Unplayed today: Spoiler-veiled chords + "Play Today"┘
   └── Played today: Side-by-side A/B Compare
```

---

## 3. TypeScript Contracts (Copy-Paste Ready for Claude Code)

```ts
export type NoteName =
  | 'C' | 'Db' | 'D' | 'Eb' | 'E' | 'F'
  | 'Gb' | 'G' | 'Ab' | 'A' | 'Bb' | 'B';

export type ChordQuality =
  | 'Maj' | 'm' | '7' | 'maj7' | 'm7'
  | 'ø7' | 'dim' | 'sus' | 'aug' | 'alt';

export type SpiceTier =
  | 'radio-safe'
  | 'jazz-standard'
  | 'modal-interchange'
  | 'deep-reharm';

export type SlotLifecycleState =
  | 'locked'
  | 'empty'
  | 'queued'
  | 'legal'
  | 'clash';

export type BadgeId =
  | 'tritone-sub'
  | 'backdoor-dominant'
  | 'modal-borrow'
  | 'chromatic-mediant'
  | 'sharp11-melody'
  | 'smooth-bass'
  | 'radio-safe'
  | 'jazz-trench';

export interface MelodyNote {
  id: string;
  midi: number;            // e.g., 64 (E4) .. 77 (F5)
  pitchLabel: string;      // e.g., "E4", "G4" (shown on desktop hover / debug)
  barIndex: 0 | 1 | 2 | 3;
  startBeat: number;       // 0.0 .. 4.0 relative to bar
  durationBeats: number;   // 0.25 .. 4.0
  yNorm: number;           // 0..1 vertical normalization across puzzle pitch span
  isAccent: boolean;       // Strong-beat target checked by legality engine
}

export interface DailyPuzzle {
  puzzleNumber: number;    // e.g., 42
  dateISO: string;         // UTC YYYY-MM-DD
  keyLabel: string;        // e.g., "C Major"
  bpm: number;             // e.g., 96
  lockedBarIndex: 0 | 1 | 2 | 3;
  anchorChord: ChordInput;
  melody: MelodyNote[];
  /** Optional beginner diatonic helper map computed per bar by theory engine */
  consonantHintsByBar: Record<0 | 1 | 2 | 3, {
    safeRoots: NoteName[];
    safeQualities: ChordQuality[];
    safeMidiNotes: number[];
  }>;
}

export interface ChordInput {
  root: NoteName;
  quality: ChordQuality;
  slashBass?: NoteName;
  /** Compact display symbol, e.g., "Db7#11", "CMaj7/E" */
  symbol: string;
  /** Optional custom MIDI voicing when crafted in Piano Mode */
  customMidiNotes?: number[];
}

export interface BarSlotState {
  barIndex: 0 | 1 | 2 | 3;
  state: SlotLifecycleState;
  chord: ChordInput | null;
  queuedChord?: ChordInput | null;
  tier?: SpiceTier;
  deviceLabel?: string;       // e.g., "Tritone Sub", "Modal Borrow"
  clashReason?: string;       // Non-punishing explanation shown in feedback banner
  clashSuggestions?: string[];// Up to 3 safe chord chips
}

export interface ScoreBreakdown {
  total: number;              // 0..100
  rarity: number;             // 0..50
  melodyColor: number;        // 0..25
  bassFlow: number;           // 0..25
  avgBassSemitones: number;   // e.g., 3.0
  percentile: number;         // e.g., 4 -> "Top 4% Spice"
  percentileLabel: string;    // "Top 4% Spice"
  overallTier: SpiceTier;
  axisSummaries: {
    rarity: string;
    melodyColor: string;
    bassFlow: string;
  };
  unlockedBadges: Array<{
    id: BadgeId;
    title: string;
    reason: string;
  }>;
}

export interface SharePayload {
  puzzleNumber: number;
  url: string;                // e.g., "https://reharm.app/#42:CMaj7.AbMaj7.Db7s11.CMaj9"
  emojiCardText: string;      // Multi-line Discord/X share string
  score: number;
  percentileLabel: string;
  barTiers: [SpiceTier | 'locked', SpiceTier | 'locked', SpiceTier | 'locked', SpiceTier | 'locked'];
  badges: BadgeId[];
}

export interface ReceiverCompareData {
  senderName: string;         // "Friend" or decoded label
  puzzleNumber: number;
  hasPlayerSolvedToday: boolean;
  friendBars: BarSlotState[];
  friendScore: ScoreBreakdown;
  playerBars?: BarSlotState[];
  playerScore?: ScoreBreakdown;
}

export interface PlayerStats {
  played: number;
  currentStreak: number;
  maxStreak: number;
  averageScore: number;
  bestScore: number;
  spiceDistribution: {
    radioSafe: number;        // 0-49
    jazzStandard: number;     // 50-74
    modalInterchange: number; // 75-89
    deepReharm: number;       // 90-100
  };
  badgeCounts: Record<BadgeId, number>;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  consonantHelper: boolean;
  isMuted: boolean;
  reducedMotion: boolean;
  inputMode: 'palette' | 'piano';
}
```

*(See `design/motion-spec.md` §3 for the complete `ReharmVisualHooks` interface driving `Tone.Transport` visual updates.)*

---

## 4. Critical Mobile Safari Audio-Unlock Wiring Checklist

When implementing the real Web Audio / `Tone.js` engine behind **View 1 (`AUDIO_GATE`)**, attach this exact sequence directly inside the synchronous click/tap handler of `#gate-power-btn`:

1. **AudioSession API (iOS 17+):**
   ```ts
   if ('audioSession' in navigator) {
     (navigator as unknown as { audioSession: { type: string } }).audioSession.type = 'playback';
   }
   ```
2. **Silent HTML5 `<audio>` Media-Channel Fallback (iOS < 17 hardware silent-switch bypass):**
   Play a pre-bundled 1-second silent looping base64 `.wav` `<audio loop playsinline>` element inside the exact tap gesture so iOS elevates the tab into the *Media* playback channel rather than *Ambient/Ringer*.
3. **Tone.js Context Unlock & Node Pre-Allocation:**
   Call `await Tone.start()`, pre-allocate the Rhodes poly-synth + flute/bell melody synth + soft lo-fi percussion voices once at startup (zero mid-loop node allocation to avoid GC clicks), and quantize chord swaps via `Tone.Transport.scheduleOnce(..., '@1m')` with a `15ms` crossfade envelope.
4. **Background/Resume Guard:**
   Listen to `document.addEventListener('visibilitychange', ...)` and call `Tone.context.resume()` cleanly when returning from Safari tab switches or lock screens.

---

## 5. Boundary Between Visual Prototype & Claude Code Implementation

| Responsibility | Provided in `design/preview/index.html` (Mocked) | To Build in Claude Code (Production) |
| :--- | :--- | :--- |
| Daily Puzzle Data | Static `MOCK_PUZZLE_42` JSON fixture | Deterministic UTC date-seeded puzzle bank / motif generator |
| Audio Playback | Visual rAF timer simulating 96 BPM loop | `Tone.js` Web Audio Rhodes + melody + drum loop + iOS unlock |
| Chord Legality / Rarity | Mocked lookup rules for demo feedback (`BMaj7` triggers clash, `Db7#11` triggers Deep Reharm) | Pitch-class interval analyzer, functional progression recognizer, 3-axis scorer |
| URL Sharing | Static mock URL string & `navigator.clipboard.writeText` | Bit-packed URL `#hash` encoder/decoder + state persistence in `localStorage` |
