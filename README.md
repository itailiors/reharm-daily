# Reharm Daily

One daily sheet for every Reharm music puzzle: https://itailiors.github.io/reharm-daily/ (planned).
Static site (Vite + vanilla TypeScript), zero backend, all progress in same-origin `localStorage`.

## Commands
- `npm run dev`: local dev server
- `npm run check`: typecheck + unit tests + production build (the definition of done)
- `npm run preview`: serve `dist/` (relative base, so it works at `/` and at `/reharm-daily/`)

Pushing to `main` deploys via `.github/workflows/deploy.yml` (GitHub Pages, source = GitHub Actions).

## Layout
- `index.html`, `src/main.ts`: entry and controller (sheets, launch veil, sync, GoatCounter)
- `src/lib/`: pure logic, unit-tested in `tests/`
  - `storage.ts`: SafeStorage (probe + in-memory fallback)
  - `dates.ts`: local date keys, edition numbers, midnight countdown
  - `records.ts`: `daily:v1:<gameId>` parsing and the stale-day rule
  - `reharmAdapter.ts`: read-only `reharm:v1:*` adapter (matches `Reharm/src/share/storage.ts`)
  - `streak.ts`: hub streak + Clean Sheet math; `share.ts`: combined share text
  - `board.ts`: aggregates everything into one snapshot
- `src/ui/`: HTML string renderers; `src/styles/app.css`: components
- `src/data/games.ts`: the typed catalog (flip a game's `status` to `'live'` and set `url` on launch day)

## Design sources (read-only inputs)
- `design/`: specs, `tokens.css` (imported directly, the single source of truth), `preview/index.html` prototype
- `assets/`: brand, covers, icon sprite; `reference/`: REHARM pack (badge SVGs are bundled from here), Lab tokens
- `brief/`, `AGY_PROMPT.md`: stage-1 brief
