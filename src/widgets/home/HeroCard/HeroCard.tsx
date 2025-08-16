import { Icon } from '@/shared/icons'
import HeroCardBg from '@/assets/hero-card-bg.svg?react'

type HeroCardProps = {
  isLoggedIn?: boolean
  nickname?: string
  current?: number
  total?: number
  successMissions?: number
  runningThemes?: number
  className?: string
  onLoginClick?: () => void
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const ratio = Math.max(0, Math.min(1, value / Math.max(1, max)))
  return (
    <div className="bg-sub h-[10px] w-[188px] rounded-full">
      <div
        className="bg-main h-full rounded-full transition-[width]"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  )
}

export default function HeroCard({
  isLoggedIn = true,
  nickname = '닉네임',
  current = 3,
  total = 10,
  successMissions = 10,
  runningThemes = 2,
  className = '',
  onLoginClick,
}: HeroCardProps) {
  const cardHeight = isLoggedIn ? 260 : 218
  return (
    <section
      className={`relative mb-[30px] w-full max-w-[500px] ${className} m-auto`}
      style={{ height: cardHeight }}
    >
      <HeroCardBg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-[calc(100%+20px)] w-[calc(100%+20px)]"
        preserveAspectRatio="none"
        style={{ left: '-3%', top: '-3%' }}
      />

      {!isLoggedIn ? (
        <div className="relative z-10 px-[20px] pt-[35px]">
          <p className="text-busan text-black">지금 로그인을 하고</p>
          <p className="text-busan text-black">
            <Icon name="pin-solid" size={18} className="text-main mr-[4px]" />
            <span className="text-main text-busan">부산 맛집 여행</span>을
            떠나보세요!
          </p>
          <button
            onClick={onLoginClick}
            className="bg-main text-medium16 mt-[60px] h-[46px] w-full rounded-[8px] text-gray-100 active:scale-[0.98]"
          >
            로그인
          </button>
        </div>
      ) : (
        <div className="relative z-10 px-[20px] pt-[35px]">
          <p className="text-busan text-black">{nickname}님,</p>
          <p className="text-busan text-black">
            <Icon name="pin-solid" size={18} className="text-main mr-[4px]" />
            <span className="text-main text-busan">부산 맛집 여행</span>을
            떠나보세요!
          </p>

          <div className="mt-[10px]">
            <p className="text-medium14 text-black">퍼즐 수집 현황</p>
            <div className="flex items-center gap-3">
              <ProgressBar value={current} max={total} />
              <span className="text-medium20 text-main">
                {current}
                <span className="text-medium16 text-gray-60"> /{total}</span>
              </span>
            </div>
          </div>

          <div className="border-sub mt-[28px] grid grid-cols-2 border-t pt-[10px] text-center">
            <div className="border-sub border-r">
              <p className="text-medium14 text-black">성공 미션</p>
              <p className="text-medium20 text-main">{successMissions}개</p>
            </div>
            <div>
              <p className="text-medium14 text-black">진행 테마</p>
              <p className="text-medium20 text-main">{runningThemes}개</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
