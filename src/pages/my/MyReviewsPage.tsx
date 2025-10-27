import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CommonHeader } from '@/shared/CommonHeader'
import { BottomTabBar } from '@/shared/BottomTabBar'
import { useIsLoggedIn } from '@/shared/hooks/useIsLoggedIn'
import { api } from '@/shared/api/client'

type ReviewItem = {
  themeReviewId: string
  content: string
  writer: string
  writerProfile: string
  createdAt: string
  imageUrls: string[]
}

async function fetchMyReviews(): Promise<ReviewItem[]> {
  const { data } = await api.get<{ data?: { reviewList?: ReviewItem[] } }>(
    '/users/reviews',
  )
  return data?.data?.reviewList ?? []
}

function ReviewCard({ item }: { item: ReviewItem }) {
  const { writer, writerProfile, content, createdAt, imageUrls } = item
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center gap-3 p-4">
        <img
          src={writerProfile}
          alt={`${writer} 프로필`}
          className="h-10 w-10 rounded-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.visibility = 'hidden'
          }}
        />
        <div>
          <p className="text-[14px] leading-tight font-semibold">{writer}</p>
          <p className="text-[12px] leading-tight text-gray-500">{createdAt}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-gray-800">
          {content}
        </p>

        {imageUrls?.length > 0 && (
          <div
            className={
              imageUrls.length === 1
                ? 'mt-3 overflow-hidden rounded-xl'
                : 'mt-3 grid grid-cols-3 gap-2'
            }
          >
            {imageUrls.map((src, idx) => (
              <div
                key={src + idx}
                className={
                  imageUrls.length === 1
                    ? 'aspect-[16/9] w-full overflow-hidden bg-gray-100'
                    : 'aspect-square w-full overflow-hidden rounded-lg bg-gray-100'
                }
              >
                <img
                  src={src}
                  alt={`review image ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LoginPromptInline() {
  const navigate = useNavigate()
  return (
    <div className="px-5 py-20 text-center">
      <div className="bg-main/10 text-main mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl"></div>
      <p className="text-[15px] font-semibold">로그인이 필요해요</p>
      <p className="mt-1 text-[13px] text-gray-500">
        내가 쓴 후기는 로그인 후 이용 가능
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => navigate('/login')}
          className="bg-main h-[42px] rounded-xl px-4 text-[13px] font-medium text-white active:scale-[0.98]"
        >
          로그인하러 가기
        </button>
        <button
          onClick={() => navigate('/')}
          className="h-[42px] rounded-xl border border-gray-300 px-4 text-[13px] font-medium text-gray-700 active:scale-[0.98]"
        >
          홈으로
        </button>
      </div>
    </div>
  )
}

export default function MyReviewsPage() {
  const navigate = useNavigate()
  const isLoggedIn = useIsLoggedIn()

  const [items, setItems] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return
    let alive = true

    ;(async () => {
      try {
        setLoading(true)
        const list = await fetchMyReviews()
        if (!alive) return
        setItems(list)
      } catch (e: unknown) {
        if (!alive) return
        let message = '후기 목록을 불러오지 못했어요.'
        if (e instanceof Error) {
          message = e.message
        } else if (
          typeof e === 'object' &&
          e !== null &&
          'message' in e &&
          typeof (e as { message?: unknown }).message === 'string'
        ) {
          message = String((e as { message?: unknown }).message)
        }
        setError(message)
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [isLoggedIn])

  return (
    <div className="min-h-dvh bg-gray-100 pt-[75px]">
      <CommonHeader title="내가 쓴 후기" showBack onBack={() => navigate(-1)} />
      <div className="mx-auto min-h-[100dvh] w-full max-w-[480px] pb-20">
        {!isLoggedIn ? (
          <LoginPromptInline />
        ) : (
          <>
            {loading && (
              <div className="animate-pulse space-y-4 px-5 pt-6">
                <div className="h-6 w-40 rounded bg-gray-200" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-44 rounded-2xl bg-gray-200" />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="px-5 pt-10 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="px-5 py-16 text-center">
                <p className="text-[15px] font-semibold">
                  작성한 후기가 없어요
                </p>
                <p className="mt-1 text-[13px] text-gray-500">
                  테마에서 방문 인증·리뷰를 남겨보세요
                </p>
                <button
                  onClick={() => navigate('/theme')}
                  className="bg-main mt-5 h-[44px] rounded-xl px-4 text-[13px] font-medium text-white"
                >
                  테마 보러 가기
                </button>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="space-y-4 px-5 pt-6">
                {items.map((it, idx) => (
                  <ReviewCard
                    key={it.themeReviewId + it.createdAt + idx}
                    item={it}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <BottomTabBar />
    </div>
  )
}
