# Reharm Daily — UX & Multi-State Screen Specification

> **Primary Mobile Viewport:** `390 × 844` (iPhone Portrait, One-Thumb Bottom-Reach Sheets)  
> **Primary Desktop Viewport:** `1280 × 800` (Centered Editorial Broadsheet, `max-width: 1040px`)  
> **Non-Negotiables:** Touch targets `>= 44 × 44px`, full keyboard tab order + `:focus-visible` ring, WCAG AA contrast, color never the sole status cue, clear "Muted-Friendly" visibility on every card.

---

## 1. Responsive Spatial Budget

### 1.1 Mobile (`390 × 844`)
- **Canvas Padding:** `12px 14px calc(24px + env(safe-area-inset-bottom))` (`362px` inner width).
- **Sticky Masthead (`56px` height):**
  - Left: Compact `Reharm Daily` folio lockup (`36px` tall).
  - Right: Edition/Streak pill (`#42 · 🔥 5`, `min-height: 44px`), Help `?` (`44×44px`), and Settings `⚙` (`44×44px`).
- **Daily Ritual Strip (Full-Width Card):**
  - Top row: `"Today · X of N played"` + streak pill + `Share Today` button (`44px` height, disabled muted state with tooltip `"Play 1 puzzle to unlock today's card"` until `played >= 1`).
  - Bottom row: Segmented N-tick progress meter (`7px` tall segments matching live daily count) + live local-midnight countdown (`Resets in 04:12:09`).
- **Lead / Featured Card (Launch State & Flagship):** Full width, `16:9` cover window (`338×190px`), title + dual-coded status pill + time/muted chips + 2-line pitch + `48px` primary CTA.
- **Secondary / Coming-Soon Grid:** Single-column compact rows for live games (or `2-column` `175px` cards for compact planned shelf on mobile, ensuring every interactive bell button stays `44×44px` minimum!).
- **Bottom Detail Sheet:** Slides up from bottom (`max-height: 88dvh`, rounded `20px 20px 0 0`) so Play/Notify/Close sit squarely in the thumb arc.

### 1.2 Desktop (`1280 × 800`)
- **Centered Broadsheet (`max-width: 1040px`, `margin: 0 auto`, `padding: 24px 32px`):**
  - **Masthead (`64px`):** Full `logo.svg`, puzzle date (`Tue, Nov 25 · #42`), streak/stats button, `?` intro replay, `⚙` settings.
  - **Ritual & All-Done Strip:** Single horizontal bar pairing progress meter, midnight countdown, and primary `Copy Today's Share Card` button.
  - **Today Grid:**
    - **Launch Mode (1 live + 6 planned):** `1.15fr` Featured Flagship card on the left + `0.85fr` Reharm Lab Practice card (`Make the Changes`) on the right (`>= 44px` action buttons), followed cleanly below by a `3-column` Coming Soon Blueprint Shelf (`2 rows × 3 cards`).
    - **Full Roster Mode (7+ live):** Asymmetric `2-column` spotlight (`2×` top featured cards or `1` hero + `6` uniform `3-column` live cartridges) plus the dedicated `Practice Inside Reharm Lab` shelf below a ruled divider.
  - **Detail / Share / Stats Modals:** Centered floating broadsheet dialogs (`max-width: 480px`) with dimmed `--bg-backdrop`.

---

## 2. Screen-by-Screen & State-by-State Specification

### State 1: Launch Day Today Board (1 Live + 6 Coming Soon + Lab Practice)
- **Visual Hierarchy (Top → Bottom):**
  1. **System Banner Slot (Collapsed unless needed):** Storage-Blocked or Offline warning banner if applicable.
  2. **Daily Ritual Card:** Reads `Today · 0 of 1 played` (or `1 of 1 · Clean Sheet! ✓` once REHARM is completed). Note: Launch Day meter renders **1 bold live segment** (or 1 live + 6 faint dashed "upcoming" ghost ticks so players see the family roadmap without feeling penalized!).
  3. **Today's Live Puzzle (Hero Card — `REHARM`):**
     - Crisp framed cover (`reharm.svg`).
     - Badges: `[ ● New Today ]` (or `[ ✓ Done · 91/100 ]`), `[ ~3 min ]`, `[ 👁 Muted-Friendly (Partly) ]`.
     - Actions: Full-width **`▶ Play REHARM`** (`48px`) + secondary **`Details & Rules`** (`44px`). When `done`, primary CTA flips cleanly to **`▶ Hear & Compare`** + **`Learn Move in Lab ↗`**.
  4. **Reharm Lab Practice Strip (`Make the Changes`):**
     - Explicitly labeled **`PRACTICE · NOT IN DAILY STREAK`** badge so players know practicing never breaks or gates their daily ritual.
     - Thumbnail (`make-the-changes.svg`), one-line pitch, `~5 min · Sound On`, **`Open in Reharm Lab ↗`**.
  5. **Coming Soon Shelf (`6 Planned Games`):**
     - Section header: **`On the Workbench (6 Upcoming)`** + counter `"X notified"`.
     - Cards for `CHORD TRENCH`, `STEPWISE`, `QUARTET`, `MEND`, `BARLINE`, `TAVDLE`.
     - Each card shows desaturated cover + tilted `COMING SOON` stamp, title, 1-line pitch, est. time, muted-friendly pill, and a **`44×44` local Bell toggle** (`Notify me` -> `Notified ✓`). Clicking the card body opens its Game Detail Sheet preview!

