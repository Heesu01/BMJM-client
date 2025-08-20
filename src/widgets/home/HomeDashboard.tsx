import { HeroCard } from './HeroCard'
import { StartTripCTA } from './StartTripCTA'
import { RecommendedByKeyword } from './RecommendedByKeyword'
import { Top3List } from './Top3List'

const MOCK_IS_LOGGED_IN = false

export default function HomeDashboard() {
  const isLoggedIn = MOCK_IS_LOGGED_IN

  return (
    <div className="space-y-6">
      <HeroCard isLoggedIn={isLoggedIn} />

      {isLoggedIn && <StartTripCTA />}

      <RecommendedByKeyword />
      <Top3List />
    </div>
  )
}
