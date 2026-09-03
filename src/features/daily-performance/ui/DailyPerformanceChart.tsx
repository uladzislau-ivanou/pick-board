import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  dailyBuckets,
  periodLabel,
  periodRange,
  periodTotals,
  type DayBucket,
  type Pick,
  type PickPeriod,
} from '@/entities/pick'
import { cn } from '@/shared/lib/cn'
import { formatWeekdayShort } from '@/shared/lib/date'
import { formatMoney } from '@/shared/lib/money'

import {
  dayActionHint,
  dayFigures,
  isDense,
  labelEvery,
  netColor,
  netLabel,
} from '../lib/chart-labels'
import { ChartLegend } from './ChartLegend'
import { PeriodTotalsRow } from './PeriodTotalsRow'

/** Bottom to top, so a day reads won → lost → still open. */
const SERIES = [
  { key: 'wonStake', color: 'var(--color-pb-win)' },
  { key: 'lostStake', color: 'var(--color-pb-loss)' },
  { key: 'pendingStake', color: 'var(--color-pb-brand)' },
] as const

const BAR_RADIUS = 3

/** A rect with only its top corners rounded. */
const cappedRect = (x: number, y: number, width: number, height: number, radius: number) => {
  const r = Math.min(radius, width / 2, height)
  return [
    `M${x},${y + height}`,
    `L${x},${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `L${x + width - r},${y}`,
    `Q${x + width},${y} ${x + width},${y + r}`,
    `L${x + width},${y + height}`,
    'Z',
  ].join(' ')
}

type BarShapeProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
  dataKey?: string
  payload?: DayBucket
}

/**
 * Rounds a segment only when nothing is stacked above it that day. Rounding
 * every segment leaves a visible notch wherever a square-bottomed segment sits
 * on a rounded one — and which series ends up on top varies by day, so it
 * cannot be decided per series.
 */
const StackedBar = ({ x, y, width, height, fill, dataKey, payload }: BarShapeProps) => {
  if (x === undefined || y === undefined || !width || !height) return null

  const index = SERIES.findIndex((series) => series.key === dataKey)
  const isTop = SERIES.slice(index + 1).every((series) => !payload?.[series.key])

  return <path d={cappedRect(x, y, width, height, isTop ? BAR_RADIUS : 0)} fill={fill} />
}

/**
 * Recharts draws the bars; the click target, the accessible name and keyboard
 * access come from a transparent button per column laid over them. SVG rects
 * cannot carry an accessible name, and the handoff requires one.
 *
 * Every row here — nets above, bars, labels below — is a flex row of equal
 * `flex-1` cells, and the chart uses the same equal bands, so the columns line
 * up without measuring anything.
 */
export const DailyPerformanceChart = ({
  picks,
  period,
  now,
  selectedDay,
  onSelectDay,
  className,
}: {
  picks: readonly Pick[]
  period: PickPeriod
  now: number
  selectedDay: number | null
  onSelectDay: (day: number) => void
  className?: string
}) => {
  const range = periodRange(period, picks, now)
  const buckets = dailyBuckets(picks, range)
  const dense = isDense(range.spanDays)
  const every = labelEvery(range.spanDays)

  const dayLabel = (bucket: DayBucket, index: number) => {
    const shown = !dense || index % every === 0 || index === buckets.length - 1
    if (!shown) return ''
    return dense ? String(new Date(bucket.day).getDate()) : formatWeekdayShort(bucket.day)
  }

  return (
    <section
      aria-label="Daily performance"
      className={cn('flex flex-col bg-ground px-4.5 pt-3.5 pb-3', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h3 className="text-[14px]">{periodLabel(period, range.spanDays)}</h3>
        <PeriodTotalsRow totals={periodTotals(buckets)} />
      </div>

      <ChartLegend />

      {dense ? null : (
        <div aria-hidden className="flex">
          {buckets.map((bucket) => (
            <span
              key={bucket.day}
              className={cn('flex-1 text-center type-heading text-[10px]', netColor(bucket))}
            >
              {netLabel(bucket)}
            </span>
          ))}
        </div>
      )}

      <div className="relative h-33">
        <div aria-hidden className="absolute inset-0 flex">
          {buckets.map((bucket) => (
            <span
              key={bucket.day}
              className={cn(
                'flex-1',
                bucket.day === selectedDay && 'rounded-t-sm bg-pb-brand-tint',
              )}
            />
          ))}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[...buckets]}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="14%"
          >
            <XAxis dataKey="day" hide />
            <YAxis hide domain={[0, 'dataMax']} />
            {SERIES.map((series) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                stackId="stake"
                fill={series.color}
                shape={StackedBar}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex">
          {buckets.map((bucket) => {
            const empty = bucket.count === 0
            return (
              <button
                key={bucket.day}
                type="button"
                disabled={empty}
                aria-pressed={empty ? undefined : bucket.day === selectedDay}
                aria-label={
                  empty
                    ? dayFigures(bucket)
                    : dayFigures(bucket) + dayActionHint(bucket.day === selectedDay)
                }
                title={dayFigures(bucket)}
                onClick={() => onSelectDay(bucket.day)}
                className="flex-1 disabled:cursor-default"
              />
            )
          })}
        </div>
      </div>

      <div className="flex border-t-2 border-divider pt-1.75">
        {buckets.map((bucket, index) => (
          <span
            key={bucket.day}
            className={cn(
              'flex-1 rounded-b-sm px-1 py-1 text-center',
              bucket.day === selectedDay &&
                'bg-pb-brand-tint shadow-[inset_0_-3px_0_0_var(--color-pb-brand)]',
            )}
          >
            <span className="block text-[10px] font-semibold tracking-[.1em] text-ink/50 uppercase">
              {dayLabel(bucket, index)}
            </span>
            {dense ? null : (
              <span className="block text-[10px] text-ink/45">
                {bucket.staked > 0 ? formatMoney(bucket.staked) : '—'}
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  )
}