### State 2: Mature Roster Today Board (7+ Live Games)
- Triggered when 7 daily games are `status: "live"` (simulated via `Mid-Day (3/7)` and `All Done (7/7)` in the prototype).
- **Ritual Card:** `Today · 3 of 7 played` with 7 crisp segmented ticks (Done = sage-green filled, In Progress = mustard half-filled, Unplayed = recessed parchment).
- **Smart Sort Order (Actionable First):**
  1. `In Progress` cards first (e.g., `STEPWISE · Step 2/4`, `MEND · 2/4 bugs fixed`) with **`Resume →`** CTA.
  2. `New Today` cards next (`CHORD TRENCH`, `QUARTET`, `BARLINE`, `TAVDLE`) with **`▶ Play`** CTA.
  3. `Done Today` cards settle cleanly at the bottom (keeping full score badge + red-pen `DONE ✓` corner stamp + `Share` / `Lab Move ↗` actions) so players always see what's left without scrolling past completed cards!
  4. `Make the Changes` stays anchored in the bottom **Practice in Reharm Lab** shelf.

### State 3: End-of-Day "All Done" Celebration
- Triggers automatically when `playedTodayCount === liveGames.length` (works identically at Launch `1/1` AND Full Roster `7/7`!).
- **All-Done Broadsheet Card:**
  - Warm brass-tinted parchment surface (`--accent-brass-bg`), bold red-pen stamp **`CLEAN SHEET ✓`**.
  - Headline: *"All puzzles played today!"* (`7 of 7 · Average 89 · 🔥 6-day streak`).
  - Live local-midnight countdown: **`Next sheet drops in 04:12:09`**.
  - Primary CTA: **`↗ Copy Combined Share Card`** (`48px`).
  - Secondary CTA: **`Keep Practicing in Reharm Lab →`** (links to `Make the Changes` so players who still want music time have an immediate next step!).

### State 4: Game Detail Sheet (Bottom Sheet on Mobile / Centered Modal on Desktop)
Triggered when tapping any card's body or `Details` button (supports all 3 game statuses: `live`, `planned`, `lab`):
- **Header:** `16:9` cover preview, game title, puzzle `#42`, Close `✕` button (`44×44px`).
- **Quick Facts Strip:** Est. time (`~3 min`), Muted-Friendly label (`Silent OK` / `Partly — visual playhead` / `Audio required`), Scoring rule (`Score 0–100 + rarity`).
- **How to Play (Strictly 3 Scannable Lines):**
  - Numbered `1 · 2 · 3` micro-steps (e.g., for REHARM: `1. Hear the 4-bar melody (Bar 1 is locked). 2. Drop chords into Bars 2–4 using the 2-tap palette or piano. 3. Lock your mix — legal passes, rarer moves score higher.`).
- **Today's Status & Stats Panel:**
  - *If Live & Done:* Today's score (`91/100 · Top 4% Spice`), unlocked badges strip, **`Learn <Move> in Reharm Lab ↗`** deep-link chip, plus 3 stat tiles (`Played`, `Streak`, `Best`), plus **`Archive →`** link (if game supports an archive).
  - *If Live & Unplayed / In Progress:* Your personal stats (`Played`, `Streak`, `Best`), plus **`▶ Play Now`** (`48px` primary CTA).
  - *If Coming Soon (`planned`):* Honest status note (*"In design/build — no account needed. Turn on a local reminder badge so it highlights here on launch day."*) + **`🔔 Notify me on this device`** toggle button (`48px`) + secondary **`Close`**.

### State 5: First Visit (1-Screen Intro, Zero Signup, 1-Tap Play)
- Shown once when `daily:v1:hub:prefs.seenIntro !== true` (and never shown again once dismissed; replayable anytime via header `?`).
- **Visual Anatomy:** Centered broadsheet card (`max-width: 400px`) over dimmed `--bg-backdrop`:
  - Hub `logo.svg` + `"One daily sheet. Every music puzzle in one place."`
  - **3 Crisp Visual Rows (10-second scan):**
    1. `📅 Play at your pace` — Pick any puzzle (`REHARM` is live today); new puzzles drop at midnight.
    2. `👁 Commute-friendly flags` — Every card tells you upfront if you can play silently.
    3. `🎹 Linked with Reharm Lab` — Keep streaks locally (no login) and jump to the Lab to learn the moves.
  - **Hero CTA:** **`▶ Open Today's Sheet`** (`48px` solid ink/brass button) + optional quick link **`Jump straight to REHARM #42 →`** (gets a player into real gameplay in **1 tap**!).

