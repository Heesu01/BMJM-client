import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/icons'
import HeroCardBg from '@/assets/hero-card-bg.svg?react'

export type HeroCardProps = {
  isLoggedIn?: boolean
  progress?: {
    nickname: string
    current: number
    total: number
    successMissions: number
    runningThemes: number
  } | null
  loading?: boolean
  error?: string | null
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
  isLoggedIn = false,
  progress,
  loading,
  error,
}: HeroCardProps) {
  const navigate = useNavigate()
  const goLogin = useCallback(() => navigate('/login'), [navigate])

  const cardHeight = isLoggedIn ? 260 : 218

  return (
    <section
      className="relative m-auto w-full max-w-[500px]"
      style={{ height: cardHeight }}
    >
      <HeroCardBg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-[calc(100%+20px)] w-[calc(100%+20px)]"
        preserveAspectRatio="none"
        style={{ left: '-3%', top: '-3%' }}
      />

      {!isLoggedIn ? (
        <GuestBlock onLoginClick={goLogin} />
      ) : loading ? (
        <LoadingBlock />
      ) : error ? (
        <ErrorBlock message={error} />
      ) : progress ? (
        <UserBlock
          nickname={progress.nickname}
          current={progress.current}
          total={progress.total}
          successMissions={progress.successMissions}
          runningThemes={progress.runningThemes}
        />
      ) : (
        <LoadingBlock />
      )}
    </section>
  )
}

function GuestBlock({ onLoginClick }: { onLoginClick?: () => void }) {
  return (
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
  )
}

function UserBlock({
  nickname,
  current,
  total,
  successMissions,
  runningThemes,
}: {
  nickname: string
  current: number
  total: number
  successMissions: number
  runningThemes: number
}) {
  return (
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
  )
}

function LoadingBlock() {
  return (
    <div className="relative z-10 px-[20px] pt-[35px]">
      <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-6 w-64 animate-pulse rounded bg-gray-200" />
      <div className="mt-4 h-3 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="h-10 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="relative z-10 px-[20px] pt-[35px]">
      <p className="text-medium14 text-red-600">에러: {message}</p>
    </div>
  )
}
