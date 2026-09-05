export const sanitizeStake = (value: string) => {
  const [whole = '', ...rest] = value.replace(/[^0-9.]/g, '').split('.')
  return rest.length === 0 ? whole : `${whole}.${rest.join('')}`
}

export interface StakeValidation {
  amount: number
  error: string | null
}

export const validateStake = (stake: string): StakeValidation => {
  if (stake.trim() === '') return { amount: 0, error: 'Enter a stake to continue.' }

  const amount = Number(stake)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { amount: 0, error: 'Stake must be greater than 0.' }
  }

  return { amount, error: null }
}
