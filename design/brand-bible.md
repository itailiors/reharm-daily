# Reharm Daily — Brand Identity & Art Direction Bible

> **Final Brand Name:** *Reharm Daily* (locked from the working name and candidate list in §1.3)  
> **Tagline:** *Daily music puzzles you can hear — and play.*  
> **Chosen Direction:** **Direction A — "The Daily Sheet"**  
> **Design Thesis:** The puzzle broadsheet clipped to the back of Reharm Lab's notebook — warm manuscript parchment, deep cobalt-indigo ink, teacher's red-pen completion stamps, and subtle paper grain framing every daily game as a tactile cartridge in its own native skin.

---

## 1. Visual Direction Decision & Rationale

Two distinct visual worlds already exist in the family:
1. **Reharm Lab** ([reharm-lab-1280.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/reference/screens/reharm-lab-1280.png)) — warm manuscript parchment (`#F6E9C9`), deep cobalt-indigo ink (`#1E2A78`), watercolour washes (blue, mustard, brick, sage), red teacher's-pen marks (`#C2311F`), `Kalam` headings, and a companion dark scheme (**Northgate**: warm club charcoal `#1C1916` with parchment ink `#E8DCC4` and poster-red `#E0604F`).
2. **REHARM** ([reharm-game-1280.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/reference/screens/reharm-game-1280.png)) — matte anodized midnight studio hardware (`#111215` / `#191B20`), warm Rhodes amber (`#E8A849`), `Space Grotesk` + `Plus Jakarta Sans` + `JetBrains Mono`.

### 1.1 Two Explorations Compared (`390×844`)

| Direction | Mockup | Core Metaphor | Strengths | Tradeoffs |
| :--- | :--- | :--- | :--- | :--- |
| **A. "The Daily Sheet" (CHOSEN)** | [exploration-a-daily-sheet.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/explorations/exploration-a-daily-sheet.png) | The puzzle broadsheet clipped to Reharm Lab's notebook; each game sits inside a parchment-matted cartridge window in its own skin. | Instant 1-glance family link to Reharm Lab; warm parchment creates maximum figure-ground contrast around dark games like REHARM (`#111215`) and CHORD TRENCH (`#081A27`) while letting STEPWISE (`#F4F1EA`) sit naturally; red-pen stamps (`DONE · 91/100 ✓`) double as both Lab heritage and daily puzzle satisfaction. | Needs a deliberate dark variant so late-night players aren't blinded by parchment — solved natively by inheriting Reharm Lab's **Northgate** palette. |
| **B. "The Club"** | [exploration-b-the-club.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/explorations/exploration-b-the-club.png) | Late-night gig marquee & perforated ticket-stub setlist board (`#151311` charcoal, brass spotlight, `Space Grotesk`). | Atmospheric evening mood; clean ticket-stub metaphor. | Dark charcoal cards mute REHARM's dark obsidian hardware frame instead of letting it pop; feels severed from Reharm Lab's daytime parchment identity unless you click the small footer chip. |
| **C. "The Rack"** *(rejected in brief)* | — | Studio 19-inch hardware rack extending REHARM's anodized chassis. | Strong tie to REHARM alone. | Weakest link to Reharm Lab; forces non-hardware puzzle concepts (STEPWISE drafting paper, TAVDLE sketchbook, Make the Changes lead sheet) into metal rack plates. |

### 1.2 Why "The Daily Sheet" Wins
1. **Zero Visual Seam with Reharm Lab:** Entering Reharm Daily from Reharm Lab's parchment toolbar feels like flipping to the back page of the same music notebook.
2. **Gallery Mat for Distinct Game Skins:** Because the hub is a calm paper sheet rather than a dark neon stage or metal rack, every game keeps 100% of its native identity inside a framed 16:9 cover window. REHARM's dark Rhodes hardware stands out dramatically against `#FBF3DF` parchment, while STEPWISE's grid paper and Make the Changes' lead sheet sit cleanly inside ink borders.
3. **Dual Native Themes Without Compromise:** Light mode mirrors Reharm Lab's **Ink & Parchment**; Dark mode mirrors Reharm Lab's **Northgate** night club sheet (`#1C1916` warm charcoal + `#E8DCC4` parchment ink + `#DFB15B` brass + `#F58979` poster-red), honoring `prefers-color-scheme` while matching both apps.

### 1.3 Final Name Choice
**`Reharm Daily`** is locked as the final name across all specs, brand marks, URLs (`/reharm-daily/`), storage keys (`daily:v1:*`), and the interactive prototype. Evaluated alternatives:

