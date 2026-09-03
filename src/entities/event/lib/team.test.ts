import { describe, expect, it } from 'vitest'

import { matchupLabel } from './matchup-label'
import { team } from './team'

describe('team', () => {
  it('takes the short name from the last word', () => {
    expect(team('Boston Celtics').short).toBe('Celtics')
    expect(team('Toronto Maple Leafs').short).toBe('Leafs')
    expect(team('Liverpool').short).toBe('Liverpool')
  })

  it('reads the crest from the map', () => {
    expect(team('Boston Celtics')).toMatchObject({ abbr: 'BOS', color: '#007a33' })
  })

  it('falls back to three letters and ink for an unmapped team', () => {
    expect(team('Some New Club')).toMatchObject({
      short: 'Club',
      abbr: 'SOM',
      color: 'var(--color-text)',
    })
  })
})

describe('matchupLabel', () => {
  it('reads away at home, in short names', () => {
    expect(matchupLabel('Denver Nuggets', 'Boston Celtics')).toBe('Nuggets @ Celtics')
  })
})
