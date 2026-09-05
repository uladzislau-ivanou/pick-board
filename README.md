# PickBoard

A two-screen mini sportsbook: browse mock events on a real odds board, place single-leg picks
in decimal or American odds, and read your record back on a dashboard that tells you something
you did not already know.

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

**Events** — 20 mock events across five sports over the next seven days, grouped by local day and
laid out the way a sportsbook lays one out: the two teams stacked on the left, one row each, and
three fixed columns of prices — Moneyline, Spread, Total — headed once per day, with an em-dash
where a market is not offered. An event inside the hour before kickoff counts down; one that has
started is marked **Live**, and once it is over it leaves the board. The header carries the next match
off, what is in play, and what you have open. Today and tomorrow are
open; later days are collapsed and render **zero** children until opened. A sport chip filters the
board, expands every matching group and resets the day window in one transition. Tapping any price
opens the Place Pick modal with a live payout.

**My Picks** — three all-time totals, a one-line insight strip that reads your recent behaviour, a
clickable 7/30/all-day chart carrying daily stake as bars and **running net as a line**, and a
ledger with period / market / sort filters, row expansion and paged loading. Clicking a chart day
filters the ledger and shows a clearable chip: the chart and the ledger are driven by **one** piece
of state, so they can never disagree.

Picks you place persist to `localStorage`, so a reload keeps them. The seeded history does **not**
persist — it is regenerated from `Date.now()` on every load, so the dashboard is never looking at a
week-old window no matter when the app is opened. Prices render in decimal or American odds; the
choice is a header toggle and it persists.

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
| `insightIndex`                                                | `features/pick-insights` local              | Clamps when the list length changes; auto-advance stops for good once the user drives the carousel                                                  |
| `oddsFormat`                                                  | `shared/lib/odds` (Context)                 | A display preference every price on both screens reads; threading it as a prop would touch every component between the header and an odds button    |

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
palette, so `text-red-500` does not compile — every colour must come from a token. The token file
carries only what the app uses: the unused halves of the Modernist ramps (`accent-2`, the 300–900
neutrals, `pb-gold`, `surface`, two shadow steps) were cut rather than shipped as decoration.

- **Corner radius is a three-step scale applied by role**, not by eye: `sm` (4px) for
  anything chip-sized, `md` (7px) for controls the user clicks, `lg` (12px) for the panels
  that contain them. Any `lg` panel also carries `overflow-hidden`, or a flush child — a
  league strip, a column rule — paints straight over the rounded corner. Team crests are
  the one exception at `rounded-full`. This departs from the Modernist system, which
  specifies zero radius everywhere; the softer geometry was an explicit product call.
- The design system's component classes (`.btn`, `.tag`, `.seg`, `.dialog`) are deliberately
  **not** imported. Their bodies are ported into `shared/ui` components instead, so there is one
  source of truth per pixel rather than two.
- Per-team crest colour cannot be a token, because the colour is data. `entities/event/lib/team.ts`
  returns the hex, `CrestBadge` sets `--crest-color`, and a Tailwind `@utility crest-split` reads it.
  No component builds a CSS string. The colour is resolved once, in `gridRows`, from the **full**
  club name and carried on the row — looking it up again from the short name ("Nuggets") silently
  falls back to the text colour, which is a black circle in light mode and a white one in dark.
- **The odds board is one fixed grid, not one grid per event.** Every card lays out on the same
  `minmax(0,1fr) repeat(3, var(--odds-col))` template, and the column heads are rendered **once per
  day group**. A market an event does not offer leaves its cell empty rather than reflowing the
  card, which is what lets a whole column of moneylines be read down the page. Sizing the odds
  columns per card, or letting them absorb free space, both collapse the team name to an ellipsis
  at 390px — `--odds-col` is therefore a fixed `clamp()`, not a `minmax()`.
