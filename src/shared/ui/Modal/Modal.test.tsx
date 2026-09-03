import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from './Modal'

/** A trigger plus the modal, so focus return can be observed for real. */
const Harness = () => {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy="modal-title"
        initialFocusRef={inputRef}
      >
        <h2 id="modal-title">Celtics -3.5</h2>
        <input ref={inputRef} aria-label="Stake" />
        <button type="button">Place pick</button>
      </Modal>
    </>
  )
}

describe('Modal', () => {
  it('renders nothing while closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()} labelledBy="t">
        <h2 id="t">Hidden</h2>
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is a modal dialog named by the heading it is given', () => {
    render(
      <Modal open onClose={vi.fn()} labelledBy="t">
        <h2 id="t">Celtics -3.5</h2>
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Celtics -3.5')
  })

  it('closes on Escape', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} labelledBy="t">
        <h2 id="t">Title</h2>
      </Modal>,
    )

    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes on a backdrop click but not on a click inside', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} labelledBy="t">
        <h2 id="t">Title</h2>
      </Modal>,
    )

    await userEvent.click(screen.getByRole('heading'))
    expect(onClose).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('locks the page behind it, and unlocks on close', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(document.body.style.overflow).toBe('hidden')

    await userEvent.keyboard('{Escape}')
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('moves focus to the requested field, then back to the trigger', async () => {
    render(<Harness />)
    const trigger = screen.getByRole('button', { name: 'Open' })

    await userEvent.click(trigger)
    expect(screen.getByLabelText('Stake')).toHaveFocus()

    await userEvent.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('traps Tab inside the dialog', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    // Stake -> Place pick -> wraps back to Stake.
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Place pick' })).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByLabelText('Stake')).toHaveFocus()

    await userEvent.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Place pick' })).toHaveFocus()
  })
})
