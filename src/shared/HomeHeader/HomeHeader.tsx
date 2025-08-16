import Logo from '@/assets/logo.svg?react'

export type HeaderProps = {
  showBell?: boolean
  className?: string
}

export default function HomeHeader({
  showBell = false,
  className = '',
}: HeaderProps) {
  return (
    <header className={`bg-[#F9F9F9] ${className}`}>
      <div className="mx-auto flex h-[75px] items-center justify-between px-[20px]">
        <Logo className="w-auto" />
        {showBell ? (
          <span
            aria-hidden
            className="text-gray-80 text-[20px] leading-none select-none"
          >
            􀋙
          </span>
        ) : (
          <span className="w-6" />
        )}
      </div>
    </header>
  )
}
