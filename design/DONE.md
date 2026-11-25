# Reharm Daily — Design & Handoff Summary

**Status:** Complete (Design, UX, Product Specs, SVG/PNG Assets, Tokens, Clickable Prototype & Implementation Handoff)

---

## 1. Direction Picked & Why

**Chosen Direction:** **Direction A — "The Daily Sheet"** ([exploration-a-daily-sheet.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/explorations/exploration-a-daily-sheet.png))  
**Alternative Explored:** **Direction B — "The Club"** ([exploration-b-the-club.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/explorations/exploration-b-the-club.png))

**Why "The Daily Sheet" Won:**
1. **Immediate Family Unity with Reharm Lab:** Light mode adopts Reharm Lab's warm parchment (`#F6E9C9` / `#FBF3DF`), deep cobalt-indigo ink (`#1E2A78`), teacher's red-pen marks (`#A52213`), and `Kalam` display typography; Dark mode inherits Reharm Lab's **Northgate** palette (`#1C1916` warm club charcoal, `#E8DCC4` parchment ink, `#DFB15B` brass, `#F58979` poster red). Hopping from Lab → Reharm Daily feels like flipping to the puzzle sheet of the same notebook.
2. **Gallery Mat for Every Game's Own Skin:** Unlike Direction B ("The Club"), where dark `#151311` stage cards muted REHARM's `#111215` dark studio chassis, warm broadsheet paper provides maximum contrast around every game's 16:9 cartridge cover (`reharm.svg`, `chord-trench.svg`, `stepwise.svg`, `quartet.svg`, `mend.svg`, `barline.svg`, `tavdle.svg`, `make-the-changes.svg`).
3. **Final Brand Name Locked (`Reharm Daily`):** Selected over the brief's working name and alternative candidates (`The Daily Sheet`, `Daily Changes`) and updated across all brand SVGs, PNGs, tokens, specs, and the prototype.

---

## 2. What Was Made

### Design Specs & Prototype (`design/`)
- [brand-bible.md](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/brand-bible.md) — Visual thesis, Direction A vs B (+ C) decision, Light + Dark tokens, 100%-verified WCAG 2.1 AA contrast table, Google Fonts bridge (`Kalam`, `Plus Jakarta Sans`, `JetBrains Mono`), iconography, and cartridge cover system.
- [ux-spec.md](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/ux-spec.md) — `390×844` and `1280×800` spatial specs across all 10 screens/states (Launch 1+6, Full Roster 7+, All-Done celebration, Game Detail Sheet, First Visit, Progress/Streaks/Badges, Combined Share Modal, Settings, Coming Soon local bells, Storage-Blocked/Offline/Empty).
- [bridge-spec.md](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/bridge-spec.md) — Lab ↔ Hub ↔ Game bridges grounded in empirical DOM measurements of both live sites (`tablist "Mode"` `348px` mobile width in Reharm Lab; `14.67px` mobile header margin + `108px` vertical flex headroom in REHARM).
- [motion-spec.md](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/motion-spec.md) — Durations, easings, compositor-only keyframes (board stagger, hover/press, launch transition, red-pen `DONE ✓` stamp, streak tick, segmented meter fill, all-done confetti, share reveal), `prefers-reduced-motion` fallbacks, and optional synthesized hub UI micro-sounds.
- [product-notes.md](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/product-notes.md) — Daily ritual loop, streak/reset rules, 3 spoiler-free Combined Share Card examples, zero-backend retention hooks, non-goals, and pre-launch checklist.
- [data-contract.md](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/data-contract.md) — Same-origin `localStorage` schemas (`daily:v1:<gameId>`, `daily:v1:hub:*`), defensive read-only adapter for `reharm:v1:*`, cross-tab/visibility sync, and private-mode fallback.
- [tokens.css](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/tokens.css) & [tokens.json](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/tokens.json) — Synchronized CSS variables and W3C JSON tokens with `prefers-color-scheme` and `prefers-reduced-motion`.
- [claude-code-handoff.md](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/claude-code-handoff.md) — Implementation blueprint, state machine, CSS classes/data-attributes, TypeScript interfaces, custom events, and mock-vs-real boundary.
- [preview/index.html](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/preview/index.html) — Zero-build clickable prototype with state switcher (`Launch`, `Mid-Day`, `All Done`, `First Visit`, `Storage Blocked`, `Offline`), live `Stamp Done ✓` & `Bridge Skins` demos, theme switcher, and reduced-motion toggle.
- `design/explorations/` — [exploration-a-daily-sheet.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/explorations/exploration-a-daily-sheet.png) and [exploration-b-the-club.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/explorations/exploration-b-the-club.png) (`390×844`).

