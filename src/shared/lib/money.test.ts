import { describe, expect, it } from 'vitest'

import { formatMoney, formatSigned } from './money'

describe('formatMoney', () => {
  it('drops trailing .00 so round amounts read as whole dollars', () => {
    expect(formatMoney(25)).toBe('$25')
    expect(formatMoney(250)).toBe('$250')
  })

  it('keeps cents when there are any', () => {
    expect(formatMoney(38.4)).toBe('$38.40')
    expect(formatMoney(304.25)).toBe('$304.25')
  })

  it('writes negatives with a typographic minus', () => {
    expect(formatMoney(-25)).toBe('−$25')
    expect(formatMoney(-3.75)).toBe('−$3.75')
  })

  it('formats zero', () => {
    expect(formatMoney(0)).toBe('$0')
  })
})

describe('formatSigned', () => {
  it('marks a gain with a plus', () => {
    expect(formatSigned(54.25)).toBe('+$54.25')
    expect(formatSigned(28.5)).toBe('+$28.50')
  })

  it('marks a loss with a minus', () => {
    expect(formatSigned(-15)).toBe('−$15')
  })

  it('leaves zero unsigned', () => {
    expect(formatSigned(0)).toBe('$0')
  })
})
