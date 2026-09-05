import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'

import { App } from './App'

const violations = async (container: HTMLElement) => {
  const results = await axe(container)
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`)
}

describe('accessibility', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  it('has no violations on the Events board', async () => {
    const { container } = render(<App />)

    expect(await violations(container)).toEqual([])
  })

  it('has no violations with the Place Pick modal open', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.click(document.querySelectorAll('[aria-label*=" at "]')[0] as HTMLElement)

    expect(await violations(container)).toEqual([])
  })

  it('has no violations on My Picks', async () => {
    window.history.replaceState(null, '', '/my-picks')
    const { container } = render(<App />)

    expect(await violations(container)).toEqual([])
  })
})
