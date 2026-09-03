# PickBoard

A two-screen mini sportsbook: browse mock events, place single-leg picks against decimal odds,
and read your record back on a dashboard that tells you something you did not already know.

Built as a **Feature-Sliced Design (FSD v2.1) reference implementation** — the layering is
enforced by ESLint, so an illegal import fails the build rather than surviving code review.

- **Live demo:** https://uladzislau-ivanou.github.io/pick-board/ (see [Deploying the demo](#deploying-the-demo) — enable Pages once and the workflow keeps it current)
- **Stack:** React 19 · TypeScript (`strict`) · Vite · Tailwind CSS v4 · React Router · Recharts ·
  Vitest + Testing Library

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script                            | What it does                                 |
| --------------------------------- | -------------------------------------------- |
| `npm run dev`                     | Dev server                                   |
| `npm run build`                   | `tsc -b` then a production build             |
| `npm run preview`                 | Serve the production build locally           |
| `npm run typecheck`               | `tsc -b` under `strict`                      |
| `npm run lint`                    | ESLint — **includes the FSD boundary rules** |
| `npm test`                        | Vitest, single run                           |
| `npm run test:watch`              | Vitest, watch mode                           |
| `npm run format` / `format:check` | Prettier                                     |

CI runs typecheck → lint → format → test → build on every push and pull request.

## The two screens

**Events** — 20 mock events across five sports over the next seven days, grouped by local day.
Today and tomorrow are open; later days are collapsed and render **zero** children until opened.
A sport chip filters the board, expands every matching group and resets the day window in one
transition. Tapping any price opens the Place Pick modal with a live payout.

**My Picks** — a pattern card that reads your recent behaviour, three all-time totals, a
clickable 7/30/all-day stacked stake chart, and a ledger with period / market / sort filters,
row expansion and paged loading. Clicking a chart day filters the ledger and shows a clearable
chip: the chart and the ledger are driven by **one** piece of state, so they can never disagree.

Picks persist to `localStorage`, so a reload keeps what you placed.

## Architecture

Imports go **down only** — never sideways, never up:

```
app  →  pages  →  widgets  →  features  →  entities  →  shared
```

```
src/
  app/          composition root, router, global styles, the end-to-end test
  pages/        events, my-picks
  widgets/      app-header, event-board, pick-ledger
  features/     place-pick, filter-events-by-sport, filter-picks,
                pick-insights, daily-performance
  entities/     event, pick
  shared/       config, lib, ui, styles
```

Inside a slice: `ui/`, `model/`, `lib/`, `api/`, `config/`. **Barrels live at slice root only** —
segment barrels buy nothing and invite cycles. `shared` has no slices, so its public API is
per unit (`shared/ui/Button`, `shared/lib/money`); there is deliberately no `shared/ui/index.ts`,
which would defeat tree-shaking.

Convention: **cross-slice imports always use `@/`, intra-slice imports are always relative.**
Every boundary crossing is therefore greppable — `grep -rn "from '@/" src/entities`.

Files: components `PascalCase.tsx`, everything else `kebab-case.ts`. Tests sit beside their
source; there are no `__tests__/` directories.

### What the linter enforces

`eslint-plugin-boundaries` is configured as a hard gate in `eslint.config.js`:

| Rule                                | Effect                                                                                                                                                                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `boundaries/elements`               | One element per layer; sliced layers `capture: ['slice']`                                                                                                                                                                                       |
| `boundaries/dependencies`           | `default: 'disallow'`, so nothing is legal until a policy says so. Each layer may import lower layers **plus its own slice** — and that self-reference is precisely what makes relative intra-slice imports legal while blocking sibling slices |
| …its `fileInternalPath: 'index.ts'` | The same policies allow a cross-slice import **only** through the slice's `index.ts`, so a deep import fails for want of a matching policy. The public API is enforced, not merely documented                                                   |
| …its package policies               | `recharts` is confined to `features/daily-performance`; `react-router` is banned from `entities` and `shared`. Policies are last-match-wins, so the broad allow comes first and the narrow exception last                                       |
| `boundaries/no-unknown-files`       | Every file must belong to a layer                                                                                                                                                                                                               |
| `no-restricted-imports`             | Nothing may import `app`. `boundaries` structurally cannot express this — there is no layer above `app` to write a policy from — so it is the one path rule                                                                                     |

Tests are exempt from `boundaries/dependencies`: a test may reach into the internals of the slice
it covers.

All four violations that matter fail `npm run lint`:

