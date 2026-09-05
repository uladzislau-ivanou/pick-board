import type { MarketType } from '@/shared/config/markets'

import type { Market, Outcome, SportEvent } from '../model/types'
import { team } from './team'

const DRAW = 'Draw'

export interface GridRow {
  key: string
  name: string
  abbr?: string
  color?: string
  color2?: string
  side?: 'away' | 'home'
}

const teamRow = (name: string, side: 'away' | 'home'): GridRow => {
  const { short, abbr, color, color2 } = team(name)
  return { key: side, name: short, abbr, color, color2, side }
}

const hasDraw = (event: SportEvent) =>
  event.markets.some((market) => market.outcomes.some((outcome) => outcome.label === DRAW))

export const gridRows = (event: SportEvent): GridRow[] => {
  const away = teamRow(event.away, 'away')
  const home = teamRow(event.home, 'home')
  return hasDraw(event) ? [away, { key: 'draw', name: DRAW }, home] : [away, home]
}

const byLabel = (market: Market, rows: readonly GridRow[]) => {
  const cells = new Map<string, Outcome>()
  for (const outcome of market.outcomes) {
    const row = rows.find(
      (candidate) =>
        outcome.label === candidate.name || outcome.label.startsWith(`${candidate.name} `),
    )
    if (row) cells.set(row.key, outcome)
  }
  return cells
}

const bySide = (market: Market, rows: readonly GridRow[]) => {
  const sides = rows.filter((row) => row.side !== undefined)
  if (market.outcomes.length !== sides.length) return new Map<string, Outcome>()

  return new Map(market.outcomes.map((outcome, index) => [sides[index].key, outcome] as const))
}

const marketCells = (market: Market, rows: readonly GridRow[]) =>
  market.type === 'Over/Under' ? bySide(market, rows) : byLabel(market, rows)

export interface MarketColumn {
  market: Market
  cells: Map<string, Outcome>
}

export const marketColumns = (event: SportEvent, rows: readonly GridRow[]) => {
  const columns = new Map<MarketType, MarketColumn>()
  for (const market of event.markets) {
    if (columns.has(market.type)) continue
    columns.set(market.type, { market, cells: marketCells(market, rows) })
  }
  return columns
}

export const outcomeLine = (market: Market, outcome: Outcome, rowName: string) => {
  if (market.type === 'Moneyline') return null
  if (market.type === 'Over/Under') {
    return outcome.label.replace(/^Over /, 'O ').replace(/^Under /, 'U ')
  }
  const stripped = outcome.label.startsWith(`${rowName} `)
    ? outcome.label.slice(rowName.length + 1)
    : outcome.label
  return stripped.replace(/^-/, '−')
}
