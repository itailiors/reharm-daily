# Reharm Daily — Product & Retention Notes

> **Philosophy:** Zero accounts, zero guilt-tripping push spam, zero backend. A calm morning/commute music ritual that takes 2–10 minutes and leaves you wanting to open your keyboard or Reharm Lab.

---

## 1. The Daily Ritual Loop

1. **Trigger (Entry from Bookmark or Reharm Lab):**
   - Habitual puzzle players open `itailiors.github.io/reharm-daily/` directly from home screen / bookmark.
   - Reharm Lab practice users spot the red-pen `1` counter on the **`Daily`** pill in the Lab toolbar and hop over in one tap.
2. **Triage (Scan Today's Sheet in 3 Seconds):**
   - Each card surfaces **two instant constraints** upfront: estimated duration (`~2–4 min`) and **Muted-Friendly flag** (`Silent OK`, `Partly`, or `Audio required`). A commuter on a muted train immediately picks `STEPWISE` or `REHARM`, saving `QUARTET` and `MEND` for headphones at home.
3. **Play & Return (`1–7` Games):**
   - Tapping **Play** launches the game (`reharm/`, etc.). Inside the game, a consistent top **`← Reharm Daily`** bar keeps the return path visible.
   - Finishing a game stamps it **`DONE ✓`** in teacher's red pen, increments the segmented meter, and nudges the **`Up Next`** puzzle right inside the game's result modal.
4. **Flex & Deepen:**
   - **Social Flex:** One tap copies a spoiler-free **Combined Share Card** bundling all finished puzzles plus one clean link (`itailiors.github.io/reharm-daily/`).
   - **Curiosity Loop:** Result chips (*"Learn Tritone Sub in Reharm Lab"*) convert puzzle curiosity into active ear/piano practice inside Reharm Lab (`?move=tritone-sub`).

---

## 2. Streak, Reset & Practice Rules

| Rule | Exact Specification | Why |
| :--- | :--- | :--- |
| **Overall Hub Streak** | Increments when **at least 1** `status: "live"` daily puzzle is completed (`status === "done"`) on consecutive local calendar days. | Requiring *all 7* games every day causes burnout and streak loss on busy days; `>= 1/day` rewards showing up daily. |
| **Clean Sheet Counter** | Separate lifetime counter (`cleanSheets`) awarded whenever `playedToday === liveGames.length` (works at Launch `1/1` and Full Roster `7/7`). | Rewards completionists with a prestige red-pen `CLEAN SHEET ✓` seal without punishing casual players. |
| **Per-Game Streak** | Tracked independently inside each game's `daily:v1:<gameId>.streak` (consecutive local days that specific game was completed). | Lets a `STEPWISE` regular keep a 20-day ladder streak even if they skip `BARLINE` for a week. |
| **Lab Practice (`Make the Changes`)** | `status: "lab"` is **never** counted in the daily meter denominator and never affects daily streaks. | Practice tools should stay pressure-free; players can jam in Lab after finishing today's sheet. |
| **Daily Reset Time** | **Local midnight (`00:00` browser local time)**. | Matches Wordle / NYT Games user expectation; countdown in Ritual Bar always shows `HH:MM:SS` until local `00:00`. |
| **Seed Sync Note for Claude Code** | Align individual game puzzle rollover to **local `YYYY-MM-DD`** (or align both hub & games cleanly) so a player finishing REHARM at `23:30` local time doesn't collide with an earlier UTC rollover. | Prevents "I just played today, why does the hub say tomorrow?" timezone bugs. |

---

## 3. Combined Share Text Examples (Spoiler-Free)

### Example A — Launch Day (1 Live Game, `1/1` Clean Sheet)
```text
🎹 Reharm Daily · #42 (1/1 ✓)
🎛️ REHARM: 91/100 · ▲ Top 4% Spice
🔥 Streak: 5d · Clean Sheet!
Play today: https://itailiors.github.io/reharm-daily/
```

### Example B — Mid-Day Full Roster (`3/7` Played)
```text
🎹 Reharm Daily · #88 (3/7)
🎛️ REHARM: 88/100 · ◐ Modal
🪜 STEPWISE: 3 moves (PAR)
🥁 BARLINE: ±11ms pocket
🔥 Streak: 9d · 4 left on today's sheet
https://itailiors.github.io/reharm-daily/
```

### Example C — Full Clean Sheet (`7/7` Complete)
```text
🎹 Reharm Daily · #120 (7/7 ✓ CLEAN SHEET)
🎛️ REHARM: 94/100 ▲
🌊 CHORD TRENCH: 512m/600m
🪜 STEPWISE: Par -1 (Eagle)
🎼 QUARTET: 0 mistakes (🎧 Pure Ear)
🩺 MEND: 4/4 restored
🥁 BARLINE: ±9ms pocket
🎵 TAVDLE: 3/6
🔥 Hub Streak: 14d
https://itailiors.github.io/reharm-daily/
```

*Compact 1-Liner Option (switchable in Share Modal):*  
`🎹 Reharm Daily #88 — 3/7 played (REHARM 88 · STEPWISE Par · BARLINE ±11ms) · 🔥 9d · itailiors.github.io/reharm-daily/`

---

## 4. Zero-Backend Retention Hooks

1. **Red-Pen Completion Stamp:** Visual dopamine of turning a plain cartridge into a red-stamped `DONE ✓` sheet entry.
2. **7-Day Rhythm Strip in Stats:** Showing a 7-dot local week card encourages "don't break the chain" without nagging banners.
3. **In-Game `Up Next` Bridge:** Instead of ending on a dead-end modal after REHARM, presenting the next 2-minute muted-friendly game (`STEPWISE`) turns 1-game sessions into 2-to-3-game rituals.
4. **Local Bell Waitlist Highlight:** Players who toggle `Notify me` on upcoming games (`CHORD TRENCH`, `STEPWISE`) get a warm `"New Today — You asked for this!"` banner badge on the day that game flips from `planned` to `live`.
5. **Practice Off-Ramp:** When `All Done` hits, linking `Keep practicing in Reharm Lab →` channels post-puzzle motivation straight into Lab mastery.

---

## 5. What We Deliberately Leave Out (v1 Non-Goals)

- **No accounts, OAuth, or magic-link emails:** Static GitHub Pages only; `localStorage` on `itailiors.github.io` is the database.
- **No browser `Notification.requestPermission()` popups:** "Notify me" is strictly an on-board local flag (`daily:v1:hub:waitlist`), never an OS permission prompt.
- **No global leaderboards or live player counts:** Avoids fake metrics, moderation overhead, and backend hosting costs.
- **No embedded playable game engines or audio loops inside the hub:** The hub stays instant-loading (`< 100 KB` gzipped); each game loads its own Tone.js studio on launch.
- **No paid subscriptions, ads, or "streak freeze" microtransactions.**

---

## 6. Pre-Launch Checklist (Launch Day: 1 Live + 6 Coming Soon)

- [ ] Host hub at `https://itailiors.github.io/reharm-daily/` sharing the `itailiors.github.io` origin.
- [ ] Add `daily:v1:reharm` write hook inside `REHARM` (and wire `reharm:v1:*` fallback adapter in hub).
- [ ] Mount `.daily-bridge-bar` + `.daily-next-card` + `.daily-lab-chip` inside `REHARM`.
- [ ] Mount the Rough.js `Daily` pill button in `Reharm Lab` toolbar beside `Progress` (+ optional left-rail icon) and support `?move=` / `?mode=changes` deep links.
- [ ] Configure `<meta property="og:image">` with `og-image.jpg` (`< 100 KB`) and `og-image.png`, plus `apple-touch-icon.png` and `favicon.svg`.
- [ ] Verify GoatCounter visit tag matches existing sites (`no other tracking`).
- [ ] Test Safari Private Browsing (storage blocked fallback), offline airplane mode, VoiceOver/keyboard tabbing, Light/Dark `prefers-color-scheme`, and `prefers-reduced-motion`.
