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

const NOT_FOCUSABLE = '[tabindex="-1"]'

type ModalProps = {
  open: boolean
  onClose: () => void
  labelledBy: string
  initialFocusRef?: RefObject<HTMLElement | null>
  children: ReactNode
  className?: string
}

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

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  if (!open) return null

  return (
    <div // NOSONAR - a scrim, not a control
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-scrim p-4"
    >
      <div // NOSONAR - native <dialog> is untestable under jsdom
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
