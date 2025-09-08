import { useEffect, useState } from 'react'
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

export default function MyPage() {
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

  useEffect(() => {
    getMyProfile()
      .then((me) => {
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
      })
      .catch((e) => {
        console.error('getMyProfile failed:', e)
      })
  }, [])

  return (
    <div className="min-h-dvh bg-gray-100 pt-[75px]">
      <CommonHeader title="마이페이지" showBack={false} />
      <div className="mx-auto flex min-h-[100dvh] max-w-[480px] flex-col">
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
      </div>
    </div>
  )
}
