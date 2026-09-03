export const sanitizeStake = (value: string) => {
  const [whole = '', ...rest] = value.replace(/[^0-9.]/g, '').split('.')
  return rest.length === 0 ? whole : `${whole}.${rest.join('')}`
}
