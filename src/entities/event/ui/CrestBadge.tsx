export const CrestBadge = ({ abbr }: { abbr: string }) => (
  <span
    aria-hidden
    className="flex size-crest shrink-0 items-center justify-center rounded-full crest-split type-heading text-crest tracking-[-0.01em] text-white"
  >
    {abbr}
  </span>
)
