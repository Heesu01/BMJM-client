import { IoStar } from 'react-icons/io5'
import type { Review } from '@/entities/map'

type Props = { reviews?: Review[] }

export default function ReviewTab({ reviews = [] }: Props) {
  return (
    <section className="mt-[30px] space-y-[30px]">
      {reviews.map((r) => (
        <article key={r.id} className="border-gray-20 border-b pb-[30px]">
          <div className="mb-[20px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {r.userAvatar ? (
                <img
                  src={r.userAvatar}
                  alt={`${r.user} avatar`}
                  className="h-[44px] w-[44px] rounded-full object-cover"
                />
              ) : (
                <div className="grid h-[44px] w-[44px] place-items-center rounded-full bg-gray-200 text-sm">
                  {r.user[0]?.toUpperCase()}
                </div>
              )}

              <div>
                <div className="text-medium14">{r.user}</div>
                <div className="text-medium12 text-gray-60">{r.date}</div>
              </div>
            </div>
            <div className="text-regular14 flex items-center gap-1">
              <IoStar size={15} className="text-main" />
              <span className="align-middle text-black">{r.rating}</span>
            </div>
          </div>

          {!!r.photos?.length && (
            <div className="no-scrollbar flex gap-[10px] overflow-x-auto">
              {r.photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`review-${r.id}-${i}`}
                  className="h-[99px] w-[99px] flex-none rounded-[10px] object-cover"
                />
              ))}
            </div>
          )}

          <p className="text-medium16 text-gray-60 mt-[16px] leading-relaxed whitespace-pre-wrap">
            {r.text}
          </p>
        </article>
      ))}
    </section>
  )
}
