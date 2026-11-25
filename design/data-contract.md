# Reharm Daily — Shared `localStorage` Data Contract

> **Shared Origin Advantage:** Reharm Lab (`/reharm-lab/`), REHARM (`/reharm/`), Reharm Daily (`/reharm-daily/`), and all future games sit under **`https://itailiors.github.io`**, so they share one synchronous `window.localStorage` namespace with zero backend or `postMessage` hacks.

---

## 1. Per-Game Key Contract (`daily:v1:<gameId>`)

Every daily game writes **one compact JSON record** (`< 2 KB`) under `daily:v1:<gameId>` whenever a player starts progress or finishes today's puzzle.

### Schema

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `v` | `1` | Yes | Schema version literal (`1`). |
| `gameId` | `string` | Yes | Catalog ID matching `games.json` (e.g. `"reharm"`, `"stepwise"`). |
| `dateKey` | `string` | Yes | Local calendar date `YYYY-MM-DD` (e.g. `"2026-11-25"`) of this record. |
| `puzzleNo` | `number` | Yes | Puzzle edition integer (e.g. `42`). |
| `status` | `'new' \| 'in_progress' \| 'done'` | Yes | Current state for `dateKey`. Games write `'in_progress'` on first move and `'done'` on finish. |
| `score` | `number \| null` | Yes | Numeric primary score (`0..100` for REHARM, depth metres, moves, ms pocket, etc.), or `null` while in progress. |
| `scoreLabel` | `string` | Yes | Human-readable badge string shown on hub card & share card (e.g. `"91/100 · Top 4%"`, `"Step 2/4"`, `"3 moves (Par)"`). |
| `tierIcon` | `string` | No | Optional emoji/glyph used in Combined Share Card (e.g. `"▲"`, `"◐"`, `"⛳"`, `"🎯"`). |
| `streak` | `number` | Yes | Game's own consecutive-day streak (`>= 0`). |
| `bestScore` | `number \| null` | No | Personal best numeric score across all days (or lowest moves for golf games). |
| `playedCount` | `number` | No | Lifetime completions count for this game. |
| `progressLabel` | `string` | No | Short label when `status === 'in_progress'` (e.g. `"2/4 bars filled"`, `"Step 2/4"`). |
| `shareText` | `string` | No | Single-line summary snippet appended into the Hub's Combined Share Card. |
| `labMove` | `{ slug: string; label: string } \| null` | No | Deep-link target for the `"Learn <label> in Reharm Lab"` chip (e.g. `{ slug: "tritone-sub", label: "Tritone Sub" }`). |
| `updatedAt` | `number` | Yes | Epoch milliseconds (`Date.now()`) of last write. |

### Concrete Examples

**Example 1 — `daily:v1:reharm` (`done`)**
```json
{
  "v": 1,
  "gameId": "reharm",
  "dateKey": "2026-11-25",
  "puzzleNo": 42,
  "status": "done",
  "score": 91,
  "scoreLabel": "91/100 · Top 4% Spice",
  "tierIcon": "▲",
  "streak": 5,
  "bestScore": 96,
  "playedCount": 14,
  "shareText": "🎛️ REHARM: 91/100 · ▲ Top 4% Spice",
  "labMove": {
    "slug": "tritone-sub",
    "label": "Tritone Sub"
  },
  "updatedAt": 1795641600000
}
```

**Example 2 — `daily:v1:stepwise` (`in_progress`)**
```json
{
  "v": 1,
  "gameId": "stepwise",
  "dateKey": "2026-11-25",
  "puzzleNo": 42,
  "status": "in_progress",
  "score": null,
  "scoreLabel": "Step 2/4 · Par 3",
  "streak": 4,
  "bestScore": 2,
  "playedCount": 9,
  "progressLabel": "Step 2/4",
  "updatedAt": 1795641420000
}
```

**Example 3 — `daily:v1:barline` (`done`)**
```json
{
  "v": 1,
  "gameId": "barline",
  "dateKey": "2026-11-25",
  "puzzleNo": 77,
  "status": "done",
  "score": 11,
  "scoreLabel": "±11ms pocket",
  "tierIcon": "🎯",
  "streak": 6,
  "bestScore": 7,
  "playedCount": 11,
  "shareText": "🥁 BARLINE: ±11ms pocket",
  "labMove": null,
  "updatedAt": 1795641900000
}
```

