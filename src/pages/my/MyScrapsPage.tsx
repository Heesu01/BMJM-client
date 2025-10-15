import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiLock } from 'react-icons/fi'
import { CommonHeader } from '@/shared/CommonHeader'
import { BottomTabBar } from '@/shared/BottomTabBar'
import { useIsLoggedIn } from '@/shared/hooks/useIsLoggedIn'
import { api } from '@/shared/api/client'

type ThemeSummary = {
  themeId: string
  title: string
  introduction: string
  mainImageUrls: string[]
  createdAt: string
  viewCount: number
}

async function fetchMyScraps(): Promise<ThemeSummary[]> {
  const { data } = await api.get<{ data?: { themeList?: ThemeSummary[] } }>(
    '/users/scrap',
  )
  return data?.data?.themeList ?? []
}

function ScrapCard({
  item,
  onClick,
}: {
  item: ThemeSummary
  onClick?: () => void
}) {
  const cover = item.mainImageUrls?.[0]
  return (
    <button
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
        {cover ? (
          <img
            src={cover}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm text-gray-400">
            이미지 없음
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-[15px] font-semibold">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-gray-600">
          {item.introduction}
        </p>
        <div className="mt-3 flex items-center justify-between text-[12px] text-gray-500">
          <span>{item.createdAt}</span>
          <span className="inline-flex items-center gap-1">
            <FiEye /> {item.viewCount}
          </span>
        </div>
      </div>
    </button>
  )
}

function LoginPromptInline() {
  const navigate = useNavigate()
  return (
    <div className="px-5 py-20 text-center">
      <div className="bg-main/10 text-main mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl">
        <FiLock />
      </div>
      <p className="text-[15px] font-semibold">로그인이 필요해요</p>
      <p className="mt-1 text-[13px] text-gray-500">
        스크랩 모음은 로그인 후 이용 가능
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

export default function MyScrapsPage() {
  const navigate = useNavigate()
  const isLoggedIn = useIsLoggedIn()

  const [items, setItems] = useState<ThemeSummary[]>([])
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
        const list = await fetchMyScraps()
        if (!alive) return
        setItems(list)
      } catch (e: unknown) {
        if (!alive) return
        const message =
          e instanceof Error ? e.message : '스크랩 목록을 불러오지 못했어요.'
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
      <CommonHeader title="스크랩 모음" showBack onBack={() => navigate(-1)} />

      <div className="mx-auto min-h-[100dvh] w-full max-w-[480px] pb-20">
        {!isLoggedIn ? (
          <LoginPromptInline />
        ) : (
          <>
            {loading && (
              <div className="animate-pulse space-y-4 px-5 pt-6">
                <div className="h-6 w-32 rounded bg-gray-200" />
                <div className="grid grid-cols-1 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-48 rounded-2xl bg-gray-200" />
                  ))}
                </div>
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
                  스크랩한 테마가 없어요
                </p>
                <p className="mt-1 text-[13px] text-gray-500">
                  관심가는 테마에서 북마크 아이콘을 눌러 스크랩하자
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-main mt-5 h-[44px] rounded-xl px-4 text-[13px] font-medium text-white"
                >
                  테마 구경하러 가기
                </button>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="grid grid-cols-1 gap-4 px-5 pt-6">
                {items.map((it) => (
                  <ScrapCard
                    key={it.themeId + it.createdAt}
                    item={it}
                    onClick={() => navigate(`/theme/${it.themeId}`)}
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
