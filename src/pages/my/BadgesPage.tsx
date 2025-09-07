import { useEffect, useState } from 'react'
import { CommonHeader } from '@/shared/CommonHeader'
import {
  BadgeHeader,
  BadgeOwnedSummary,
  BadgeGrid,
  type Badge,
} from '@/widgets/my/BadgesWidgets'
import { getMyProfile } from '@/features/my/model'

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [repId, setRepId] = useState<string>('')
  const [repName, setRepName] = useState<string>('')

  useEffect(() => {
    getMyProfile().then((me) => {
      const list: Badge[] = (me.badgeList ?? []).map((url, idx) => ({
        id: `badge-${idx}`,
        name: '',
        imageUrl: url,
      }))

      setBadges(list)
      setRepName(me.title ?? '부먹찍먹')

      if (me.mainBadgeUrl) {
        const found = list.find((b) => b.imageUrl === me.mainBadgeUrl)
        setRepId(found ? found.id : (list[0]?.id ?? ''))
      } else {
        setRepId(list[0]?.id ?? '')
      }
    })
  }, [])

  const rep = badges.find((b) => b.id === repId) ?? badges[0]
  const total = badges.length

  return (
    <div className="min-h-dvh bg-gray-100">
      <CommonHeader title="내 뱃지" />
      <main className="mx-auto max-w-[480px] px-[20px] pt-[75px]">
        {rep && (
          <BadgeHeader
            badge={{
              ...rep,
              name: repName,
            }}
            className="mx-auto max-w-[300px]"
          />
        )}

        <BadgeOwnedSummary total={total} className="mt-[20px]" />
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
