import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react'

import { cn } from '@/shared/lib/cn'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]'

/** Anything deliberately taken out of the tab order, such as the dialog itself. */
const NOT_FOCUSABLE = '[tabindex="-1"]'

type ModalProps = {
  open: boolean
  onClose: () => void
  /** Id of the heading inside the dialog that names it. */
  labelledBy: string
  /** What to focus on open — the stake input, not the close button. */
  initialFocusRef?: RefObject<HTMLElement | null>
  children: ReactNode
  className?: string
}

/**
 * The single owner of the app's dialog accessibility: dialog semantics, Escape,
 * a focus trap, a locked page behind it, and focus returned to the trigger.
 *
 * Keyboard handling sits on the backdrop rather than on `document`: focus is
 * moved inside and trapped, so every keystroke bubbles here anyway, and a
 * scoped listener beats a global one plus its add/remove bookkeeping.
 *
 * Two accepted deviations, marked `NOSONAR` at their lines:
 *
 * 1. **Not a native `<dialog>`** (S6819). jsdom 30 implements none of
 *    `showModal`, `show` or `close`, so every test here — focus trap, focus
 *    return, Escape, body lock — would assert against a stub of the very API
 *    under test. The handoff specifies `role="dialog"` + `aria-modal`, and this
 *    is the last code in the app worth leaving uncovered.
 * 2. **The backdrop is a scrim with a click handler.** Dismissing by clicking
 *    outside is a redundant convenience: Escape (handled on the same element)
 *    and the close button are the accessible paths. Every alternative is worse
 *    — a full-screen `<button>` puts a meaningless stop in the focus trap, and
 *    dropping the behaviour breaks an expectation the prototype set.
 */
export const Modal = ({
  open,
  onClose,
  labelledBy,
  initialFocusRef,
  children,
  className,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const trigger = document.activeElement as HTMLElement | null
    const target = initialFocusRef?.current ?? dialogRef.current
    target?.focus()

    return () => trigger?.focus()
  }, [open, initialFocusRef])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose()
      return
    }
    if (event.key !== 'Tab' || !dialogRef.current) return

    const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (element) => !element.matches(NOT_FOCUSABLE),
    )
    const first = focusable[0]
    const last = focusable.at(-1)
    if (!first || !last) return

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  /** Only a click on the backdrop itself, so nothing inside has to stop it bubbling. */
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  if (!open) return null

  return (
    <div // NOSONAR - a scrim, not a control: see the accepted deviations above
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-scrim p-4"
    >
      <div // NOSONAR - native <dialog> is untestable here: see above
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          'max-h-[calc(100vh-32px)] w-full max-w-[460px] animate-pb-in overflow-y-auto rounded-lg border-2 border-inverse bg-ground shadow-lg',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
