# Handoff: Reharm Daily

## Goal
Ship and connect the Reharm Daily hub (https://itailiors.github.io/reharm-daily/): one daily sheet for the Reharm music games, linked both ways with REHARM and Reharm Lab. Zero backend; apps share same-origin localStorage.

## Done
- 8ee8207: production hub (Vite + vanilla TS). SafeStorage, local-midnight rollover, hub streak + Clean Sheet, combined share card, read-only `reharm:v1:*` adapter, cross-tab sync, Web Audio cues, Pages deploy workflow. Live and deployed.
- ce6f650 (reharm-daily#1): hub numbers REHARM puzzles by local day, matching REHARM.
- REHARM repo (itailiors/reharm), all merged: #2 writes `daily:v1:reharm` + bridge bar + Up-next card; #3 local-midnight rollover; #4 "Learn <move> in Reharm Lab" chip in the score reveal.
- Verified at 390×844 and 1280×800, both themes: AA contrast and 44px targets audited across board + all sheets.

- Reharm Lab repo (itailiors/reharm-lab, local folder `TheWoodshed`), merged: #31 Daily pill + rail icon, unplayed-count badge from `daily:v1:*`, `?mode=changes`, `?move=<slug>`, `← Reharm Daily` return pill.

## In progress
- Nothing half done.

## Next 3 steps
1. On the live Lab, check that `?mode=changes&from=reharm-daily` lands in the Changes tab and that the Daily pill shows the right count.
2. Phone smoke test on the live hub: finish REHARM, confirm the red-pen stamp + Clean Sheet, tap Copy (only the clipboard fallback was tested; the preview pane blocks the clipboard).
3. Bump the Pages actions in `.github/workflows/deploy.yml` (Node 20 deprecation warning); REHARM's workflow uses the same versions.

## Decisions and why
- Product name "Reharm Daily", path /reharm-daily/, Direction A ("The Daily Sheet").
- `design/tokens.css` is imported directly by the app, so it stays the single source of truth.
- Hub streak counts days with >= 1 live daily done; Clean Sheet is a separate lifetime count; Lab practice never counts.
- Extra hub key `daily:v1:hub:seen` so a game is stamped Done only once per day.
- `HubStreak.since` set on reset so back-fill from REHARM history doesn't undo a reset.
- GoatCounter uses the Reharm Lab account endpoint (`reharm-lab.goatcounter.com`), loaded at idle, only on *.github.io.
- Planned games launch by flipping `status` to 'live' and setting `url` in `src/data/games.ts`.

## Gotchas
- `daily:v1:reharm` (native record) beats the adapter only when its dateKey is today's local date.
- The preview pane captures screenshots mid-animation; check computed styles before trusting a "transparent" sheet.
- Running a contrast audit right after a theme switch gives false failures while transitions run; wait ~1s.
- Reharm Lab already used a `move` URL param for its own purpose before the bridge; the Lab session must keep it working.
- The hub repo has no PR CI checks; the Pages workflow runs `npm run check` on push to main.
