import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CommonHeader } from '@/shared/CommonHeader'
import { ThemeCard } from '@/widgets/home/ThemeCard'
import { api } from '@/shared/api/client'

type LocationState = {
  userName?: string
  goals?: string[]
  foods?: string[]
  moods?: string[]
}

type ThemeApiResp = {
  statusCode: string
  message: string
  data: {
    themes: Array<{
      themeId: string
      title: string
      introduction: string
      mainImageUrls: string[]
    }>
  }
}

type ThemeVM = {
  id: string
  title: string
  desc: string
  thumbs: string[]
}

const normalizeImg = (raw?: string) =>
  (raw ?? '')
    .replace(/^http:\/\//i, 'https://')
    .replace(/\?SIZE=([^?&]+)\?OPT=/i, '?SIZE=$1&OPT=')

export default function ThemeResultPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { userName = '여행자' } = (state as LocationState) || {}

  const selectedKeywords = useMemo(() => {
    const s = (state as LocationState) || {}
    return [...(s.goals ?? []), ...(s.foods ?? []), ...(s.moods ?? [])]
  }, [state])

  const [themes, setThemes] = useState<ThemeVM[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let alive = true
    if (!selectedKeywords.length) {
      setThemes([])
      return
    }
    ;(async () => {
      try {
        setLoading(true)
        const { data } = await api.post<ThemeApiResp>('/home/theme', {
          selectedKeywords,
        })
        if (!alive) return
        const src = data?.data?.themes ?? []
        const mapped: ThemeVM[] = src.map((t) => ({
          id: t.themeId,
          title: t.title,
          desc: t.introduction,
          thumbs: (t.mainImageUrls ?? []).map(normalizeImg),
        }))
        setThemes(mapped)
      } catch {
        if (alive) setThemes([])
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [selectedKeywords])

  const count = themes.length

  const openTheme = (id: string) => {
    navigate(`/recommend/theme/${id}`, { state })
  }

  return (
    <div className="min-h-dvh bg-gray-100 px-[20px] pt-[75px] pb-[24px]">
      <CommonHeader title="맞춤 테마" />

      <section className="mt-[20px] mb-[20px]">
        <p className="text-medium16 text-black">
          {userName}님에게 딱맞는
          <br />
          여행 테마를
          <span className="text-main font-bold underline">{count}개</span>
          찾았어요!
        </p>
      </section>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      )}

      <section className="space-y-[12px]">
        {themes.map((t) => (
          <ThemeCard
            key={t.id}
            id={t.id}
            title={t.title}
            desc={t.desc}
            thumbs={t.thumbs}
            onClick={openTheme}
          />
        ))}
        {!loading && themes.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            추천 결과가 없습니다. 키워드를 바꿔보세요.
          </p>
        )}
      </section>
    </div>
  )
}
