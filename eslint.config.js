import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import boundaries from 'eslint-plugin-boundaries'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'app']

const SLICED = ['entities', 'features', 'widgets', 'pages']

const SLICE_ENTRY_POINT = 'index.ts'

const SHARED_ENTRY_POINTS = ['*/index.ts', '*.ts', '*.tsx', '*.css']

const lowerSlicedLayers = (layer) =>
  LAYERS.slice(0, LAYERS.indexOf(layer)).filter((other) => other !== 'shared')

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

  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        ...SLICED.map((layer) => ({
          type: layer,
          pattern: `src/${layer}/*`,
          capture: ['slice'],
        })),
        { type: 'shared', pattern: 'src/shared/*', capture: ['segment'] },
      ],
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.app.json' },
      },
    },
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'boundaries/no-unknown-files': 'error',

      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          checkAllOrigins: true,
          checkUnknownLocals: true,
          policies: [
            { allow: { to: { module: { origin: 'external' } } } },
            { allow: { to: { module: { origin: 'core' } } } },
            ...layerPolicies,

            {
              disallow: { to: { module: { origin: 'external', source: 'recharts' } } },
              message:
                'recharts belongs to features/daily-performance only — keep chart geometry out of other slices.',
            },
            {
              from: { element: { type: 'features', captured: { slice: 'daily-performance' } } },
              allow: { to: { module: { origin: 'external', source: 'recharts' } } },
            },

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

  {
    files: ['**/*.test.{ts,tsx}', 'vitest.setup.ts'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { 'boundaries/dependencies': 'off' },
  },
])
