import { useEffect, useMemo, useState } from 'react'
import { ThemeCard } from '@/widgets/home/ThemeCard'
import { THEME_KEYWORDS, type ThemeKeyword } from '@/features/home/model'
import { FaRegEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

type OfficialThemeAPI = {
  themeId: string
  title: string
  introduction: string
  mainImageUrls: string[]
  createdAt: string
  viewCount: number
}

type OfficialThemeListResp = {
  statusCode: string
  message: string
  data: { themeList: OfficialThemeAPI[] }
}

export type HeroTheme = {
  id: string
  title: string
  desc: string
  thumbs: string[]
}

type Props = {
  onKeywordItemClick?: (id: string) => void
  className?: string
}

const MOCK_OFFICIAL_THEMES: OfficialThemeListResp = {
  statusCode: '200 OK',
  message: 'official 테마 목록 전체 조회 완료',
  data: {
    themeList: [
      {
        themeId: '588da54d-4073-4b42-ad08-72f4342a95eb',
        title: '🐾 반려견과 함께! 더욱 즐거운 맛집 🐶',
        introduction:
          '부산에서 애견 동반 가능한 맛집에서 반려견과 행복한 추억을 만들어 보세요.',
        mainImageUrls: ['img3', 'img1', 'img2'],
        createdAt: '2025-09-03',
        viewCount: 1,
      },
      {
        themeId: 'c90a8acd-e407-40da-8070-752ceb6eb348',
        title: '🎨 지금 가장 핫한 팝업 & 전시 in 부산 ✨',
        introduction:
          '올여름, 부산 곳곳에서 열리는 특별한 팝업과 전시를 놓치지 마세요!',
        mainImageUrls: ['img9', 'img8', 'img10'],
        createdAt: '2025-09-03',
        viewCount: 0,
      },
      {
        themeId: 'e81c2a71-dd48-474e-a535-8918ef6aba1d',
        title: '🎬 영화도시 부산 촬영지 맛집 🍽',
        introduction:
          '영화 속 주인공이 된 기분으로, 부산의 명물 맛집을 즐겨보세요!',
        mainImageUrls: ['img6', 'img7', 'img5'],
        createdAt: '2025-09-03',
        viewCount: 0,
      },
    ],
  },
}

const MOCK_KEYWORD_THEMES: OfficialThemeListResp = {
  statusCode: '200 OK',
  message: 'DATE_COURSE 키워드 테마 목록 전체 조회 완료',
  data: {
    themeList: [
      {
        themeId: 'c90a8acd-e407-40da-8070-752ceb6eb348',
        title: '🎨 지금 가장 핫한 팝업 & 전시 in 부산 ✨',
        introduction:
          '올여름, 부산 곳곳에서 열리는 특별한 팝업과 전시를 놓치지 마세요!',
        mainImageUrls: ['img9', 'img8', 'img10'],
        createdAt: '2025-09-03',
        viewCount: 0,
      },
      {
        themeId: 'c90a8acd-e407-40da-8070-752ceb6eb348',
        title: '🎨 지금 가장 핫한 팝업 & 전시 in 부산 ✨',
        introduction:
          '올여름, 부산 곳곳에서 열리는 특별한 팝업과 전시를 놓치지 마세요!',
        mainImageUrls: ['img9', 'img8', 'img10'],
        createdAt: '2025-09-03',
        viewCount: 0,
      },
      {
        themeId: 'c90a8acd-e407-40da-8070-752ceb6eb348',
        title: '🎨 지금 가장 핫한 팝업 & 전시 in 부산 ✨',
        introduction:
          '올여름, 부산 곳곳에서 열리는 특별한 팝업과 전시를 놓치지 마세요!',
        mainImageUrls: ['img9', 'img8', 'img10'],
        createdAt: '2025-09-03',
        viewCount: 0,
      },
    ],
  },
}

const IMG_MAP: Record<string, string> = {
  img1: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400',
  img2: 'https://images.unsplash.com/photo-1529927066849-0f47e3cbd3b0?q=80&w=400',
  img3: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400',
  img5: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400',
  img6: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=400',
  img7: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=400',
  img8: 'https://images.unsplash.com/photo-1551276317-801d8e52d0d5?q=80&w=400',
  img9: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=400',
  img10: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=400',
}
const toUrl = (key: string) =>
  key.startsWith('http')
    ? key
    : (IMG_MAP[key] ?? `https://picsum.photos/seed/${key}/400/300`)

export default function ThemeOfficialSection({ className = '' }: Props) {
  const navigate = useNavigate()
  const [hero, setHero] = useState<HeroTheme[]>([])
  useEffect(() => {
    const { data } = MOCK_OFFICIAL_THEMES
    const mapped: HeroTheme[] = data.themeList.map((t) => ({
      id: t.themeId,
      title: t.title,
      desc: t.introduction,
      thumbs: (t.mainImageUrls ?? []).map(toUrl).filter(Boolean).slice(0, 3),
    }))
    setHero(mapped)
  }, [])

  const kwList = THEME_KEYWORDS
  const [selected, setSelected] = useState<ThemeKeyword>(kwList[0].value)
  const [keywordItems, setKeywordItems] = useState<OfficialThemeAPI[]>([])

  useEffect(() => {
    const { data } = MOCK_KEYWORD_THEMES
    setKeywordItems(data.themeList)
  }, [selected])

  const heroEmpty = useMemo(() => hero.length === 0, [hero])

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
            {heroEmpty && (
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
          {keywordItems.map((it) => (
            <button
              key={it.themeId}
              onClick={() => navigate(`/theme/${it.themeId}`)}
              className="w-full pt-[12px] text-left"
            >
              <div className="flex gap-[12px]">
                <div className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[10px] bg-gray-100">
                  {it.mainImageUrls?.[0] && (
                    <img
                      src={toUrl(it.mainImageUrls[0])}
                      alt={it.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onClick={() => navigate(`/theme/${it.themeId}`)}
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
                      <FaRegEye size={14} className="opacity-80" aria-hidden />
                      <span>{it.viewCount}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-gray-20 mt-[12px] border-t" />
            </button>
          ))}

          {keywordItems.length === 0 && (
            <div className="text-medium14 py-6 text-gray-500">
              추천 테마가 없습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
