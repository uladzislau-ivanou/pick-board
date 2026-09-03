export const CrestBadge = ({ abbr, color }: { abbr: string; color: string }) => (
  <span
    style={{ backgroundColor: color }}
    className="flex size-crest shrink-0 items-center justify-center type-heading text-crest text-white"
  >
    {abbr}
  </span>
)
