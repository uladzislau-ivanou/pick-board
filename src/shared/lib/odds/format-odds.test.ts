import { describe, expect, it } from 'vitest'

import { formatOdds } from './format-odds'

describe('formatOdds decimal', () => {
  it('always shows two decimal places', () => {
    expect(formatOdds(1.9)).toBe('1.90')
    expect(formatOdds(2)).toBe('2.00')
  })

  it('leaves two-place odds untouched', () => {
    expect(formatOdds(1.72)).toBe('1.72')
  })
})

describe('formatOdds american', () => {
  it('reads an underdog as the profit on a $100 stake', () => {
    expect(formatOdds(2.2, 'american')).toBe('+120')
    expect(formatOdds(3.45, 'american')).toBe('+245')
  })

  it('reads a favourite as the stake needed to win $100', () => {
    expect(formatOdds(1.91, 'american')).toBe('−110')
    expect(formatOdds(1.72, 'american')).toBe('−139')
  })

  it('treats an even-money price as the first underdog price', () => {
    expect(formatOdds(2, 'american')).toBe('+100')
  })

  it('falls back to decimal for a price that cannot pay out', () => {
    expect(formatOdds(1, 'american')).toBe('1.00')
  })
})