```
entities/pick   →  features/filter-picks            upward
entities/pick   →  entities/event                   sideways, same layer
pages/my-picks  →  widgets/pick-ledger/ui/PickLedger deep, bypassing index.ts
widgets/…       →  recharts                         package outside its one slice
```

One alias, `@/*` → `src/*`, declared in `tsconfig.app.json` and `vite.config.ts`. Per-layer
aliases look FSD-ish but duplicate entries across four configs and would still let
`@entities/pick/model/PicksProvider` slip past a reviewer; `@/entities/pick` already names its
layer aloud and the linter enforces the rest.

### Boundary decisions worth naming

Each of these is a place a naive structure breaks:

- **`MarketType` and `Sport` are shared by both entities.** `Market.type` belongs to
  `entities/event`, `Pick.market` to `entities/pick`. Whichever entity declared them, the other
  would need a sibling-entity import — illegal. So there is a deliberately tiny shared kernel:
  `shared/config/markets.ts`, `shared/config/sports.ts`, and `shared/ui/SportIcon` for the icon
  map both entities need. Enums, labels and one icon map — no logic, or it becomes a junk drawer.
- **`calculatePayout` lives in `entities/pick/lib`** and takes primitives, so the modal can call
  it before a `Pick` exists. Five consumers: the modal, the totals, the ledger row, the chart's
  `returned`, and the week-net insight rules.
- **The insight engine splits in two.** The _measurements_ are pure statistics that the totals,
  the chart and the ledger also need → `entities/pick/lib/stats.ts`, which contains no
  user-facing strings, ever, or the entity stops being reusable. The _copy_ and the ranking are
  product concerns → `features/pick-insights`. Each rule is a file; every sentence lives in
  `config/messages.ts`.
- **`PickPeriod`, `periodRange` and `periodLabel` are in `entities/pick/lib/period.ts`,** because
  both `filter-picks` and `daily-performance` need them and declaring them in either feature
  would force a feature→feature import. `SortOption`, which only the ledger cares about, stays
  in `filter-picks`.
- **`PicksContext` is in `entities/pick/model`,** not `app/providers`. Nothing may import `app`,
  so a provider living there could not be read by `widgets/pick-ledger`. `app/App.tsx` only
  _composes_ it.
- **`ROUTES` is in `shared/config`.** The header tabs and the toast's "View → My Picks" jump both
  need path constants from inside `widgets`/`features`; putting them in `app/routes` would be an
  upward import. `app/routes/router.tsx` just maps those constants to page components.
- **`OutcomeButton` stays presentational** in `entities/event/ui` with an injected
  `onSelectOutcome`; `widgets/event-board` is the layer that knows `features/place-pick` exists.
  The modal's payload is not a `Pick` — it carries `sport` and both the display market and the
  market type — so it is a separate `PickDraft` type.
- **There is no `entities/team`.** Teams are bare strings on `SportEvent` with no id and no
  lifecycle, so they are `entities/event/lib/team.ts` plus a crest-colour config.
- **The band on My Picks is not a widget.** It holds zero logic and would take `period`,
  `selectedDay`, `picks` and their setters straight back out as props — page markup in a widget
  costume — and the `period` it received must be shared with the ledger _below_ it, so ownership
  has to sit above both. It is `pages/my-picks/ui/PerformanceBand.tsx`, layout only.

### State ownership

The rule that decides every case: **if changing A must atomically reset B, A and B live in one
reducer.**

| State                                                         | Owner                                       | Why                                                                                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `picks`                                                       | `entities/pick/model` (Context)             | Shared by both screens; the brief's required Context                                                                                                |
| `sport` + `openDays` + `visibleDays`                          | `widgets/event-board/model`                 | "A sport chip filters, expands every matching group **and** resets the day window" is one transition                                                |
| Modal `draft` + `stake`                                       | `features/place-pick/model`                 | Local modal state; a second Context would add indirection without removing a prop                                                                   |
| `tab`, `period`, `market`, `sort`, `dayFilter`, `visibleRows` | `features/filter-picks/model` (one reducer) | Any change resets the row window; a period change also clears the day filter. One piece of state is why the chart and the ledger can never disagree |
| `expandedRows: Set<string>`                                   | `widgets/pick-ledger/model`                 | Explicitly independent — paging must not close open rows                                                                                            |
| `insightIndex`                                                | `features/pick-insights` local              | Clamps when the list length changes; no auto-advance                                                                                                |

## The insight heuristic

