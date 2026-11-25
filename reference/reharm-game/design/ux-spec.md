# REHARM — Mobile-First UX & State Architecture Specification

> **Primary Viewport:** `390 × 844` (iPhone Portrait, One-Thumb Ergonomics)  
> **Desktop Viewport:** `1280 × 800` (Centered Studio Hardware Chassis, max-width `960px`)  
> **Core Principle:** Every daily control sits naturally inside the bottom thumb arc (`y = 430px–810px`), zero vertical scrolling is required during active play on `390 × 844`, and no interactive tap target is smaller than `44 × 44px`.

---

## 1. Responsive Spatial Budget

### 1.1 Portrait Mobile (`390 × 844` Safe-Area Budget)

Accounting for ~`44px` iOS Safari URL/status chrome or PWA safe areas, the usable studio canvas fits within `780px` height (`padding: 12px 14px calc(14px + env(safe-area-inset-bottom))`):

| Zone | Height | Contents | Thumb Ergonomics |
| :--- | :---: | :--- | :--- |
| **Header Bar** | `48px` | `REHARM #42` mark + Key/BPM badge (`C MAJ · 96 BPM`) + 3 icon triggers (`?` Info, `📊` Stats, `⚙` Settings) | Top-edge low-frequency actions |
| **4-Bar Melody Timeline & Chord Strip** | `164px` | Recessed OLED melody contour well (`68px`) with animated vertical playhead sweep + 4 equal-width chord slots (`84px`) + `12px` inner spacing | Glanceable focal anchor (`4×84px` cards = `362px` total width with `8px` gaps) |
| **Fixed Feedback Strip** | `38px` | Single-row status pill: Queued countdown (`Next bar: Db7#11`), Legal Snap badge, or Soft Clash tip (`C melody rubs against B Maj`) | Fixed height prevents vertical layout shift |
| **Transport & Lock Bar** | `52px` | `Play/Pause` (`48×44`), `Loop` toggle (`44×44`), `Undo/Reset` (`44×44`), plus right-aligned **`Lock Mix`** primary amber CTA (`height: 44px`, `min-width: 112px`) | Thumb upper reach arc |
| **Bottom Input Drawer** | `~396px` | Mode header (`Chord Palette` \| `Piano Mode` segmented switch + `Helper` toggle pill) + either **2-Tap Chord Grid** (12 Roots `6×2` + 10 Qualities `5×2` + collapsible `/ Bass` rail) OR **Sticky 1.5-Octave Piano** (`C4–F5`) | Prime one-thumb zone (`y = 410–810px`) |

### 1.2 Desktop Scaling (`1280 × 800`)

- Centered hardware studio module (`max-width: 880px`, `margin: 0 auto`) sitting cleanly over `--bg-canvas` with `24px` breathing room.
- **Timeline Expansion:** Each of the 4 bar slots expands to `~196px` width, revealing live chord tones (`C E G B`) beneath the chord symbol (`CMaj7`) and displaying melodic note pitch names (`E4`, `G4`) inside the OLED pills on hover/playback.
- **Drawer Ergonomics:** In `Chord Palette` mode, the 12 roots arrange as a crisp `12×1` studio step-sequencer strip (`48px` height) above the `10×1` quality strip and optional `/ Bass` rail, giving instant desktop keyboard-like speed (`1–4` selects bar, `Space` plays/pauses). In `Piano Mode`, the full 1.5-octave (`18` keys `C4–F5`) spans smoothly across the drawer without horizontal scrolling.

---

## 2. Detailed Specification of All 8 Key Views & States

