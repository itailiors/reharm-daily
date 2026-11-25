# Reharm Lab Dailys — Product Brief (games hub)

Owner: Itai (jazz pianist + developer). Design by Antigravity; code by Claude Code afterwards.
Date: 2026-11-25.

## 1. What this is

A home for a growing family of **daily music games** ("-dles" with Krillion-style open-ended scoring), linked both ways with **Reharm Lab**, a jazz-piano reharmonization and practice app.

- One front door that shows every game, today's puzzle for each, and whether you've played it yet.
- A player can go Lab → hub → a game → back to the hub → next game → back to the Lab, without feeling they changed websites.
- Zero backend, zero accounts, zero cost. Static files on GitHub Pages.

## 2. Who plays

| Player | What they want from the hub |
|---|---|
| Casual / bedroom producer | "What's today's game, how long does it take, can I play muted?" One tap to play. |
| Daily-puzzle regular (Wordle/Connections crowd) | A ritual: see all of today's games, tick them off, keep streaks, share a combined card. |
| Jazz / theory nerd (Itai's crowd) | Depth: rare-move badges, scores, a path into Reharm Lab to actually learn the moves. |

## 3. The family (see `games.json` for the data)

| Game | Status | One line |
|---|---|---|
| **REHARM** | LIVE `itailiors.github.io/reharm/` | Daily 4-bar melody; pick chords for each bar; legal = pass, rarer harmony = higher score. Playable share links. |
| CHORD TRENCH | planned | Krillion on an electric piano: 6 timed constraints, spicier valid chords dive deeper (meters). |
| STEPWISE | planned | Weaver/word-ladder for chords: morph start chord → target chord one voice, one step at a time; beat Par. |
| QUARTET | planned | Connections with 16 playable sound snippets grouped by theory. |
| MEND | planned | A 4-bar groove arrives with 4 musical bugs; find and fix them. |
| BARLINE | planned | Tap Beat 1 on odd-meter riffs; slice the rhythm ring. |
| TAVDLE | planned (folder exists, no spec yet) | Placeholder: a note/melody "-dle". Design a card slot; content TBD. |
| Make the Changes | lives inside Reharm Lab | Root-movement/function trainer (Lab's "Changes" tab). Show it as a "practice" entry, not a daily. |

Full concept writeups: `../reference/music-theory-dle-research.md` §2.

The hub must look right with **1 live game and 6 "coming soon"** (launch day) AND with **7+ live games** (later). Design both states.

## 4. Brand situation — and the decision we want from you

Two existing looks:

1. **Reharm Lab** — "living lead sheet": warm parchment paper, deep Blue-Note-style ink, watercolour washes (blue / mustard / brick / sage), red teacher's-pen corrections and stamps, everything hand-drawn (Rough.js, Kalam + Architects Daughter fonts). Has a dark theme too. Files: `../reference/reharm-lab/`. Live: `itailiors.github.io/reharm-lab/`.
2. **REHARM (game)** — "midnight studio": OP-1 / Rhodes hardware meets NYT Games restraint. Matte aluminium, amber, brass, Space Grotesk / Plus Jakarta Sans / JetBrains Mono, 4 Spice Tier colours. Files: `../reference/reharm-game/`. Live: `itailiors.github.io/reharm/`.

**You decide the hub's look.** Options we see (pick one, or beat them, and say why in the brand bible):

- **A. "The Daily Sheet"** — the hub is the puzzle page of the Lab's newspaper/notebook: Lab paper + ink as the frame, and each game appears as a card or "cartridge" in its own skin (REHARM card = midnight hardware). Strongest Lab link.
- **B. "The Club"** — a late-night jazz club / marquee / setlist board: each game is a "set" on tonight's bill. A fresh look that bridges paper (setlist, ticket stubs) and hardware (stage lights, amber).
- **C. "The Rack"** — a studio hardware rack where each game is a module. Extends the REHARM look; weakest Lab link.

Whatever you pick, it must: (a) feel like the same family as the Lab within one glance (shared type or ink or paper cue), (b) let every game keep its own skin, (c) give each game a consistent **card/cover-art system** so new games slot in without redesign.

## 5. Must-have features (design all of them)

1. **Today board** — every game with: name, cover art, one-line pitch, today's puzzle number, est. time (e.g. "~2 min"), "works muted" flag, status (new / in progress / done + score / coming soon).
2. **Daily ritual progress** — "2 of 3 today" meter + per-game streak + overall streak. Reset at local midnight.
3. **Combined share card** — one emoji/text card for all of today's games + one link (spoiler-free). Also a 1200×630 OG image for the hub.
4. **Game detail sheet** — tap a card: how-to-play in 3 lines, your stats, archive link if the game has one, Play button.
5. **Lab bridge (both directions)**:
   - In Reharm Lab: an entry point (header pill / tab / small "Dailys" badge with today's unplayed count). Design it IN THE LAB'S STYLE (paper, ink, Kalam) — mock it on top of a Lab screenshot.
   - In each game: a small consistent "← Dailys" back-link + "next game" nudge on the results screen. Design it once so every game can drop it in, in its own skin.
   - From a game's result to the Lab: "Learn this move in Reharm Lab" deep-link (e.g. a tritone-sub badge → the Lab's Tritone sub move). Design the button/chip.
6. **Coming-soon / waitlist state** for planned games (no email collection; maybe "notify me" = just a local bell toggle).
7. **First visit** — 1-screen intro, no signup, gets you to a Play button in one tap.
8. **Settings** — theme (light/dark/system), reduced motion, sound on/off default. Respect `prefers-reduced-motion` and `prefers-color-scheme`.
9. **Empty, offline and error states**; storage blocked (private mode) still works, just no streaks.

Nice to have: archive calendar, per-game trophy shelf (REHARM badges in `reference/reharm-game/assets/badges/`), "today's featured move" tie-in with the Lab.

## 6. Technical facts (constraints for your designs)

- Hosting: GitHub Pages, all on the same origin `itailiors.github.io` (paths `/reharm-lab/`, `/reharm/`, hub likely `/dailys/`). So the hub **can read each game's localStorage** for "played today"/scores. REHARM uses keys prefixed `reharm:v1:` (`settings`, `history`, `draft`, `meta`). Propose a tiny shared contract every game writes, e.g. `dailys:v1:<gameId>` = `{ lastPlayed, puzzleNo, score, scoreLabel, streak, shareText }`.
- No backend, no accounts, no analytics beyond the existing GoatCounter visit count.
- Mobile first: design at **390×844** and **1280×800**. Touch targets ≥ 44px. Must work with the phone muted (most games are audio, so show the "muted-friendly" flag clearly).
- Audio: all game audio is synthesized (Tone.js). The hub itself may have tiny UI sounds (optional, off when muted); if you want one, specify it (pitch/timbre/length) — Claude will synthesize it.
- Fonts: Google Fonts only. Accessibility: WCAG AA contrast, colour never the only signal (shape + label too), full keyboard nav, visible focus.
- Rights: no real trademarks or musicians' likenesses. Musicians' names only as "in the style of" credits. "Blue Note" is a trademark: don't name it.

## 7. What NOT to do

- No game logic, music theory engines, or real audio — Claude builds those. Mock data only.
- No purple SaaS gradients, glassmorphism rainbows, generic gamer neon.
- Don't redesign the REHARM game itself or the Lab app; design only the hub + the bridge pieces that go into them.
