import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { getEvents } from '../api/event-fixtures'
import { EventCard } from './EventCard'

const NOW = new Date(2026, 8, 3, 12).getTime()
const celtics = getEvents(NOW)[0]

describe('EventCard', () => {
  it('shows the league, kickoff and market count', () => {
    render(<EventCard event={celtics} onSelectOutcome={vi.fn()} />)

    expect(screen.getByText('NBA · 7:30 PM ET')).toBeInTheDocument()
    expect(screen.getByText('3 markets')).toBeInTheDocument()
  })

  it('shows short names, monograms and which side is home', () => {
    render(<EventCard event={celtics} onSelectOutcome={vi.fn()} />)

    // Monograms are unique; the short names also appear as moneyline labels.
    expect(screen.getByText('DEN')).toBeInTheDocument()
    expect(screen.getByText('BOS')).toBeInTheDocument()
    expect(screen.getByText('away')).toBeInTheDocument()
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  it('renders one column per market, labelled by its display name', () => {
    render(<EventCard event={celtics} onSelectOutcome={vi.fn()} />)

    expect(screen.getByText('Spread')).toBeInTheDocument()
    expect(screen.getByText('Total points')).toBeInTheDocument()
  })

  it('renders every outcome as a button with odds to two decimals', () => {
    render(<EventCard event={celtics} onSelectOutcome={vi.fn()} />)

    expect(screen.getAllByRole('button')).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Celtics at 1.72' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nuggets +3.5 at 1.95' })).toBeInTheDocument()
  })

  it('reports the event, market and outcome behind a tapped price', async () => {
    const onSelectOutcome = vi.fn()
    render(<EventCard event={celtics} onSelectOutcome={onSelectOutcome} />)

    await userEvent.click(screen.getByRole('button', { name: 'Under 224.5 at 1.94' }))

    const [event, market, outcome] = onSelectOutcome.mock.calls[0]
    expect(event.id).toBe(celtics.id)
    expect(market.type).toBe('Over/Under')
    expect(outcome).toMatchObject({ label: 'Under 224.5', odds: 1.94 })
  })
})