### View 1: First-Visit Landing & Tactile iOS Audio Unlock Gate
- **Problem Addressed:** Mobile Safari routes Web Audio to the hardware *Ambient/Ringer* channel and fails silently when a user's physical mute switch is on—and blocks `AudioContext` until a direct user gesture.
- **UX Solution:** Present a centered, inviting **"Power On Studio"** hardware console overlay (`z-index: 60`) styled like turning on a vintage Fender Rhodes / OP-1 synth—**never** an alarming browser error dialog.
- **Visual Anatomy:**
  - Recessed studio card (`max-width: 344px`, `--bg-surface`, `1px solid --border-strong`).
  - Centered `REHARM` wordmark (`assets/brand/logo.svg`) + daily edition tag (`PUZZLE #42 · C MAJOR · 96 BPM`).
  - Concise 1-line pitch: *"One daily 4-bar melody. Craft the rarest progression underneath."*
  - **Hero Tactile Power Switch / CTA:** Full-width (`height: 56px`, `--accent-primary-solid-bg`, `--accent-primary-solid-ink`) button labeled **`▶ TAP TO POWER STUDIO`** with subtle hardware chamfer and amber LED glow.
  - **Subtle Mobile Audio Hint Pill:** Beneath the button in `--text-muted` (`12px`): *"Routes warm Rhodes synth to media audio — works even on silent switch"* + subtle secondary ghost link *"Continue visually (muted)"* for commuters who genuinely want silent mode.
- **Interaction Contract:** Tapping the primary CTA triggers iOS `navigator.audioSession.type = 'playback'`, silent `<audio>` loop fallback, and `Tone.start()` in the engine before smoothly crossfading (`240ms`) into View 2 with playback queued on beat 1.

---

### View 2: Main 4-Bar Melody Timeline (Active Studio)
- **Recessed OLED Melody Display (`--bg-well`, `border-radius: 12px 12px 0 0`):**
  - Divided cleanly into **4 bar columns** (`Bar 1`..`Bar 4`) by subtle vertical `1px` ticks, with **16 sixteenth/beat sub-ticks** along the top ruler (`1`, `2`, `3`, `4` per bar).
  - **Melody Contour Pills:** Rounded horizontal pitch bars (`height: 6px`, `rx: 3px`) positioned vertically across a 1.5-octave normalized pitch range (`0%–100%`). No musical staff lines or clefs. Idle pills use `--pill-idle`; the currently sounding melody pill lights in `--pill-active` (`--glow-amber`) and scales subtly (`scaleY(1.25)`).
  - **Animated Playhead:** Crisp `2px` vertical amber laser (`--playhead-line` + soft trailing `16px` gradient beam) sweeping continuously across Bars 1→4 via CSS/rAF `transform: translateX(...)`.
- **4 Chord Slots Row (`grid-template-columns: repeat(4, 1fr)`, `gap: 8px`):**
  - **Bar 1 (Anchored / Locked State):**
    - Styled with `--accent-brass-bg`, `1px solid --accent-brass-border`, and a top-right brass padlock badge (`assets/icons/lock.svg`, `14×14`).
    - Displays `ANCHOR` micro-label (`10px`, uppercase tracked) + chord symbol (`CMaj7`, `18px JetBrains Mono`) + subtle Spice Tier pip (`◆ Jazz Std`).
    - Non-editable (`aria-disabled="true"`), tapping gives a gentle brass blink tooltip: *"Bar 1 is today's harmonic anchor."*
  - **Bars 2–4 (Editable Chord Slots):**
    - Minimum height `84px`, tappable whole surface (`>= 80×84px` on `390px` viewport).
    - Top strip: Bar index (`BAR 2`) + small 4-beat LED indicator dots (`••••`) that pulse sequentially while that bar plays.
    - Center: Bold tabular chord symbol (`AbMaj7`, `Db7#11`, `CMaj9`), or clean dashed outline + `+ Chord` prompt when empty.
    - Bottom strip: Spice Tier micro-tag (`● Safe`, `◆ Jazz`, `◐ Modal`, `▲ Deep`) OR micro-state pill (`QUEUED`, `CLASH`).
    - **Selected Bar Ring:** `2px solid --accent-primary` + subtle outer amber glow (`--glow-amber`).
