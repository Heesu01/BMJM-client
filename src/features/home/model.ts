import { useEffect, useMemo, useState } from 'react'
import { api } from '@/shared/api/client'

export type HomeProgress = {
  nickname: string
  current: number
  total: number
  successMissions: number
  runningThemes: number
}

export type Top3Item = {
  id: string
  title: string
  address: string
  imageUrl: string
}

export function useHomeData(isLoggedIn: boolean) {
  const [progress, setProgress] = useState<HomeProgress | null>(null)
  const [top3, setTop3] = useState<Top3Item[] | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        //홈 Top3 장소 불러오기
        const { data } = await api.get<{
          statusCode: string
          message: string
          data: {
            top3Places: Array<{
              placeName: string
              address: string
              imageUrl: string
            }>
          }
        }>('/home/top3')

        if (!alive) return
        const src = data?.data?.top3Places ?? []
        const items: Top3Item[] = src.slice(0, 3).map((p) => ({
          id: encodeURIComponent(p.placeName),
          title: p.placeName,
          address: p.address,
          imageUrl: normalizeImg(p.imageUrl),
        }))
        setTop3(items)
      } catch {
        //
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true
    if (!isLoggedIn) {
      setProgress(null)
      return () => {
        alive = false
      }
    }
    ;(async () => {
      try {
        // 홈 진행상황 불러오기
        const { data } = await api.get<{
          statusCode: string
          message: string
          data: {
            userName: string
            totalMissionCount: number
            collectedPuzzleCount: number
            completedMissionCount: number
            completedThemeCount: number
          }
        }>('/home')
        if (!alive) return
        const d = data.data
        setProgress({
          nickname: d.userName,
          current: d.collectedPuzzleCount,
          total: d.totalMissionCount,
          successMissions: d.completedMissionCount,
          runningThemes: d.completedThemeCount,
        })
      } catch {
        //
      }
    })()
    return () => {
      alive = false
    }
  }, [isLoggedIn])

  return { progress, top3 }
}

export type ThemeKeyword =
  | 'LOCAL_TOUR'
  | 'FOOD_TOUR'
  | 'ALLEY_TRIP'
  | 'DATE_COURSE'
  | 'SOLO_TRIP'
  | 'FAMILY_WITH_CHILD'
  | 'NIGHT_VIEW'
  | 'CAFE_PHOTO'
  | 'MOVIE_LOCATION'
  | 'LOCAL_COURSE'

export const THEME_KEYWORDS: Array<{ value: ThemeKeyword; label: string }> = [
  { value: 'LOCAL_TOUR', label: '지역 탐방' },
  { value: 'FOOD_TOUR', label: '음식 투어' },
  { value: 'ALLEY_TRIP', label: '골목 여행' },
  { value: 'DATE_COURSE', label: '데이트 코스' },
  { value: 'SOLO_TRIP', label: '혼행 감성' },
  { value: 'FAMILY_WITH_CHILD', label: '가족/아이와' },
  { value: 'NIGHT_VIEW', label: '야경/야식' },
  { value: 'CAFE_PHOTO', label: '카페&사진' },
  { value: 'MOVIE_LOCATION', label: '영화/드라마 장소' },
  { value: 'LOCAL_COURSE', label: '현지인 코스' },
]

export type ThemeItem = {
  id: string
  title: string
  imageUrl: string
}

const normalizeImg = (raw?: string) =>
  (raw ?? '')
    .replace(/^http:\/\//i, 'https://')
    .replace(/\?SIZE=([^?&]+)\?OPT=/i, '?SIZE=$1&OPT=')

function pickOneImage(candidates?: string[] | null, fallback?: string) {
  const pool = [
    ...(Array.isArray(candidates) ? candidates : []),
    ...(fallback ? [fallback] : []),
  ]
  for (const raw of pool) {
    const url = normalizeImg(raw)
    if (url) return url
  }
  return ''
}

export async function fetchThemesByKeyword(
  keyword: ThemeKeyword,
): Promise<ThemeItem[]> {
  // 홈 키워드별 테마 불러오기
  const { data } = await api.get<{
    statusCode: string
    message: string
    data: {
      recommendThemes: Array<{
        themeId: string
        title: string
        mainImageUrls?: string[]
        mainImageUrl: string
      }>
    }
  }>('/home/theme', { params: { keyword } })

  const src = data?.data?.recommendThemes ?? []
  return src.map((t) => ({
    id: t.themeId,
    title: t.title,
    imageUrl: pickOneImage(t.mainImageUrls, t.mainImageUrl),
  }))
}

// 행사/축제
export const DISTRICTS = [
  { code: '1', name: '강서구' },
  { code: '2', name: '금정구' },
  { code: '3', name: '기장군' },
  { code: '4', name: '남구' },
  { code: '5', name: '동구' },
  { code: '6', name: '동래구' },
  { code: '7', name: '부산진구' },
  { code: '8', name: '북구' },
  { code: '9', name: '사상구' },
  { code: '10', name: '사하구' },
  { code: '11', name: '서구' },
  { code: '12', name: '수영구' },
  { code: '13', name: '연제구' },
  { code: '14', name: '영도구' },
  { code: '15', name: '중구' },
  { code: '16', name: '해운대구' },
] as const
export type District = (typeof DISTRICTS)[number]

export type FestivalItem = {
  address: string
  mapX: string
  mapY: string
  firstImage?: string
  tel?: string
  title: string
  eventStartDate: string
  eventEndDate: string
}

type FestivalResp = {
  statusCode: string
  message: string
  data: FestivalItem[]
}

export function fmtYMD(s: string) {
  return s?.length === 8
    ? `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`
    : s
}

export async function fetchFestivalList(
  code: string,
  year: number = 2025,
): Promise<FestivalItem[]> {
  const { data } = await api.get<FestivalResp>('/api/tour/festival', {
    params: { year, code },
  })
  return data.data ?? []
}

const _festivalCache = new Map<string, FestivalItem[]>()

export function useFestival(code: string | null, year: number = 2025) {
  const [data, setData] = useState<FestivalItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!code) return
    const key = `${year}:${code}`

    if (_festivalCache.has(key)) {
      setData(_festivalCache.get(key)!)
      setLoading(false)
      setError(null)
      return
    }

    const ctrl = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const list = await fetchFestivalList(code, year)
        if (ctrl.signal.aborted) return
        _festivalCache.set(key, list)
        setData(list)
      } catch (e) {
        if (!ctrl.signal.aborted) setError(e)
      } finally {
        if (!ctrl.signal.aborted) setLoading(false)
      }
    })()

    return () => ctrl.abort()
  }, [code, year])

  const sorted = useMemo(() => {
    if (!data) return null
    return [...data].sort((a, b) =>
      a.eventStartDate.localeCompare(b.eventStartDate),
    )
  }, [data])

  return { data: sorted, loading, error }
}
