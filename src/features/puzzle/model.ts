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
