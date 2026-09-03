let sequence = 0

/**
 * Unique within a session and across reloads: the timestamp separates runs, the
 * counter separates ids created in the same millisecond.
 */
export const createId = (prefix: string) => {
  sequence += 1
  return `${prefix}-${Date.now().toString(36)}-${sequence}`
}
