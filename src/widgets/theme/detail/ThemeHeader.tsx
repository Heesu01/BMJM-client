import { FaRegEye } from 'react-icons/fa'
import { GoBookmark, GoBookmarkFill } from 'react-icons/go'
import type { ThemeDetail } from '@/features/theme/model'
import { useState } from 'react'

type Props = { theme: ThemeDetail; onBack?: () => void }

export default function ThemeHeader({ theme }: Props) {
  const [scrap, setScrap] = useState<boolean>(theme.scrapped)
  const hero =
    theme.mainImageUrl ??
    'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop'

  return (
    <header className="mt-[75px]">
      <div className="relative">
        <div className="h-[248px] w-full overflow-hidden bg-gray-200">
          <img
            src={hero}
            alt={theme.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute bottom-[16px] left-[16px] flex items-center gap-[8px] text-gray-100">
          <FaRegEye size={16} />
          <span className="text-regular16">{theme.viewCount}</span>
        </div>
      </div>

      <div className="px-[20px] pt-[30px] pb-[30px]">
        <div className="align-center flex justify-between">
          <h1 className="text-semi20 leading-none">{theme.title}</h1>
          <button
            aria-label="스크랩"
            onClick={() => setScrap((s) => !s)}
            className="align-center flex justify-center text-black/70"
          >
            {scrap ? <GoBookmarkFill size={20} /> : <GoBookmark size={20} />}
          </button>
        </div>

        {theme.tags.length > 0 && (
          <div className="text-medium14 text-gray-60 mt-[8px] flex flex-wrap gap-[4px]">
            {theme.tags.map((t) => (
              <span key={t} className="bg-gray-10 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}
        <p className="text-medium16 text-gray-80 mt-[10px]">
          {theme.introduction}
        </p>
      </div>
    </header>
  )
}
