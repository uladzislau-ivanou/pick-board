import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { getEvents } from '@/entities/event'

import { EventBoard } from './EventBoard'

const NOW = new Date(2026, 8, 3, 12).getTime()
const events = getEvents(NOW)

const renderBoard = () => {
  const user = userEvent.setup()
  render(<EventBoard events={events} now={NOW} onSelectOutcome={vi.fn()} />)
  return user
}

const dayHeader = (label: string) =>
  screen.getByRole('button', { name: new RegExp(`^${label}`, 'i') })

const visibleCards = () => screen.queryAllByRole('article')

describe('EventBoard day window', () => {
  it('mounts only the first three day groups', () => {
    renderBoard()

    expect(dayHeader('Today')).toBeInTheDocument()
    expect(dayHeader('Tomorrow')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Sunday/i })).not.toBeInTheDocument()
  })

  it('reveals three more days per click, then drops the button', async () => {
    const user = renderBoard()

    await user.click(screen.getByRole('button', { name: 'Show 4 more days' }))
    expect(screen.getByRole('button', { name: /^Sunday/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show 1 more day' }))
    expect(screen.queryByRole('button', { name: /more day/i })).not.toBeInTheDocument()
  })
})

describe('EventBoard day groups', () => {
  it('opens today and tomorrow, and leaves later days collapsed', () => {
    renderBoard()

    expect(dayHeader('Today')).toHaveAttribute('aria-expanded', 'true')
    expect(dayHeader('Tomorrow')).toHaveAttribute('aria-expanded', 'true')
    expect(dayHeader('Saturday')).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders no cards for a collapsed group', () => {
    renderBoard()

    expect(visibleCards()).toHaveLength(10)
  })

  it('toggles a group, and the override sticks', async () => {
    const user = renderBoard()

    await user.click(dayHeader('Saturday'))
    expect(dayHeader('Saturday')).toHaveAttribute('aria-expanded', 'true')
    expect(visibleCards()).toHaveLength(12)

    await user.click(dayHeader('Today'))
    expect(dayHeader('Today')).toHaveAttribute('aria-expanded', 'false')
    expect(visibleCards()).toHaveLength(7)
  })
})

describe('EventBoard sport filter', () => {
  it('offers a chip per sport present, with counts', () => {
    renderBoard()

    expect(screen.getByRole('button', { name: 'All, 20 events' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Basketball, 5 events' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hockey, 4 events' })).toBeInTheDocument()
  })

  it('narrows the board and marks the chip', async () => {
    const user = renderBoard()

    await user.click(screen.getByRole('button', { name: 'Basketball, 5 events' }))

    expect(screen.getByRole('button', { name: 'Basketball, 5 events' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(visibleCards()).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Show 2 more days' })).toBeInTheDocument()
  })

  it('opens every matching group so the user never narrows twice', async () => {
    const user = renderBoard()

    await user.click(screen.getByRole('button', { name: 'Basketball, 5 events' }))

    expect(dayHeader('Saturday')).toHaveAttribute('aria-expanded', 'true')
  })

  it('resets the day window when the sport changes', async () => {
    const user = renderBoard()
    await user.click(screen.getByRole('button', { name: 'Show 4 more days' }))

    await user.click(screen.getByRole('button', { name: 'Basketball, 5 events' }))

    expect(screen.getByRole('button', { name: /more day/i })).toBeInTheDocument()
  })

  it('clears a manual toggle when the sport changes', async () => {
    const user = renderBoard()
    await user.click(dayHeader('Today'))
    expect(dayHeader('Today')).toHaveAttribute('aria-expanded', 'false')

    await user.click(screen.getByRole('button', { name: 'Basketball, 5 events' }))

    expect(dayHeader('Today')).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('EventBoard empty state', () => {
  it('explains an empty filter and offers a way out', async () => {
    const user = userEvent.setup()
    const soccerOnly = events.filter((event) => event.sport === 'soccer')
    render(<EventBoard events={soccerOnly} now={NOW} onSelectOutcome={vi.fn()} />)

    expect(screen.queryByRole('button', { name: /basketball/i })).not.toBeInTheDocument()

    render(<EventBoard events={[]} now={NOW} onSelectOutcome={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'No events scheduled.' })).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'All sports' })[0])
  })
})

describe('EventBoard prices', () => {
  it('reports the tapped price up to the page', async () => {
    const onSelectOutcome = vi.fn()
    const user = userEvent.setup()
    render(<EventBoard events={events} now={NOW} onSelectOutcome={onSelectOutcome} />)

    await user.click(screen.getByRole('button', { name: 'Celtics at 1.72' }))

    expect(onSelectOutcome).toHaveBeenCalledOnce()
  })
})
