import { describe, expect, it } from 'vitest'

import { getEvents } from '../api/event-fixtures'
import { matchupLabel } from './matchup-label'
import { team } from './team'

describe('team', () => {
  it('takes the short name from the last word', () => {
    expect(team('Boston Celtics').short).toBe('Celtics')
    expect(team('Toronto Maple Leafs').short).toBe('Leafs')
    expect(team('Liverpool').short).toBe('Liverpool')
  })

  it('prefers the crest short name where the last word is not the common one', () => {
    expect(team('Newcastle United').short).toBe('Newcastle')
    expect(team('Tottenham Hotspur').short).toBe('Tottenham')
  })

  it('has a real crest for every club the board can show', () => {
    const clubs = new Set(getEvents(Date.now()).flatMap((event) => [event.home, event.away]))
    const unmapped = [...clubs].filter((club) => team(club).color === 'var(--color-text)')

    expect(unmapped).toEqual([])
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
