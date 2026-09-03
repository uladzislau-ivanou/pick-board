import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TOAST_MS } from '@/shared/config/app'

import { ToastProvider } from './ToastProvider'
import { useToast } from './toast-context'

const Trigger = ({ onAction }: { onAction?: () => void }) => {
  const { show } = useToast()
  return (
    <button
      type="button"
      onClick={() =>
        show({ message: 'Pick placed — Celtics at 1.72', actionLabel: 'View', onAction })
      }
    >
      Place pick
    </button>
  )
}

const renderWithProvider = (onAction?: () => void) =>
  render(
    <ToastProvider>
      <Trigger onAction={onAction} />
    </ToastProvider>,
  )

const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }))

describe('ToastProvider', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows nothing until something fires a toast', () => {
    renderWithProvider()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('announces the message as a status', () => {
    renderWithProvider()

    click('Place pick')

    expect(screen.getByRole('status')).toHaveTextContent('Pick placed — Celtics at 1.72')
  })

  it('dismisses itself after the configured delay', () => {
    renderWithProvider()
    click('Place pick')

    act(() => vi.advanceTimersByTime(TOAST_MS - 1))
    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('runs the action and dismisses when the action is clicked', () => {
    const onAction = vi.fn()
    renderWithProvider(onAction)
    click('Place pick')

    click('View')

    expect(onAction).toHaveBeenCalledOnce()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('useToast', () => {
  it('fails loudly outside the provider, rather than silently doing nothing', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Trigger />)).toThrow(/inside <ToastProvider>/)
    vi.restoreAllMocks()
  })
})
