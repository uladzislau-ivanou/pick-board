import { describe, expect, it } from 'vitest'

import { formatOdds } from './format-odds'

describe('formatOdds', () => {
  it('always shows two decimal places', () => {
    expect(formatOdds(1.9)).toBe('1.90')
    expect(formatOdds(2)).toBe('2.00')
  })

  it('leaves two-place odds untouched', () => {
    expect(formatOdds(1.72)).toBe('1.72')
  })
})
