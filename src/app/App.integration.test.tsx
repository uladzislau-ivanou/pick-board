import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { PicksProvider } from '@/entities/pick'
import { ToastProvider } from '@/shared/ui/Toast'

import { routes } from './routes/router'

const renderApp = () => {
  const user = userEvent.setup()
  render(
    <PicksProvider>
      <ToastProvider>
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />
      </ToastProvider>
    </PicksProvider>,
  )
  return user
}

const myPicksTab = () => screen.getByRole('link', { name: /my picks/i })

const total = (label: string) => within(screen.getByText(label).parentElement as HTMLElement)

const rows = () => screen.getAllByRole('button').filter((el) => el.hasAttribute('aria-expanded'))

describe('placing a pick, end to end', () => {
  beforeEach(() => window.localStorage.clear())

  it('goes from a price on the board to a pending pick on My Picks', async () => {
    const user = renderApp()
    expect(myPicksTab()).toHaveTextContent('My Picks10')

    await user.click(screen.getByRole('button', { name: 'Celtics at 1.72' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAccessibleName('Celtics')
    expect(screen.getByLabelText('Stake')).toHaveValue('10')

    await user.clear(screen.getByLabelText('Stake'))
    await user.type(screen.getByLabelText('Stake'), '25')
    expect(screen.getByText('$43')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Place pick' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Pick placed — Celtics at 1.72')
    expect(myPicksTab()).toHaveTextContent('My Picks11')
  })

  it('lands the new pick on top of My Picks and moves both totals', async () => {
    const user = renderApp()

    await user.click(screen.getByRole('button', { name: 'Celtics at 1.72' }))
    await user.clear(screen.getByLabelText('Stake'))
    await user.type(screen.getByLabelText('Stake'), '25')
    await user.click(screen.getByRole('button', { name: 'Place pick' }))
    await user.click(screen.getByRole('button', { name: 'View' }))

    expect(rows()).toHaveLength(1)
    expect(rows()[0]).toHaveAccessibleName(
      /^Celtics, Moneyline, Nuggets @ Celtics\. odds 1\.72\. stake \$25\. to return \$43\. Pending$/,
    )

    expect(total('Total staked').getByText('$275')).toBeInTheDocument()
    expect(total('Total staked').getByText('11 picks all time')).toBeInTheDocument()
    expect(total('Pending payout').getByText('$43')).toBeInTheDocument()
    expect(total('Pending payout').getByText('1 open · $25 at risk')).toBeInTheDocument()

    expect(total('Win rate').getByText('60%')).toBeInTheDocument()
    expect(total('Win rate').getByText('6 of 10 resolved')).toBeInTheDocument()
  })

  it('survives a reload, because picks are persisted', async () => {
    const user = renderApp()

    await user.click(screen.getByRole('button', { name: 'Celtics at 1.72' }))
    await user.click(screen.getByRole('button', { name: 'Place pick' }))

    cleanup()
    renderApp()

    expect(myPicksTab()).toHaveTextContent('My Picks11')
  })

  it('jumps to My Picks from the toast', async () => {
    const user = renderApp()

    await user.click(screen.getByRole('button', { name: 'Celtics at 1.72' }))
    await user.click(screen.getByRole('button', { name: 'Place pick' }))
    await user.click(screen.getByRole('button', { name: 'View' }))

    expect(screen.getByRole('heading', { level: 1, name: 'My Picks' })).toBeInTheDocument()
    expect(myPicksTab()).toHaveAttribute('aria-current', 'page')
  })

  it('discards the selection when the modal is dismissed', async () => {
    const user = renderApp()

    await user.click(screen.getByRole('button', { name: 'Celtics at 1.72' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(myPicksTab()).toHaveTextContent('My Picks10')
  })

  it('returns focus to the price that opened the modal', async () => {
    const user = renderApp()
    const price = screen.getByRole('button', { name: 'Celtics at 1.72' })

    await user.click(price)
    await user.keyboard('{Escape}')

    expect(price).toHaveFocus()
  })
})
