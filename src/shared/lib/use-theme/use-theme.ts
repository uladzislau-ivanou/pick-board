import { useState } from 'react'

import { applyTheme, readTheme, THEME_STORAGE_KEY, type Theme } from './theme'

/**
 * Until the user picks a side there is nothing in storage and the system
 * preference wins, resolved before first paint by the script in `index.html`.
 * The first toggle writes an explicit choice, which then survives reloads.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(readTheme)

  const select = (next: Theme) => {
    applyTheme(next)
    setTheme(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Private mode or a full quota: the theme still applies for this session.
    }
  }

  return { theme, select, toggle: () => select(theme === 'dark' ? 'light' : 'dark') }
}