---

## 2. Hub Keys (`daily:v1:hub:*`)

| Key | Type & Purpose | Example |
| :--- | :--- | :--- |
| `daily:v1:hub:prefs` | User preferences (`theme`, `reducedMotion`, `mutedDefault`, `uiSounds`, `seenIntro`, `bannerDismissedDate`) | `{"theme":"system","reducedMotion":false,"mutedDefault":false,"uiSounds":false,"seenIntro":true}` |
| `daily:v1:hub:streak` | Aggregated hub ritual record (`current`, `longest`, `lastPlayedDate`, `cleanSheets`, `recentDays` map of `YYYY-MM-DD -> { played, total, clean }`) | `{"current":5,"longest":12,"lastPlayedDate":"2026-11-25","cleanSheets":4,"recentDays":{"2026-11-25":{"played":1,"total":1,"clean":true}}}` |
| `daily:v1:hub:waitlist` | Local-only bell reminders for `planned` games (`Record<gameId, number>` epoch ms added) | `{"quartet":1795641200000,"chord-trench":1795641250000}` |

---

## 3. Defensive Read-Only Adapter for Existing `reharm:v1:*`

`brief/PRODUCT_BRIEF.md §6` notes that the live `REHARM` game already uses keys prefixed `reharm:v1:` (`settings`, `history`, `draft`, `meta`). Note: our headless browser sandbox blocked programmatic `window.localStorage` inspection on the live site, so exact live property names inside `reharm:v1:history` should be verified in the `Reharm` codebase by Claude Code during wiring.

Until REHARM also emits `daily:v1:reharm` directly, the hub reads `reharm:v1:*` **strictly read-only** in priority order:
1. If `daily:v1:reharm` exists and `dateKey === todayKey`, use it as canonical source.
2. Otherwise, inspect `reharm:v1:history`, `reharm:v1:draft`, and `reharm:v1:meta` defensively (guarded by `try/catch` + optional chaining):
   - If `history` contains an entry matching `todayKey` (or today's `puzzleNumber`), synthesize `{ status: 'done', score, scoreLabel, streak, labMove }` in memory without mutating `reharm:v1:*`.
   - Else if `draft` has non-empty user bars matching `todayKey` / today's `puzzleNumber`, synthesize `{ status: 'in_progress', progressLabel: 'X/3 bars' }`.
   - If `reharm:v1:settings.theme` or `.isMuted` exists and `daily:v1:hub:prefs` has never been set, optionally seed initial default (never overwrite explicit hub user choices).

---

## 4. Date Rollover, Sync & Private-Mode Fallback Rules

### Local Calendar Key (`getLocalDateKey`)
```ts
export function getLocalDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
```
- **Stale Day Rule:** If a stored `daily:v1:<gameId>.dateKey !== getLocalDateKey()`, treat today's card status as `'new'`, while preserving `streak` (checking whether `dateKey === yesterdayKey` to know if the streak is still alive or reset to `0`) and `bestScore` / `playedCount`.

### Cross-Tab & Return-to-Tab Sync
- Listen to `window.addEventListener('storage', refreshBoard)` (fires when a player completes a game in another tab).
- Listen to `window.addEventListener('pageshow', refreshBoard)` and `document.addEventListener('visibilitychange', ...)` (fires when returning via Back button or switching tabs from REHARM → Hub).
- Diff previous vs newly loaded `status`: if a game flipped from `'new' | 'in_progress'` → `'done'`, trigger the red-pen `stamp-done` animation (`motion-spec.md §2.4`)!

### Storage-Blocked (Safari Private Mode) Degradation
- Wrap **every** `localStorage.getItem` / `setItem` / `removeItem` in a small `SafeStorage` module testing read/write probe (`__daily_probe__`) at startup.
- If `SecurityError` or `QuotaExceededError` occurs:
  - Set `storageBlocked = true` on hub state.
  - Display the non-blocking top notice (`ux-spec.md §2.10`).
  - Fall back to an in-memory `Map<string, string>` so theme switches, detail sheets, bells, and share preview keep working cleanly for the current session.
