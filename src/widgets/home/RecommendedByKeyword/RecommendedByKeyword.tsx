import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@/shared/icons'

export type PlaceItem = {
  id: string
  title: string
  address: string
  imageUrl: string
}

type Props = {
  keywords?: string[]
  itemsByKeyword?: Record<string, PlaceItem[]>
  initialKeyword?: string
  className?: string
  onKeywordChange?: (kw: string) => void
}

const DEFAULT_KEYWORDS = [
  '전통시장',
  '둘레길',
  '해운대',
  '국밥투어',
  '카페거리',
]
const DEFAULT_ITEMS_BY_KEYWORD: Record<string, PlaceItem[]> = {
  전통시장: [
    {
      id: '1',
      title: '전통시장 국수',
      address: '사하구 61-2',
      imageUrl: 'https://picsum.photos/seed/market1/400/300',
    },
    {
      id: '2',
      title: '은이네 해장국',
      address: '사하구 61-2',
      imageUrl: 'https://picsum.photos/seed/market2/400/300',
    },
  ],
  둘레길: [
    {
      id: '3',
      title: '갈맷길 1코스',
      address: '영도구',
      imageUrl: 'https://picsum.photos/seed/trail1/400/300',
    },
  ],
  해운대: [
    {
      id: '4',
      title: '해운대 초밥집',
      address: '해운대구',
      imageUrl: 'https://picsum.photos/seed/haeundae1/400/300',
    },
  ],
  국밥투어: [
    {
      id: '5',
      title: '돼지국밥 성지',
      address: '부산진구',
      imageUrl: 'https://picsum.photos/seed/gukbap1/400/300',
    },
  ],
  카페거리: [
    {
      id: '6',
      title: '오션뷰 카페',
      address: '수영구 광안리',
      imageUrl: 'https://picsum.photos/seed/cafe1/400/300',
    },
  ],
}

export default function RecommendedByKeyword({
  keywords,
  itemsByKeyword,
  initialKeyword,
  className = '',
  onKeywordChange,
}: Props) {
  const kwList = keywords && keywords.length ? keywords : DEFAULT_KEYWORDS
  const dataMap = itemsByKeyword ?? DEFAULT_ITEMS_BY_KEYWORD

  const initial =
    initialKeyword && kwList.includes(initialKeyword)
      ? initialKeyword
      : kwList[0]
  const [selected, setSelected] = useState(initial)
  useEffect(() => {
    if (!kwList.includes(selected)) setSelected(kwList[0])
  }, [kwList, selected])

  const items = useMemo(() => dataMap[selected] ?? [], [dataMap, selected])

  const handleSelect = (kw: string) => {
    setSelected(kw)
    onKeywordChange?.(kw)
  }

  return (
    <section className={`mt-[30px] space-y-3 ${className}`}>
      <h2 className="text-semi16 text-black">오늘의 추천 키워드</h2>

      <div className="no-scrollbar -mx-[20px] overflow-x-auto px-[20px]">
        <div className="flex gap-[10px]">
          {kwList.map((kw) => {
            const active = kw === selected
            return (
              <button
                key={kw}
                onClick={() => handleSelect(kw)}
                className={
                  (active
                    ? 'bg-main text-gray-100'
                    : 'border-sub border bg-white text-black') +
                  ' inline-flex shrink-0 cursor-pointer items-center rounded-full px-[12px] py-[8px] whitespace-nowrap'
                }
              >
                <span className="text-semi14">{kw}</span>
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
              className="relative w-[140px] shrink-0 snap-start overflow-hidden rounded-[20px] bg-black/5"
            >
              <div className="pointer relative h-[157px] w-full cursor-pointer">
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-[12px] text-gray-100">
                <p className="text-medium14 line-clamp-1">{item.title}</p>
                <p className="text-medium12 mt-1 flex items-center gap-[4px] opacity-90">
                  <Icon name="pin-solid" size={11} className="text-gray-100" />
                  <span className="line-clamp-1">{item.address}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
