import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BusanMapSVG from './BusanMapSVG'
import {
  usePuzzleMapProgress,
  useRegionMissions,
  useBusanPopularity,
} from '@/features/puzzle/model'

function popularityToColor(p?: number) {
  if (p == null) return '#E5E7EB'
  const v = Math.max(0, Math.min(1, p / 100))
  const hue = 220 - 220 * v
  return `hsl(${hue}deg 85% 55%)`
}

export default function PuzzleMapTab() {
  const navigate = useNavigate()
  const { data, byRegion, loading, completedCount } = usePuzzleMapProgress()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [view, setView] = useState<'table' | 'chart'>('table')

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

  const {
    data: popData,
    loading: popLoading,
    error: popError,
  } = useBusanPopularity()

  const [openModal, setOpenModal] = useState(false)

  const handlePickRegion = (name: string) => {
    setSelectedRegion(name)
    setOpenModal(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setOpenModal(false)
    if (openModal) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openModal])

  return (
    <div className="relative">
      <div className="absolute left-[20px]">
        <div className="text-semi16">
          총 {completedCount}개의 퍼즐을 모았어요!
        </div>
        <div className="text-medium14 text-gray-60 mt-[2px]">
          미션을 달성하고 퍼즐을 채워보세요.
        </div>
      </div>

      <div className="absolute top-[230px] right-[20px] z-[200]">
        <button
          type="button"
          className="rounded-full bg-white/90 px-3 py-1.5 text-[13px] shadow transition hover:bg-white"
          onClick={() => setOpenModal(true)}
          aria-haspopup="dialog"
          aria-expanded={openModal}
        >
          지역 방문률
        </button>
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
                onClick={() => navigate(`/puzzle/${m.missionId}`)}
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

      {openModal && (
        <>
          <div
            className="fixed inset-0 z-[1000] bg-black/40"
            onClick={() => setOpenModal(false)}
          />
          <div
            className="fixed inset-x-0 top-1/2 z-[1001] mx-auto w-[min(680px,92vw)] -translate-y-1/2 rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="부산 인기 미니맵"
          >
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-semi16">최근 30일 평균 방문 집중률</h3>
                <button
                  type="button"
                  className="rounded-full px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                  onClick={() => setOpenModal(false)}
                >
                  닫기
                </button>
              </div>

              {popLoading ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  불러오는 중…
                </div>
              ) : popError ? (
                <div className="py-10 text-center text-sm text-red-500">
                  데이터 오류
                </div>
              ) : !popData || popData.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  데이터 없음
                </div>
              ) : (
                (() => {
                  const sorted = [...popData].sort(
                    (a, b) => b.avgCnctrRate - a.avgCnctrRate,
                  )
                  const max = Math.max(1, ...sorted.map((d) => d.avgCnctrRate))

                  return (
                    <>
                      <div className="mb-4 inline-flex rounded-full bg-gray-100 p-1 text-sm">
                        <button
                          type="button"
                          className={`rounded-full px-3 py-1.5 ${view === 'table' ? 'bg-white shadow' : 'text-gray-500'}`}
                          onClick={() => setView('table')}
                        >
                          표
                        </button>
                        <button
                          type="button"
                          className={`rounded-full px-3 py-1.5 ${view === 'chart' ? 'bg-white shadow' : 'text-gray-500'}`}
                          onClick={() => setView('chart')}
                        >
                          그래프
                        </button>
                      </div>

                      <div className="mb-3 flex items-center gap-2 text-[12px] text-gray-500">
                        <span>낮음</span>
                        <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-green-300 via-yellow-400 to-red-500" />
                        <span>높음</span>
                      </div>

                      {view === 'table' ? (
                        <div className="max-h-[50vh] overflow-auto rounded-xl border border-gray-100">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white">
                              <tr className="text-left text-gray-500">
                                <th className="w-12 px-3 py-2">#</th>
                                <th className="px-3 py-2">구·군</th>
                                <th className="w-24 px-3 py-2 text-right">
                                  집중률
                                </th>
                                <th className="px-3 py-2">미니바</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sorted.map((d, i) => (
                                <tr
                                  key={d.signguNm}
                                  className="cursor-pointer border-t border-gray-50 hover:bg-gray-50"
                                  onClick={() => handlePickRegion(d.signguNm)}
                                  title={`${d.signguNm} ${d.avgCnctrRate.toFixed(1)}%`}
                                >
                                  <td className="px-3 py-2 text-gray-500">
                                    {i + 1}
                                  </td>
                                  <td className="px-3 py-2">{d.signguNm}</td>
                                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                                    {d.avgCnctrRate.toFixed(1)}%
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="h-2 w-full rounded-full bg-gray-100">
                                      <div
                                        className="h-2 rounded-full transition-all"
                                        style={{
                                          width: `${(d.avgCnctrRate / max) * 100}%`,
                                          background: popularityToColor(
                                            d.avgCnctrRate,
                                          ),
                                        }}
                                        aria-label={`${d.signguNm} 집중률 ${d.avgCnctrRate.toFixed(1)}%`}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="max-h-[52vh] overflow-auto">
                          <ul className="space-y-2">
                            {sorted.map((d, i) => (
                              <li key={d.signguNm}>
                                <button
                                  type="button"
                                  onClick={() => handlePickRegion(d.signguNm)}
                                  className="w-full rounded-lg border border-gray-100 bg-white p-2 text-left hover:bg-gray-50"
                                  title={`${d.signguNm} ${d.avgCnctrRate.toFixed(1)}%`}
                                >
                                  <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                                    <span className="flex items-center gap-2">
                                      <span className="w-5 text-right">
                                        {i + 1}
                                      </span>
                                      <span className="font-medium text-gray-800">
                                        {d.signguNm}
                                      </span>
                                    </span>
                                    <span className="tabular-nums">
                                      {d.avgCnctrRate.toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="h-3 w-full rounded-full bg-gray-100">
                                    <div
                                      className="h-3 rounded-full transition-all"
                                      style={{
                                        width: `${(d.avgCnctrRate / max) * 100}%`,
                                        background: popularityToColor(
                                          d.avgCnctrRate,
                                        ),
                                      }}
                                      aria-label={`${d.signguNm} 집중률 ${d.avgCnctrRate.toFixed(1)}%`}
                                    />
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )
                })()
              )}
            </div>
          </div>
        </>
      )}
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
      type="button"
      onClick={onClick}
      className={`${base} ${completed ? doneStyle : todoStyle}`}
      aria-pressed={completed}
      aria-disabled={completed}
    >
      <div className={`w-[8px] ${completed ? 'bg-gray-40' : 'bg-main'}`} />
      <div className="flex-1 p-[15px] pr-[12px] text-left">
        <div
          className={`text-semi16 ${completed ? 'text-gray-500' : 'text-gray-900'}`}
        >
          {title}
        </div>
        <div
          className={`text-medium12 mt-1 ${completed ? 'text-gray-400' : 'text-gray-60'}`}
        >
          {desc}
        </div>
      </div>
      <div className="flex items-center pr-[23px] text-[22px]">
        {!completed && (
          <span className="group-hover:text-main text-gray-500">›</span>
        )}
      </div>
    </button>
  )
}
