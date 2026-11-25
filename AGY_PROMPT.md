# Prompt for Antigravity (paste everything below the line; workspace = this folder)

---

You are the product designer, UX lead and art director for **Reharm Lab Dailys**: a hub for a family of daily music games ("-dles" with Krillion-style open-ended scoring), linked both ways with **Reharm Lab**, a jazz-piano reharmonization app. Your job is **design, UX, product decisions, assets and animation specs only**. Claude Code will build the real thing from what you hand over, exactly like it did for the REHARM game.

Workspace: `C:\Users\itail\Documents\claude-projects\IO_GAMES\ReharmLab-Dailys`

## Read first (in this order)
1. `brief/PRODUCT_BRIEF.md` — the product, players, must-have features, constraints, what not to do.
2. `brief/games.json` — the game catalog (mock data for your prototype).
3. `reference/reharm-game/design/` — the REHARM game's brand bible, ux-spec, motion-spec, tokens, the handoff contract and the clickable prototype. **Match the depth and format of these files.** `claude-code-handoff.md` is the template for your handoff.
4. `reference/reharm-lab/` — Reharm Lab's tokens (`index.css`, `tokens.ts`, `themes.ts`). Its look: warm parchment, deep ink linework, watercolour washes, red teacher's-pen marks, hand-drawn (Rough.js), fonts Kalam / Architects Daughter / Noto Music.
5. Look at both live sites in your browser at 390px and 1280px wide: `https://itailiors.github.io/reharm-lab/` and `https://itailiors.github.io/reharm/`. Save screenshots to `reference/screens/`.
6. Skim `reference/music-theory-dle-research.md` §2 for what each planned game is.

## Decide, then commit
- Pick the hub's visual direction (brief §4: "Daily Sheet", "Club", "Rack", or something better). Mock **2 directions quickly** (one 390×844 Today screen each, as PNGs in `design/explorations/`), pick one, and write down why in the brand bible. Don't stop to ask; I'll redirect if I disagree.
- Name: "Reharm Lab Dailys" is the working name. Propose up to 3 alternatives in the brand bible, but use the working name in everything you make.

## Deliverables (all inside the workspace)
```
design/
  brand-bible.md        visual thesis, chosen direction + why, palette with verified WCAG AA contrast table (light + dark), type, iconography, card/cover-art system, how each game keeps its own skin inside the hub
  ux-spec.md            every screen and state at 390×844 and 1280×800: Today board (launch: 1 live + 6 coming soon; later: 7 live), game detail sheet, first visit, daily progress + streaks, combined share card, settings, coming-soon, empty/offline/storage-blocked, end-of-day "all done" state
  bridge-spec.md        the Lab ↔ hub ↔ game links: (1) the entry point inside Reharm Lab, drawn in the LAB's style, mocked over a Lab screenshot; (2) a drop-in "← Dailys" + "next game" component every game can wear in its own skin (show it in REHARM's skin and one other); (3) a "Learn this move in Reharm Lab" chip from a game result
  motion-spec.md        every animation: name, trigger, duration, easing, keyframes, reduced-motion fallback. Must include: board load-in, card hover/press, card → game launch transition, "done" stamp on a card, streak tick, progress meter fill, all-done celebration, share-card reveal. Use tokens for durations/easings.
  product-notes.md      PM decisions: daily ritual loop, what counts as a streak, reset time, how the combined share text reads (give 3 examples), retention hooks that need no backend, what we deliberately leave out, launch checklist
  data-contract.md      the shared localStorage contract every game writes for the hub (e.g. `dailys:v1:<gameId>`): fields, types, examples. Note REHARM already uses `reharm:v1:*`. Same origin, so the hub reads it directly.
  tokens.css + tokens.json   [data-theme="light"|"dark"], prefers-color-scheme + reduced-motion handled, same structure as reference/reharm-game/design/tokens.css
  claude-code-handoff.md     the implementation contract: file inventory, token rules, state machine, component list with CSS classes and data-attributes, TypeScript interfaces for the mock data, event names, what is mock vs real
  preview/index.html    a zero-build clickable prototype (vanilla HTML/CSS/JS, tokens.css linked, mock data from brief/games.json inlined) covering every screen + state in ux-spec, with a small state switcher (launch / mid-day / all-done / storage-blocked) and a theme toggle
  explorations/         the 2 direction mockups
assets/
  brand/                hub logo (SVG), favicon.svg, apple-touch-icon.png 180, og-image.png 1200×630 + og-image.jpg (<100 KB)
  covers/               one cover art per game in games.json (SVG preferred; PNG 2x where it's illustrated), a consistent system so future games slot in; a "coming soon" treatment
  icons/                24×24 stroke icons (currentColor) for the hub UI + a sprite.svg
  lab-entry/            the Lab-side entry point as SVG in the Lab's hand-drawn style
```

## Rules
- Design only. No game logic, music theory, or real audio. Mock data only.
- Every colour via tokens; WCAG AA verified (list the ratios); colour never the only signal.
- Mobile first, touch targets ≥ 44px, keyboard focus visible, `prefers-reduced-motion` respected.
- Google Fonts only. No trademarks, no real musicians' likenesses; "Blue Note" must not appear.
- No purple SaaS gradients, glassmorphism rainbows, or gamer neon.
- Any text inside images must be spelled correctly; if an image model garbles text, redo it as SVG.
- Keep the REHARM game and the Lab app unchanged; you design only the hub and the bridge pieces.

## When done
Write `design/DONE.md`: what you made, the direction you picked and why, open questions for Itai (max 5), and anything you couldn't do. Then stop.
