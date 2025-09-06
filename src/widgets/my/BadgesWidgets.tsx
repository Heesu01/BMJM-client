export type Badge = {
  id: string
  name: string
  imageUrl?: string
  color?: string
}

export function BadgeHeader({
  badge,
  className = '',
}: {
  badge: Badge
  className?: string
}) {
  return (
    <div className={className}>
      <header className="mt-[12px] text-center">
        <h2 className="text-main text-semi20">나의 대표 뱃지</h2>
        <p className="text-semi14 mt-[5px] text-[#A0A0A0]">
          대표 뱃지는 커뮤니티에서 프로필로 보여져요.
        </p>
      </header>

      <div className="mt-[24px] grid place-items-center">
        <div
          className="relative grid place-items-center rounded-full"
          style={{ width: 180, height: 180 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-sky-400 to-blue-500 ring-8 ring-sky-100" />
          {badge.imageUrl ? (
            <img
              src={badge.imageUrl}
              alt={badge.name}
              className="relative h-[120px] w-[120px] object-contain"
            />
          ) : (
            <div
              className="relative grid h-[120px] w-[120px] place-items-center rounded-full text-white"
              style={{ backgroundColor: badge.color ?? '#47A9FF' }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                className="opacity-90"
              >
                <path
                  d="M4 10a8 8 0 0016 0H4zm2 8h12"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="text-bold14 bg-sub text-main mt-[20px] h-[31px] w-[184px] rounded-full text-center leading-[31px]">
          {badge.name}
        </div>
      </div>
    </div>
  )
}

export function BadgeOwnedSummary({
  total,
  className = '',
}: {
  total: number
  className?: string
}) {
  return (
    <div
      className={`bg-main text-semi16 flex w-full items-center justify-between rounded-[10px] p-[20px] text-white ${className}`}
    >
      <span>보유한 뱃지</span>
      <span>총 {total}개</span>
    </div>
  )
}

export function BadgeGrid({
  badges,
  repId,
  withSection = false,
  title = '나의 뱃지',
  className = '',
}: {
  badges: Badge[]
  repId?: string
  withSection?: boolean
  title?: string
  className?: string
}) {
  const grid = (
    <ul className="grid grid-cols-4 gap-[10px]">
      {badges.map((b) => (
        <li key={b.id} className="relative">
          <div
            className="grid place-items-center select-none"
            aria-label={b.name}
          >
            <div
              className="grid h-16 w-16 place-items-center rounded-full shadow ring-4 ring-white transition-transform active:scale-95"
              style={{ backgroundColor: b.color ?? '#E5E7EB' }}
            >
              {b.imageUrl ? (
                <img
                  src={b.imageUrl}
                  alt={b.name}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <span className="text-xs text-white">{b.name.slice(0, 2)}</span>
              )}
            </div>

            {repId === b.id && (
              <span className="bg-sub text-main text-bold14 mt-[10px] rounded-full px-[10px] py-[2px]">
                대표
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )

  if (withSection) {
    return (
      <section className={`mt-[30px] ${className}`}>
        <h3 className="text-semi16 mb-[20px]">{title}</h3>
        {grid}
      </section>
    )
  }

  return grid
}
