import { useEffect, useState } from 'react'

const read = <T>(key: string) => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? undefined : (JSON.parse(raw) as T)
  } catch {
    return undefined
  }
}

export const useLocalStorageState = <T>(key: string, createInitial: () => T) => {
  const [value, setValue] = useState<T>(() => read<T>(key) ?? createInitial())

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])

  return [value, setValue] as const
}
