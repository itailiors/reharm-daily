# Handoff: Reharm Daily

## Goal
Run the Reharm Daily hub (https://itailiors.github.io/reharm-daily/) as one daily sheet for the Reharm music games (REHARM, STEPWISE, MEND live), linked both ways with each game and Reharm Lab. Zero backend; apps share same-origin localStorage.

## Done
- 8ee8207 production hub; ce6f650 local-day REHARM numbering; 7d1dc02 STEPWISE live; 73083fa MEND live.
- 2026-11-27 blind Gemini playtest of hub + all three games (gemini-pro-orchestrator-neon, no source access, 390×844). Reviews: docs/playtests/2026-11-27-gemini-blind.md.
- Playtest fixes, all deployed:
  - Hub 59f637b: intro names every live game; done cards drop the redundant (i) next to "Learn move".
  - MEND (itailiors/mend) 9b0785b: anonymous bass chips, cadence romans hidden until healed, melody strip above chords, kind-specific chord explanations, share URL, "Checks (par 4)", toast off header.
  - REHARM (itailiors/reharm) 19dad8d + a64d57c: penalty names the bars, explains auto-extensions (Db7 + G = Db7#11), locked day hides / Bass and fits 844px, melody note names, style hints, full https share link.
  - STEPWISE (itailiors/stepwise) 7ca23d8 + b1536a3: one-screen phone layout with scrolling ladder, Auto note spelling (default), rule banner opens before first move, share URL + countdown.
  - All three games: bridge strip says "Daily sheet" / "<GAME> done" instead of "1/1 today".
- /code-review medium on the game commits: 3 important findings fixed (short-phone overlap, lava spelling, style hint wiping clash fixes).

## In progress
- .claude/launch.json has uncommitted dev entries for mend/reharm/stepwise (absolute paths to sibling folders); keep local or drop.

## Next 3 steps
1. Phone smoke test on the live sites: play all three games, check the hub stamps + Copy (clipboard success path never verified on a real device).
2. Small review leftovers: MEND hub record still says "taps" (Mend src/game/daily.ts buildDoneRecord); MEND toast is position:absolute, so it hides when scrolled.
3. Bump the Pages actions in .github/workflows/deploy.yml (Node 20 deprecation); the game repos use the same versions.

## Decisions and why
- Product name "Reharm Daily", path /reharm-daily/, Direction A ("The Daily Sheet").
- design/tokens.css is imported directly by the app, so it stays the single source of truth.
- Hub streak counts days with >= 1 live daily done; Clean Sheet is a separate lifetime count; Lab practice never counts.
- Extra hub key daily:v1:hub:seen so a game is stamped Done only once per day.
- HubStreak.since set on reset so back-fill from REHARM history doesn't undo a reset.
- GoatCounter uses the Reharm Lab endpoint (reharm-lab.goatcounter.com), loaded at idle, only on *.github.io.
- Planned games launch by flipping status to 'live' and setting url in src/data/games.ts.
- Games don't count the whole sheet (they only know their own result), so their strip says "Daily sheet" rather than a fraction.
- STEPWISE: old saves stored 'sharp' as a default, so 'sharp' without spellingChosen now loads as Auto (explicit sharp pickers switch once).
- MEND bass chips stay A/B/C (daily order) until healed; labelling "Root" gave the answer away.

## Gotchas
- daily:v1:reharm (native record) beats the adapter only when its dateKey is today's local date.
- The preview pane captures screenshots mid-animation; check computed styles before trusting a "transparent" sheet. Gemini's headless screenshots have the same problem (MEND's "see-through" modal report was a fade-in).
- Running a contrast audit right after a theme switch gives false failures while transitions run; wait ~1s.
- Reharm Lab already used a `move` URL param before the bridge; keep it working.
- The hub repo has no PR CI checks; each repo's Pages workflow runs npm run check on push to main.
- Blind Gemini playtests need timeout_s ~1500 and "play once, max ~400 words" in the prompt; 600s timed out on 3 of 4, and the hub agent once ended without writing its review.
- STEPWISE dev builds accept ?date=YYYY-MM-DD to load another day's puzzle.
