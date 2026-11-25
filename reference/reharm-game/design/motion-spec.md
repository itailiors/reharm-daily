# REHARM — Motion, Micro-Interaction & Audio-Reactive Visual Spec

> **Design Intent:** Hardware switch crispness (`80–240ms`, zero mushy bounce) paired with fluid musical timekeeping (`60fps` transport-synced playhead & downbeat bloom).  
> **Hardware Constraint:** Every continuous and micro-interaction animation animates strictly compositor-friendly properties (`transform`, `opacity`, `clip-path`, `box-shadow` sparingly via opacity pseudo-elements) to preserve glitch-free Web Audio playback on mobile Safari.

---

## 1. Motion Curves & Duration Tokens

Synchronized directly with `design/tokens.css` and `design/tokens.json`:

| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--dur-instant` | `80ms` | Keycap press depression (`translateY(1.5px)`), LED dot toggle |
| `--dur-fast` | `140ms` | Tab switches, palette focus ring transition, helper dot fade |
| `--dur-normal` | `240ms` | Legal chord snap, clash shake cycle, toast/banner swap |
| `--dur-smooth` | `360ms` | Drawer slide-up, modal entrance, A/B compare transition |
| `--dur-ceremony` | `900ms` | Score count-up (`0 → 91`), 3-axis meter fill stagger |
| `--dur-pulse-beat` | `1250ms` | Queued-bar anticipation pulse (or dynamically scaled to `60000 / bpm` ms) |
| `--ease-snap` | `cubic-bezier(0.2, 0.9, 0.3, 1)` | Tactile synth switch detent (fast attack, crisp zero-overshoot settle) |
| `--ease-spring` | `cubic-bezier(0.34, 1.45, 0.64, 1)` | Badge stamp-in & legal chord celebration micro-pop |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Meter bar fill deceleration, sheet dismissal |
| `--ease-linear` | `linear` | Continuous transport playhead `translateX` across 4 bars |

---

## 2. Choreography Catalogue & Reduced-Motion Fallbacks

### 2.1 Continuous Loop Playhead Sweep & Melody Pill Illumination
- **Playhead Beam:** Sweeps continuously from `0%` to `100%` of the 4-bar timeline width using `transform: translateX(<progress * width>px)` driven inside `requestAnimationFrame` from normalized `Tone.Transport` progress `[0..1)`. Never animate `left` or `width`.
- **Melody Contour Pills:** When the playhead enters `[note.startBeat, note.endBeat)`, the pill receives `[data-sounding="true"]`, transitioning in `--dur-instant` (`80ms`) from `--pill-idle` to `--pill-active` with `transform: scaleY(1.35)` and `--glow-amber`.
- **Bar Beat LEDs:** Each bar slot houses 4 tiny beat LEDs (`1..4`); the active beat lights up in `--accent-primary` for crisp visual rhythm even when a phone is muted.
- **`prefers-reduced-motion: reduce`:** Playhead jumps cleanly bar-by-bar (`step` highlight on the active bar card border + crisp active melody pill color shift without continuous sweeping beam or scale transforms).

### 2.2 Queued-Chord Bar-Boundary Swap Anticipation (`queued`)
- **Problem:** Changing chords mid-bar causes audio clicks unless quantized to the next barline; users need immediate confirmation their tap registered.
- **Visual Motion:**
  - Slot enters `[data-slot-state="queued"]`: displays the upcoming chord symbol (`Db7#11`) with a `NEXT BAR` tag, dashed `--state-queued-border`, and a gentle rhythmic pulse (`opacity: 0.72 ↔ 1.0` synced to beat duration).
  - Remaining beats before bar boundary count down on the bar's 4-beat LED dots.
  - **On Downbeat (`onChordSwap(barIndex, 'legal')`):** Border flashes solid `--state-legal-border`, slot executes a subtle downbeat bloom (`scale(1) → scale(1.035) → scale(1)` over `240ms --ease-snap`), and transitions to its earned Spice Tier styling.
- **`prefers-reduced-motion: reduce`:** Queued state displays static solid/dashed amber border + `NEXT BAR` pill without pulsing opacity or downbeat scale bloom.

### 2.3 Dissonant Clash Shake & Legal Snap Ripple
- **Dissonant Clash (`onClash(barIndex)`):**
  - `@keyframes reharm-clash-shake` (`300ms`, `ease-out`): horizontal hardware rattle `0% (0) → 18% (-6px) → 36% (5px) → 54% (-4px) → 72% (3px) → 90% (-1px) → 100% (0)`.
  - Simultaneous background swap to `--state-clash-bg` and soft engineer explanation chip slide-in (`translateY(4px) → 0`, `140ms`).
