import { Icon } from '@/shared/icons'

export type Top3Item = {
  id: string
  title: string
  address: string
  imageUrl: string
}

type Props = {
  items?: Top3Item[]
  className?: string
  onItemClick?: (id: string) => void
}

const FALLBACK_TOP3: Top3Item[] = [
  {
    id: 'f1',
    title: '부산 최고 맛집, 피리피리',
    address: '해운대구 6-2',
    imageUrl: 'https://picsum.photos/seed/top1/1200/800',
  },
  {
    id: 'f2',
    title: '부산 최고 맛집, 피리피리',
    address: '해운대구 6-2',
    imageUrl: 'https://picsum.photos/seed/top2/1200/800',
  },
  {
    id: 'f3',
    title: '부산 최고 맛집, 피리피리',
    address: '해운대구 6-2',
    imageUrl: 'https://picsum.photos/seed/top3/1200/800',
  },
]

export default function Top3List({
  items,
  className = '',
  onItemClick,
}: Props) {
  const list: Top3Item[] = (
    items && items.length ? items : FALLBACK_TOP3
  ).slice(0, 3)

  return (
    <section className={`mt-[40px] ${className}`}>
      <h2 className="text-semi16 mb-[16px] text-black">인기 맛집 TOP 3</h2>

      <div className="space-y-[10px]">
        {list.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className="group relative block h-[100px] w-full overflow-hidden rounded-[20px] text-left"
          >
            <img
              src={item.imageUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#3B3B3B]/70 to-[#A1A1A1]/0" />

            <div className="absolute inset-0 flex items-center gap-[23px] px-[20px]">
              <span className="text-[38px] leading-none font-semibold text-gray-100">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <p className="text-medium14 line-clamp-1 text-gray-100">
                  {item.title}
                </p>
                <p className="text-medium12 text-gray-20 mt-1 flex items-center gap-1">
                  <Icon name="pin-solid" size={10} className="text-gray-20" />
                  <span className="line-clamp-1">{item.address}</span>
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
