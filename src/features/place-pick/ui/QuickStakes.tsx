import { QUICK_STAKES } from '@/shared/config/app'
import { cn } from '@/shared/lib/cn'
import { formatMoney } from '@/shared/lib/money'

export const QuickStakes = ({
  value,
  onSelect,
}: {
  value: string
  onSelect: (value: string) => void
}) => (
  <div className="flex gap-2">
    {QUICK_STAKES.map((amount) => {
      const selected = Number(value) === amount
      return (
        <button
          key={amount}
          type="button"
          aria-pressed={selected}
          onClick={() => onSelect(String(amount))}
          className={cn(
            'min-h-10 flex-1 border px-3 text-left type-heading text-[13px] transition-colors',
            selected
              ? 'border-pb-brand bg-pb-brand-tint-2'
              : 'border-divider bg-neutral-100 hover:border-pb-brand hover:bg-pb-brand-tint',
          )}
        >
          {formatMoney(amount)}
        </button>
      )
    })}
  </div>
)
