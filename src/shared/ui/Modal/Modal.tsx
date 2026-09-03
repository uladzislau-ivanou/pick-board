import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

import { cn } from '@/shared/lib/cn'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]'

/** Anything deliberately taken out of the tab order, such as the backdrop. */
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => !element.matches(NOT_FOCUSABLE),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable.at(-1) as HTMLElement

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    const trigger = document.activeElement as HTMLElement | null
    const target = initialFocusRef?.current ?? dialogRef.current
    target?.focus()

    return () => trigger?.focus()
  }, [open, initialFocusRef])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-neutral-900/55 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'max-h-[calc(100vh-32px)] w-full max-w-[460px] animate-pb-in overflow-y-auto border-2 border-neutral-900 bg-ground shadow-lg',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
