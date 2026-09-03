import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { getSeedPicks, type Pick } from '@/entities/pick'
import { DAY } from '@/shared/lib/date'

import { DailyPerformanceChart } from './DailyPerformanceChart'

const NOW = new Date(2026, 8, 3, 12).getTime()
const seeded = getSeedPicks(NOW)

const renderChart = (props: Partial<Parameters<typeof DailyPerformanceChart>[0]> = {}) => {
  const user = userEvent.setup()
  render(
    <DailyPerformanceChart
      picks={seeded}
      period="7d"
      now={NOW}
      selectedDay={null}
      onSelectDay={vi.fn()}
      {...props}
    />,
  )
  return user
}

/** One transparent button per day sits over the bars. */
const columns = () => screen.getAllByRole('button')

describe('DailyPerformanceChart', () => {
  it('titles itself by the active period', () => {
    renderChart()
    expect(screen.getByRole('heading', { name: 'Last 7 days' })).toBeInTheDocument()

    render(
      <DailyPerformanceChart
        picks={seeded}
        period="all"
        now={NOW}
        selectedDay={null}
        onSelectDay={vi.fn()}
      />,
    )
    expect(screen.getByRole('heading', { name: 'All time · 7 days' })).toBeInTheDocument()
  })

  it('shows the period totals the design quotes', () => {
    renderChart()

    expect(screen.getByText('$250')).toBeInTheDocument()
    expect(screen.getByText('$304.25')).toBeInTheDocument()
    expect(screen.getByText('+$54.25')).toBeInTheDocument()
  })

  it('names every status in the legend, so colour is never the only cue', () => {
    renderChart()

    for (const label of ['Won', 'Lost', 'Pending']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('renders one column per day in the period', () => {
    renderChart()
    expect(columns()).toHaveLength(7)
  })

  it('carries the day figures as a text label, not just a hover title', () => {
    renderChart()

    // Index 5 is yesterday; the seeded picks run 1 to 6 days back, so today is empty.
    const label = columns()[5].getAttribute('aria-label') ?? ''
    expect(label).toMatch(/^Wed, Sep 2: /)
    expect(label).toContain('staked')
    expect(label).toContain('returned')
    expect(label).toContain('net')
    expect(label).toContain('click to filter the list')
  })

  it('says so when a day has no picks, and makes it unclickable', () => {
    renderChart({ picks: [] })

    expect(columns()[0]).toHaveAttribute('aria-label', expect.stringContaining('no picks'))
    expect(columns()[0]).toBeDisabled()
  })

  it('reports the day behind a clicked column', async () => {
    const onSelectDay = vi.fn()
    const user = renderChart({ onSelectDay })

    await user.click(columns()[5])

    expect(onSelectDay).toHaveBeenCalledOnce()
  })

  it('marks the selected column and says it is filtering', () => {
    const today = seeded[0].placedAt
    renderChart({ selectedDay: new Date(today).setHours(0, 0, 0, 0) })

    const selected = columns().find((column) => column.getAttribute('aria-pressed') === 'true')
    expect(selected?.getAttribute('aria-label')).toContain('filtering the list below')
  })

  it('shows a net figure and the amount staked per day', () => {
    renderChart()

    expect(screen.getAllByText(/ in$/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
  })

  it('marks a day with only pending picks as open', () => {
    const pending: Pick[] = [
      {
        id: 'open-1',
        event: 'Nuggets @ Celtics',
        market: 'Moneyline',
        selection: 'Celtics',
        odds: 2,
        stake: 10,
        status: 'Pending',
        placedAt: NOW,
      },
    ]
    renderChart({ picks: pending })

    expect(screen.getByText('open')).toBeInTheDocument()
  })

  it('thins the labels and drops the per-day figures over a long period', () => {
    renderChart({ period: '30d' })

    expect(columns()).toHaveLength(30)
    // Weekday names give way to day-of-month numbers, and "$45 in" disappears.
    expect(screen.queryAllByText(/ in$/)).toHaveLength(0)
    expect(screen.queryByText('Thu')).not.toBeInTheDocument()
  })

  it('widens the window for a pick older than the default period', () => {
    const old: Pick[] = [{ ...seeded[0], id: 'old', placedAt: NOW - 11 * DAY }]
    renderChart({ picks: old, period: 'all' })

    expect(columns()).toHaveLength(12)
  })
})
