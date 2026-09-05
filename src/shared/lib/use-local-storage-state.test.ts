import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useLocalStorageState } from './use-local-storage-state'

describe('useLocalStorageState', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts from the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorageState('picks', () => ['seed']))
    expect(result.current[0]).toEqual(['seed'])
  })

  it('writes every update, so a reload sees the latest value', () => {
    const { result } = renderHook(() => useLocalStorageState('picks', () => ['seed']))

    act(() => result.current[1](['seed', 'placed']))

    expect(JSON.parse(window.localStorage.getItem('picks') ?? '')).toEqual(['seed', 'placed'])
  })

  it('prefers the stored value over the initial one', () => {
    window.localStorage.setItem('picks', JSON.stringify(['stored']))

    const { result } = renderHook(() => useLocalStorageState('picks', () => ['seed']))

    expect(result.current[0]).toEqual(['stored'])
  })

  it('falls back to the initial value when the stored entry is corrupt', () => {
    window.localStorage.setItem('picks', 'not json')

    const { result } = renderHook(() => useLocalStorageState('picks', () => ['seed']))

    expect(result.current[0]).toEqual(['seed'])
  })
})