`getPickInsights(picks, now)` returns **every** pattern that fires, positives before warnings,
and the pattern card is a carousel over them. One message is a fortune cookie; a ranked set is a
read. Pending picks are excluded — a pick that has not settled is not evidence.

Under three resolved picks the engine returns a single neutral card. If nothing fires, it falls
back to a neutral "steady form" reading.

| #   | Tone | Fires when                                           | Scope       |
| --- | ---- | ---------------------------------------------------- | ----------- |
| 1   | good | ≥3 consecutive wins at the newest end                | —           |
| 2   | good | ≥4 wins in the last 5 resolved                       | —           |
| 3   | good | Best market with 3+ resolved picks at ≥60%           | that market |
| 4   | good | Positive net return over the last 7 days, ≥3 settled | —           |
| 5   | bad  | ≥3 consecutive losses within one market type         | that market |
| 6   | bad  | ≤1 win in the last 5 resolved                        | —           |
| 7   | bad  | Worst market with 3+ resolved picks at ≤34%          | that market |
| 8   | bad  | Negative net return over the last 7 days, ≥3 settled | —           |
| 9   | bad  | Last-3 average stake > 1.5× the all-time average     | —           |

Rules 5 and 7 can describe the same market, so rule 7 is suppressed for any market rule 5 already
reported. That exclusion is **orchestrator-level**, passed in as accumulated context, so
`weakest-market.ts` never imports `cold-market.ts`.

`now` is a parameter, not a `Date.now()` call inside the function — which is the only reason the
week-to-date rules are testable at all. The same is true of `groupByDay(events, now)`,
`periodRange(period, picks, now)` and `dailyBuckets(picks, range)`.

## Styling

Tailwind v4's CSS-first config suits a token handoff. `src/shared/styles/tokens.css` holds one
`@theme` block with the design system's values plus the `--pb-*` brand layer; a search for
`#f3f2f2` in `src/` returns exactly one line. `--color-*: initial` clears Tailwind's default
palette, so `text-red-500` does not compile — every colour must come from a token.

- `--radius-*: 0` everywhere, and no `rounded-*` utility anywhere.
- The design system's component classes (`.btn`, `.tag`, `.seg`, `.dialog`) are deliberately
  **not** imported. Their bodies are ported into `shared/ui` components instead, so there is one
  source of truth per pixel rather than two.
- Per-team crest gradients cannot be tokens, because the colour is data. `entities/event/lib/team.ts`
  returns the hex, the cell sets `--crest-color`, and a Tailwind `@utility crest-field` reads it.
  No component builds a CSS string.
- **No media queries.** Responsiveness is `flex-wrap`, `auto-fit` grids and `clamp()` only, so the
  layout degrades in a single direction: every row wraps, every grid is `auto-fit`, and no element
  carries a fixed width wider than a 375px viewport outside a scroll container.
- Archivo 400/500/600/800 via `<link>` with `preconnect`, avoiding a CSS `@import` waterfall.

## Accessibility

- The Place Pick modal is `role="dialog" aria-modal="true"`, labelled by the selection heading,
  focus moved to the stake input on open, focus **trapped**, Escape closes, focus **returned** to
  the price button that opened it, and the page behind it is locked.
- Day group headers and ledger rows are `<button aria-expanded aria-controls>`; the panel carries
  the id.
- The stake input has a real `<label>`, `inputmode="decimal"`, and a validation line that is
  `aria-live="polite"` and referenced by `aria-describedby`.
- **Chart columns are real `<button>`s laid over the bars**, each with a text `aria-label`
  carrying the same figures as the hover title. SVG rects cannot hold an accessible name, and the
  figures would otherwise be desktop-only.
- Accessible names are set explicitly wherever a label and its value are adjacent elements — the
  computed name would otherwise read "Odds1.72" or "Basketball5".
- Never colour alone: Won / Lost / Pending each carry a text label as well as a fill.
- The design system's 2px `:focus-visible` ring is left untouched; no component restyles it.
- Tap targets: prices and primary actions ≥46px, chips and toggles ≥34px, quick stakes 40px.

## Testing

`npm test` — 241 tests in 32 files, all colocated with their source.

- **The brief's two required targets:** `calculatePayout` and `getPickInsights` (per-rule).
- Plus `groupByDay`, every `entities/pick/lib/stats` function, `periodRange`/`periodLabel`,
  `dailyBuckets`, `applyPickQuery`, the pick-query reducer, and the shared formatters.
