import type { ThemeReview } from '@/features/theme/model'

export default function ThemeReviewTab({
  reviews,
}: {
  reviews: ThemeReview[]
}) {
  return (
    <section className="space-y-4 px-[20px] py-3">
      {reviews.map((r) => (
        <article
          key={r.id}
          className="border-gray-20 mb-[20px] border-b bg-white pb-[30px]"
        >
          <div className="flex gap-[10px]">
            <img
              src={r.userAvatar}
              alt={r.user}
              className="h-[44px] w-[44px] flex-shrink-0 rounded-full object-cover"
            />
            <div className="mb-[20px] flex flex-col">
              <p className="text-medium14">{r.user}</p>
              <p className="text-medium12 text-gray-80">{r.date}</p>
            </div>
          </div>

          {r.imageUrls && r.imageUrls.length > 0 && (
            <div className="mb-2 mb-[16px] flex gap-2 overflow-x-auto">
              {r.imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="리뷰 사진"
                  className="h-[100px] w-[100px] flex-shrink-0 rounded-[10px] object-cover"
                />
              ))}
            </div>
          )}

          <p className="text-medium16 text-gray-80 whitespace-pre-line">
            {r.content}
          </p>
        </article>
      ))}

      {reviews.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          등록된 리뷰가 없습니다.
        </div>
      )}
    </section>
  )
}
