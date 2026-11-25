# Reharm Daily — Two-Way Bridge Specification (Lab ↔ Hub ↔ Games)

> **Goal:** A player can travel **Reharm Lab → Reharm Daily Hub → Game → Hub → Next Game → Reharm Lab** without ever feeling they left the same instrument family, while each app keeps its own visual skin and zero backend infrastructure.

---

## 1. Bridge Piece #1 — Entry Point Inside Reharm Lab

### Empirical Layout Findings from Live `itailiors.github.io/reharm-lab/`
Inspecting the live DOM ([reharm-lab-1280.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/reference/screens/reharm-lab-1280.png) and [reharm-lab-390.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/reference/screens/reharm-lab-390.png)) reveals two critical constraints:
1. On `390×844` mobile, `tablist "Mode"` (`Study | Practice | Coach | Changes | Voicings`) measures **`348px` wide inside a `360px` container**. **Do NOT add a 6th tab inside `Mode`** — it would wrap or overflow horizontally.
2. Directly above `Mode` in the top action toolbar, Row 2 currently holds ONLY `📒 Progress` (`111px` wide), leaving **`~240px` of open parchment** on the right. On `1280×800` desktop, `nav[aria-label="Main"]` (`80px` left rail) also has open vertical space right below the 3rd icon (`Play`).

### Placement & Mockup Composites
- **Primary Entry (All Viewports):** A Rough.js double-pass pill button **`Daily`** placed immediately to the right of `📒 Progress` in the top action toolbar.
  - **Mobile (`390×844`):** Slots straight into Row 2 beside `Progress` with **zero extra vertical rows** ([lab-bridge-mockup-mobile.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-bridge-mockup-mobile.png)).
  - **Desktop (`1280×800`):** Sits beside `Progress` in the toolbar AND mirrors as a `48×48` Rough.js folio icon inside the `80px` left sidebar below `Play` ([lab-bridge-mockup-desktop.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-bridge-mockup-desktop.png)).

![Reharm Lab Desktop Entry Mockup](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-bridge-mockup-desktop.png)
![Reharm Lab Mobile Entry Mockup](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-bridge-mockup-mobile.png)

### Visual Anatomy & SVG Assets
- **Unplayed State (`unplayed > 0`):** Warm `--color-paper-light` fill, Rough.js `--color-ink` double border, miniature calendar-sheet icon, `Kalam` bold label `"Daily"`, and a **teacher's red-pen circular counter** (`--color-pen` fill, `--color-paper-light` tabular numeral `1`..`7`) + subtle `↗` indicator.
  - Ink & Parchment SVG: [lab-daily-pill.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-daily-pill.svg)
  - Northgate Dark SVG: [lab-daily-pill-northgate.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-daily-pill-northgate.svg)
  - Desktop Left-Rail SVG: [lab-daily-sidebar-icon.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-daily-sidebar-icon.svg)
- **All-Done State (`unplayed === 0`):** Counter flips from red-pen `1` to `--color-sage-ink` (`#4A6A3A` light / `#A5BD7C` dark) checkmark badge with soft sage watercolour wash ([lab-daily-pill-done.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-daily-pill-done.svg)).
- **Theme-Agnostic Implementation in Reharm Lab:** Reads `daily:v1:*` (and `reharm:v1:history`) from same-origin `localStorage` on mount & `focus` to compute today's unplayed count; falls back cleanly to `"Daily ↗"` with no count badge if storage is blocked. Uses Reharm Lab's CSS variables (`--color-paper-light`, `--color-ink`, `--color-pen`, `--color-sage-ink`, `--font-marker`) so **Ink & Parchment**, **Northgate**, and **Panam** themes all style it automatically.

---

## 2. Bridge Piece #2 — Drop-In Game Strip (`← Reharm Daily`) & Post-Game Nudge (`Next Game`)

### Empirical Layout Constraint from Live `itailiors.github.io/reharm/`
Inspecting REHARM's DOM ([reharm-game-390.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/reference/screens/reharm-game-390.png)) shows:
- On `390×844`, `.studio-header` (`#1 · Eb MAJ` + 3 right icons) has only **`14.67px`** of horizontal slack between `.brand-lockup` (`right: 223.33px`) and `.header-actions` (`left: 238px`).
- Meanwhile, the vertical flex layout between the transport bar (`y = 357px`) and the bottom drawer (`y = 465px`) has **`108px`** of open vertical headroom!

**Decision:** Never cram `← Reharm Daily` inside a game's tight header row. Mount a **`38px`-tall top family strip (`.daily-bridge-bar`)** cleanly above `<header>`, keeping the interactive `← Reharm Daily` back link at **`44px` hit height** (extending via negative vertical padding or `min-height: 38px` full-bar tap zone / `44px` hitbox).

![Drop-in Game Bridge Skin Comparison](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/game-bridge-skins-comparison.png)

### 2.1 The 6-Variable Skin Contract (`--bridge-*`)
Any daily game mounts the exact same lightweight HTML/Web Component snippet and supplies just **6 CSS variables** on `:root` or `.daily-bridge-host`:

| Variable | Purpose | REHARM (Midnight) | STEPWISE (Drafting Paper) |
| :--- | :--- | :--- | :--- |
| `--bridge-bg` | Strip backdrop | `#16181D` | `#EFECE3` |
| `--bridge-surface` | Result/card container | `#191B20` | `#FFFFFF` |
| `--bridge-elevated` | Next-game card fill | `#22252C` | `#EAE6DC` |
| `--bridge-border` | Hairline divider | `#2B2F3A` | `#C8C1B2` |
| `--bridge-text` | Primary copy | `#F4F1EA` | `#182026` |
| `--bridge-muted` | Secondary metadata | `#B2B6C2` | `#4C565E` |
| `--bridge-accent` | Back link & primary CTA fill | `#E8A849` | `#0F5E57` |
| `--bridge-accent-ink` | Ink inside Next-Game CTA | `#14120E` | `#FBF3DF` |

*(Plus `--bridge-font` and `--bridge-mono` inheriting each game's sans and monospace fonts.)*

### 2.2 Component A — Top Family Strip (`.daily-bridge-bar`)
```html
<nav class="daily-bridge-bar" aria-label="Reharm Daily navigation">
  <a class="daily-back-link" href="https://itailiors.github.io/reharm-daily/">
    <span aria-hidden="true">←</span>
    <span>Reharm Daily</span>
  </a>
  <a class="daily-ritual-mini" href="https://itailiors.github.io/reharm-daily/" aria-label="Daily progress: 1 of 3 puzzles played">
    <span class="daily-mini-count">1/3 today</span>
    <span class="daily-mini-dots" aria-hidden="true">
      <i class="is-done"></i><i></i><i></i>
    </span>
  </a>
</nav>
```
- **Mobile (`390×844`):** `height: 38px` visual bar (`padding: 0 12px`) with `min-height: 44px` extended tap target via `padding-block` / `:before` hit area on `.daily-back-link`. Preserves zero-scroll fit inside `844px`.
- **Desktop (`1280×800`):** Centered inside the game's max-width (`920px` for REHARM) or full-bleed top strip (`border-bottom: 1px solid var(--bridge-border)`).

### 2.3 Component B — Post-Game Nudge (`.daily-next-card`)
Shown inside each game's Score Reveal / Results modal below its primary Share/Replay buttons:
```html
<aside class="daily-next-card" aria-label="Next daily puzzle">
  <div class="daily-next-info">
    <span class="daily-next-eyebrow">Up Next on Today's Sheet</span>
    <strong class="daily-next-title">STEPWISE #42</strong>
    <span class="daily-next-meta">~2 min · Silent-friendly · Voice-leading</span>
  </div>
  <a class="daily-next-cta" href="https://itailiors.github.io/stepwise/">Play Next →</a>
</aside>
```
- **Smart Selection Rule:** Reads `daily:v1:*` for the first unplayed `status: "live"` game in catalog order.
- **Launch Day (1 Live Game) & All-Done Fallback:** When no other live daily games remain unplayed today, `.daily-next-card` automatically flips to **"All Daily Puzzles Complete! Return to Today's Sheet"** (CTA: `Share Combined Card →` linking to `https://itailiors.github.io/reharm-daily/?open=share`) or points to **"Practice: Make the Changes"** in Reharm Lab.

---

## 3. Bridge Piece #3 — `"Learn this move in Reharm Lab"` Chip

### Purpose & Aesthetic Rule
Unlike `.daily-bridge-bar` (which adopts the host game's skin), the **Lab Move Chip (`.daily-lab-chip`)** deliberately wears a mini **Reharm Lab parchment & ink pill** (`#FBF3DF` surface, `1.8px solid #1E2A78`, `RL` folio badge, `Kalam` move title, red-pen `#A52213` action label `"Open Lab ↗"`). That unmistakable paper cue teaches players: *"Clicking this opens the practice notebook in Reharm Lab."*

### Where It Appears
1. **In any Game's Results / Breakdown Modal:** Dynamically attached to detected harmonic/theory concepts (e.g., REHARM's unlocked `Tritone Sub`, `Backdoor Dominant`, `Modal Interchange`, `Chromatic Mediant`; STEPWISE's `Diminished Pivot`; MEND's `Lydian #4`).
2. **In the Hub's Game Detail Sheet:** Appears for completed games under today's result summary so players can jump straight from reviewing yesterday/today's score into practice.

### URL Deep-Link Contract (Forward-Compatible)
Live Reharm Lab inspection showed it currently reads `?tune=coop-blues&level=2&key=F`, while tab switching (`Study`, `Coach`, `Changes`) is internal state. We define this clean additive query contract for Claude Code to wire in Reharm Lab (which degrades gracefully to opening the default tune today):

| Context | Target URL | Intended Lab Landing Behavior |
| :--- | :--- | :--- |
| **Specific Reharm Move** | `https://itailiors.github.io/reharm-lab/?move=tritone-sub&from=reharm` | Opens `Coach` → `Concept Drill` (or `Study` move highlight) pre-selected to `Tritone substitution`, showing a subtle `"← Back to Reharm Daily"` return toast. |
| **Make the Changes (Hub Card)** | `https://itailiors.github.io/reharm-lab/?mode=changes&from=reharm-daily` | Opens directly inside the `Changes` (`Make the Changes`) tab instead of `Study`. |
| **General Practice Fallback** | `https://itailiors.github.io/reharm-lab/?from=reharm-daily` | Opens default Lab view with the `Daily` toolbar pill active. |

**Canonical `move` Slugs:** `tritone-sub`, `backdoor-dominant`, `modal-interchange`, `chromatic-mediant`, `secondary-ii-v`, `upper-structure`, `diminished-pivot`, `lydian-sharp4`.