| Candidate | Tone | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Reharm Daily (LOCKED)** | Editorial (like *NYT Games* / *Wordle* kin) | Crisp, unmistakable, drops the plural spelling quirk of the brief's working name. | Slightly tilts toward harmony games when BARLINE/QUARTET arrive. |
| **The Daily Sheet** | Newspaper / musician's gig pad | Directly names the broadsheet metaphor; pairs naturally with Reharm Lab's "living lead sheet". | Doesn't include "Reharm" in the title for search/bookmarks. |
| **Daily Changes** | Jazz idiom ("playing the changes") | Clever double meaning (daily routine + chord changes), short wordmark. | Less transparent to casual bedroom producers than `Reharm Daily`. |

---

## 2. Aesthetic Pillars

1. **Broadsheet Calm Over Arcade Clutter:** Warm paper surfaces (`#F6E9C9` / `#FBF3DF`), crisp ink borders (`2px solid --border-ink`), generous gutters, and subtle fractal paper grain (`--texture-paper` light / `--texture-brush` dark). Zero purple SaaS gradients, zero glassmorphism blurs, zero neon glows.
2. **Teacher's Red Pen as Reward:** Just as Reharm Lab uses red ink (`#C2311F` / `#A52213`) for margin corrections and checkmarks, completing a daily puzzle stamps a crisp tilted **`DONE ✓`** red-pen seal onto the cartridge and ticks the daily progress meter.
3. **Each Game Keeps Its Skin:** The hub sets the paper frame and typography; inside each card's 16:9 cover well (`.cover-window`) and inside the game's own URL, the game owns its native palette and controls.
4. **Dual-Coded Accessibility:** Statuses never rely on color alone. Every badge pairs color with a distinct icon/shape (`✓` stamp, `◐` half-circle progress, `●` new puzzle dot, tilted `COMING SOON` blueprint stamp, eye/headphones muted flags).

---

## 3. Color System & Verified WCAG 2.1 AA Contrast Matrix

All colors live in [tokens.css](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/tokens.css) and [tokens.json](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/tokens.json).

### 3.1 Light Theme — *"Ink & Parchment Daily Sheet"* (Default)

| Role | Token | Value | Usage |
| :--- | :--- | :--- | :--- |
| Canvas | `--bg-canvas` | `#F6E9C9` | Warm manuscript parchment backdrop + paper noise |
| Surface | `--bg-surface` | `#FBF3DF` | Primary broadsheet cards, ritual header, detail sheets |
| Elevated | `--bg-elevated` | `#EFE2C1` | Secondary buttons, coming-soon cards, stat tiles |
| Well (Recessed) | `--bg-well` | `#EAD7AA` | Meter tracks, share preview box, Lab practice strip |
| Border Ink | `--border-ink` | `#1E2A78` | Broadsheet frames, primary card borders |
| Border Strong | `--border-strong` | `#877B62` | Cover windows, dashed coming-soon frames |
| Ink Primary | `--text-primary` | `#1E2A78` | Headlines, titles, primary copy |
| Ink Secondary | `--text-secondary` | `#2F3C8A` | Game pitches, supporting explanations |
| Ink Muted | `--text-muted` | `#45508C` | Time estimates, puzzle numbers, secondary hints |
| Primary Solid CTA | `--accent-primary-solid-bg` | `#1E2A78` | Primary Play / Share buttons (`#FBF3DF` ink) |
| Teacher's Red Pen | `--accent-pen` | `#A52213` | `DONE` stamps, unplayed counter dot, error/highlight |
| Brass Accent | `--accent-brass` | `#7A4B06` | Streak pill, in-progress highlights (`rgba(227,178,60,0.22)` bg) |

### 3.2 Dark Theme — *"Northgate Night Sheet"* (`[data-theme="dark"]` & `@media (prefers-color-scheme: dark)`)

| Role | Token | Value | Usage |
| :--- | :--- | :--- | :--- |
| Canvas | `--bg-canvas` | `#1C1916` | Warm club charcoal + subtle brush grain |
| Surface | `--bg-surface` | `#25211D` | Broadsheet cards, modals, detail sheets |
| Elevated | `--bg-elevated` | `#312B25` | Secondary buttons, stat tiles, coming-soon cards |
| Well (Recessed) | `--bg-well` | `#151210` | Meter tracks, share preview terminal |
| Border Ink | `--border-ink` | `#8C7D6B` | Warm parchment-tan outlines (`4.00:1` on surface) |
| Ink Primary | `--text-primary` | `#E8DCC4` | Warm aged parchment type (avoids pure-white halation) |
| Ink Secondary | `--text-secondary` | `#C7B99E` | Supporting descriptions & metadata |
| Ink Muted | `--text-muted` | `#A49781` | Hints, durations, archive dates |
| Primary Solid CTA | `--accent-primary-solid-bg` | `#DFB15B` | Burnished brass CTA (`#181410` charcoal ink) |
| Poster Red Pen | `--accent-pen` | `#F58979` | `DONE` stamps, unplayed counter badge |

