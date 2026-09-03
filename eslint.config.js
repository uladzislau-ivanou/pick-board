import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import boundaries from 'eslint-plugin-boundaries'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * Feature-Sliced Design layers, lowest first. A layer may import any layer
 * BELOW it — never a sibling slice in the same layer, never upward.
 *
 * Each slice is one `boundaries` element, so imports *within* a slice are
 * "internal" dependencies and are not checked at all (`checkInternals` stays
 * off). That is deliberate: relative imports inside a slice are unrestricted.
 */
const LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'app']

/** Layers divided into slices (and which therefore capture a `slice`). */
const SLICED = ['entities', 'features', 'widgets', 'pages']

/** Public API of a sliced layer: the slice root barrel, and nothing else. */
const SLICE_ENTRY_POINT = 'index.ts'

/**
 * `shared` has no slices, so its public API is per unit:
 * `shared/ui/Button/index.ts`, `shared/lib/money/index.ts`,
 * `shared/config/routes.ts`. There is deliberately no `shared/ui/index.ts` —
 * one barrel over every primitive would defeat tree-shaking.
 */
const SHARED_ENTRY_POINTS = ['*/index.ts', '*.ts', '*.tsx', '*.css']

const lowerSlicedLayers = (layer) =>
  LAYERS.slice(0, LAYERS.indexOf(layer)).filter((other) => other !== 'shared')

/**
 * Layer-descent policies, generated from LAYERS so the rule cannot drift from
 * the documented architecture. Two per layer: the lower sliced layers through
 * their slice barrel, and `shared` through its per-unit entry points.
 */
const layerPolicies = LAYERS.flatMap((layer) => {
  const policies = []
  const lower = lowerSlicedLayers(layer)

  if (lower.length > 0) {
    policies.push({
      from: { element: { type: layer } },
      allow: {
        to: { element: { types: { anyOf: lower }, fileInternalPath: SLICE_ENTRY_POINT } },
      },
    })
  }

  // Every layer reaches `shared` through its per-unit entry points — including
  // `shared` itself, so `shared/ui/Button` may import `shared/lib/cn`.
  policies.push({
    from: { element: { type: layer } },
    allow: { to: { element: { type: 'shared', fileInternalPath: SHARED_ENTRY_POINTS } } },
  })

  return policies
})

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'design_handoff_pickboard']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // ── Feature-Sliced Design boundaries ─────────────────────────────────────
  // These rules are why the architecture is provable rather than merely
  // documented: an illegal import fails `npm run lint`.
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      // No `boundaries/include`: scoping analysis to src/** would classify every
      // node_modules dependency as *ignored*, and ignored dependencies are
      // skipped — which would silently disable the package policies below. The
      // element patterns already scope classification to src/**.
      'boundaries/elements': [
        // `app` is a single element: the composition root, imported by nobody.
        { type: 'app', pattern: 'src/app' },
        ...SLICED.map((layer) => ({
          type: layer,
          pattern: `src/${layer}/*`,
          capture: ['slice'],
        })),
        // One element per shared segment (config, lib, ui, styles).
        { type: 'shared', pattern: 'src/shared/*', capture: ['segment'] },
      ],
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.app.json' },
      },
    },
    rules: {
      // Every file must belong to a layer.
      'boundaries/no-unknown-files': 'error',

      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          // Check third-party imports too (off by default), so the package
          // policies below actually bite; and check imports that resolve inside
          // src but land outside every element.
          checkAllOrigins: true,
          checkUnknownLocals: true,
          // Policies are evaluated in order and the LAST match decides, so the
          // broad allows come first and the narrow exceptions last.
          policies: [
            // Any package, and any layer-legal local import.
            { allow: { to: { module: { origin: 'external' } } } },
            { allow: { to: { module: { origin: 'core' } } } },
            ...layerPolicies,

            // ── Package exceptions (last wins) ─────────────────────────────
            // Recharts is an implementation detail of one feature. Confining it
            // there is what keeps swapping the chart renderer a one-file change.
            {
              disallow: { to: { module: { origin: 'external', source: 'recharts' } } },
              message:
                'recharts belongs to features/daily-performance only — keep chart geometry out of other slices.',
            },
            {
              from: { element: { type: 'features', captured: { slice: 'daily-performance' } } },
              allow: { to: { module: { origin: 'external', source: 'recharts' } } },
            },

            // Routing is a concern of app/pages/widgets. An entity or a shared
            // primitive that knows about the router is not reusable.
            {
              from: { element: { types: { anyOf: ['entities', 'shared'] } } },
              disallow: {
                to: { module: { origin: 'external', source: ['react-router', 'react-router/*'] } },
              },
              message:
                'entities and shared must not depend on the router — take a path or a callback as a prop instead.',
            },
          ],
        },
      ],
    },
  },

  // Nothing may import the composition root. `boundaries` cannot express this
  // (there is no layer above `app` to write a policy from), so it is a path rule.
  {
    files: ['src/{pages,widgets,features,entities,shared}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app', '@/app/**', '**/app/**'],
              message:
                'app is the top layer — nothing may import it. Move the shared value down to shared/config.',
            },
          ],
        },
      ],
    },
  },

  // Vitest globals. A test may reach into the internals of the slice it covers,
  // so the boundary rules do not apply to it.
  {
    files: ['**/*.test.{ts,tsx}', 'vitest.setup.ts'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { 'boundaries/dependencies': 'off' },
  },
])
