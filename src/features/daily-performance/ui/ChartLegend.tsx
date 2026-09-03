const ITEMS = [
  { label: 'Won', swatch: 'bg-pb-win' },
  { label: 'Lost', swatch: 'bg-pb-loss' },
  { label: 'Pending', swatch: 'bg-pb-brand' },
]

export const ChartLegend = () => (
  <ul className="mt-2 mb-3 flex flex-wrap gap-3.5">
    {ITEMS.map((item) => (
      <li
        key={item.label}
        className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[.08em] text-ink/60 uppercase"
      >
        <span aria-hidden className={`size-2.5 ${item.swatch}`} />
        {item.label}
      </li>
    ))}
  </ul>
)
