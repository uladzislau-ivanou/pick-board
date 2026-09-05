import { describe, expect, it } from 'vitest'

import { ROWS_PER_PAGE } from '@/shared/config/app'

import { initialPickQuery, pickQueryReducer, type PickQuery } from './pick-query'

const paged: PickQuery = { ...initialPickQuery, visibleRows: 18, dayFilter: 1_700_000_000_000 }

describe('pickQueryReducer', () => {
  it('starts on the All tab with one page of rows', () => {
    expect(initialPickQuery.tab).toBe('all')
    expect(initialPickQuery.visibleRows).toBe(ROWS_PER_PAGE)
  })

  it('resets the row window on every narrowing control', () => {
    const actions = [
      { type: 'selectTab', tab: 'settled' },
      { type: 'selectMarket', market: 'Spread' },
      { type: 'selectSort', sort: 'stake' },
      { type: 'clearDay' },
    ] as const

    for (const action of actions) {
      expect(pickQueryReducer(paged, action).visibleRows).toBe(ROWS_PER_PAGE)
    }
  })

  it('clears the day filter when the period changes, since the day may fall outside it', () => {
    const next = pickQueryReducer(paged, { type: 'selectPeriod', period: '30d' })

    expect(next.period).toBe('30d')
    expect(next.dayFilter).toBeNull()
    expect(next.visibleRows).toBe(ROWS_PER_PAGE)
  })

  it('toggles the same day off and a different day on', () => {
    const selected = pickQueryReducer(initialPickQuery, { type: 'toggleDay', day: 10 })
    expect(selected.dayFilter).toBe(10)

    expect(pickQueryReducer(selected, { type: 'toggleDay', day: 10 }).dayFilter).toBeNull()
    expect(pickQueryReducer(selected, { type: 'toggleDay', day: 20 }).dayFilter).toBe(20)
  })

  it('grows the window by a page and leaves the filters alone', () => {
    const next = pickQueryReducer(paged, { type: 'showMoreRows' })

    expect(next.visibleRows).toBe(18 + ROWS_PER_PAGE)
    expect(next.dayFilter).toBe(paged.dayFilter)
  })
})
