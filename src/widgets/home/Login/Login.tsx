import { useNavigate } from 'react-router-dom'
import Brand from '@/assets/brand.svg?react'
import Logo from '@/assets/logo.svg?react'
import { ImBubble } from 'react-icons/im'

type Props = {
  onKakaoLogin?: () => void
  className?: string
}

export default function Login({ onKakaoLogin, className = '' }: Props) {
  const navigate = useNavigate()
  const handleClick =
    onKakaoLogin ??
    (() => {
      navigate('/')
    })

  return (
    <section className={`flex flex-col items-center px-[20px] ${className}`}>
      <Brand aria-hidden className="mt-[88px] h-[88px] w-[73px]" />
      <Logo
        width={173}
        height={41}
        className="text-main mt-[23px] [&_*]:fill-current"
      />
      <p className="text-gray-80 text-medium16 mt-[30px] text-center">
        간편하게 로그인하고
        <br />
        다양한 서비스를 이용해 보세요!
      </p>
      <button
        onClick={handleClick}
        className="mt-[71px] h-[60px] w-full max-w-[480px] rounded-[10px] bg-[#FDDC3F] text-[16px] font-bold text-black active:scale-[0.98]"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <ImBubble />
          카카오 계정으로 로그인
        </span>
      </button>
    </section>
  )
}
