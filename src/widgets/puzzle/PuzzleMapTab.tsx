import { useState, useMemo } from 'react'
import BusanMapSVG from './BusanMapSVG'
import {
  usePuzzleMapProgress,
  useRegionMissions,
} from '@/features/puzzle/model'

export default function PuzzleMapTab() {
  const { data, byRegion, totalCollected, loading } = usePuzzleMapProgress()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const defaultRegion = useMemo(() => {
    if (selectedRegion) return selectedRegion
    const firstIncomplete = data?.find((d) => !d.puzzleCompleted)?.puzzleRegion
    return firstIncomplete ?? data?.[0]?.puzzleRegion ?? null
  }, [selectedRegion, data])

  const { data: missionData, loading: missionsLoading } = useRegionMissions(
    defaultRegion ?? undefined,
  )

  const current = defaultRegion ? byRegion[defaultRegion] : undefined
  const collected = current?.collectedMissionCount ?? 0
  const total = current?.totalMissionCount ?? 0
  const percent = total > 0 ? Math.round((collected / total) * 100) : 0

  return (
    <div>
      <div className="absolute left-[20px]">
        <div className="text-semi16">
          총 {totalCollected}개의 퍼즐을 모았어요!
        </div>
        <div className="text-medium14 text-gray-60 mt-[2px]">
          미션을 달성하고 퍼즐을 채워보세요.
        </div>
      </div>
      <div className="m-atuo flex w-full items-center justify-center">
        <BusanMapSVG
          selected={defaultRegion}
          progressByRegion={byRegion}
          onSelect={(name) => setSelectedRegion(name)}
        />
      </div>

      <div className="p-[20px]">
        <div className="flex items-center gap-3 rounded-[20px] bg-white p-[16px] shadow">
          <div className="bg-sub-2 flex h-[48px] w-[48px] items-center justify-center rounded-full">
            <span className="text-main text-semi16">🧩</span>
          </div>

          <div className="flex-1">
            <div className="text-medium16">
              다음 부산 관광 퍼즐{' '}
              <span className="text-main text-semi16">
                ‘{defaultRegion ?? ''}’
              </span>
            </div>
            <div className="mt-[2px] flex items-center gap-3">
              <div className="bg-sub-2 h-[8px] w-full rounded-full">
                <div
                  className="bg-main h-full rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="text-medium14 w-[46px] text-right text-gray-500">
                <span className="text-main text-medium16 mr-[2px]">
                  {collected}
                </span>
                /{total}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[20px] pb-[85px]">
        <div className="text-semi16 mt-[20px]">
          ‘{defaultRegion ?? ''}’ 관련 미션
        </div>

        {missionsLoading || loading ? (
          <div className="px-4 py-6 text-sm text-gray-500">불러오는 중…</div>
        ) : missionData && missionData.missions.length > 0 ? (
          <div className="mt-[10px] flex flex-col gap-[10px]">
            {missionData.missions.map((m) => (
              <MissionItem
                key={m.missionId}
                title={m.missionTitle}
                desc={m.missionDescription}
                onClick={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-sm text-gray-400">
            등록된 미션이 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

function MissionItem({
  title,
  desc,
  onClick,
}: {
  title: string
  desc: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group border-gray-20 flex w-full items-stretch overflow-hidden border bg-white"
    >
      <div className="bg-main w-[8px]" aria-hidden />
      <div className="flex-1 p-[15px] pr-[12px] text-left">
        <div className="text-semi16">{title}</div>
        <div className="text-medium12 text-gray-60 mt-1">{desc}</div>
      </div>
      <div className="flex items-center pr-[23px] text-[30px]">›</div>
    </button>
  )
}
