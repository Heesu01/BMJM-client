import { useState, useMemo } from 'react'
import BusanMapSVG from './BusanMapSVG'
import {
  usePuzzleMapProgress,
  useRegionMissions,
} from '@/features/puzzle/model'
import { useNavigate } from 'react-router-dom'

export default function PuzzleMapTab() {
  const navigate = useNavigate()
  const { data, byRegion, loading, completedCount } = usePuzzleMapProgress()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const defaultRegion = useMemo(() => {
    if (selectedRegion) return selectedRegion
    const firstIncomplete = data?.find((d) => !d.puzzleCompleted)?.puzzleRegion
    return firstIncomplete ?? data?.[0]?.puzzleRegion ?? null
  }, [selectedRegion, data])

  const current = defaultRegion ? byRegion[defaultRegion] : undefined
  const { data: missionData, loading: missionsLoading } = useRegionMissions(
    current?.puzzleId,
  )

  const collected = current?.collectedMissionCount ?? 0
  const total = current?.totalMissionCount ?? 0
  const percent = total > 0 ? Math.round((collected / total) * 100) : 0

  return (
    <div>
      <div className="absolute left-[20px]">
        <div className="text-semi16">
          총 {completedCount}개의 퍼즐을 모았어요!
        </div>
        <div className="text-medium14 text-gray-60 mt-[2px]">
          미션을 달성하고 퍼즐을 채워보세요.
        </div>
      </div>

      <div className="m-auto flex w-full items-center justify-center">
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
                onClick={() => navigate(`/missions/${m.missionId}`)}
                completed={m.isCompleted}
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
  completed = false,
  onClick,
}: {
  title: string
  desc: string
  completed?: boolean
  onClick?: () => void
}) {
  const base =
    'group flex w-full items-stretch overflow-hidden border transition-colors'
  const doneStyle =
    'border-gray-200 bg-gray-50 cursor-default pointer-events-none'
  const todoStyle =
    'border-gray-200 bg-white hover:border-main/40 hover:bg-main/3'

  return (
    <button
      onClick={completed ? undefined : onClick}
      className={`${base} ${completed ? doneStyle : todoStyle}`}
      aria-pressed={completed}
      aria-disabled={completed}
    >
      <div
        className={`w-[8px] ${completed ? 'bg-emerald-400/80' : 'bg-main'}`}
        aria-hidden
      />

      <div className="flex-1 p-[15px] pr-[12px] text-left">
        <div
          className={`text-semi16 flex ${
            completed ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}
        >
          {title}
          {completed ? (
            <span className="ml-[5px] inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              완료
            </span>
          ) : (
            <span className="ml-[5px] inline-flex items-center gap-1 rounded-full bg-blue-500/5 px-2 py-0.5 text-[11px] text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              진행 가능
            </span>
          )}
        </div>
        <div
          className={`text-medium12 mt-1 ${
            completed ? 'text-gray-400' : 'text-gray-60'
          }`}
        >
          {desc}
        </div>
      </div>

      <div className="flex items-center pr-[23px] text-[22px]">
        {completed ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-emerald-600"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="group-hover:text-main text-gray-500">›</span>
        )}
      </div>
    </button>
  )
}