- Component and widget tests for the board, the modal, the chart, the ledger and the dashboard.
- `src/app/App.integration.test.tsx` walks the handoff's definition of done: tap a price → type a
  stake → place the pick → it is on top of My Picks as Pending, Total Staked and Pending Payout
  have moved, win rate has not, and a reload keeps it.

Every test is deterministic because `now` is injected everywhere it is needed.

Two things worth knowing if a test surprises you:

- **Recharts' `ResponsiveContainer` measures 0 in jsdom**, so the bars do not render under test.
  That is fine and deliberate: every assertion targets the HTML rows and the overlay buttons,
  which is also where all the behaviour lives.
- **The seeded picks come in same-timestamp pairs.** A stable `placedAt desc` sort therefore keeps
  the fixture's table order inside a day, which is what makes "4 of the last 5 landed" true on
  first load.

## Assumptions and decisions

Where the brief left room, these are the calls made — and why.

| Decision                                                     | Reasoning                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decimal odds only**                                        | `payout = stake × odds`. An American/fractional toggle is a settings concern, not a two-screen exercise. The format is single-sourced in `shared/lib/odds`.                                                                                                                                                                                                                                      |
| **No settlement**                                            | Placed picks stay Pending; all Won/Lost data is seeded. Settling on a timer would fake a backend and make every test time-dependent.                                                                                                                                                                                                                                                             |
| **Summary totals are always all-time**                       | The period control scopes the chart and the ledger, deliberately not the three totals — a "total staked" that shrinks when you change a filter is not a total. Each sub-line says which population it counted.                                                                                                                                                                                   |
| **Mock data is synchronous, in the entity's `api/` segment** | `getEvents(now)` and `getSeedPicks(now)`. It cannot be `shared/mocks`: the fixtures are typed `SportEvent[]`/`Pick[]`, so `shared` would import `entities` upward. `api/` is the seam a real HTTP call lands in. Deliberately **not** a fake `async` fetch — the design specifies no skeletons, spinners or loading states anywhere, and a promise would invent three UI states nothing defines. |
| **The seeded picks reference events absent from the feed**   | Padres vs Giants, Bucks vs Sixers. The two fixture sets are independent on purpose: `Pick` carries a display string, not an `eventId`.                                                                                                                                                                                                                                                           |
| **`localStorage` persistence**                               | One hook, `shared/lib/use-local-storage-state`. Placing a pick and losing it on refresh makes the app feel broken for the sake of purity.                                                                                                                                                                                                                                                        |
| **The board pages days, not events**                         | "Show N more days" reveals three at a time and collapsed groups render zero children. The ledger pages rows with an explicit "Load 4 more" and a "6 of 10 shown" count — **never** infinite scroll, because a record users audit needs a reachable bottom and a stable position.                                                                                                                 |
| **Three sort options, not sortable column headers**          | Only two ledger columns are magnitudes; headers would need a fixed-width table that breaks the labelled mobile rows, and every header click would reset the row window. Sorting applies to the whole filtered set, then pages; ties fall back to `placedAt` desc.                                                                                                                                |
| **The ledger row is not a `<table>`**                        | Its metric columns have to wrap under the left block on a phone while each keeps its own label. That is exactly what a table cannot do.                                                                                                                                                                                                                                                          |
| **No `i18n`**                                                | `en-US` dates and currency, pinned in `shared/lib/date` so tests stay stable. Every string that reaches a user lives in a component or in `pick-insights/config/messages.ts`.                                                                                                                                                                                                                    |
| **No per-event pick grouping**                               | Collapsing several picks on one event under an event header is worth it once the data model produces multi-pick events; today every group would be a group of one.                                                                                                                                                                                                                               |
| **No date-range picker**                                     | The chart _is_ the date picker. A from–to range earns its place only once "All" spans months.                                                                                                                                                                                                                                                                                                    |
| **Steiger not used**                                         | The official FSD linter was considered and declined; boundaries are enforced by ESLint alone, which keeps the gate to one command.                                                                                                                                                                                                                                                               |

## Deploying the demo

`.github/workflows/deploy.yml` builds with `GITHUB_PAGES=true` — which switches Vite's `base` to
`/pick-board/` — and publishes `dist/` to GitHub Pages. `index.html` is copied to `404.html`
because Pages has no SPA rewrite, so without it a refresh on `/pick-board/my-picks` would 404
instead of reaching the router.

To enable it: **Settings → Pages → Build and deployment → Source: GitHub Actions**, then push to
`main`.
