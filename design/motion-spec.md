# Reharm Daily — Motion, Micro-Interaction & Optional UI Audio Spec

> **Design Intent:** Tactile print-and-ink clarity (`80–360ms`, crisp paper settle, zero sluggish bounce) paired with rewarding red-pen completion stamps.  
> **Performance Rule:** Animate strictly GPU-composited properties (`transform`, `opacity`, `clip-path`). Never transition `height`, `width`, `top`, or `left`.  
> **Accessibility:** `@media (prefers-reduced-motion: reduce)` and `[data-reduced-motion="true"]` zero all motion tokens (`--dur-*: 0ms`) cleanly in `design/tokens.css`.

---

## 1. Motion Duration & Easing Tokens

Synchronized directly with [tokens.css](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/tokens.css) and [tokens.json](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/tokens.json):

| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--dur-instant` | `80ms` | Card/button press depression (`scale(0.985)`), icon toggle |
| `--dur-fast` | `140ms` | Hover border lift, bell toggle swap, focus transition, copy-button swap |
| `--dur-normal` | `240ms` | Sheet backdrop fade, toast entrance, share tab switch |
| `--dur-stamp` | `320ms` | Red-pen `"DONE ✓"` rubber-stamp drop onto completed card |
| `--dur-smooth` | `360ms` | Bottom Game Detail Sheet slide-up, Launch transition card focus |
| `--dur-ceremony` | `850ms` | Segmented daily progress meter fill + streak tick count |
| `--dur-celebrate` | `1100ms` | End-of-day Clean Sheet confetti-dot / ink-flourish reveal |
| `--ease-snap` | `cubic-bezier(0.2, 0.9, 0.3, 1)` | Crisp tactile button press & sheet controls |
| `--ease-spring` | `cubic-bezier(0.34, 1.45, 0.64, 1)` | Streak flame micro-pop & bell confirmation bounce |
| `--ease-stamp` | `cubic-bezier(0.22, 1.28, 0.36, 1)` | Rubber-stamp impact (`scale(1.38) -> scale(0.97) -> scale(1)`) |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Board load-in, sheet slide-in, meter fill |
| `--ease-linear` | `linear` | Countdown tick / continuous fades |

---

## 2. Choreography Catalogue

### 2.1 Board Load-In (`board-enter`)
- **Trigger:** Initial page render or Today Board view switch.
- **Timing:** Masthead & Ritual Bar fade in immediately (`0ms`, `opacity: 0 -> 1` over `var(--dur-normal)`). Game cartridges enter with a subtle vertical settle (`translateY(10px) -> 0`, `opacity: 0 -> 1`, `var(--dur-normal) var(--ease-out)`), staggered `40ms` per card (`calc(var(--card-index) * 40ms)`), capped at index `6` (`240ms` max delay).
- **Reduced Motion:** All cards appear at `opacity: 1; transform: none` immediately (`0ms`).

### 2.2 Card Hover & Press (`card-tactile`)
- **Trigger:** Pointer hover (`@media (hover: hover)`) and `:active` press on `.game-card`.
- **Hover:** Card shifts `transform: translateY(-2px)` over `var(--dur-fast) var(--ease-snap)` and elevates shadow from `--shadow-card` to `--shadow-card-hover`; cover art inside `.cover-window` stays crisp (`scale(1.015)` subtle frame zoom). Coming-soon dashed cards do not lift vertically — only strengthen border contrast.
- **Press (`:active`):** `transform: translateY(1px) scale(0.992)` over `var(--dur-instant) var(--ease-snap)` (tactile paper-card press).
- **Reduced Motion:** Zero `translateY`/`scale`; hover relies solely on border weight/color change (`--border-strong` -> `--border-ink`).

### 2.3 Card → Game Launch Transition (`launch-handoff`)
- **Trigger:** Clicking **`Play`** on a live game card or inside the Game Detail Sheet.
- **Sequence (`340ms` total before navigation or prototype launch overlay):**
  1. Card briefly pulses its CTA (`scale(0.98)` -> `scale(1)` over `80ms`).
  2. The cover window cross-fades cleanly into a centered studio transition veil (`opacity: 0 -> 1`, `var(--dur-normal) var(--ease-out)`) displaying the target game's mark, puzzle `#42`, and *"Opening REHARM…"* (`200ms` visual bridge so switching origins feels continuous rather than a blank white flash).
  3. On return (`visibilitychange` / `pageshow` from browser back), the board fades in cleanly (`--dur-fast`).
- **Reduced Motion:** Instant cross-fade (`0ms`) or direct link navigation.

