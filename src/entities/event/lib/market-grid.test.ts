import { describe, expect, it } from 'vitest'

import { getEvents } from '../api/event-fixtures'
import type { SportEvent } from '../model/types'
import { gridRows, marketColumns, outcomeLine } from './market-grid'

const NOW = new Date(2026, 8, 3, 12).getTime()
const events = getEvents(NOW)
const basketball = events[0]
const soccer = events.find((event) => event.sport === 'soccer') as SportEvent

const market = (event: SportEvent, type: string) =>
  event.markets.find((candidate) => candidate.type === type)!

describe('team short names', () => {
  it('uses the name the market labels use, not the last word of the club', () => {
    const spurs = events.find((event) => event.away === 'Tottenham Hotspur') as SportEvent
    const [away, , home] = gridRows(spurs)

    expect(away.name).toBe('Tottenham')
    expect(home.name).toBe('Newcastle')
  })
})

describe('gridRows', () => {
  it('gives a two-way event one row per team, away on top', () => {
    expect(gridRows(basketball).map((row) => row.name)).toEqual(['Nuggets', 'Celtics'])
  })

  it('slots the draw between the two teams for a three-way market', () => {
    expect(gridRows(soccer).map((row) => row.name)).toEqual(['Liverpool', 'Draw', 'Arsenal'])
  })

  it('resolves club colour from the full club name, not the short one', () => {
    for (const row of gridRows(basketball)) {
      expect(row.color).toMatch(/^#/)
      expect(row.color2).toMatch(/^#/)
    }
  })

  it('carries the monogram for a team row and nothing for the draw', () => {
    const [away, draw] = gridRows(soccer)

    expect(away.abbr).toBe('LIV')
    expect(draw.abbr).toBeUndefined()
    expect(draw.color).toBeUndefined()
  })
})

describe('marketCells', () => {
  it('lands each moneyline price on the row it belongs to', () => {
    const rows = gridRows(basketball)
    const cells = marketColumns(basketball, rows).get('Moneyline')!.cells

    expect(cells.get('away')?.label).toBe('Nuggets')
    expect(cells.get('home')?.label).toBe('Celtics')
  })

  it('matches a spread by the team name that prefixes it', () => {
    const rows = gridRows(basketball)
    const cells = marketColumns(basketball, rows).get('Spread')!.cells

    expect(cells.get('away')?.label).toBe('Nuggets +3.5')
    expect(cells.get('home')?.label).toBe('Celtics -3.5')
  })

  it('puts Over on the first team row and Under on the second, as a board does', () => {
    const rows = gridRows(basketball)
    const cells = marketColumns(basketball, rows).get('Over/Under')!.cells

    expect(cells.get('away')?.label).toBe('Over 224.5')
    expect(cells.get('home')?.label).toBe('Under 224.5')
    expect(cells.has('draw')).toBe(false)
  })

  it('leaves the draw row empty for a two-outcome total', () => {
    const rows = gridRows(soccer)
    const cells = marketColumns(soccer, rows).get('Over/Under')!.cells

    expect(cells.get('away')?.label).toBe('Over 2.5')
    expect(cells.get('home')?.label).toBe('Under 2.5')
    expect(cells.get('draw')).toBeUndefined()
  })

  it('leaves a cell empty rather than guess when a label matches no row', () => {
    const rows = gridRows(basketball)
    const cells = marketColumns(
      {
        ...basketball,
        markets: [
          {
            id: 'x',
            type: 'Moneyline',
            name: 'Moneyline',
            outcomes: [
              { id: 'x1', label: 'Home', odds: 1.5 },
              { id: 'x2', label: 'Away', odds: 2.5 },
            ],
          },
        ],
      },
      rows,
    ).get('Moneyline')!.cells

    expect(cells.size).toBe(0)
  })

  it('places every outcome of every fixture on exactly one row', () => {
    const misplaced: string[] = []

    for (const event of events) {
      const rows = gridRows(event)
      for (const [type, column] of marketColumns(event, rows)) {
        const placed = [...column.cells.values()]
        for (const outcome of column.market.outcomes) {
          if (!placed.some((candidate) => candidate.id === outcome.id)) {
            misplaced.push(`${event.away} @ ${event.home} [${type}] dropped "${outcome.label}"`)
          }
        }
      }
    }

    expect(misplaced).toEqual([])
  })
})

describe('outcomeLine', () => {
  it('has no line for a moneyline, because the price is the whole cell', () => {
    const moneyline = market(basketball, 'Moneyline')

    expect(outcomeLine(moneyline, moneyline.outcomes[0], 'Nuggets')).toBeNull()
  })

  it('strips the team off a spread and uses a real minus sign', () => {
    const spread = market(basketball, 'Spread')
    const rows = gridRows(basketball)
    const cells = marketColumns(basketball, rows).get('Spread')!.cells

    expect(outcomeLine(spread, cells.get('away')!, 'Nuggets')).toBe('+3.5')
    expect(outcomeLine(spread, cells.get('home')!, 'Celtics')).toBe('−3.5')
  })

  it('shortens Over and Under to the board abbreviations', () => {
    const total = market(basketball, 'Over/Under')
    const [over, under] = total.outcomes

    expect(outcomeLine(total, over, 'Nuggets')).toBe('O 224.5')
    expect(outcomeLine(total, under, 'Celtics')).toBe('U 224.5')
  })
})
