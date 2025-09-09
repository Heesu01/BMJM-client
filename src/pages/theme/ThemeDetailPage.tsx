import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<ThemeDetail | null>(null)
  const [comments, setComments] = useState<ThemeComment[]>([])
  const [reviews, setReviews] = useState<ThemeReview[]>([])
  const [tab, setTab] = useState<'about' | 'review'>('about')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setErr(null)
    ;(async () => {
      try {
        const t = await fetchThemeById(id)
        if (!alive) return
        setTheme(t)

        const [r, c] = await Promise.all([
          fetchThemeReviews(id),
          fetchThemeComments(id),
        ])
        if (!alive) return
        setReviews(r)
        setComments(c)
      } catch (e) {
        if (!alive) return
        setErr('로드 중 오류가 발생했어요.')
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  if (err) return <div className="p-4 text-red-500">{err}</div>
  if (!theme) return <div className="p-4">로딩중…</div>

  return (
    <div className="min-h-dvh bg-white">
      <CommonHeader title="상세 테마" />
      <ThemeHeader theme={theme} onBack={() => navigate(-1)} />
      <DetailTabNav value={tab} onChange={setTab} className="mb-[8px]" />

      <div>
        {tab === 'about' ? (
          <>
            <ThemeAboutTab theme={theme} />
            <ThemeComments comments={comments} />
          </>
        ) : (
          <ThemeReviewTab reviews={reviews} />
        )}
      </div>
    </div>
  )
}
