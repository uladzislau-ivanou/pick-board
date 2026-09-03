import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { getSeedPicks, type Pick } from '@/entities/pick'
import { usePickQuery } from '@/features/filter-picks'
import { DAY, startOfDay } from '@/shared/lib/date'

import { PickLedger } from './PickLedger'

const NOW = new Date(2026, 8, 3, 12).getTime()
const seed = getSeedPicks(NOW)

const pending: Pick = {
  id: 'p1',
  event: 'Nuggets vs Celtics',
  market: 'Moneyline',
  selection: 'Celtics',
  odds: 1.72,
  stake: 25,
  status: 'Pending',
  placedAt: NOW - 2 * 60 * 60 * 1000,
}

const SELECT_DAY = startOfDay(NOW - DAY)

const Harness = ({ picks }: { picks: readonly Pick[] }) => {
  const [query, dispatch] = usePickQuery()
  return (
    <>
      <button type="button" onClick={() => dispatch({ type: 'toggleDay', day: SELECT_DAY })}>
        Select day
      </button>
      <PickLedger
        picks={picks}
        query={query}
        dispatch={dispatch}
        now={NOW}
        onBrowseEvents={vi.fn()}
      />
    </>
  )
}

const renderLedger = (picks: readonly Pick[] = seed) => {
  const user = userEvent.setup()
  render(<Harness picks={picks} />)
  return user
}

const rows = () => screen.getAllByRole('button').filter((el) => el.hasAttribute('aria-expanded'))

const row = (name: RegExp) => screen.getByRole('button', { name })

describe('PickLedger tabs', () => {
  it('opens on Settled when nothing is pending, with both counts', () => {
    renderLedger()

    expect(screen.getByRole('button', { name: '10 settled picks in this period' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: '0 pending picks in this period' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('opens on Pending as soon as a pick is open', () => {
    renderLedger([pending, ...seed])

    expect(screen.getByRole('button', { name: '1 pending pick in this period' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(rows()).toHaveLength(1)
  })

  it('shows the pending empty copy when the tab is switched to an empty one', async () => {
    const user = renderLedger()

    await user.click(screen.getByRole('button', { name: /pending picks in this period/ }))

    expect(screen.getByRole('heading', { name: 'Nothing open right now.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Browse events' })).toBeInTheDocument()
  })
})

describe('PickLedger paging', () => {
  it('shows one page with the remaining count', () => {
    renderLedger()

    expect(rows()).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Load 4 more' })).toBeInTheDocument()
    expect(screen.getByText('6 of 10 shown')).toBeInTheDocument()
  })

  it('loads the rest and drops the footer', async () => {
    const user = renderLedger()

    await user.click(screen.getByRole('button', { name: 'Load 4 more' }))

    expect(rows()).toHaveLength(10)
    expect(screen.queryByRole('button', { name: /Load \d+ more/ })).not.toBeInTheDocument()
  })

  it('resets the window when a filter changes', async () => {
    const user = renderLedger()

    await user.click(screen.getByRole('button', { name: 'Load 4 more' }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort' }), 'stake')

    expect(rows()).toHaveLength(6)
    expect(screen.getByText('6 of 10 shown')).toBeInTheDocument()
  })
})

describe('PickLedger row disclosure', () => {
  it('opens several rows at once and keeps them open across paging', async () => {
    const user = renderLedger()

    await user.click(row(/^Under 9\.5, Over\/Under/))
    await user.click(row(/^Lakers, Moneyline/))

    expect(screen.getByText('1.90 decimal')).toBeInTheDocument()
    expect(screen.getByText('2.05 decimal')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Load 4 more' }))

    expect(row(/^Under 9\.5, Over\/Under/)).toHaveAttribute('aria-expanded', 'true')
    expect(row(/^Lakers, Moneyline/)).toHaveAttribute('aria-expanded', 'true')
  })

  it('names the row with its figures and points at the panel it controls', async () => {
    const user = renderLedger()
    const target = row(/^Lakers, Moneyline/)

    expect(target).toHaveAccessibleName(
      'Lakers, Moneyline, Lakers vs Suns. odds 2.05. stake $25. returned $51.25. Won',
    )
    expect(target).toHaveAttribute('aria-controls', 'pick-detail-h10')

    await user.click(target)
    expect(screen.getByText('$25 × 2.05 = $51.25')).toBeInTheDocument()
    expect(
      screen.getByText(/Counted as a win in your strike rate/, { selector: 'p' }),
    ).toBeInTheDocument()
  })

  it('shows a lost pick as a negative return', () => {
    renderLedger()

    expect(row(/^Under 9\.5, Over\/Under/)).toHaveAccessibleName(/lost −\$30\. Lost$/)
  })
})

describe('PickLedger filters', () => {
  it('narrows to one market and re-counts the note', async () => {
    const user = renderLedger()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Market' }), 'Spread')

    expect(rows()).toHaveLength(2)
    expect(screen.queryByRole('button', { name: /Load \d+ more/ })).not.toBeInTheDocument()
  })

  it('re-sorts the whole set before paging it', async () => {
    const user = renderLedger()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort' }), 'stake')

    expect(screen.getByText('Sorted by stake, largest first')).toBeInTheDocument()
    expect(rows()[0]).toHaveAccessibleName(/^Bucks, Moneyline/)
  })

  it('drops the day filter when the period changes', async () => {
    const user = renderLedger()

    await user.click(screen.getByRole('button', { name: 'Select day' }))
    expect(rows()).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: '30 days' }))
    expect(screen.queryByRole('button', { name: /day filter/ })).not.toBeInTheDocument()
    expect(rows()).toHaveLength(6)
  })

  it('offers a chip that clears the selected day', async () => {
    const user = renderLedger()

    await user.click(screen.getByRole('button', { name: 'Select day' }))
    await user.click(screen.getByRole('button', { name: 'Clear the Wed, Sep 2 day filter' }))

    expect(rows()).toHaveLength(6)
  })

  it('explains an empty day rather than looking broken', async () => {
    const user = renderLedger()

    await user.click(screen.getByRole('button', { name: /pending picks in this period/ }))
    await user.click(screen.getByRole('button', { name: 'Select day' }))

    expect(
      screen.getByRole('heading', { name: 'No pending picks on Wed, Sep 2.' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Clear the day filter above/)).toBeInTheDocument()
  })
})
