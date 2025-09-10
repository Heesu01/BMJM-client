import { useEffect, useState } from 'react'
import {
  THEME_KEYWORDS,
  type ThemeKeyword,
  type ThemeItem,
  fetchThemesByKeyword,
} from '@/features/home/model'
import { useNavigate } from 'react-router-dom'

type Props = {
  initialKeyword?: ThemeKeyword
  className?: string
  onKeywordChange?: (kw: ThemeKeyword) => void
}

export default function RecommendedByKeyword({
  initialKeyword,
  className = '',
  onKeywordChange,
}: Props) {
  const kwList = THEME_KEYWORDS
  const initial =
    kwList.find((k) => k.value === initialKeyword)?.value ?? kwList[0].value

  const [selected, setSelected] = useState<ThemeKeyword>(initial)
  const [items, setItems] = useState<ThemeItem[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetchThemesByKeyword(selected)
        if (alive) setItems(res)
      } catch {
        if (alive) setItems([])
      }
    })()
    return () => {
      alive = false
    }
  }, [selected])

  const handleSelect = (kw: ThemeKeyword) => {
    setSelected(kw)
    onKeywordChange?.(kw)
  }

  return (
    <section className={`mt-[30px] space-y-3 ${className}`}>
      <h2 className="text-semi16 text-black">오늘의 추천 테마</h2>

      <div className="no-scrollbar -mx-[20px] overflow-x-auto px-[20px]">
        <div className="flex gap-[10px]">
          {kwList.map(({ value, label }) => {
            const active = value === selected
            return (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                className={
                  (active
                    ? 'bg-main text-gray-100'
                    : 'border-sub border bg-white text-black') +
                  ' inline-flex shrink-0 cursor-pointer items-center rounded-full px-[12px] py-[8px] whitespace-nowrap'
                }
              >
                <span className="text-semi14">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="no-scrollbar -mx-[20px] overflow-x-auto px-[20px]">
        <div className="flex snap-x snap-mandatory gap-[10px]">
          {items.map((item) => (
            <article
              key={item.id}
              onClick={() => navigate(`/theme/${item.id}`)}
              className="relative w-[140px] shrink-0 snap-start overflow-hidden rounded-[20px] bg-black/5"
            >
              <div className="pointer relative h-[157px] w-full cursor-pointer">
                <img
                  src={item.imageUrl.trim()}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://picsum.photos/seed/theme-fallback/400/300'
                  }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-[12px] text-gray-100">
                <p className="text-medium14 line-clamp-1">{item.title}</p>
                {/* <p className="text-medium12 mt-1 flex items-center gap-[4px] opacity-90">
                  <Icon name="pin-solid" size={11} className="text-gray-100" />
                  <span className="line-clamp-1">{address}</span>
                </p> */}
              </div>
            </article>
          ))}
          {items.length === 0 && (
            <div className="text-medium14 py-8 text-gray-500">
              추천 테마가 없습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