### Assets (`assets/` & `reference/screens/`)
- `assets/brand/` — [logo.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/logo.svg), [logo-dark.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/logo-dark.svg), [favicon.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/favicon.svg), [apple-touch-icon.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/apple-touch-icon.png) (`180×180`), [og-image.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/og-image.png) (`1200×630`), and [og-image.jpg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/brand/og-image.jpg) (`1200×630`, 87,572 bytes < 100 KB).
- `assets/covers/` — 8 consistent `480×270` (`16:9`) game cover SVGs (`reharm.svg`, `chord-trench.svg`, `stepwise.svg`, `quartet.svg`, `mend.svg`, `barline.svg`, `tavdle.svg`, `make-the-changes.svg`) + [coming-soon-stamp.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/covers/coming-soon-stamp.svg).
- `assets/icons/` — 28 standalone `24×24` `currentColor` stroke SVGs + combined [sprite.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/icons/sprite.svg).
- `assets/lab-entry/` — [lab-daily-pill.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-daily-pill.svg), [lab-daily-pill-done.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-daily-pill-done.svg), [lab-daily-pill-northgate.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-daily-pill-northgate.svg), [lab-daily-sidebar-icon.svg](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-daily-sidebar-icon.svg), [lab-bridge-mockup-desktop.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-bridge-mockup-desktop.png), [lab-bridge-mockup-mobile.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/lab-bridge-mockup-mobile.png), and [game-bridge-skins-comparison.png](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/assets/lab-entry/game-bridge-skins-comparison.png).
- `reference/screens/` — Live captures at `1280×800` and `390×844` for both Reharm Lab (`reharm-lab-1280.png`, `reharm-lab-390.png`) and REHARM (`reharm-game-1280.png`, `reharm-game-390.png`).

---

## 3. Open Questions for Itai (Max 5)

*(Brand name is locked to **Reharm Daily** per Itai's preference; 4 implementation alignment items remain.)*

1. **Midnight Rollover Alignment:** The hub resets at local midnight (`00:00` local time) per the brief, whereas `REHARM` uses UTC `dateISO` (`ux-spec.md`). Should `REHARM` switch to local `YYYY-MM-DD` (or keep both aligned on the exact same rollover rule) so late-night plays don't split across days?
2. **Overall Streak Threshold:** Confirm that completing **at least 1 live puzzle/day** keeps the Hub Streak alive while completing **all** live puzzles awards a separate `Clean Sheet ✓` tally (avoiding daily burnout once 7 games are live).
3. **Reharm Lab Deep-Link Query Contract:** Confirm adding `?move=<slug>&from=<gameId>` (pre-selecting that concept in Coach/Study) and `?mode=changes&from=reharm-daily` (opening `Make the Changes`) inside Reharm Lab, since Lab currently only reads `?tune=&level=&key=`.
4. **Drop-In Top Family Strip in REHARM:** Confirm placing the slim `38px` `.daily-bridge-bar` (`← Reharm Daily`) above REHARM's `<header>` rather than squeezing it into `.studio-header` (which only has `14.67px` horizontal space left at `390px` mobile while `108px` vertical flex space is open).

---

## 4. Anything We Couldn't Do

- **Direct `localStorage` Read of Live `reharm:v1:*` Schemas:** The isolated `webview_browser` subagent sandbox blocks `page.evaluate()` and programmatic `window.localStorage` reads on `itailiors.github.io`, so exact field names inside `REHARM`'s `reharm:v1:history` and `reharm:v1:draft` JSON objects could not be dumped directly from the live browser runtime. To bridge safely without guessing, [data-contract.md](file:///C:/Users/itail/Documents/claude-projects/IO_GAMES/ReharmLab-Dailys/design/data-contract.md) defines the canonical `daily:v1:<gameId>` writer contract alongside a defensive read-only adapter for `reharm:v1:*` for Claude Code to match against REHARM's repository.
