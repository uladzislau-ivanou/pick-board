import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { PicksProvider } from '@/entities/pick'
import { ROUTES } from '@/shared/config/routes'

import { AppHeader } from './AppHeader'

const renderHeader = (initialPath: string = ROUTES.events) => {
  const router = createMemoryRouter(
    [
      { path: ROUTES.events, element: <AppHeader /> },
      { path: ROUTES.myPicks, element: <AppHeader /> },
    ],
    { initialEntries: [initialPath] },
  )

  return render(
    <PicksProvider>
      <RouterProvider router={router} />
    </PicksProvider>,
  )
}

describe('AppHeader', () => {
  beforeEach(() => window.localStorage.clear())

  it('shows the brand and both tabs, and not the prototype Handoff tab', () => {
    renderHeader()

    expect(screen.getByText('PickBoard')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.queryByText(/handoff/i)).not.toBeInTheDocument()
  })

  it('counts every pick next to My Picks', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: /my picks/i })).toHaveTextContent('My Picks10')
  })

  it('marks the current tab for assistive technology', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /my picks/i })).not.toHaveAttribute('aria-current')
  })

  it('moves the current marker when the other tab is followed', async () => {
    renderHeader()

    await userEvent.click(screen.getByRole('link', { name: /my picks/i }))

    expect(screen.getByRole('link', { name: /my picks/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Events' })).not.toHaveAttribute('aria-current')
  })
})
