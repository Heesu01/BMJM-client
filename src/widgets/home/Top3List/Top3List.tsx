import { Icon } from '@/shared/icons'
import type { Top3Item } from '@/features/home/model'

type Props = {
  items?: Top3Item[] | null
  className?: string
  onItemClick?: (id: string) => void
}

const norm = (raw?: string) => {
  if (!raw) return ''
  try {
    if (raw.includes('thumb2.tripinfo.co.kr/thumb.php')) {
      const u = new URL(raw)
      const inner = u.searchParams.get('url')
      if (inner) raw = inner
    }
  } catch {
    //
  }
  return raw
    .replace(/^http:\/\//i, 'https://')
    .replace(/\?SIZE=([^?&]+)\?OPT=/i, '?SIZE=$1&OPT=')
}

export default function Top3List({
  items,
  className = '',
  onItemClick,
}: Props) {
  if (!items || items.length === 0) return null

  const list = items.slice(0, 3)

  return (
    <section className={`mt-[40px] ${className}`}>
      <h2 className="text-semi16 mb-[16px] text-black">인기 맛집 TOP 3</h2>

      <div className="space-y-[10px]">
        {list.map((item, idx) => (
          <button
            key={item.id || `${idx}-${item.title}`}
            onClick={() => item.id && onItemClick?.(item.id)}
            className="group relative block h-[100px] w-full overflow-hidden rounded-[20px] text-left"
            aria-label={item.title}
          >
            <img
              src={norm(item.imageUrl)}
              alt={item.title || '인기 맛집 이미지'}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                e.currentTarget.src =
                  'https://picsum.photos/seed/top-fallback/1200/800'
              }}
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
