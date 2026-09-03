import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { DEFAULT_STAKE } from '@/shared/config/app'

import { sanitizeStake } from '../lib/sanitize-stake'
import type { PickDraft } from '../model/types'
import { PlacePickModal } from './PlacePickModal'

const draft: PickDraft = {
  sport: 'basketball',
  event: 'Nuggets @ Celtics',
  market: 'Spread',
  marketType: 'Spread',
  selection: 'Celtics -3.5',
  odds: 1.91,
}

const Harness = ({ onConfirm = vi.fn(), onClose = vi.fn() }) => {
  const [stake, setStake] = useState(DEFAULT_STAKE)
  return (
    <PlacePickModal
      draft={draft}
      stake={stake}
      onStakeChange={(value) => setStake(sanitizeStake(value))}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}

const stakeInput = () => screen.getByLabelText('Stake')
const placeButton = () => screen.getByRole('button', { name: 'Place pick' })

describe('PlacePickModal', () => {
  it('opens pre-filled with the selection, market, event and odds', () => {
    render(<Harness />)

    expect(screen.getByRole('dialog')).toHaveAccessibleName('Celtics -3.5')
    expect(screen.getByText('Spread · Nuggets @ Celtics')).toBeInTheDocument()
    expect(screen.getByText('1.91')).toBeInTheDocument()
    expect(stakeInput()).toHaveValue('10')
  })

  it('computes the payout and profit from the opening stake', () => {
    render(<Harness />)

    expect(screen.getByText('$19.10')).toBeInTheDocument()
    expect(screen.getByText('Returns $9.10 profit')).toBeInTheDocument()
  })

  it('recomputes the payout live as the stake is typed', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.clear(stakeInput())
    await user.type(stakeInput(), '25')

    expect(screen.getByText('$47.75')).toBeInTheDocument()
    expect(screen.getByText('Returns $22.75 profit')).toBeInTheDocument()
  })

  it('ignores characters that are not part of an amount', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.clear(stakeInput())
    await user.type(stakeInput(), '$1a2')

    expect(stakeInput()).toHaveValue('12')
  })

  it('fills the stake from a quick-stake chip and marks it', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByRole('button', { name: '$25' }))

    expect(stakeInput()).toHaveValue('25')
    expect(screen.getByRole('button', { name: '$25' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '$10' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('asks for a stake and blocks confirmation when the field is empty', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.clear(stakeInput())

    expect(screen.getByText('Enter a stake to continue.')).toBeInTheDocument()
    expect(placeButton()).toBeDisabled()
  })

  it('rejects a non-positive stake', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.clear(stakeInput())
    await user.type(stakeInput(), '0')

    expect(screen.getByText('Stake must be greater than 0.')).toBeInTheDocument()
    expect(placeButton()).toBeDisabled()
  })

  it('describes the stake field by its validation message', () => {
    render(<Harness />)

    const described = stakeInput().getAttribute('aria-describedby')
    expect(described).toBeTruthy()
    expect(document.getElementById(described as string)).toHaveAttribute('aria-live', 'polite')
  })

  it('confirms with the parsed stake', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<Harness onConfirm={onConfirm} />)

    await user.clear(stakeInput())
    await user.type(stakeInput(), '12.50')
    await user.click(placeButton())

    expect(onConfirm).toHaveBeenCalledWith(12.5)
  })

  it('discards through Cancel, the close button and Escape', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<Harness onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(3)
  })

  it('puts focus straight on the stake field', () => {
    render(<Harness />)
    expect(stakeInput()).toHaveFocus()
  })
})
