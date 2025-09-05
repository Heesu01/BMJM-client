import { CommonHeader } from '@/shared/CommonHeader'
import {
  BadgeHeader,
  BadgeOwnedSummary,
  BadgeGrid,
  type Badge,
} from '@/widgets/my/BadgesWidgets'

export default function BadgesPage() {
  const badges: Badge[] = [
    {
      id: 'busan-food',
      name: '부산 맛집왕',
      imageUrl: '/assets/badges/busan-food.png',
      color: '#47A9FF',
    },
    {
      id: 'cablecar',
      name: '케이블카',
      imageUrl: '/assets/badges/cablecar.png',
      color: '#49C2FF',
    },
    {
      id: 'green',
      name: '새싹',
      imageUrl: '/assets/badges/leaf.png',
      color: '#42C45A',
    },
    {
      id: 'temple',
      name: '사찰',
      imageUrl: '/assets/badges/temple.png',
      color: '#8A5BFF',
    },
    {
      id: 'lighthouse',
      name: '등대',
      imageUrl: '/assets/badges/lighthouse.png',
      color: '#4FD1C5',
    },
    {
      id: 'fish',
      name: '생선',
      imageUrl: '/assets/badges/fish.png',
      color: '#FFCC66',
    },
    {
      id: 'burger',
      name: '버거',
      imageUrl: '/assets/badges/burger.png',
      color: '#FF6B6B',
    },
  ]

  const repId = 'busan-food'
  const rep = badges.find((b) => b.id === repId) ?? badges[0]

  return (
    <div className="min-h-dvh bg-gray-100">
      <CommonHeader title="내 뱃지" />
      <main className="mx-auto max-w-[480px] px-[20px] pt-[75px]">
        <BadgeHeader badge={rep} className="mx-auto max-w-[300px]" />

        <BadgeOwnedSummary total={badges.length} className="mt-[20px]" />
        <BadgeGrid
          badges={badges}
          repId={repId}
          withSection
          title="나의 뱃지"
        />
      </main>
    </div>
  )
}
