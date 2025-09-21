import { HeroCard } from './HeroCard'
import { StartTripCTA } from './StartTripCTA'
import { RecommendedByKeyword } from './RecommendedByKeyword'
import { Top3List } from './Top3List'
import { useHomeData } from '@/features/home/model'
import { useNavigate } from 'react-router-dom'
import FestivalWidget from './Festival/FestivalWidget'

export default function HomeDashboard() {
  const isLoggedIn = !!localStorage.getItem('accessToken')

  const { progress, top3 } = useHomeData(isLoggedIn)

  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <HeroCard isLoggedIn={isLoggedIn} progress={progress ?? undefined} />

      {isLoggedIn && <StartTripCTA />}

      <RecommendedByKeyword />
      <FestivalWidget className="mt-[30px]" />

      <Top3List
        items={top3 ?? undefined}
        onItemClick={(id) => navigate(`/map/${id}`)}
      />
    </div>
  )
}