- **Almost no media queries.** Responsiveness is `flex-wrap`, `auto-fit` grids, container queries
  and `clamp()`. The one exception is the board's column heads, which swap "Moneyline" for "ML"
  under 448px — below that the odds column is narrower than the word, and no amount of wrapping
  or truncation reads as well as the abbreviation every sportsbook already uses.
- **One named container query**, `@container/ledger` on the ledger, read by `@2xl/ledger:` in both
  the row and the header. It is the single place where two arrangements are genuinely needed rather
  than one that degrades. Narrow, the status chip and disclosure sit beside the selection and the
  figures drop to a second line, each under its own label. Wide, the ledger becomes a real table:
  the labels are hidden, one header row names Odds / Stake / Return, and the row is
  selection | figures | status on one line. Column widths are shared constants
  (`entities/pick/ui/pick-row-layout.ts`) so the header cannot drift from the rows. It keys off the
  _ledger's_ width rather than the viewport's, which is the honest dependency — and flex `order`
  cannot express "same line here, next line there", so the row uses explicit grid placement.
- Archivo 400/500/600/800 via `<link>` with `preconnect`, avoiding a CSS `@import` waterfall.

### Light and dark

The theme switcher in the header flips **token values only** — not one utility class in the app
is theme-aware, and there is not a single `dark:` variant. That is the whole return on having a
token layer: `bg-ground`, `text-ink` and `border-divider` already meant "the page" and "the ink",
so redefining what those mean is the entire feature.

Three details make it hold up:

- **`data-theme` is always concrete.** A small script in `index.html` resolves the stored choice
  — or the system preference, when the user has never chosen — _before first paint_. So there is
  no flash of the wrong palette, and the stylesheet needs one dark block instead of a second
  `prefers-color-scheme` copy of it.
- **Some roles could not be a shade.** One dark neutral was doing three unrelated jobs: an
  inverted tile (the toast), a hard border (the modal) and a scrim (the backdrop) — and only the
  first should become _light_ in dark mode. They are now `--color-inverse`, `--color-inverse-ink`
  and `--color-scrim`. Likewise `--color-on-field` is text on a saturated win/loss/brand field, and
  stays light in both themes.
- **Result colours are re-tuned, not reused.** `--pb-win` `#0c7252` and `--pb-loss` `#b23a2f`
  fail contrast as text on a dark ground, so dark mode lightens them. `color-scheme: dark` also
  ships, which is what makes the two native `<select>`s in the filter bar render correctly.

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
- **Brand is a sportsbook blue**, `#1d4ed8` / `#7aa7ff`. It is the only strong hue that collides
  with nothing else on screen: won is green, lost and live are both red. The purple it replaced was
  distinctive, but purple-on-neutral-grey is the most recognisable generated-UI palette there is,
  and this is a submission judged on how it reads.
- **Brand marks interaction and state, never data.** Every price on the board used to be brand —
  **49 brand-coloured text nodes on Events, 47 of them prices**, against 2 on My Picks. Colour
  applied to almost everything says nothing, and it left no colour to say _selected_ with. Prices
  are ink now: the handicap or total is the bold read, the juice sits under it at `ink/65`, and
  brand is left for the active nav tab, a selected chip or segment, the focus ring, the primary
  button, the selected chart day, and the pending state. Events is down to **1**. The payoff is
  that hovering a price — brand border, brand tint — is now the most conspicuous thing on the
  board, which is exactly right for the one thing you are meant to click. `brand-count.mjs` in the
  audit harness is the guard.
- **Muted text has a floor of `ink/65`.** Anything lighter fails AA on the darkest ground the app
  uses (`neutral-200`): `ink/55` measures 3.68:1 and `ink/50` measures 3.10:1 in light mode. The
  scale is now two steps — `ink/65` for labels and `ink/70` for sub-lines — which still separates
  them without dropping any of it below 4.5:1.
