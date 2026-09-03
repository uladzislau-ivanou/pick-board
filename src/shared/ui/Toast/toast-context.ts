import { createContext, useContext } from 'react'

export type Toast = {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export const ToastContext = createContext<{ show: (toast: Toast) => void } | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>')
  return context
}
