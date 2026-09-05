const ITEMS = [
  { label: 'Won', swatch: 'size-2.5 bg-pb-win' },
  { label: 'Lost', swatch: 'size-2.5 bg-pb-loss' },
  { label: 'Pending', swatch: 'size-2.5 bg-pb-brand' },
  { label: 'Running net', swatch: 'h-0.5 w-4 bg-ink' },
]

export const ChartLegend = () => (
  <ul className="mt-2 mb-3 flex flex-wrap gap-3.5">
    {ITEMS.map((item) => (
      <li key={item.label} className="flex items-center gap-1.5 text-[11px] text-ink/70">
        <span aria-hidden className={item.swatch} />
        {item.label}
      </li>
    ))}
  </ul>
)
