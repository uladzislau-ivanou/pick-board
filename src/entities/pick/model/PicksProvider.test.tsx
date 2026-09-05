import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { DAY } from '@/shared/lib/date'

import { PicksProvider } from './PicksProvider'
import { usePicks } from './picks-context'

const Readout = () => {
  const { picks, addPick } = usePicks()
  return (
    <>
      <p data-testid="count">{picks.length}</p>
      <p data-testid="seed-oldest">
        {Math.min(...picks.filter((pick) => pick.id.startsWith('h')).map((p) => p.placedAt))}
      </p>
      <p data-testid="newest">{`${picks[0]?.selection} ${picks[0]?.status}`}</p>
      <button
        type="button"
        onClick={() =>
          addPick({
            event: 'Nuggets @ Celtics',
            market: 'Spread',
            selection: 'Celtics -3.5',
            odds: 1.91,
            stake: 10,
          })
        }
      >
        Place pick
      </button>
    </>
  )
}

const SEED_SHAPE = {
  id: 'stale',
  event: 'Old vs Older',
  market: 'Moneyline',
  selection: 'Old',
  odds: 2,
  stake: 10,
  status: 'Won',
} as const

const renderProvider = () =>
  render(
    <PicksProvider>
      <Readout />
    </PicksProvider>,
  )

describe('PicksProvider', () => {
  beforeEach(() => window.localStorage.clear())

  it('starts from the seeded history', () => {
    renderProvider()
    expect(screen.getByTestId('count')).toHaveTextContent('10')
  })

  it('prepends a placed pick as Pending', () => {
    renderProvider()

    act(() => screen.getByRole('button').click())

    expect(screen.getByTestId('count')).toHaveTextContent('11')
    expect(screen.getByTestId('newest')).toHaveTextContent('Celtics -3.5 Pending')
  })

  it('re-anchors the seeded history to today, however old the stored picks are', () => {
    const stale = { ...SEED_SHAPE, placedAt: Date.now() - 400 * DAY }
    window.localStorage.setItem('pickboard.picks', JSON.stringify([stale]))

    renderProvider()

    const oldestSeed = Number(screen.getByTestId('seed-oldest').textContent)

    expect(screen.getByTestId('count')).toHaveTextContent('11')
    expect(Date.now() - oldestSeed).toBeLessThan(7 * DAY)
    expect(screen.getByTestId('newest')).toHaveTextContent('Under 9.5 Lost')
  })

  it('keeps placed picks across a remount', () => {
    const first = renderProvider()
    act(() => screen.getByRole('button').click())
    first.unmount()

    renderProvider()

    expect(screen.getByTestId('count')).toHaveTextContent('11')
    expect(screen.getByTestId('newest')).toHaveTextContent('Celtics -3.5 Pending')
  })
})

describe('usePicks', () => {
  it('fails loudly outside the provider', () => {
    expect(() => render(<Readout />)).toThrow(/inside <PicksProvider>/)
  })
})