- **Transport & Lock Mix Bar:**
  - Left cluster: `Play/Pause` tactile keycap (`48×44px`), `Loop` indicator toggle (`44×44px`, lit amber when active), `Undo/Reset` (`44×44px`), and live `96 BPM` monospace badge.
  - Right CTA: **`Lock Mix`** (`height: 44px`, solid `--accent-primary-solid-bg` when all 3 open bars are legal; disabled muted hardware state with tooltip *"Fill all 4 bars cleanly to lock"* while bars are empty or clashing).

---

### View 3: Bottom Thumb-Zone Input Drawer
Anchored cleanly at the bottom (`--bg-surface`, top border `1px solid --border-subtle`, `border-radius: 18px 18px 0 0` on mobile).

- **Drawer Header Strip (`44px`):**
  - **Input Mode Segmented Switch:** `[ ⊞ Palette | 🎹 Piano ]` (`min-height: 36px` inside `44px` row).
  - **Consonant Helper Toggle Pill:** Bulb icon (`helper-bulb.svg`) + `Helper` label + glowing teal status dot.
  - **Quick Bar Step Arrows / Selected Target Pill:** Shows `Editing Bar 3` with quick `<` `>` arrows or auto-advances smoothly on chord confirmation.

- **Mode A — 2-Tap Chord Palette:**
  1. **Root Grid (`6 × 2` on mobile, `12 × 1` on desktop):** `C`, `Db`, `D`, `Eb`, `E`, `F`, `Gb`, `G`, `Ab`, `A`, `Bb`, `B`. Each tactile keycap is `min-height: 44px`, `JetBrains Mono 600`, `--shadow-keycap`.
  2. **Quality Grid (`5 × 2` on mobile, `10 × 1` on desktop):** `Maj`, `m`, `7`, `maj7`, `m7`, `ø7`, `dim`, `sus`, `aug`, `alt`. Each keycap is `min-height: 44px`.
  3. **Optional `/ Bass` Slash-Note Tray:** Collapsible single-row button (`+ Slash Bass: / Ab ×`) expanding a horizontal chip scroller (`44px` height) to craft smooth basslines (`CMaj7/E`, `F/G`, `Db7#11/G`).
  4. **Beginner "Consonant Helper" Overlay:** When active, safe diatonic/consonant Roots and Qualities for the *currently selected bar's melody notes* display a crisp `6px` `--helper-dot` (`#5EC2B7` dark / `#0B5D56` light) LED pip in their top-right corner—zero clutter when toggled OFF for pros.

- **Mode B — Sticky 1.5-Octave Piano Mode:**
  - **Live Chord Recognition Header (`40px`):** Displays held pitch classes (`Db · F · Ab · Cb · G`) -> recognized chord badge (`Db7#11 · ▲ Deep Reharm`) + **`Clear`** (`44×36px`) + **`Apply to Bar 3`** confirm button.
  - **Touch-Friendly 1.5-Octave Keyboard (`C4` to `F5` — 11 white keys, 7 black keys):**
    - White keys are **`46px` wide × `128px` tall** (`> 44px` touch target minimum!) in a clean horizontal track (`overflow-x: auto` on `390px` so keys NEVER shrink below `44px`, with crisp left/right edge scroll affordance; fits 100% unclipped on desktop).
    - **Sticky Toggle Behavior:** Tapping any key toggles that note ON/OFF (no awkward multi-touch holding on phones!). Active keys illuminate in `--piano-active-bg` (`#E8A849`) with a tactile bottom amber LED bar and bold note label (`Db4`).
    - When **Consonant Helper** is ON, safe scale/melody-friendly keys carry a subtle teal dot above the key bottom label.

---

### View 4: Live Loop Micro-States (4 Explicit States)
All 4 states animate cleanly without layout shift inside the bar slot and `38px` feedback strip:

1. **Empty Bar (`empty`):**
   - Recessed dashed border (`1px dashed --border-strong`), muted `+ Tap chord` placeholder, Spice badge hidden. `Lock Mix` remains gated.