- **Fill and ink are separate tokens.** `--pb-win` / `--pb-loss` have to _lighten_ in dark mode to
  stay legible against a dark ground — which would leave light text sitting on a light chip. So
  solid fills use `--pb-win-field` / `--pb-loss-field`, which stay dark in both themes. Measured:
  every value that carries colour or is deliberately quietened — prices, column heads, league
  labels, status chips, returns, the period net, the pattern kicker, the W/L evidence squares,
  chart day labels, ledger heads and stat notes — measures **4.7–15.2:1** in light and dark, all
  above the 4.5:1 AA floor. `--pb-win` had to go from `#0d7a58` to `#0c7252` to clear it on the
  insight strip's ground, and every muted alpha below 65% had to come up.
- The `:focus-visible` ring is 2px of **brand**, not the design system's accent. The accent is a
  red, and a red ring around a focused input reads as a validation error before the user has done
  anything wrong. It is defined once in `base.css`; no component restyles it. Its `outline-offset`
  is **negative**, drawing the ring just inside the element rather than around it: an outline is
  painted outside the border box, so on any control flush inside an `overflow-hidden` parent — the
  stake input, every segment of a segmented control, every ledger row — an outset ring is silently
  clipped away. An inset ring can never be. Verified by tabbing through both pages in a real
  browser and asserting, for every stop, that a ring exists and that no clipping ancestor cuts it.
- Tap targets: primary actions and nav tabs ≥44px, prices 44px, chips and toggles ≥34px,
  quick stakes 40px. Verified in a browser at 320–1280px, not read off the CSS.

## Testing

`npm test` — 246 tests in 33 files, all colocated with their source.

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

