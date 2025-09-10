import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaRegEye } from 'react-icons/fa'
import { ThemeCard } from '@/widgets/home/ThemeCard'
import { THEME_KEYWORDS, type ThemeKeyword } from '@/features/home/model'
import {
  fetchTodayThemes,
  fetchThemesByKeyword,
  type OfficialThemeAPI,
  type ServerKeyword,
} from '@/features/theme/model'

export type HeroTheme = {
  id: string
  title: string
  desc: string
  thumbs: string[]
}

type Props = { className?: string }

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : '알 수 없는 오류가 발생했어요.'

export default function ThemeOfficialSection({ className = '' }: Props) {
  const navigate = useNavigate()

  const [hero, setHero] = useState<HeroTheme[]>([])
  const [heroLoading, setHeroLoading] = useState(false)
  const [heroError, setHeroError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setHeroLoading(true)
    setHeroError(null)
    ;(async () => {
      try {
        const list = await fetchTodayThemes()
        const mapped: HeroTheme[] = list.map((t) => ({
          id: t.themeId,
          title: t.title,
          desc: t.introduction,
          thumbs: (t.mainImageUrls ?? []).filter(Boolean).slice(0, 3),
        }))
        if (alive) setHero(mapped)
      } catch (e: unknown) {
        if (alive) setHeroError(getErrorMessage(e))
      } finally {
        if (alive) setHeroLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const heroEmpty = useMemo(
    () => !heroLoading && hero.length === 0,
    [heroLoading, hero.length],
  )

  const kwList = THEME_KEYWORDS
  const [selected, setSelected] = useState<ThemeKeyword>(kwList[0].value)
  const [keywordItems, setKeywordItems] = useState<OfficialThemeAPI[]>([])
  const [kwLoading, setKwLoading] = useState(false)
  const [kwError, setKwError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setKwLoading(true)
    setKwError(null)
    ;(async () => {
      try {
        const list = await fetchThemesByKeyword({
          themeType: 'official',
          keyword: selected as ServerKeyword,
        })
        if (alive) setKeywordItems(list)
      } catch (e: unknown) {
        if (alive) {
          setKwError(getErrorMessage(e))
          setKeywordItems([])
        }
      } finally {
        if (alive) setKwLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [selected])

  return (
    <section className={`space-y-[30px] ${className}`}>
      <div>
        <h2 className="text-semi16 mb-[20px]">오늘의 추천 테마</h2>
        <div className="no-scrollbar -mx-[20px] overflow-x-auto px-[20px]">
          <div className="flex gap-[12px]">
            {hero.map((t) => (
              <div key={t.id} className="w-[320px] shrink-0">
                <ThemeCard
                  id={t.id}
                  title={t.title}
                  desc={t.desc}
                  thumbs={t.thumbs}
                  onClick={() => navigate(`/theme/${t.id}`)}
                />
              </div>
            ))}
            {heroLoading && (
              <div className="text-medium14 py-8 text-gray-500">
                불러오는 중…
              </div>
            )}
            {heroError && !heroLoading && (
              <div className="text-medium14 py-8 text-red-500">{heroError}</div>
            )}
            {heroEmpty && !heroError && (
              <div className="text-medium14 py-8 text-gray-500">
                추천 테마가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
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
          {kwLoading && (
            <div className="text-medium14 py-6 text-gray-500">불러오는 중…</div>
          )}
          {kwError && !kwLoading && (
            <div className="text-medium14 py-6 text-red-500">{kwError}</div>
          )}

          {!kwLoading &&
            !kwError &&
            keywordItems.map((it) => {
              const thumb = it.mainImageUrls?.[0]
              return (
                <button
                  key={it.themeId}
                  onClick={() => navigate(`/theme/${it.themeId}`)}
                  className="w-full pt-[12px] text-left"
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
                              'https://picsum.photos/seed/theme-list/400/300'
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

          {!kwLoading && !kwError && keywordItems.length === 0 && (
            <div className="text-medium14 py-6 text-gray-500">
              추천 테마가 없습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