2. **Queued Bar-Boundary Swap Anticipation (`queued`):**
   - While looping, tapping a new chord queues it for the next bar downbeat (`Bar 3 -> Db7#11`) to prevent mid-measure audio clicks.
   - Slot shows `--state-queued-bg`, pulsing amber border (`--state-queued-border`), subtle top-right pill `NEXT BAR`, and a beat countdown ring (`• • ◦`) syncing to the current bar's remaining beats.
   - At beat 1 of the next bar, it blooms cleanly into the active chord.
3. **Legal Chord Snap (`legal`):**
   - On boundary lock (or instant assignment while paused), slot triggers a `240ms` spring micro-snap + brief `--state-legal-bg` emerald edge flash (`400ms`), settling immediately into its earned Spice Tier accent color (`● Safe` / `◆ Jazz` / `◐ Modal` / `▲ Deep`).
   - Feedback strip displays: `✓ Bar 3 locked · Db7#11 creates #11 tension over G melody`.
4. **Dissonant Clash Shake (`clash`):**
   - When a chosen chord creates a harsh minor-9th/cross-relation clash with an accented melody note (e.g., `BMaj7` against held `C5` melody):
   - Bar performs a crisp horizontal hardware shake (`±5px`, `320ms`), illuminates in `--state-clash-bg` / `--state-clash-border`, and shows a **non-punishing engineer tip** in the feedback strip:
     `⚠ Clash on Bar 3: C melody rubs against B Maj (b9). Try Bm7, Cmaj7, or AbMaj7.`
   - Does **not** erase the user's input or lock them out; lets them adjust immediately or tap a suggested chip.

---

### View 5: "Lock Mix" Score Reveal Ceremony
Triggered when the player clicks **`Lock Mix`** on a complete 4-bar legal progression:
- **Krillion-Style Dramatic Modal / Full-Panel Reveal (`max-width: 440px`):**
  1. **Header:** `PUZZLE #42 · LOCKED IN` + mini 4-bar chord strip (`CMaj7 · AbMaj7 · Db7#11 · CMaj9`) with tap-to-audition mini play button.
  2. **Hero Score Ring / Counter:** Large `Space Grotesk 56px` tabular count-up from `00` → **`91`** `/ 100` alongside animated percentile pill **`Top 4% Spice 🌶`** (`--tier-deep-fg`).
  3. **3-Axis Staggered Breakdown Meters:**
     - **Harmonic Rarity (`46 / 50`)** — *"Tritone Sub (`bII7 → I`) + Modal Borrow (`bVI`)"*
     - **Melody Color (`23 / 25`)** — *"Melody `G` lands on `#11` of `Db7#11`"*
     - **Bassline Flow (`22 / 25`)** — *"Smooth 3-semitone average motion (`C → Ab → Db → C`)"*
  4. **Unlocked Harmonic Flavor Badges:** Stamped-in collectible hardware pins (`assets/badges/*.png`, `56×56` crisp circular medallions) with badge title and short theory callout (`Modal Borrow`, `Tritone Sub`, `#11 Melody`, `Smooth Bass`).
  5. **Primary Actions:** **`Share Mix`** (`--accent-primary-solid-bg`), **`▶ Replay Mix`**, and **`View Stats`**.

---

### View 6: Viral Share Modal
- Opens from Score Reveal or already-completed header badge.
- **Spoiler-Free Share Card Preview (`--bg-well` recessed terminal box, `JetBrains Mono 13px`):**
  ```text
  🎛️ REHARM #42 — 91/100 (Top 4% Spice)
  Bar 1 🔒 | Bar 2 🟣 | Bar 3 🔥 | Bar 4 ✨
  Badges: 🌙 Modal Borrow · ⚡ Tritone Sub · 💎 #11 Melody
  Bassline Flow: 🧈 Smooth (3 st avg)
  ▶ Hear my mix: reharm.app/#42:CMaj7.AbMaj7.Db7s11.CMaj9
  ```
