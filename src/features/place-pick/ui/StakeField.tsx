import type { Ref } from 'react'

/**
 * The label is bound with `htmlFor` rather than wrapping the input, so the
 * accessible name is "Stake" and not "Stake$" — the currency prefix sits in
 * the same box but outside the label.
 */
export const StakeField = ({
  id,
  ref,
  value,
  onChange,
  describedBy,
}: {
  id: string
  ref?: Ref<HTMLInputElement>
  value: string
  onChange: (value: string) => void
  describedBy?: string
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-[10px] font-semibold tracking-[.12em] text-ink/60 uppercase"
    >
      Stake
    </label>
    <div className="mt-1 flex items-stretch border border-divider bg-neutral-100">
      <span className="flex items-center border-r border-divider px-3.5 text-ink/60">$</span>
      <input
        id={id}
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="decimal"
        placeholder="0.00"
        aria-describedby={describedBy}
        className="w-full bg-transparent px-3.5 py-3 type-heading text-[17px]"
      />
    </div>
  </div>
)
