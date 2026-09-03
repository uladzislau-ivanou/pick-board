import type { Ref } from 'react'

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
    <div className="mt-1 flex items-stretch overflow-hidden rounded-md border border-divider bg-neutral-100">
      <span className="flex items-center border-r border-divider px-3 text-ink/60">$</span>
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
