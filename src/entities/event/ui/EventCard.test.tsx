import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { getEvents } from '../api/event-fixtures'
import { EventCard } from './EventCard'

const NOW = new Date(2026, 8, 3, 12).getTime()
const celtics = getEvents(NOW)[0]

/** Every case renders the same card; only the assertions differ. */
const renderCard = (onSelectOutcome = vi.fn()) => {
  render(<EventCard event={celtics} onSelectOutcome={onSelectOutcome} />)
  return onSelectOutcome
}

describe('EventCard', () => {
  /**
   * Six checks that differ only in the string they look for, so they are one
   * case over a table rather than six near-identical bodies. Monograms stand in
   * for the teams because they are unique — the short names appear again as
   * moneyline labels.
   */
  it.each([
    ['the league and kickoff', 'NBA · 7:30 PM ET'],
    ['the market count', '3 markets'],
    ['the away monogram', 'DEN'],
    ['the home monogram', 'BOS'],
    ['a market by its display name', 'Spread'],
    ['an Over/Under market by its display name', 'Total points'],
  ])('renders %s', (_case, text) => {
    renderCard()

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  /** Away-first ordering carries the side visually; screen readers still need it stated. */
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

  it('reports the event, market and outcome behind a tapped price', async () => {
    const onSelectOutcome = renderCard()

    await userEvent.click(screen.getByRole('button', { name: 'Under 224.5 at 1.94' }))

    const [event, market, outcome] = onSelectOutcome.mock.calls[0]
    expect(event.id).toBe(celtics.id)
    expect(market.type).toBe('Over/Under')
    expect(outcome).toMatchObject({ label: 'Under 224.5', odds: 1.94 })
  })
})
