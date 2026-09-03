import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { TOAST_MS } from '@/shared/config/app'

import { ToastContext, type Toast } from './toast-context'

/** One toast at a time, auto-dismissed. State and view together: there is only ever one. */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null)

  const show = useCallback((next: Toast) => setToast(next), [])
  const value = useMemo(() => ({ show }), [show])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), TOAST_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        // <output> carries an implicit status role.
        <output className="fixed bottom-5 left-5 z-[70] flex max-w-[calc(100vw-40px)] animate-pb-in items-center gap-3 bg-neutral-900 px-4.5 py-3.5 text-[13px] text-ground">
          <span>{toast.message}</span>
          {toast.actionLabel ? (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.()
                setToast(null)
              }}
              className="border border-ground/40 px-2 py-1 type-heading text-[11px] tracking-[.06em] uppercase hover:bg-ground/15"
            >
              {toast.actionLabel}
            </button>
          ) : null}
        </output>
      ) : null}
    </ToastContext.Provider>
  )
}
