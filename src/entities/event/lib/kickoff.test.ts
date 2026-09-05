import { describe, expect, it } from 'vitest'

import { getEvents } from '../api/event-fixtures'
import { kickoffState, liveEvents, nextKickoff, openEvents } from './kickoff'

const NOW = new Date(2026, 8, 3, 12).getTime()
const MINUTE = 60_000
const HOUR = 60 * MINUTE
const events = getEvents(NOW)

describe('kickoffState', () => {
  it('is live from the moment the clock starts', () => {
    expect(kickoffState(NOW, NOW)).toEqual({ kind: 'live' })
    expect(kickoffState(NOW - MINUTE, NOW)).toEqual({ kind: 'live' })
  })

  it('stops calling a match live three hours after kickoff', () => {
    expect(kickoffState(NOW - 2.9 * HOUR, NOW)).toEqual({ kind: 'live' })
    expect(kickoffState(NOW - 3 * HOUR, NOW)).toEqual({ kind: 'ended' })
  })

  it('counts down inside the last hour', () => {
    expect(kickoffState(NOW + 25 * MINUTE, NOW)).toEqual({ kind: 'soon', minutes: 25 })
    expect(kickoffState(NOW + HOUR, NOW)).toEqual({ kind: 'soon', minutes: 60 })
  })

  it('never counts down to zero minutes, which would read as live', () => {
    expect(kickoffState(NOW + 20_000, NOW)).toEqual({ kind: 'soon', minutes: 1 })
  })

  it('shows a plain kickoff time beyond an hour out', () => {
    expect(kickoffState(NOW + 61 * MINUTE, NOW)).toEqual({ kind: 'scheduled' })
  })
})

describe('liveEvents', () => {
  it('is empty on a board where nothing has started', () => {
    expect(liveEvents(events, NOW)).toHaveLength(0)
  })

  it('counts only what is inside the live window, not everything in the past', () => {
    const earliest = Math.min(...events.map((event) => event.kickoffAt))

    expect(liveEvents(events, earliest + MINUTE)).toHaveLength(1)
    expect(
      liveEvents(events, earliest + 4 * HOUR).some((event) => event.kickoffAt === earliest),
    ).toBe(false)
  })
})

describe('openEvents', () => {
  it('keeps the whole board while nothing has finished', () => {
    expect(openEvents(events, NOW)).toHaveLength(events.length)
  })

  it('drops a match once it is over, so a finished game is never bettable', () => {
    const earliest = Math.min(...events.map((event) => event.kickoffAt))
    const open = openEvents(events, earliest + 4 * HOUR)

    expect(open).toHaveLength(events.length - 1)
    expect(open.some((event) => event.kickoffAt === earliest)).toBe(false)
  })

  it('still lists a match that is in play', () => {
    const earliest = Math.min(...events.map((event) => event.kickoffAt))

    expect(openEvents(events, earliest + MINUTE)).toHaveLength(events.length)
  })
})

describe('nextKickoff', () => {
  it('finds the earliest event still to come', () => {
    const next = nextKickoff(events, NOW)

    expect(next?.kickoffAt).toBe(Math.min(...events.map((event) => event.kickoffAt)))
  })

  it('skips an event that has already started', () => {
    const first = events[0]

    expect(nextKickoff(events, first.kickoffAt)?.id).not.toBe(first.id)
  })

  it('has nothing to report once the board is behind us', () => {
    const last = Math.max(...events.map((event) => event.kickoffAt))

    expect(nextKickoff(events, last)).toBeUndefined()
  })
})
