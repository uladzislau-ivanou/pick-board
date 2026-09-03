export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'pickboard.theme.v1'

/** The attribute the token sheet keys its dark palette off. */
export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
}

/**
 * What the page is showing right now. Read from the DOM rather than kept in a
 * module variable, because the pre-paint script in `index.html` — not React —
 * is what resolves the first value.
 */
export const readTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
