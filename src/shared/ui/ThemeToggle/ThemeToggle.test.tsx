import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { ThemeToggle } from './ThemeToggle'

const root = () => document.documentElement
const theme = () => root().getAttribute('data-theme')

const bootWith = (initial: 'light' | 'dark') => {
  root().setAttribute('data-theme', initial)
  const user = userEvent.setup()
  render(<ThemeToggle />)
  return user
}

describe('ThemeToggle', () => {
  beforeEach(() => window.localStorage.clear())
  afterEach(() => root().removeAttribute('data-theme'))

  it('offers the theme it would switch to, not the one showing', () => {
    bootWith('light')
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument()
  })

  it('flips the attribute the token sheet keys off', async () => {
    const user = bootWith('light')

    await user.click(screen.getByRole('button'))
    expect(theme()).toBe('dark')

    await user.click(screen.getByRole('button'))
    expect(theme()).toBe('light')
  })

  it('persists the choice, so a reload does not fall back to the system', async () => {
    const user = bootWith('light')

    await user.click(screen.getByRole('button'))
    expect(window.localStorage.getItem('pickboard.theme.v1')).toBe('dark')
  })

  it('reads its initial state from the DOM, not from a default', () => {
    bootWith('dark')
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })
})
