import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomTabBar } from '@/shared/BottomTabBar'
import { CommonHeader } from '@/shared/CommonHeader'
import {
  MyHeaderBadge,
  MyProfileCard,
  MyStatRow,
  MyMenuSection,
  type MyProfile,
} from '@/widgets/my/MyPageWidgets'
import { getMyProfile } from '@/features/my/model'
import { useIsLoggedIn } from '@/shared/hooks/useIsLoggedIn'
import { FiLock } from 'react-icons/fi'

function LoginPromptCard() {
  const navigate = useNavigate()
  return (
    <div
      className="pointer-events-auto w-full max-w-[420px] rounded-2xl bg-white/95 p-6 shadow-xl ring-1 ring-black/5"
      role="dialog"
      aria-modal="true"
      aria-label="로그인 필요 안내"
    >
      <div className="flex items-center gap-3">
        <div className="from-main/90 to-main/60 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-white">
          <FiLock size={22} />
        </div>
        <div>
          <p className="text-[15px] font-bold">로그인이 필요해요</p>
          <p className="text-[13px] text-gray-500">
            마이페이지는 로그인 후 이용할 수 있어요.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/login')}
        className="bg-main mt-5 h-[48px] w-full rounded-xl text-[15px] font-semibold text-white active:scale-[0.98]"
      >
        로그인하러 가기
      </button>

      <button
        onClick={() => navigate('/')}
        className="mt-3 h-[44px] w-full rounded-xl border border-gray-300 text-[13px] font-medium text-gray-700 active:scale-[0.98]"
      >
        홈으로
      </button>
    </div>
  )
}

export default function MyPage() {
  const isLoggedIn = useIsLoggedIn()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [profile, setProfile] = useState<MyProfile>({
    name: '',
    email: '',
    title: '마이페이지',
    avatarUrl: '',
  })
  const [badgeUrl, setBadgeUrl] = useState<string | undefined>(undefined)
  const [stats, setStats] = useState([
    { label: '성공 미션', value: 0 },
    { label: '퍼즐 수집', value: 0 },
  ])
  const [loading, setLoading] = useState(false)

  const [openLoginModal, setOpenLoginModal] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      setOpenLoginModal(true)
    } else {
      setOpenLoginModal(false)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        const me = await getMyProfile()
        if (cancelled) return
        setProfile({
          name: me.name,
          email: me.email,
          title: me.title ?? '부먹찍먹',
          avatarUrl: me.avatarUrl,
        })
        setBadgeUrl(me.mainBadgeUrl)
        setStats([
          { label: '성공 미션', value: me.completedMissionCount ?? 0 },
          { label: '퍼즐 수집', value: me.collectedPuzzleCount ?? 0 },
        ])
      } catch (e) {
        console.error('getMyProfile failed:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isLoggedIn])

  return (
    <div className="min-h-dvh bg-gray-100 pt-[75px]">
      <CommonHeader title="마이페이지" showBack={false} />
      <div className="mx-auto flex min-h-[100dvh] max-w-[480px] flex-col">
        {loading ? (
          <div className="animate-pulse px-5 pt-6">
            <div className="h-8 w-28 rounded bg-gray-200" />
            <div className="mt-4 h-24 rounded-2xl bg-gray-200" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="h-16 rounded-xl bg-gray-200" />
              <div className="h-16 rounded-xl bg-gray-200" />
            </div>
            <div className="mt-6 h-40 rounded-2xl bg-gray-200" />
          </div>
        ) : (
          <>
            <MyHeaderBadge
              label={profile.title ?? '마이페이지'}
              badgeUrl={badgeUrl}
            />
            <MyProfileCard profile={profile} />
            <MyStatRow items={stats} />
            <div className="mt-[20px] flex-1 rounded-t-[20px] bg-[#F9F9F9]">
              <MyMenuSection />
              <BottomTabBar />
            </div>
          </>
        )}

        {!isLoggedIn && openLoginModal && (
          <>
            <div
              className="pointer-events-none fixed inset-0 z-[1000] bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
            />
            <div
              className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
              onClick={() => setOpenLoginModal(false)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <LoginPromptCard />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
