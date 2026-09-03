import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { getSeedPicks } from '@/entities/pick'

import { getPickInsights } from '../model/get-pick-insights'
import { PickPatternCard } from './PickPatternCard'

const NOW = new Date(2026, 8, 3, 12).getTime()
const seeded = getSeedPicks(NOW)
const insights = getPickInsights(seeded, NOW)

const renderCard = (picks = seeded) => {
  const user = userEvent.setup()
  render(<PickPatternCard picks={picks} now={NOW} />)
  return user
}

describe('PickPatternCard', () => {
  it('shows the strongest pattern first, with its position', () => {
    renderCard()

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(insights[0].headline)
    expect(screen.getByText(`Pattern 1 / ${insights.length}`)).toBeInTheDocument()
  })

  it('offers a dot per pattern, named by its kicker', () => {
    renderCard()

    for (const insight of insights) {
      expect(screen.getByRole('button', { name: insight.kicker })).toBeInTheDocument()
    }
  })

  it('advances to the next pattern', async () => {
    const user = renderCard()

    await user.click(screen.getByRole('button', { name: 'Next pattern' }))

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(insights[1].headline)
    expect(screen.getByText(`Pattern 2 / ${insights.length}`)).toBeInTheDocument()
  })

  it('wraps backwards from the first pattern to the last', async () => {
    const user = renderCard()

    await user.click(screen.getByRole('button', { name: 'Previous pattern' }))

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      insights[insights.length - 1].headline,
    )
  })

  it('jumps straight to a pattern from its dot', async () => {
    const user = renderCard()

    await user.click(screen.getByRole('button', { name: 'Cold market' }))

    const cold = insights.find((insight) => insight.kicker === 'Cold market')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(cold?.headline ?? '')
  })

  it('scopes the evidence strip to the pattern on screen', async () => {
    const user = renderCard()

    await user.click(screen.getByRole('button', { name: 'Cold market' }))

    // All four seeded Over/Under picks lost.
    expect(screen.getByText('Last 4 Over/Under')).toBeInTheDocument()
    expect(screen.getAllByText('Lost')).toHaveLength(4)
    expect(screen.queryAllByText('Won')).toHaveLength(0)
  })

  it('labels each result in text, never by colour alone', () => {
    renderCard()

    expect(screen.getByText(/^Last 5 resolved$/)).toBeInTheDocument()
    expect(screen.getAllByText(/^(Won|Lost)$/)).toHaveLength(5)
  })

  it('hides the carousel when there is only one pattern', () => {
    renderCard([])

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Not enough history yet.')
    expect(screen.queryByRole('button', { name: 'Next pattern' })).not.toBeInTheDocument()
    expect(screen.queryByText(/^Pattern /)).not.toBeInTheDocument()
  })
})
