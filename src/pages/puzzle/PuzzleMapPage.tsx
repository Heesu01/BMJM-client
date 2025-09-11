import { useState } from 'react'
import PuzzleMapTab from '@/widgets/puzzle/PuzzleMapTab'
import RankingTab from '@/widgets/puzzle/RankingTab'
import PuzzleTabNav from '@/widgets/puzzle/PuzzleTabNav'
import { BottomTabBar } from '@/shared/BottomTabBar'
import { useMissionRankings } from '@/features/puzzle/model'

export default function PuzzleMapPage() {
  const [tab, setTab] = useState<'map' | 'ranking'>('map')
  const { data, loading, error } = useMissionRankings()
  if (loading) return <div>랭킹 로딩중…</div>
  if (error) return <div>에러</div>
  if (!data) return null

  const users = data.map((r) => ({
    id: String(r.rank),
    name: r.userName,
    avatarUrl: r.profileImage,
    successCount: r.successMissionCount,
  }))

  return (
    <div className="bg-gray-10 min-h-dvh">
      <PuzzleTabNav value={tab} onChange={setTab} />
      {tab === 'map' ? <PuzzleMapTab /> : <RankingTab users={users} />}
      <BottomTabBar />
    </div>
  )
}
