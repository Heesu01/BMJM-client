import { BottomTabBar } from '@/shared/BottomTabBar'
import { CommonHeader } from '@/shared/CommonHeader'
import {
  MyHeaderBadge,
  MyProfileCard,
  MyStatRow,
  MyMenuSection,
  type MyProfile,
} from '@/widgets/my/MyPageWidgets'

export default function MyPage() {
  const profile: MyProfile = {
    name: '이윤재',
    email: 'lki3532@naver.com',
    title: '부산 맛집왕',
    avatarUrl: '',
  }

  const stats = [
    { label: '성공 미션', value: 10 },
    { label: '퍼즐 수집', value: 2 },
  ]

  return (
    <div className="min-h-dvh bg-gray-100 pt-[75px]">
      <CommonHeader title="마이페이지" showBack={false} />
      <div className="mx-auto flex min-h-[100dvh] max-w-[480px] flex-col">
        <MyHeaderBadge
          label={profile.title ?? '마이페이지'}
          badgeUrl="https://www.notion.so/image/attachment%3Ac1f1f52e-fccf-4be7-ad48-20a39c4a44ab%3Aimage.png?table=block&id=25e28dd5-8f94-8089-a5df-dcc8e6a4722f&spaceId=57d9811f-0897-4645-a8eb-8171d894df35&width=1800&userId=ba98e4f2-4bdb-46cc-bc20-355f50218737&cache=v2"
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