### 3.3 Semantic Status & Audio-Flag Tokens

| Semantic State | Dual-Code Cue | Light (`fg` / `bg`) | Dark (`fg` / `bg`) |
| :--- | :--- | :--- | :--- |
| **Done** | Check stamp + `DONE` | `#2D5629` / `rgba(126,156,107,0.20)` | `#A8C980` / `rgba(142,154,98,0.18)` |
| **In Progress** | Half circle + `RESUME` | `#7A4404` / `rgba(227,178,60,0.24)` | `#E8BC66` / `rgba(210,162,78,0.18)` |
| **New / Today** | Solid dot + `PLAY` | `#1E2A78` / `rgba(91,133,194,0.16)` | `#99B9E6` / `rgba(127,154,192,0.18)` |
| **Coming Soon** | Dashed border + Stamp | `#444E82` / `rgba(30,42,120,0.08)` | `#B5A892` / `rgba(232,220,196,0.08)` |
| **Muted-Friendly** | Eye/visual badge + `Muted OK` | `#155852` / `rgba(21,88,82,0.10)` | `#7DD0C5` / `rgba(125,208,197,0.14)` |
| **Audio Recommended** | Headphones + `Sound On` | `#8C3316` / `rgba(185,83,47,0.13)` | `#F29478` / `rgba(207,112,64,0.16)` |
| **Warning / Offline** | Shield/Alert + Banner | `#7A3E04` / `#F5E0A8` | `#F2C97D` / `#362A19` |

### 3.4 Verified WCAG 2.1 Contrast Table

All 108 foreground/background checks (including alpha-composited status fills over `--bg-surface`, `--bg-elevated`, and `--bg-well`) were computed programmatically in Node.js (`>= 4.5:1` required for text; `>= 3.0:1` required for UI borders/focus rings):

| Token Pair | Light Ratio | Dark Ratio | Minimum | Result |
| :--- | :---: | :---: | :---: | :---: |
| `text.primary` / `surface.canvas` | **10.51:1** | **12.89:1** | 4.5:1 | AAA Pass |
| `text.primary` / `surface.surface` | **11.45:1** | **11.77:1** | 4.5:1 | AAA Pass |
| `text.primary` / `surface.elevated` | **9.84:1** | **10.29:1** | 4.5:1 | AAA Pass |
| `text.secondary` / `surface.surface` | **8.90:1** | **8.27:1** | 4.5:1 | AAA Pass |
| `text.muted` / `surface.elevated` | **5.87:1** | **4.87:1** | 4.5:1 | AA Pass |
| `text.muted` / `surface.well` | **5.32:1** | **6.50:1** | 4.5:1 | AA Pass |
| `accent.primarySolidInk` / `accent.primarySolidBg` | **11.45:1** | **9.23:1** | 4.5:1 | AAA Pass |
| `accent.pen` / `surface.surface` | **6.69:1** | **6.65:1** | 4.5:1 | AA Pass |
| `accent.pen` / blended `penBg` (over `elevated`) | **4.95:1** | **4.89:1** | 4.5:1 | AA Pass |
| `accent.brass` / blended `brassBg` (over `elevated`) | **5.25:1** | **5.23:1** | 4.5:1 | AA Pass |
| `status.done.fg` / blended `done.bg` (over `elevated`) | **5.65:1** | **5.71:1** | 4.5:1 | AA Pass |
| `status.progress.fg` / blended `progress.bg` (over `elevated`) | **5.55:1** | **5.62:1** | 4.5:1 | AA Pass |
| `status.new.fg` / blended `new.bg` (over `elevated`) | **8.45:1** | **5.22:1** | 4.5:1 | AA Pass |
| `status.soon.fg` / blended `soon.bg` (over `well`) | **4.85:1** | **6.74:1** | 4.5:1 | AA Pass |
| `status.mutedOk.fg` / blended `mutedOk.bg` (over `elevated`) | **5.52:1** | **5.75:1** | 4.5:1 | AA Pass |
| `status.audioReq.fg` / blended `audioReq.bg` (over `well`) | **4.93:1** | **6.77:1** | 4.5:1 | AA Pass |
| `status.warn.fg` / `status.warn.bg` | **6.40:1** | **8.94:1** | 4.5:1 | AA / AAA Pass |
| `focus.ring` / `surface.surface` (UI graphics) | **11.45:1** | **8.05:1** | 3.0:1 | AA UI Pass |
| `border.ink` / `surface.surface` (UI graphics) | **11.45:1** | **4.00:1** | 3.0:1 | AA UI Pass |
| `border.strong` / `surface.surface` (UI graphics) | **3.77:1** | **3.78:1** | 3.0:1 | AA UI Pass |

