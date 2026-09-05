import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { getEvents } from '../api/event-fixtures'
import { EventCard } from './EventCard'

const NOW = new Date(2026, 8, 3, 12).getTime()
const events = getEvents(NOW)
const celtics = events[0]
const soccer = events.find((event) => event.sport === 'soccer')!

const renderCard = (onSelectOutcome = vi.fn(), event = celtics, now = NOW) => {
  render(<EventCard event={event} now={now} onSelectOutcome={onSelectOutcome} />)
  return onSelectOutcome
}

describe('EventCard', () => {
  it.each([
    ['the league', 'NBA'],
    ['the kickoff time', '7:30 PM ET'],
    ['the away monogram', 'DEN'],
    ['the home monogram', 'BOS'],
  ])('renders %s', (_case, text) => {
    renderCard()

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('names each team once, as a row, rather than in every price', () => {
    renderCard()

    expect(screen.getAllByText('Celtics')).toHaveLength(1)
    expect(screen.getAllByText('Nuggets')).toHaveLength(1)
  })

  it('announces which side is home without printing it', () => {
    renderCard()

    expect(screen.getByText('away team')).toHaveClass('sr-only')
    expect(screen.getByText('home team')).toHaveClass('sr-only')
  })

  it('renders every outcome as a button with odds to two decimals', () => {
    renderCard()

    expect(screen.getAllByRole('button')).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Celtics at 1.72' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nuggets +3.5 at 1.95' })).toBeInTheDocument()
  })

  it('shows the handicap and the total as the line, with the price under it', () => {
    renderCard()

    expect(screen.getByRole('button', { name: 'Celtics -3.5 at 1.91' })).toHaveTextContent(
      '−3.51.91',
    )
    expect(screen.getByRole('button', { name: 'Over 224.5 at 1.88' })).toHaveTextContent(
      'O 224.51.88',
    )
  })

  it('gives a three-way market its own draw row', () => {
    renderCard(vi.fn(), soccer)

    expect(screen.getByText('Draw')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Draw at 3.45' })).toBeInTheDocument()
  })

  it('marks an event that has already kicked off as live', () => {
    renderCard(vi.fn(), celtics, celtics.kickoffAt + 60_000)

    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.queryByText('7:30 PM ET')).not.toBeInTheDocument()
  })

  it('shows the kickoff time until the hour before, then counts down', () => {
    renderCard(vi.fn(), celtics, celtics.kickoffAt - 3 * 60 * 60_000)

    expect(screen.getByText('7:30 PM ET')).toBeInTheDocument()
  })

  it('counts down inside the last hour before kickoff', () => {
    renderCard(vi.fn(), celtics, celtics.kickoffAt - 12 * 60_000)

    expect(screen.getByText('Starts in 12m')).toBeInTheDocument()
  })

  it('reports the event, market and outcome behind a tapped price', async () => {
    const onSelectOutcome = renderCard()

    await userEvent.click(screen.getByRole('button', { name: 'Under 224.5 at 1.94' }))

    const [event, market, outcome] = onSelectOutcome.mock.calls[0]
    expect(event.id).toBe(celtics.id)
    expect(market.type).toBe('Over/Under')
    expect(outcome).toMatchObject({ label: 'Under 224.5', odds: 1.94 })
  })
})
