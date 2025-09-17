import { useEffect, useMemo, useState, useCallback } from 'react'
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

  const [showTestModal, setShowTestModal] = useState(false)
  const [testPw, setTestPw] = useState('')
  const [testError, setTestError] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)

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

  const submitTestLogin = useCallback(async () => {
    if (testPw.toLowerCase() !== 'test12') {
      setTestError('비밀번호가 올바르지 않습니다.')
      return
    }

    try {
      setTestLoading(true)
      setTestError(null)

      const resp = await api.get<IssueTokenResp>('/auth/test')
      const token = resp?.data?.data?.accessToken
      if (!token) throw new Error(resp?.data?.message || '토큰 발급 실패')

      localStorage.setItem('accessToken', token)
      setAuthToken(token)

      setShowTestModal(false)
      window.history.replaceState({}, '', '/')
      navigate('/', { replace: true })
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        '테스트 로그인에 실패했습니다.'
      setTestError(msg)
    } finally {
      setTestLoading(false)
    }
  }, [navigate, testPw])

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

      <button
        type="button"
        onClick={() => {
          setShowTestModal(true)
          setTestPw('')
          setTestError(null)
        }}
        className="mt-3 h-[56px] w-full max-w-[480px] rounded-[10px] border border-gray-300 text-[15px] font-semibold text-gray-800 active:scale-[0.98]"
      >
        테스트 계정으로 로그인
      </button>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {showTestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowTestModal(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold">테스트 계정 로그인</h2>
            <p className="text-[12px] text-gray-500">
              * 관리자만 로그인 가능합니다.
            </p>
            <input
              type="password"
              autoFocus
              value={testPw}
              onChange={(e) => setTestPw(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !testLoading) submitTestLogin()
              }}
              placeholder="비밀번호"
              className="focus:border-main mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              disabled={testLoading}
            />

            {testError && (
              <p className="mt-2 text-sm text-red-600">{testError}</p>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="h-[44px] flex-1 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 active:scale-[0.98]"
                disabled={testLoading}
              >
                취소
              </button>
              <button
                type="button"
                onClick={submitTestLogin}
                disabled={testLoading}
                className="bg-main h-[44px] flex-1 rounded-lg text-sm font-semibold text-white active:scale-[0.98] disabled:opacity-60"
              >
                {testLoading ? '로그인 중…' : '로그인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
