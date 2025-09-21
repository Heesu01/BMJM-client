import { useEffect, useMemo, useState } from 'react'
import { api, type ApiError } from '@/shared/api/client'

export type PuzzleProgressDto = {
  puzzleId: string
  puzzleRegion: string
  totalMissionCount: number
  collectedMissionCount: number
  puzzleCompleted: boolean
}
export type PuzzleMapProgressResp = {
  statusCode: string
  message: string
  data: { puzzleMapProgressDtos: PuzzleProgressDto[] }
}

export type RegionMissionsResp = {
  statusCode: string
  message: string
  data: {
    regionName: string
    missions: {
      missionId: string
      missionTitle: string
      missionDescription: string
      isCompleted: boolean
    }[]
  }
}

export type MissionRankingItem = {
  userName: string
  profileImage: string
  successMissionCount: number
  rank: number
}
export type MissionRankingResp = {
  statusCode: string
  message: string
  data: { missionRankings: MissionRankingItem[] }
}

export function progressMapByRegion(list: PuzzleProgressDto[]) {
  const map: Record<string, PuzzleProgressDto> = {}
  list.forEach((p) => (map[p.puzzleRegion] = p))
  return map
}
export function progressMapById(list: PuzzleProgressDto[]) {
  const map: Record<string, PuzzleProgressDto> = {}
  list.forEach((p) => (map[p.puzzleId] = p))
  return map
}

export function usePuzzleMapProgress() {
  const [data, setData] = useState<PuzzleProgressDto[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get<PuzzleMapProgressResp>('/puzzles/progress')
        if (!alive) return
        setData(res.data.data.puzzleMapProgressDtos ?? [])
      } catch (e) {
        if (!alive) return
        setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const byRegion = useMemo(
    () => (data ? progressMapByRegion(data) : {}),
    [data],
  )
  const byId = useMemo(() => (data ? progressMapById(data) : {}), [data])

  const completedCount = useMemo(
    () => (data ? data.filter((d) => d.puzzleCompleted).length : 0),
    [data],
  )

  return {
    data,
    byRegion,
    byId,
    completedCount,
    loading,
    error,
  }
}

export function useRegionMissions(puzzleId?: string) {
  const [data, setData] = useState<RegionMissionsResp['data'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!puzzleId) return
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get<RegionMissionsResp>(
          `/puzzles/mission/${puzzleId}`,
        )
        if (!alive) return
        setData(res.data.data)
      } catch (e) {
        if (!alive) return
        setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [puzzleId])

  return { data, loading, error }
}

export function useMissionRankings() {
  const [data, setData] = useState<MissionRankingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get<MissionRankingResp>('/puzzles/ranking')
        if (!alive) return
        setData(res.data.data.missionRankings ?? [])
      } catch (e) {
        if (!alive) return
        setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])
  return { data, loading, error }
}

export type MissionDetailResp = {
  statusCode: string
  message: string
  data: {
    missionId: string
    missionTitle: string
    missionIntroduction: string
    missionContent: string
    missionImageUrl: string
    x?: string
    y?: string
  }
}

export function useMissionDetail(missionId?: string) {
  const [data, setData] = useState<MissionDetailResp['data'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    if (!missionId) return
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get<MissionDetailResp>(
          `/puzzles/mission/${missionId}/detail`,
        )
        if (!alive) return
        setData(res.data.data)
      } catch (e) {
        if (!alive) return
        setError(e as ApiError)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [missionId])

  return { data, loading, error }
}

export type MissionRecordItem = {
  userName: string
  userProfile: string
  createdAt: string
  imageUrls: string[]
  content: string
}
export type MissionRecordResp = {
  statusCode: string
  message: string
  data: { missionRecordList: MissionRecordItem[] }
}

export function useMissionRecords(missionId?: string) {
  const [data, setData] = useState<MissionRecordItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!missionId) return
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get<MissionRecordResp>(
          `/puzzles/mission/${missionId}/record`,
        )
        if (!alive) return
        setData(res.data.data.missionRecordList ?? [])
      } catch (e) {
        if (!alive) return
        setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [missionId])

  return { data, loading, error }
}

export type SimpleResp = {
  statusCode: string
  message: string
  data?: unknown
}

export async function verifyMissionLocation(params: {
  missionId: string
  x: number | string
  y: number | string
}) {
  const { missionId, x, y } = params
  return api.post<SimpleResp>(`/puzzles/mission/${missionId}/location`, {
    x: String(x),
    y: String(y),
  })
}

export async function createMissionRecord(params: {
  missionId: string
  score: number
  content: string
  images: File[]
}) {
  const { missionId, score, content, images } = params
  const fd = new FormData()
  fd.append('score', String(score))
  fd.append('content', content)
  images.forEach((f) => fd.append('images', f))

  return api.post<SimpleResp>(`/puzzles/mission/${missionId}/record`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export type Popularity = {
  signguNm: string
  avgCnctrRate: number
  tatsNm?: string
}

type ConcentrationResp = {
  statusCode: string
  message: string
  data: {
    areaCd?: string
    areaNm?: string
    signguCd?: string
    signguNm: string
    avgCnctrRate: number
    tatsNm?: string
  }
}

export const BUSAN_SIGNGUS = [
  '중구',
  '서구',
  '동구',
  '영도구',
  '부산진구',
  '동래구',
  '남구',
  '북구',
  '해운대구',
  '사하구',
  '금정구',
  '강서구',
  '연제구',
  '수영구',
  '사상구',
  '기장군',
] as const

export function useBusanPopularity() {
  const [data, setData] = useState<Popularity[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true

    ;(async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          BUSAN_SIGNGUS.map(async (signguNm) => {
            try {
              const res = await api.get<ConcentrationResp>(
                '/api/tour/concentration',
                {
                  params: { signguNm },
                },
              )

              const d = res.data.data
              return {
                signguNm: d.signguNm ?? signguNm,
                avgCnctrRate: Number(d.avgCnctrRate ?? 0),
                tatsNm: d.tatsNm,
              } as Popularity
            } catch (e) {
              console.warn('Popularity fetch failed for', signguNm, e)
              return { signguNm, avgCnctrRate: 0 }
            }
          }),
        )

        if (alive) setData(results)
      } catch (e: unknown) {
        if (alive) setError(e as Error)
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [])

  return { data, loading, error }
}
