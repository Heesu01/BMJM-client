import { useEffect, useState } from 'react'
import { THEME_KEYWORDS, type ThemeKeyword } from '@/features/home/model'
import { FaRegEye } from 'react-icons/fa'
import { BsPencilSquare } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

type UserThemeAPI = {
  themeId: string
  title: string
  introduction: string
  mainImageUrls: string[]
  createdAt: string
  viewCount: number
}
type UserThemeListResp = {
  statusCode: string
  message: string
  data: { themeList: UserThemeAPI[] }
}

type Props = {
  className?: string
}

const MOCK_USER_THEMES: Record<string, UserThemeListResp> = {
  POPULAR: {
    statusCode: '200 OK',
    message: 'POPULAR 유저 테마 목록 조회 완료',
    data: {
      themeList: [
        {
          themeId: 'u-1',
          title: '전통 시장 맛집 투어',
          introduction:
            "부산을 배경으로 한 영화 '국제시장'의 명소를 둘러보세요",
          mainImageUrls: [
            'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=400',
          ],
          createdAt: '2025-07-06',
          viewCount: 126,
        },
        {
          themeId: 'u-2',
          title: '부산 골목 디저트 탐방',
          introduction: '골목 사이사이 숨어있는 디저트 맛집을 찾아가는 코스',
          mainImageUrls: [
            'https://images.unsplash.com/photo-1514511547117-f9a83778f03b?q=80&w=400',
          ],
          createdAt: '2025-07-06',
          viewCount: 98,
        },
      ],
    },
  },
}

export default function ThemeUserSection({ className = '' }: Props) {
  const navigate = useNavigate()
  const kwList = THEME_KEYWORDS
  const [selected, setSelected] = useState<ThemeKeyword>(kwList[0].value)
  const [items, setItems] = useState<UserThemeAPI[]>([])

  useEffect(() => {
    const key = typeof selected === 'string' ? selected : 'POPULAR'
    const resp = MOCK_USER_THEMES[key] ?? MOCK_USER_THEMES.POPULAR
    setItems(resp.data.themeList)
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
        {items.map((it) => (
          <button
            key={it.themeId}
            onClick={() => navigate(`/theme/${it.themeId}`)}
            className="w-full rounded-[16px] pt-[12px] text-left"
          >
            <div className="flex gap-[12px]">
              <div className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[10px] bg-gray-100">
                {it.mainImageUrls?.[0] && (
                  <img
                    src={it.mainImageUrls[0]}
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
                    <FaRegEye size={14} className="opacity-80" aria-hidden />

                    <span>{it.viewCount}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="text-gray-20 mt-[12px] border-t" />
          </button>
        ))}

        {items.length === 0 && (
          <div className="text-medium14 py-6 text-gray-500">
            유저 테마가 없습니다.
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/theme/create')}
        aria-label="유저 테마 작성"
        className="text-main fixed right-[20px] bottom-[107px] grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg"
      >
        <BsPencilSquare />
      </button>
    </section>
  )
}
