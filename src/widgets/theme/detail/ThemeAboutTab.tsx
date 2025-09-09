import type { ThemeDetail } from '@/features/theme/model'
import { Icon } from '@/shared/icons'

export default function ThemeAboutTab({ theme }: { theme: ThemeDetail }) {
  return (
    <section className="space-y-4 px-[20px] py-3">
      {theme.sections.map((s, idx) => (
        <article key={s.id}>
          {idx === 0 && (
            <div className="mb-[17px] flex items-center gap-[10px] rounded-[10px] p-[14px] shadow-lg">
              <img
                src={
                  s.authorAvatar ??
                  'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=160'
                }
                alt={s.authorName}
                className="h-[44px] w-[44px] rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-medium14 leading-tight">{s.authorName}</p>
                <p className="text-medium12 text-gray-80">{s.date}</p>
              </div>
            </div>
          )}

          {s.imageUrl && (
            <div className="mb-[10px] overflow-hidden rounded-[20px]">
              <img
                src={s.imageUrl}
                alt={s.placeName}
                className="h-[200px] w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="border-gray-20 mb-[20px] flex items-center justify-between rounded-full border bg-white px-[20px] py-[8px]">
            <span className="text-medium14">{s.placeName}</span>
            <span className="text-medium12 text-gray-80 flex items-center gap-1">
              <Icon name="pin-solid" size={12} className="text-gray-80" />
              {s.address}
            </span>
          </div>

          <p className="text-medium14 whitespace-pre-line text-[#6E6E6E]">
            {s.content}
          </p>
        </article>
      ))}

      {theme.sections.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          등록된 설명이 없습니다.
        </div>
      )}
    </section>
  )
}
