import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/shared/lib/use-theme'

/** The label names the destination, not the current state: it has to be actionable. */
export const ThemeToggle = () => {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="flex size-9 items-center justify-center rounded-md border border-divider text-ink/70 transition-colors hover:border-pb-brand hover:bg-pb-brand-tint hover:text-pb-brand"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
