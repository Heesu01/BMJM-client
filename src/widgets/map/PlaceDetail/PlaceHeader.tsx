import type { Place } from '@/entities/map'
import { IoStar } from 'react-icons/io5'
import { Icon } from '@/shared/icons'

type Props = {
  place: Place
  onBack?: () => void
}

export default function PlaceHeader({ place, onBack }: Props) {
  const { name, rating, reviewCount, address, hours, photos } = place
  const hero =
    photos?.[0] ??
    'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop'

  return (
    <header>
      <div className="relative">
        <div className="h-[248px] w-full overflow-hidden bg-gray-200">
          <img src={hero} alt={name} className="h-full w-full object-cover" />
        </div>

        <button
          onClick={onBack ?? (() => history.back())}
          aria-label="뒤로가기"
          className="absolute top-0 left-[20px] h-[75px] place-items-center text-white"
        >
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 16.25L6.25 10l6.25-6.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="px-[18px] pt-[20px]">
        <div className="flex items-start justify-between">
          <h1 className="text-medium20 text-lg text-black">{name}</h1>
          <div className="text-regular14 flex items-center gap-1">
            <IoStar size={15} className="text-main" />
            <span className="align-middle text-black">
              {typeof rating === 'number' ? rating.toFixed(1) : '0.0'} (
              {reviewCount ?? 0})
            </span>
          </div>
        </div>

        <div className="text-medium14 text-gray-60 mt-[10px] flex items-center gap-[4px]">
          <Icon name="pin-solid" size={16} className="text-main" />
          {address}
        </div>

        {hours && (
          <div className="text-medium12 mt-[18px] text-black">{hours}</div>
        )}
      </div>
    </header>
  )
}
