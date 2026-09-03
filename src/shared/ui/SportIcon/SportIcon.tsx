import type { Sport } from '@/shared/config/sports'

/**
 * Lucide ships no ball-sport icons (checked across all exports in v1.40), so
 * these are hand-drawn to its geometry: 24px box, no fill, 1.6 stroke, square
 * caps. `lucide-react` still supplies the interface icons.
 */
const PATHS: Record<Sport, readonly string[]> = {
  basketball: [
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
    'M4.9 4.9a15 15 0 0 1 14.2 14.2',
    'M19.1 4.9A15 15 0 0 0 4.9 19.1',
    'M12 2v20',
  ],
  football: [
    'M3 21c0-8 10-18 18-18 0 8-10 18-18 18Z',
    'M9.5 14.5 14.5 9.5',
    'M11 11l1.5 1.5',
    'M13 9l1.5 1.5',
  ],
  soccer: [
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
    'M12 7.5 8.2 10.3l1.5 4.4h4.6l1.5-4.4Z',
    'M12 2v5.5',
    'M3.5 8.5l4.7 1.8',
    'M20.5 8.5l-4.7 1.8',
    'M9.7 14.7 7 19',
    'M14.3 14.7 17 19',
  ],
  baseball: [
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
    'M5 5c3 3 3 11 0 14',
    'M19 5c-3 3-3 11 0 14',
  ],
  hockey: ['M3 5l6 12h6l6-12', 'M3 21h18'],
}

type SportIconProps = {
  sport: Sport
  size?: number
  className?: string
}

export const SportIcon = ({ sport, size = 22, className }: SportIconProps) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="square"
    className={className}
  >
    {PATHS[sport].map((path) => (
      <path key={path} d={path} />
    ))}
  </svg>
)
