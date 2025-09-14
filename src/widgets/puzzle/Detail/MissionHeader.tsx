export type MissionDetailBodyProps = {
  loading?: boolean
  error?: unknown
  mission?: {
    missionTitle: string
    missionIntroduction: string
    missionContent: string
    missionImageUrl?: string
    isCompleted?: boolean
    x?: string
    y?: string
  }
}

export default function MissionDetailBody({
  loading,
  error,
  mission,
}: MissionDetailBodyProps) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-[220px] w-full bg-gray-200" />
        <div className="px-5 py-4">
          <div className="h-5 w-2/3 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-4/5 rounded bg-gray-100" />
        </div>
        <div className="px-5">
          <div className="mt-3 h-28 rounded-2xl bg-gray-100" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-5 py-8 text-center text-sm text-red-500">
        미션을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </div>
    )
  }

  if (!mission) return null

  const steps =
    mission?.missionContent
      ?.split('\n')
      .map((s) => s.trim())
      .filter(Boolean) ?? []

  const tone = mission.isCompleted
    ? {
        badge: '#9CA3AF',
        chipBg: '#F3F4F6',
        stepText: 'text-gray-500 line-through',
      }
    : { badge: '#ffffff', chipBg: '#1690FF', stepText: 'text-gray-800' }

  const handleNavigate = () => {
    if (mission?.y && mission?.x) {
      const url = `https://map.kakao.com/link/to/${encodeURIComponent(
        mission.missionTitle,
      )},${mission.y},${mission.x}`
      window.open(url, '_blank')
    }
  }

  return (
    <div>
      {mission.missionImageUrl ? (
        <img
          src={mission.missionImageUrl}
          alt={mission.missionTitle}
          className="h-[248px] w-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : null}

      <div className="p-[20px]">
        <div className="text-medium20">{mission.missionTitle}</div>
        <div className="text-medium14 text-gray-80">
          {mission.missionIntroduction}
        </div>
      </div>

      {steps.length > 0 && (
        <div>
          <div className="rounded-2xl px-[20px]">
            <div
              className="text-semi14 mb-2 inline-flex items-center gap-2 rounded-[4px] p-[8px]"
              style={{ backgroundColor: tone.chipBg, color: tone.badge }}
            >
              <span>💡 미션 TIP</span>
            </div>

            <ol className="mt-1 space-y-2">
              {steps.map((line, i) => (
                <li key={i} className="text-medium16 flex gap-2">
                  <span
                    className="mb-[19px] inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[12px]"
                    style={{ borderColor: tone.chipBg, color: tone.chipBg }}
                  >
                    {i + 1}
                  </span>
                  <span className={tone.stepText}>{line}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <div className="px-[20px]">
        {mission?.y && mission?.x && (
          <button
            onClick={handleNavigate}
            className="bg-sub-2 text-main mt-3 w-full rounded-lg px-4 py-2 shadow-sm"
          >
            카카오맵 길찾기
          </button>
        )}
      </div>
    </div>
  )
}