### State 6: Daily Progress, Streaks & Trophy Drawer
Triggered from tapping the Ritual Strip's streak pill (`🔥 5d`) or trophy trigger:
- **4 KPI Tiles (`2×2` mobile, `4×1` desktop):** `Hub Streak` (`🔥 5d`), `Longest Streak` (`12d`), `Total Puzzles` (`38`), `Clean Sheets` (`4`).
- **7-Day Rhythm Strip:** Last 7 local calendar days shown as stamped circle pills (`M T W T F S S`) — green check if played, double-brass ring if Clean Sheet, muted dash if missed.
- **Per-Game Streak Ledger:** Compact table listing each live game's personal streak, best score, and total plays.
- **REHARM Harmonic Badge Shelf (Nice-to-Have Integration):** Displays unlocked enamel pins from `reference/reharm-game/assets/badges/*.svg` (`Tritone Sub`, `Modal Borrow`, `Backdoor Dominant`, `#11 Melody`, etc.) read directly from `reharm:v1:history`!

### State 7: Combined Share Card Modal
- **Spoiler-Free Terminal Box (`--bg-well`, `JetBrains Mono 13px`):**
  - Displays the assembled multi-line emoji/text card (e.g., `Reharm Daily · #42 (2/7)` with per-game score/tier rows and `itailiors.github.io/reharm-daily/`).
- **Format Toggle (`[ Full Sheet | Compact 1-Liner ]`):** Lets players pick detailed Discord format or ultra-short SMS/X format.
- **Primary CTA:** **`Copy Share Card`** (`48px`) -> copies via `navigator.clipboard.writeText`, morphs for `2000ms` into **`✓ Copied to Clipboard!`**.
- **Fallback:** If `navigator.clipboard` is blocked (non-HTTPS or restricted iframe), automatically selects an inline `<textarea>` and shows `"Press Ctrl/Cmd + C to copy"`.

### State 8: Settings Sheet
- **Theme:** `[ System | Light (Parchment) | Dark (Northgate) ]` segmented selector (`>= 44px` height per segment), defaults to `System` honoring `prefers-color-scheme`.
- **Reduced Motion:** Toggle switch (`Auto-on when OS prefers-reduced-motion`). Sets `data-reduced-motion="true"` on `<html>`.
- **Default Audio Preference:** `[ Sound On | Muted Default ]` toggle — saved to `daily:v1:hub:prefs` and visually highlights muted-friendly games when set to `Muted Default`!
- **Hub UI Micro-Sounds:** Toggle (`Off by default` or synced with Muted Default — tiny marimba/pencil click cues when stamping Done or toggling bells).
- **Storage & Data Row:** Shows `"Stored locally on this device · 0 KB server data"` + **`Reset Hub History`** button with safe inline 2-tap confirmation (`Are you sure? [Cancel] [Confirm Reset]`).

### State 9: Coming Soon / Waitlist State
- No email boxes, no server waitlists.
- Clicking `Notify me` toggles `gameId` inside `daily:v1:hub:waitlist` (`localStorage`), swaps icon from `bell` to `bell-check` + `"Notified ✓"`, and displays a subtle toast: `"Saved locally — we'll spotlight <Game> on this sheet when it launches."`

### State 10: Empty, Offline, Storage-Blocked & Corrupt-Data States
1. **Storage Blocked (Safari Private Browsing / Disabled Cookies):**
   - Top dismissible warm-amber banner (`--status-warn-bg`, `shield-alert` icon): **`Private / Storage Blocked — All games still play, but streaks and scores won't save after you close this tab.`**
   - Hub continues functioning cleanly using in-memory fallback (`window.__dailyMemStore`); settings toggles work for the active session.
2. **Offline (`navigator.onLine === false`):**
   - Top amber notice (`wifi-off` icon): **`You're offline — Cached games and today's sheet remain readable; new games may need a connection to load.`**
   - Live card CTAs stay clickable if cached by browser/SW; external `Make the Changes` shows subtle offline note on tap instead of failing silently.
3. **Empty State (No Games Played Today Yet):**
   - Ritual strip shows encouraging 1-line prompt: *"Pick a puzzle below — even 2 minutes keeps your streak alive."* Share button clearly disabled with helper caption *"Finish 1 puzzle to generate today's share card."*
4. **Corrupt / Unparseable `localStorage` Payload:**
   - Hub wraps every `JSON.parse` in `try/catch`; invalid payloads for one game isolate cleanly to `"New Today"` without crashing the board or wiping sibling games' data.