### 2.4 `"DONE ✓"` Red-Pen Stamp (`stamp-done`)
- **Trigger:** Returning to the hub when a game newly reports `status: "done"` today (or clicking `Stamp Done ✓` in the prototype).
- **Keyframes:**
  ```css
  @keyframes daily-stamp-land {
    0%   { opacity: 0; transform: rotate(-14deg) scale(1.48); }
    65%  { opacity: 1; transform: rotate(-5.5deg) scale(0.94); }
    100% { opacity: 1; transform: rotate(-6deg) scale(1); }
  }
  ```
- **Duration / Easing:** `var(--dur-stamp)` (`320ms`) with `var(--ease-stamp)`. Simultaneously flashes a subtle `240ms` sage-ink highlight ring (`opacity: 0.7 -> 0` pseudo-element) around the card frame.
- **Reduced Motion:** Stamp appears immediately at its resting `-6deg` badge angle with `opacity: 1` and zero scale/drop animation.

### 2.5 Segmented Progress Meter Fill (`meter-fill`)
- **Trigger:** Completing a game or switching state to `Mid-Day` / `All Done`.
- **Motion:** Each `.meter-seg` fill sits inside an inner `::after` bar animated via `transform: scaleX(1)` from `transform-origin: left center` over `var(--dur-smooth)` (`360ms`) `var(--ease-out)`, staggered `60ms` across newly filled segments.
- **Reduced Motion:** Width/scale snaps immediately (`0ms`) to final state.

### 2.6 Streak Tick (`streak-tick`)
- **Trigger:** First daily completion of the day increments `currentStreak` (`5d -> 6d`).
- **Keyframes:**
  ```css
  @keyframes daily-streak-pop {
    0%   { transform: scale(1); }
    45%  { transform: scale(1.22) translateY(-2px); }
    100% { transform: scale(1) translateY(0); }
  }
  ```
- **Duration / Easing:** `var(--dur-smooth)` (`360ms`) `var(--ease-spring)` on the flame icon + tabular number swap (`translateY(6px) -> 0` over `200ms`).
- **Reduced Motion:** Number increments cleanly in place with zero scale/translate motion.

### 2.7 End-of-Day All-Done Celebration (`clean-sheet-celebrate`)
- **Trigger:** Last live game of the day transitions to `done` (`played === totalLive`).
- **Motion:**
  1. All-Done broadsheet banner expands smoothly (`opacity: 0 -> 1`, `translateY(-8px) -> 0` over `var(--dur-smooth) var(--ease-out)`).
  2. **`CLEAN SHEET ✓`** stamp lands (`320ms --ease-stamp`, `140ms` delay).
  3. 8 lightweight CSS-only geometric confetti ticks (Reharm Lab wash colors: blue, mustard, brick, sage — small `6×6` squares/notes around the stamp) drift outward `18–32px` and fade out over `var(--dur-celebrate)` (`1100ms`), purely decorative (`aria-hidden="true"`, pointer-events none, zero continuous loop).
- **Reduced Motion:** Banner and `CLEAN SHEET ✓` stamp appear statically with zero confetti particles.

### 2.8 Share-Card Reveal & Copy Morph (`share-reveal`)
- **Trigger:** Opening Share Modal + clicking `Copy Share Card`.
- **Reveal:** Modal rises (`translateY(14px) -> 0`, `opacity: 0 -> 1` over `var(--dur-normal) var(--ease-out)`). Terminal lines gently fade in as a single block (no typewriter delay that blocks copying!).
- **Copy Morph:** Button background shifts smoothly from `--accent-primary-solid-bg` to `--status-done-fg` (`140ms`), label switches to `✓ Copied to Clipboard!`, holds `2000ms`, and reverts cleanly.
- **Reduced Motion:** Instant modal display (`0ms`) and crisp text-only state change on copy.

---

## 3. Optional Hub UI Micro-Sounds (Off When Muted)

All hub audio is optional, defaults to **muted when OS/Settings `mutedDefault === true`**, unlocks lazily inside the user gesture (`AudioContext` resume), and uses tiny Web Audio oscillators (no external MP3 files):

| Event | Timbre | Pitch / Notes | Envelope & Length |
| :--- | :--- | :--- | :--- |
| **Stamp Done ✓** | Warm soft Rhodes/marimba fifth | `C5` (`523.25 Hz`) -> `G5` (`783.99 Hz`) | `10ms` attack, `160ms` exp decay, gain `0.08` |
| **Clean Sheet (All Done)** | Gentle 4-note major-9th arpeggio | `C5 → E5 → G5 → D6` (`70ms` apart) | Soft sine+triangle, `280ms` tail, gain `0.07` |
| **Bell Toggle On** | Crisp brass ping | `A5` (`880 Hz`) | `4ms` attack, `90ms` decay, gain `0.05` |
| **Copy Share Card** | Subtle paper-tick pop | Filtered click (`1200 Hz` bandpass) | `25ms` burst, gain `0.04` |