| Decision                                                     | Reasoning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decimal and American odds, no fractional**                 | `payout = stake × odds` always; the format is a display concern, single-sourced in `shared/lib/odds` and read through one context. Decimal and American cover the two conventions these leagues are actually priced in. Fractional adds a third rounding table for no reader this app has.                                                                                                                                                                                                          |
| **The board is a fixed three-column grid**                   | Moneyline / Spread / Total in that order, on every card, headed once per day group, with an empty cell where an event has no such market. Sizing columns per card is what makes an odds board unscannable — the column you are comparing moves. This is the change that took a card from 468px to 134px on a phone.                                                                                                                                                                                 |
| **No settlement**                                            | Placed picks stay Pending; all Won/Lost data is seeded. Settling on a timer would fake a backend and make every test time-dependent.                                                                                                                                                                                                                                                                                                                                                                |
| **Summary totals are always all-time**                       | The period control scopes the chart and the ledger, deliberately not the three totals — a "total staked" that shrinks when you change a filter is not a total. Each sub-line says which population it counted.                                                                                                                                                                                                                                                                                      |
| **Mock data is synchronous, in the entity's `api/` segment** | `getEvents(now)` and `getSeedPicks(now)`. It cannot be `shared/mocks`: the fixtures are typed `SportEvent[]`/`Pick[]`, so `shared` would import `entities` upward. `api/` is the seam a real HTTP call lands in. Deliberately **not** a fake `async` fetch — the design specifies no skeletons, spinners or loading states anywhere, and a promise would invent three UI states nothing defines.                                                                                                    |
| **The seeded picks reference events absent from the feed**   | Padres vs Giants, Bucks vs Sixers. The two fixture sets are independent on purpose: `Pick` carries a display string, not an `eventId`.                                                                                                                                                                                                                                                                                                                                                              |
| **`localStorage` persistence**                               | One hook, `shared/lib/use-local-storage-state`. Placing a pick and losing it on refresh makes the app feel broken for the sake of purity.                                                                                                                                                                                                                                                                                                                                                           |
| **The board pages days, not events**                         | "Show N more days" reveals three at a time and collapsed groups render zero children. The ledger pages rows with an explicit "Load 4 more" and a "6 of 10 shown" count — **never** infinite scroll, because a record users audit needs a reachable bottom and a stable position.                                                                                                                                                                                                                    |
| **Three sort options, not sortable column headers**          | Only two ledger columns are magnitudes; headers would need a fixed-width table that breaks the labelled mobile rows, and every header click would reset the row window. Sorting applies to the whole filtered set, then pages; ties fall back to `placedAt` desc.                                                                                                                                                                                                                                   |
| **The ledger row is not a `<table>`**                        | Its metric columns have to wrap under the left block on a phone while each keeps its own label. That is exactly what a table cannot do. Wide, it still _reads_ as a table: a container query hides the per-row labels and shows one header row, with the column widths as shared constants so the two cannot drift.                                                                                                                                                                                 |
| **No `i18n`**                                                | `en-US` dates and currency, pinned in `shared/lib/date` so tests stay stable. Every string that reaches a user lives in a component or in `pick-insights/config/messages.ts`.                                                                                                                                                                                                                                                                                                                       |
| **No per-event pick grouping**                               | Collapsing several picks on one event under an event header is worth it once the data model produces multi-pick events; today every group would be a group of one.                                                                                                                                                                                                                                                                                                                                  |
| **Crests are two-tone monogram badges, not club logos**      | Each club's real primary _and_ secondary colour as a hard diagonal wedge on the badge. No third-party marks, so the public demo ships clean — and the handoff anticipates the alternative: "swap for `<img>` in the same box if real marks are licensed", which is a one-file change in `CrestBadge`.                                                                                                                                                                                               |
| **No decorative colour anywhere**                            | The full-bleed club-colour field, the 3px edge flash and a per-row club-colour wash were all tried and all cut. The wash was the closest call — it filled the empty half of a row — but a horizontal band behind a row is the universal _selected_ affordance, so it collided with the real hover state, and for the navy clubs a 15% tint over cream renders grey, which reads as a highlight rather than as Cubs blue. The crest badge already says whose row it is, in the club's actual colour. |
| **A finished match leaves the board**                        | `openEvents` drops anything more than three hours past kickoff, so the board never offers a price on a game that is over. The count therefore falls through the evening — 20 events in the morning, 17 late at night — which is the truthful number rather than a padded one.                                                                                                                                                                                                                       |
| **Storage keys carry no version suffix**                     | `pickboard.picks`, `pickboard.theme`, `pickboard.odds-format`. There is one shape of each and no migration path to keep alive; a `.v2` would only be a note about a schema nobody can still be holding.                                                                                                                                                                                                                                                                                             |
| **No visible "AWAY" / "HOME" captions, and no "VS" divider** | Away-on-top ordering already carries the pairing, and the crest and team name earn the room — which is what a row on a real book looks like. The side stays in the accessibility tree via `sr-only`, so nothing is lost for anyone who cannot see the layout. A deliberate deviation from the handoff.                                                                                                                                                                                              |
| **A three-way market gets its own Draw row**                 | Between the two clubs, 1-X-2 order. The Total column simply leaves that row empty rather than forcing a two-outcome market into three slots.                                                                                                                                                                                                                                                                                                                                                        |
| **The app does not explain itself in prose**                 | Three captions were cut — "Single-leg picks only…", "Later days load on demand…", "Most recent first · click a chart day to filter". Each described either an implementation detail or an affordance that should be visible instead. A product that narrates its own behaviour reads as a prototype.                                                                                                                                                                                                |
| **No date-range picker**                                     | The chart _is_ the date picker. A from–to range earns its place only once "All" spans months.                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Steiger not used**                                         | The official FSD linter was considered and declined; boundaries are enforced by ESLint alone, which keeps the gate to one command.                                                                                                                                                                                                                                                                                                                                                                  |

## Deploying the demo

`.github/workflows/deploy.yml` builds with `GITHUB_PAGES=true` — which switches Vite's `base` to
`/pick-board/` — and publishes `dist/` to GitHub Pages. `index.html` is copied to `404.html`
because Pages has no SPA rewrite, so without it a refresh on `/pick-board/my-picks` would 404
instead of reaching the router.

To enable it: **Settings → Pages → Build and deployment → Source: GitHub Actions**, then push to
`main`.
