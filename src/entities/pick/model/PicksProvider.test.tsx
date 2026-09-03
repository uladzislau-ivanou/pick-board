import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { PicksProvider } from './PicksProvider'
import { usePicks } from './picks-context'

const Readout = () => {
  const { picks, addPick } = usePicks()
  return (
    <>
      <p data-testid="count">{picks.length}</p>
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
