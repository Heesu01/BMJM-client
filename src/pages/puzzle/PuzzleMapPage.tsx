import { useState } from 'react'
import PuzzleMapTab from '@/widgets/puzzle/PuzzleMapTab'
import RankingTab from '@/widgets/puzzle/RankingTab'
import PuzzleTabNav from '@/widgets/puzzle/PuzzleTabNav'
import { BottomTabBar } from '@/shared/BottomTabBar'
import { useMissionRanking } from '@/features/puzzle/model'

export default function PuzzleMapPage() {
  const [tab, setTab] = useState<'map' | 'ranking'>('map')
  const { users, loading } = useMissionRanking()

  return (
    <div className="bg-gray-10 min-h-dvh">
      <PuzzleTabNav value={tab} onChange={setTab} />
      {tab === 'map' ? (
        <PuzzleMapTab />
      ) : (
        <RankingTab users={users} isLoading={loading} />
      )}
      <BottomTabBar />
    </div>
  )
}
