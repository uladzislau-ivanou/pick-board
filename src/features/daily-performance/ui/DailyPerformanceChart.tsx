import {
  Bar,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

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

import { dayActionHint, dayFigures, isDense, labelEvery } from '../lib/chart-labels'
import { netDomain, withCumulativeNet } from '../lib/cumulative-net'
import { PeriodTotalsRow } from './PeriodTotalsRow'

const LEGEND = [
  { label: 'Won', swatch: 'size-2.5 bg-pb-win' },
  { label: 'Lost', swatch: 'size-2.5 bg-pb-loss' },
  { label: 'Pending', swatch: 'size-2.5 bg-pb-brand' },
  { label: 'Running net', swatch: 'h-0.5 w-4 bg-ink' },
]

const ChartLegend = () => (
  <ul className="mt-2 mb-3 flex flex-wrap gap-3.5">
    {LEGEND.map((item) => (
      <li key={item.label} className="flex items-center gap-1.5 text-[11px] text-ink/70">
        <span aria-hidden className={item.swatch} />
        {item.label}
      </li>
    ))}
  </ul>
)

const SERIES = [
  { key: 'wonStake', color: 'var(--color-pb-win)' },
  { key: 'lostStake', color: 'var(--color-pb-loss)' },
  { key: 'pendingStake', color: 'var(--color-pb-brand)' },
] as const

const BAR_RADIUS = 3

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

const StackedBar = ({ x, y, width, height, fill, dataKey, payload }: BarShapeProps) => {
  if (x === undefined || y === undefined || !width || !height) return null

  const index = SERIES.findIndex((series) => series.key === dataKey)
  const isTop = SERIES.slice(index + 1).every((series) => !payload?.[series.key])

  return <path d={cappedRect(x, y, width, height, isTop ? BAR_RADIUS : 0)} fill={fill} />
}

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
  const points = withCumulativeNet(buckets)
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

      <div className="relative h-38">
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
          <ComposedChart
            data={points}
            margin={{ top: 6, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="14%"
          >
            <XAxis dataKey="day" hide />
            <YAxis yAxisId="stake" hide domain={[0, 'dataMax']} />
            <YAxis yAxisId="net" hide domain={netDomain(points)} />
            {SERIES.map((series) => (
              <Bar
                key={series.key}
                yAxisId="stake"
                dataKey={series.key}
                stackId="stake"
                fill={series.color}
                shape={StackedBar}
                isAnimationActive={false}
              />
            ))}
            <ReferenceLine
              yAxisId="net"
              y={0}
              stroke="var(--color-divider)"
              strokeDasharray="2 3"
            />
            <Line
              yAxisId="net"
              type="monotone"
              dataKey="cumulativeNet"
              stroke="var(--color-ink)"
              strokeWidth={2}
              dot={{ r: 2, fill: 'var(--color-ink)', stroke: 'none' }}
              activeDot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
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
                className="flex-1 rounded-t-sm transition-colors not-disabled:hover:bg-ink/6 disabled:cursor-default"
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
            <span className="block text-[10px] font-semibold tracking-[.1em] text-ink/65 uppercase">
              {dayLabel(bucket, index)}
            </span>
            {dense ? null : (
              <span className="block text-[10px] text-ink/65">
                {bucket.staked > 0 ? formatMoney(bucket.staked) : '—'}
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  )
}
