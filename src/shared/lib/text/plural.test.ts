import { describe, expect, it } from 'vitest'

import { plural } from './plural'

describe('plural', () => {
  it('keeps the singular for exactly one', () => {
    expect(plural(1, 'pick')).toBe('1 pick')
  })

  it('adds an s otherwise', () => {
    expect(plural(0, 'pick')).toBe('0 picks')
    expect(plural(20, 'event')).toBe('20 events')
  })
})
