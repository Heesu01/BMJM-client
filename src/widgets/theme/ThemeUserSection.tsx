import { useEffect, useState } from 'react'
import { THEME_KEYWORDS, type ThemeKeyword } from '@/features/home/model'
import { FaRegEye } from 'react-icons/fa'
import { BsPencilSquare } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import {
  fetchThemesByKeyword,
  type OfficialThemeAPI as UserThemeAPI,
  type ServerKeyword,
} from '@/features/theme/model'
import { useIsLoggedIn } from '@/shared/hooks/useIsLoggedIn'

type Props = {
  className?: string
}

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : '유저 테마를 불러오지 못했어요.'

export default function ThemeUserSection({ className = '' }: Props) {
  const navigate = useNavigate()
  const isLoggedIn = useIsLoggedIn()

  const kwList = THEME_KEYWORDS
  const [selected, setSelected] = useState<ThemeKeyword>(kwList[0].value)

  const [items, setItems] = useState<UserThemeAPI[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const list = await fetchThemesByKeyword({
          themeType: 'user',
          keyword: selected as ServerKeyword,
        })
        if (!alive) return
        setItems(list)
      } catch (e: unknown) {
        if (!alive) return
        setError(getErrorMessage(e))
        setItems([])
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [selected])

  return (
    <section className={` ${className}`}>
      <h3 className="text-semi16 mb-[10px]">테마 키워드</h3>

      <div className="no-scrollbar -mx-[20px] mb-[8px] overflow-x-auto px-[20px]">
        <div className="flex gap-[10px]">
          {kwList.map(({ value, label }) => {
            const active = value === selected
            return (
              <button
                key={value}
                onClick={() => setSelected(value)}
                className={
                  (active
                    ? 'bg-main text-gray-100'
                    : 'border-sub border bg-white text-black') +
                  ' inline-flex shrink-0 cursor-pointer items-center rounded-full px-[12px] py-[4px] whitespace-nowrap'
                }
              >
                <span className="text-semi14">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        {loading && (
          <div className="text-medium14 py-6 text-gray-500">불러오는 중…</div>
        )}
        {error && !loading && (
          <div className="text-medium14 py-6 text-red-500">{error}</div>
        )}

        {!loading &&
          !error &&
          items.map((it) => {
            const thumb = it.mainImageUrls?.[0]
            return (
              <button
                key={it.themeId}
                onClick={() => navigate(`/theme/${it.themeId}`)}
                className="w-full rounded-[16px] pt-[12px] text-left"
              >
                <div className="flex gap-[12px]">
                  <div className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[10px] bg-gray-100">
                    {thumb && (
                      <img
                        src={thumb}
                        alt={it.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://picsum.photos/seed/user-theme/400/300'
                        }}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-semi14 line-clamp-1">{it.title}</p>
                    <p className="text-medium12 text-gray-60 mt-[8px] line-clamp-2">
                      {it.introduction}
                    </p>

                    <div className="text-medium10 text-gray-60 mt-[8px] flex items-center justify-between">
                      <span>{it.createdAt}</span>
                      <span className="flex items-center gap-[6px]">
                        <FaRegEye
                          size={14}
                          className="opacity-80"
                          aria-hidden
                        />
                        <span>{it.viewCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-20 mt-[12px] border-t" />
              </button>
            )
          })}

        {!loading && !error && items.length === 0 && (
          <div className="text-medium14 py-6 text-center text-gray-500">
            {isLoggedIn
              ? '아직 등록된 테마가 없어요. 나만의 테마를 직접 만들어보세요!'
              : '아직 등록된 테마가 없어요. 로그인 후 참여해보세요!'}
          </div>
        )}
      </div>

      {isLoggedIn && (
        <button
          onClick={() => navigate('/theme/create')}
          aria-label="유저 테마 작성"
          className="text-main fixed right-[20px] bottom-[107px] grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg"
        >
          <BsPencilSquare />
        </button>
      )}
    </section>
  )
}
