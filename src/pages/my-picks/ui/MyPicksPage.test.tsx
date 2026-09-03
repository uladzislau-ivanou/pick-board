import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { PicksProvider } from '@/entities/pick'
import { DAY, formatDayWithDate, startOfDay } from '@/shared/lib/date'

import { MyPicksPage } from './MyPicksPage'

/**
 * `PicksProvider` seeds from the real clock, so days are derived here rather
 * than pinned. Every assertion is about behaviour, not about a fixed date.
 */
const YESTERDAY = startOfDay(Date.now() - DAY)

const renderPage = () => {
  const user = userEvent.setup()
  render(
    <PicksProvider>
      <RouterProvider
        router={createMemoryRouter([{ path: '/', element: <MyPicksPage /> }], {
          initialEntries: ['/'],
        })}
      />
    </PicksProvider>,
  )
  return user
}

const chartDay = (day: number) =>
  screen.getByRole('button', { name: new RegExp(`^${formatDayWithDate(day)}:`) })

/** Only ledger rows carry `aria-expanded`. */
const rows = () => screen.getAllByRole('button').filter((el) => el.hasAttribute('aria-expanded'))

/** The three summary figures are label / value / sub-line inside one element. */
const total = (label: string) => within(screen.getByText(label).parentElement as HTMLElement)

describe('MyPicksPage summary', () => {
  beforeEach(() => window.localStorage.clear())

  it('reports the seeded picks all-time, and says so', () => {
    renderPage()

    expect(total('Total staked').getByText('$250')).toBeInTheDocument()
    expect(total('Total staked').getByText('10 picks all time')).toBeInTheDocument()

    expect(total('Pending payout').getByText('$0')).toBeInTheDocument()
    expect(total('Pending payout').getByText('0 open · $0 at risk')).toBeInTheDocument()

    expect(total('Win rate').getByText('60%')).toBeInTheDocument()
    expect(total('Win rate').getByText('6 of 10 resolved')).toBeInTheDocument()
  })

  it('leaves the totals all-time when the period control moves', async () => {
    const user = renderPage()
    expect(screen.getByText('Account · Last 7 days')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '30 days' }))

    // The kicker and the chart heading name the same period from one source.
    expect(screen.getByRole('heading', { name: 'Last 30 days' })).toBeInTheDocument()
    expect(screen.getByText('Account · Last 30 days')).toBeInTheDocument()
    expect(total('Total staked').getByText('$250')).toBeInTheDocument()
    expect(total('Total staked').getByText('10 picks all time')).toBeInTheDocument()
  })
})

describe('MyPicksPage chart drill-down', () => {
  beforeEach(() => window.localStorage.clear())

  it('filters the ledger from one chart column and back again', async () => {
    const user = renderPage()
    expect(rows()).toHaveLength(6)

    await user.click(chartDay(YESTERDAY))
    expect(rows()).toHaveLength(2)

    const chip = screen.getByRole('button', {
      name: `Clear the ${formatDayWithDate(YESTERDAY)} day filter`,
    })
    await user.click(chip)

    expect(rows()).toHaveLength(6)
    expect(chip).not.toBeInTheDocument()
  })

  it('marks the selected column and clears it on a second click', async () => {
    const user = renderPage()

    await user.click(chartDay(YESTERDAY))
    expect(chartDay(YESTERDAY)).toHaveAttribute('aria-pressed', 'true')

    await user.click(chartDay(YESTERDAY))
    expect(chartDay(YESTERDAY)).toHaveAttribute('aria-pressed', 'false')
    expect(rows()).toHaveLength(6)
  })
})
