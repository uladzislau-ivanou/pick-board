export const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0)

export const round2 = (value: number) => Math.round(value * 100) / 100

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))