- **Legal Snap (`onChordSwap(barIndex, 'legal')`):**
  - Brief border/glow ripple (`opacity: 0.9 → 0` pseudo-element ring expanding `scale(1) → scale(1.04)` over `320ms --ease-out`).
- **`prefers-reduced-motion: reduce`:** Zero horizontal shake; clash uses immediate color/border transition + clear warning icon (`⚠`) and explanation text.

### 2.4 Score Reveal Ceremony (`onScoreReveal(breakdown)`)
Triggered sequentially when **"Lock Mix"** succeeds:
1. **`0ms–220ms`:** Modal container enters (`opacity: 0 → 1`, `translateY(14px) → 0`, `--ease-out`).
2. **`120ms–920ms`:** Total score (`00 → 91`) counts up smoothly with `easeOutCubic` (`requestAnimationFrame` formatting 2-digit tabular integer in `Space Grotesk`).
3. **`350ms`:** Percentile rank pill (`Top 4% Spice`) pops in (`--dur-normal --ease-spring`).
4. **`400ms / 520ms / 640ms` (120ms stagger):** Three horizontal score meters (`Rarity /50`, `Melody /25`, `Bass /25`) fill via `transform: scaleX(ratio)` from `origin-left` over `650ms --ease-out`.
5. **`780ms+` (90ms stagger per badge):** Unlocked Harmonic Flavor medallions stamp in (`scale(1.18) → scale(1)`, `opacity: 0 → 1`, `280ms --ease-spring`).
- **`prefers-reduced-motion: reduce`:** All numbers, meters (`scaleX` final ratio), rank pill, and badge medallions render at full final values immediately (`0ms` stagger).

---

## 3. Audio-Reactive UI Callback Hooks (`Tone.Transport` Integration)

Claude Code should wire `Tone.Transport` lookahead events through `Tone.Draw.schedule(...)` (never mutating DOM inside the Web Audio callback thread) into this exact framework-agnostic hook surface:

```ts
export interface ReharmVisualHooks {
  /**
   * Fires continuously on requestAnimationFrame while transport plays.
   * @param normalizedLoopProgress Number in [0, 1) representing position across all 4 bars.
   * @param activeNoteIds IDs of melody notes currently sounding at this transport time.
   */
  onTransportFrame(normalizedLoopProgress: number, activeNoteIds: string[]): void;

  /**
   * Fires on every quarter-note beat via Tone.Draw.schedule.
   * @param barIndex 0..3 (Bar 1..4)
   * @param beatIndex 0..3 (Beat 1..4 within the bar)
   */
  onBeat(barIndex: 0 | 1 | 2 | 3, beatIndex: 0 | 1 | 2 | 3): void;

  /**
   * Fires on beat 1 of each bar via Tone.Draw.schedule.
   * Clears previous bar highlight and triggers bar boundary focus.
   */
  onBarStart(barIndex: 0 | 1 | 2 | 3): void;

  /**
   * Fires when a chord change commits (immediately if paused, or at bar boundary when quantized).
   */
  onChordSwap(
    barIndex: 0 | 1 | 2 | 3,
    state: 'queued' | 'legal' | 'clash' | 'empty',
    tier?: 'radio-safe' | 'jazz-standard' | 'modal-interchange' | 'deep-reharm'
  ): void;

  /**
   * Fires when the legality analyzer detects a harsh melody/chord rub.
   */
  onClash(barIndex: 0 | 1 | 2 | 3, clashReason: string, suggestions?: string[]): void;

  /**
   * Fires upon "Lock Mix" completion to trigger the staggered Krillion score reveal ceremony.
   */
  onScoreReveal(breakdown: {
    total: number;
    rarity: number;
    melodyColor: number;
    bassFlow: number;
    percentileLabel: string;
    unlockedBadges: string[];
  }): void;
}
```

### Timing Safety Notes for Engine Wiring
1. **Use `Tone.Draw.schedule(cb, time)`** for `onBeat`, `onBarStart`, and boundary `onChordSwap` so visual flashes land frame-accurately with speaker output without blocking audio scheduling.
2. **Drive `onTransportFrame` from a single `requestAnimationFrame` loop** reading `Tone.Transport.progress` (`0..1`) only while `Tone.Transport.state === 'started'`; cancel the rAF handle cleanly on Pause, Lock Mix, or `visibilitychange` backgrounding.
3. **Debounce rapid key taps:** If a user taps 3 chords rapidly within one bar before the next downbeat, replace the queued chord preview immediately and fire `onChordSwap(bar, 'queued')` so only the latest candidate commits on `onBarStart`.
