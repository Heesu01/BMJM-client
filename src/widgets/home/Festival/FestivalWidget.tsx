import { useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { DISTRICTS, useFestival, fmtYMD } from '@/features/home/model'

type Props = { className?: string }

const POPULAR_ORDER = [
  '16',
  '12',
  '7',
  '15',
  '14',
  '6',
  '10',
  '8',
  '11',
  '9',
  '2',
  '3',
  '1',
  '13',
  '5',
  '4',
] as const
const RANK: Record<string, number> = POPULAR_ORDER.reduce(
  (acc, code, idx) => ((acc[code] = idx), acc),
  {} as Record<string, number>,
)

export default function FestivalWidget({ className = '' }: Props) {
  // const navigate = useNavigate()
  const [selected, setSelected] = useState<string>('16')

  const kwList = useMemo(() => {
    return [...DISTRICTS]
      .sort((a, b) => (RANK[a.code] ?? 999) - (RANK[b.code] ?? 999))
      .map((d) => ({ value: d.code, label: d.name }))
  }, [])

  const { data: items, loading, error } = useFestival(selected, 2025)

  return (
    <section className={`mt-[30px] space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-semi16 text-black">행사·축제</h2>
      </div>

      <div className="no-scrollbar -mx-[20px] overflow-x-auto px-[20px]">
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
        <div className="flex h-[210px] snap-x snap-mandatory items-stretch gap-[10px]">
          {!loading &&
            !error &&
            (items?.length ?? 0) > 0 &&
            items!.map((f, idx) => (
              <article
                key={`${f.title}-${f.eventStartDate}-${idx}`}
                // onClick={() => navigate('/festival')}
                className="relative h-full w-[220px] shrink-0 snap-start overflow-hidden rounded-[20px] bg-white"
              >
                <div className="relative h-[128px] w-full cursor-pointer">
                  <img
                    src={
                      f.firstImage ||
                      'https://picsum.photos/seed/festival-fallback/400/300'
                    }
                    alt={f.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://picsum.photos/seed/festival-fallback/400/300'
                    }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-[87px] px-[10px] text-gray-100">
                  <p className="text-medium14 line-clamp-1">{f.title}</p>
                </div>

                <div className="p-[12px]">
                  <p className="text-medium12 mt-1 flex items-center gap-[6px] text-gray-600">
                    <FiCalendar size={14} className="text-gray-500" />
                    <span>
                      {fmtYMD(f.eventStartDate)} ~ {fmtYMD(f.eventEndDate)}
                    </span>
                  </p>
                  {f.address && (
                    <p className="text-medium12 mt-1 flex items-center gap-[6px] text-gray-600">
                      <FiMapPin size={14} className="text-gray-500" />
                      <span className="line-clamp-1">{f.address}</span>
                    </p>
                  )}
                </div>
              </article>
            ))}

          {!loading && !error && (items?.length ?? 0) === 0 && (
            <div className="text-medium14 flex h-full items-center py-8 text-gray-500">
              행사/축제가 없어요.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
