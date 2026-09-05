import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { OddsFormatProvider } from './OddsFormatProvider'
import { useOddsFormat } from './odds-format-context'
import { ODDS_FORMAT_SHORT } from './format-odds'

const STORAGE_KEY = 'pickboard.odds-format'

const Readout = () => {
  const { format, select } = useOddsFormat()
  return (
    <>
      <p data-testid="format">{ODDS_FORMAT_SHORT[format]}</p>
      <button type="button" onClick={() => select('american')}>
        Switch
      </button>
    </>
  )
}

const renderProvider = () =>
  render(
    <OddsFormatProvider>
      <Readout />
    </OddsFormatProvider>,
  )

describe('OddsFormatProvider', () => {
  beforeEach(() => window.localStorage.clear())

  it('starts in decimal', () => {
    renderProvider()
    expect(screen.getByTestId('format')).toHaveTextContent('DEC')
  })

  it('keeps the choice across a remount', async () => {
    const user = userEvent.setup()
    const first = renderProvider()
    await user.click(screen.getByRole('button'))
    first.unmount()

    renderProvider()

    expect(screen.getByTestId('format')).toHaveTextContent('US')
  })

  it.each([JSON.stringify('fractional'), JSON.stringify(7), 'not json at all'])(
    'falls back to decimal rather than crashing on a stored %s',
    (stored) => {
      window.localStorage.setItem(STORAGE_KEY, stored)

      renderProvider()

      expect(screen.getByTestId('format')).toHaveTextContent('DEC')
    },
  )
})
