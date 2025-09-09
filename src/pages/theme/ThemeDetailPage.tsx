import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CommonHeader } from '@/shared/CommonHeader'
import ThemeHeader from '@/widgets/theme/detail/ThemeHeader'
import DetailTabNav from '@/widgets/theme/detail/DetailTabNav'
import ThemeAboutTab from '@/widgets/theme/detail/ThemeAboutTab'
import ThemeComments from '@/widgets/theme/detail/ThemeComments'
import ThemeReviewTab from '@/widgets/theme/detail/ThemeReviewTab'
import {
  fetchThemeById,
  fetchThemeReviews,
  fetchThemeComments,
  type ThemeComment,
  type ThemeDetail,
  type ThemeReview,
} from '@/features/theme/model'

export default function ThemeDetailPage() {
  const params = useParams()
  const id = params.id ?? params.themeId ?? ''

  const [theme, setTheme] = useState<ThemeDetail | null>(null)
  const [comments, setComments] = useState<ThemeComment[]>([])
  const [reviews, setReviews] = useState<ThemeReview[]>([])
  const [tab, setTab] = useState<'about' | 'review'>('about')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setErr('테마 ID가 없습니다.')
      return
    }

    let alive = true
    setErr(null)

    setTheme(null)
    setComments([])
    setReviews([])

    const pTheme = fetchThemeById(id)
    const pComments = fetchThemeComments(id)
    const pReviews = fetchThemeReviews(id)

    pTheme
      .then((t) => {
        if (!alive) return
        setTheme(t)
      })
      .catch(() => {
        if (!alive) return
        setErr('로드 중 오류가 발생했어요.')
      })

    pComments
      .then((c) => {
        if (!alive) return
        setComments(c)
      })
      .catch((e) => {
        console.error(e)
      })

    pReviews
      .then((r) => {
        if (!alive) return
        setReviews(r)
      })
      .catch((e) => {
        console.error(e)
      })

    return () => {
      alive = false
    }
  }, [id])

  if (err) return <div className="p-4 text-red-500">{err}</div>
  if (!theme) return <div className="p-4">로딩중…</div>

  return (
    <div className="min-h-dvh bg-white">
      <CommonHeader title="상세 테마" />
      <ThemeHeader theme={theme} />
      <DetailTabNav value={tab} onChange={setTab} className="mb-[8px]" />

      <div>
        {tab === 'about' ? (
          <>
            <ThemeAboutTab theme={theme} />
            <ThemeComments
              themeId={id}
              comments={comments}
              onChange={setComments}
            />
          </>
        ) : (
          <ThemeReviewTab reviews={reviews} />
        )}
      </div>
    </div>
  )
}
