import type { ReactNode } from 'react'

type UIButtonProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export default function CommonBtn({
  children,
  className = '',
  onClick,
  disabled,
}: UIButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`font-medium16 inline-flex h-[46px] items-center justify-center rounded-[8px] select-none ${disabled ? 'bg-gray-40 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
