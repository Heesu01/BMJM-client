import { useEffect, useState } from 'react'
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
