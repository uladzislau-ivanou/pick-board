import { render, screen } from '@testing-library/react'
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