- **Action Controls:**
  - **`Copy Playable Link & Card`** (`48px` primary amber button): Copies full card + URL, morphs cleanly for `2s` into **`✓ Copied to Clipboard!`** (`--state-legal-bg`).
  - **`Copy Link Only`** (`44px` secondary hardware keycap): Copies bare `reharm.app/#42:...` link for quick DM pasting.
  - Note: Modal footer gently reminds `"Your chord names live only in the link — safe to paste in Discord without spoiling!"`

---

### View 7: Shared-Mix Receiver Screen (`#42:...`)
Displayed when opening a friend's playable share URL (`reharm.app/#42:CMaj7.AbMaj7.Db7s11.CMaj9`):

- **State 7A — Unplayed Today (Zero-Spoiler Protection Default):**
  - Clear banner: **`ALEX'S MIX · PUZZLE #42`** (`Score: 91/100 · Top 4% Spice`).
  - **Hero Play Button:** Oversized tactile **`▶ HEAR ALEX'S MIX`** (`56px` height) driving the live 4-bar OLED melody timeline + friend's bass/chord motion.
  - **Spoiler Veil on Chord Slots:** Bars 2–4 display Spice Tier color & geometric tier badges (`🔒 Anchor`, `◐ Modal`, `▲ Deep`, `◆ Jazz`) while hiding raw chord symbols behind a subtle frosted hardware shutter (`Tap to peek chords` opt-in toggle) so the recipient's own daily attempt isn't spoiled by reading!
  - **Earned Badges Row:** Shows Alex's unlocked hardware medallions (`Modal Borrow`, `Tritone Sub`, `#11 Melody`).
  - **Primary CTA:** Bold **`🎹 Play Today's Reharm`** (`52px` amber button) transitioning directly into View 1/2 to compose their own take.

- **State 7B — Already Played Today (Side-by-Side A/B Compare Mode):**
  - Toggleable **`[ Play Alex (91) ]` vs `[ Play Yours (84) ]`** live A/B switcher right above a stacked 4-bar comparison grid showing Bar 1..Bar 4 side-by-side (`Alex: AbMaj7 → Db7#11` vs `Yours: Fmaj7 → G7alt`), delta score badge (`+7 Spice`), and shared vs unique badges.

---

### View 8: 15-Second How-to-Play, Stats/Streak Drawer & Settings
1. **15-Second Visual How-to-Play Modal:**
   - **3 Visual Micro-Cards (scannable in 15s):**
     1. *Listen & Pick a Bar:* Illustrated 4-bar strip with pulsing playhead (`Bar 1` brass-locked).
     2. *Drop Chords with 2 Taps:* Visual `Root + Quality` keycaps (or Piano Mode + optional teal Helper dots).
     3. *Chase Rare Harmony:* 4-tier color legend (*Radio Safe -> Jazz Standard -> Modal Interchange -> Deep Reharm*) showing how rarer legal resolutions earn higher scores + collectible pins.
2. **Stats & Streak Drawer:**
   - **4 KPI Tiles (`2×2` mobile, `4×1` desktop):** `Played` (`14`), `Avg Score` (`82`), `Current Streak` (`🔥 9`), `Best Spice` (`96`).
   - **Score Distribution Histogram:** 4 horizontal Spice-Tier bars (`0–49 Safe`, `50–74 Jazz`, `75–89 Modal`, `90–100 Deep`) with today's bracket highlighted in amber.
   - **Trophy Case (8 Harmonic Flavor Pins):** `4×2` grid displaying full-color matte-enamel pin PNGs (`assets/badges/*.png`) for unlocked badges (with earn counts like `×3`) and crisp recessed monochrome silhouettes for locked badges with unlock hints on tap.
3. **Settings Sheet:**
   - **Studio Theme:** `[ Midnight (Dark) | Daylight (Light) ]` live switch.
   - **Consonant Helper Default:** Toggle switch (shows subtle teal LEDs on safe diatonic options).
   - **Sound & iOS Playback Hint:** Audio mute/unmute toggle + concise iOS hardware mute-switch explanation & audio-session status indicator (`Media Channel Ready`).
   - **Reduced Motion:** Respects OS `prefers-reduced-motion` automatically plus manual override toggle.
