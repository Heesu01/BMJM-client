import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Brand from '@/assets/brand.svg?react'
import Logo from '@/assets/logo.svg?react'
import { ImBubble } from 'react-icons/im'
import { api, setAuthToken } from '@/shared/api/client'

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI
const KAKAO_AUTH_URL =
  `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code`

type IssueTokenResp = {
  status: number
  message: string
  data?: { accessToken?: string }
}

type Props = { className?: string }

export default function Login({ className = '' }: Props) {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { code, oauthError } = useMemo(() => {
    const sp = new URLSearchParams(window.location.search)
    return {
      code: sp.get('code'),
      oauthError: sp.get('error') || sp.get('error_description'),
    }
  }, [])

  useEffect(() => {
    if (oauthError) {
      setError(`로그인 실패: ${oauthError}`)
      return
    }
    if (!code) return

    let cancelled = false
    ;(async () => {
      try {
        setIsProcessing(true)
        setError(null)

        const resp = await api.post<IssueTokenResp>('/oauth', { code })
        console.log('[oauth exchange resp]', resp?.data)

        const token = resp?.data?.data?.accessToken
        if (!token) throw new Error(resp?.data?.message || '토큰 발급 실패')

        localStorage.setItem('accessToken', token)
        setAuthToken(token)

        if (cancelled) return
        window.history.replaceState({}, '', '/')
        navigate('/', { replace: true })
      } catch (e: any) {
        if (!cancelled) {
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            '로그인 처리 중 오류가 발생했습니다.'
          setError(msg)
        }
      } finally {
        if (!cancelled) setIsProcessing(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [code, oauthError, navigate])

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL
  }

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
        onClick={handleKakaoLogin}
        disabled={isProcessing}
        className="mt-[71px] h-[60px] w-full max-w-[480px] rounded-[10px] bg-[#FDDC3F] text-[16px] font-bold text-black active:scale-[0.98] disabled:opacity-60"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <ImBubble />
          {isProcessing ? '로그인 처리 중...' : '카카오 계정으로 로그인'}
        </span>
      </button>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </section>
  )
}
