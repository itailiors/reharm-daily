# Blind Gemini playtest, 2026-11-27

Four Antigravity agents (gemini-pro-orchestrator-neon, plan mode, empty workspace, no source access), 390×844 mobile viewport, headless Chromium (no audio). One playthrough each.

| Game | Score | Biggest issue |
|---|---|---|
| Hub (Reharm Daily) | 8.5 | Games' own "x/1 today" badges and edition numbers disagree with the hub (STEPWISE #2 vs hub #3; REHARM says "All daily puzzles complete" after 1 of 3) |
| STEPWISE #2 | 7.5 | Mobile: ladder growth pushes the ±1/±2 controls below the fold; pucks cover note labels |
| REHARM #3 | 7.5 | Score breakdown docks "−12 unresolved" without saying which bar or why |
| MEND #52 | 6.5 | Theory Diagnosis overlay is see-through; playhead and toasts draw over modals/header |

## Hub
- Onboarding copy says "(REHARM is live today)" though 3 games are live (confirmed: `src/ui/sheets.ts:190` names only the lead game).
- STEPWISE badge "1/1 today" contradicts hub's 3-game sheet; edition #2 vs hub #3.
- Completed card: "Hear & compare" + "Learn move" push the (i) button onto its own row.
- Worked well: clear live vs planned split, same-tab nav both ways, instant stamp/streak/progress update, share card with Full / Compact tabs.

## STEPWISE
- Not told up front that every intermediate step must be a recognized chord; Checkpoint: Dim pill isn't obviously tappable and `?` doesn't explain it.
- Enharmonic spelling: shows D# Maj / G# instead of Eb / Ab by default.
- Share text has no game URL; no countdown to tomorrow's puzzle.
- Top fixes: lock layout to 100dvh with scrolling ladder; sensible default spelling; explain the daily modifier, add URL + countdown.
- (Middle of this review was truncated in transport.)

## REHARM
- Tapping Db + 7 silently became Db7#11.
- After locking: banner pushes page to 882px, clipping "/ Bass Root"; that button stays enabled while Root/Quality are disabled.
- Piano roll shows no note names; STYLE presets (Outside-in, Bach) unexplained.
- Share link copies without `https://`.
- Top fixes: explain deductions per bar; disable / Bass and fit 844px after lock; flag auto-extensions + label melody notes.

## MEND
- Too easy: Bass button labelled "Root (B1)", Cadence option text matches the target verbatim.
- Theory Diagnosis overlay translucent: rows/buttons bleed through. Playhead line crosses Pending rows, toasts and popups. Toasts cover the header.
- Editing Chords collapses Melody, hiding the notes you need to harmonize.
- Chords diagnosis explanation didn't match the remaining correct option.
- Share card omits URL; "4/4 taps" wording for first-try checks.
- Top fixes: opaque modal + z-index for playhead/toasts; remove giveaway labels; keep healed layers readable.

## Not covered
Audio, haptics, native share sheet, Make the Changes (Lab mode).