---

## 4. Typography System (Google Fonts Only)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Kalam:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

1. **Display, Masthead & Section Headers — `Kalam` (`400`, `700`)**
   - Shared directly with Reharm Lab's `--font-marker`. Carries the warm hand-lettered broadsheet character on page titles, game headings, stamp labels, and section dividers.
2. **UI Copy, Descriptions & Controls — `Plus Jakarta Sans` (`400`, `500`, `600`, `700`)**
   - Shared directly with REHARM's `--font-sans`. Crisp editorial legibility at `12px–16px` for pitches, how-to-play instructions, settings toggles, and modal actions.
3. **Numbers, Puzzle `#`, Scores, Timers & Share Cards — `JetBrains Mono` (`500`, `600`, `700`)**
   - Shared directly with REHARM's `--font-mono`. Always paired with `font-variant-numeric: tabular-nums` so `#42`, `91/100`, `5d`, and `04:12:09` midnight countdowns never jump horizontally.

---

## 5. Iconography & Brand Marks

- **UI Icon Set ([sprite.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/icons/sprite.svg) + 28 standalone SVGs in `assets/icons/`):** `24×24` viewBox, `1.75px` rounded stroke (`currentColor`), `fill="none"`. Matches REHARM's stroke weight so icons look cohesive in both light ink and dark brass.
- **Hub Logo ([logo.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/logo.svg) / [logo-dark.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/logo-dark.svg)):** A hand-ruled daily folio sheet displaying four stepped harmonic bars in Reharm Lab's four wash colors (`#5B85C2` blue, `#E3B23C` mustard, `#7E9C6B` sage, `#1E2A78` deep ink) crowned with a red-pen completion seal, beside `REHARM` eyebrow and underlined `DAILY` wordmark.
- **Favicon & Touch Icon:** [favicon.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/favicon.svg) (`32×32`) and [apple-touch-icon.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/apple-touch-icon.png) (`180×180`).
- **Open Graph Card:** [og-image.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/og-image.png) and `<100 KB` [og-image.jpg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/og-image.jpg) (`1200×630`, verified 87,572 bytes).

---

## 6. Cartridge Cover-Art System & How Every Game Keeps Its Own Skin

Every game in `brief/games.json` receives a **`480×270` (`16:9`) vector cover (`assets/covers/<id>.svg`)** mounted inside a standardized parchment-bordered cartridge frame (`.cover-window`):

| Game | Native Visual Skin Preserved in Cover | Cover Asset |
| :--- | :--- | :--- |
| **REHARM** | Midnight obsidian OLED timeline + 4 brass/amber/lavender/coral chord slots | [reharm.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/reharm.svg) |
| **CHORD TRENCH** | Abyssal sonar depth scale (`50m–600m`) + illuminated electric piano | [chord-trench.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/chord-trench.svg) |
| **STEPWISE** | Engineering grid paper + spruce-teal/terracotta voice-leading ladder (`PAR 3`) | [stepwise.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/stepwise.svg) |
| **QUARTET** | Dark studio felt `4×4` sound matrix with solved ochre group & audio glyphs | [quartet.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/quartet.svg) |
| **MEND** | Warm analog 4-lane tape console + surgical repair crosshair on sour clash | [mend.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/mend.svg) |
| **BARLINE** | Matte obsidian + brass Euclidean `7/8` (`2+2+3`) rhythm ring & Beat-1 diamond | [barline.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/barline.svg) |
| **TAVDLE** | Blueprint parchment staff sketch with floating `?` noteheads (placeholder) | [tavdle.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/tavdle.svg) |
| **Make the Changes** | Authentic Reharm Lab lead sheet with mustard watercolour highlight & red check | [make-the-changes.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/make-the-changes.svg) |

### Slotting Future Games Without Redesign
1. Drop a new `480×270` `assets/covers/<gameId>.svg` depicting that game's core mechanic in its own palette.
2. Add one entry to the catalog JSON with `id`, `name`, `status`, `pitch`, `estMinutes`, `mutedFriendly`, `scoreUnit`, and optional `labLinks`.
3. While `status === "planned"`, the hub automatically applies the **Coming Soon Blueprint Treatment**: dashed `--border-strong` card frame, muted background (`--bg-elevated`), desaturated cover (`opacity: 0.85; saturate(0.65)`), tilted [coming-soon-stamp.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/coming-soon-stamp.svg) overlay in the bottom-right corner, and local Bell waitlist toggle. Flipping `status` to `"live"` promotes it to an active cartridge with zero layout rewrite.
