import { useNavigate } from 'react-router-dom'

export type CommonHeaderProps = {
  title: string
  className?: string
  onBack?: () => void
  rootPath?: string
}

export default function CommonHeader({
  title,
  className = '',
  onBack,
  rootPath = '/',
}: CommonHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(rootPath)
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white ${className}`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="relative mx-auto flex h-[75px] items-center px-[20px]">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
          className="absolute text-[20px] text-black"
        >
          〈
        </button>

        <h1 className="text-medium18 mx-auto text-base text-black">{title}</h1>
      </div>
    </header>
  )
}
