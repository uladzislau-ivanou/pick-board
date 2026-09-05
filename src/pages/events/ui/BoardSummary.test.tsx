import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getEvents } from '@/entities/event'
import type { Pick } from '@/entities/pick'

import { BoardSummary } from './BoardSummary'

const NOW = new Date(2026, 8, 3, 12).getTime()
const events = getEvents(NOW)

const open: Pick = {
  id: 'p1',
  event: 'Nuggets @ Celtics',
  market: 'Moneyline',
  selection: 'Celtics',
  odds: 1.72,
  stake: 25,
  status: 'Pending',
  placedAt: NOW,
}

const stat = (label: string) => within(screen.getByText(label).parentElement as HTMLElement)

describe('BoardSummary', () => {
  it('names the next match off and how long until it starts', () => {
    render(<BoardSummary events={events} picks={[]} now={NOW} />)

    expect(stat('Next off').getByText('Liverpool @ Arsenal')).toBeInTheDocument()
    expect(stat('Next off').getByText('EPL · Today · 3:00 PM ET')).toBeInTheDocument()
  })

  it('switches to minutes once the next match is inside the hour', () => {
    const kickoff = Math.min(...events.map((event) => event.kickoffAt))
    render(<BoardSummary events={events} picks={[]} now={kickoff - 18 * 60_000} />)

    expect(stat('Next off').getByText(/in 18m$/)).toBeInTheDocument()
  })

  it('counts what is in play', () => {
    const kickoff = Math.min(...events.map((event) => event.kickoffAt))
    render(<BoardSummary events={events} picks={[]} now={kickoff + 60_000} />)

    expect(stat('Live now').getByText('1')).toBeInTheDocument()
    expect(stat('Live now').getByText('1 event')).toBeInTheDocument()
  })

  it('says so plainly when nothing is in play and nothing is placed', () => {
    render(<BoardSummary events={events} picks={[]} now={NOW} />)

    expect(stat('Live now').getByText('Nothing in play')).toBeInTheDocument()
    expect(stat('Open picks').getByText('None placed yet')).toBeInTheDocument()
  })

  it('carries the open picks and what they have at risk across from My Picks', () => {
    render(<BoardSummary events={events} picks={[open]} now={NOW} />)

    expect(stat('Open picks').getByText('1')).toBeInTheDocument()
    expect(stat('Open picks').getByText('$25 at risk')).toBeInTheDocument()
  })

  it('has nothing to point at once every event is behind us', () => {
    const last = Math.max(...events.map((event) => event.kickoffAt))
    render(<BoardSummary events={events} picks={[]} now={last + 1} />)

    expect(stat('Next off').getByText('—')).toBeInTheDocument()
    expect(stat('Next off').getByText('Nothing scheduled')).toBeInTheDocument()
  })
})
