import { MARKET_COLUMN_LABELS } from '@/shared/config/markets'

import { BOARD_COLUMNS, boardGridStyle } from '../config/board-columns'

const CELL = 'text-center text-[9px] font-semibold tracking-[.1em] text-ink/65 uppercase'

export const BoardColumnHeader = () => (
  <div
    aria-hidden
    style={boardGridStyle}
    className="grid gap-x-1 border-b border-divider bg-neutral-200 px-matchup-x py-1.5"
  >
    <span />
    {BOARD_COLUMNS.map((type) => {
      const { short, full } = MARKET_COLUMN_LABELS[type]

      return (
        <span key={type} className={CELL}>
          {short === full ? (
            full
          ) : (
            <>
              <span className="min-[448px]:hidden">{short}</span>
              <span className="max-[447px]:hidden">{full}</span>
            </>
          )}
        </span>
      )
    })}
  </div>
)
