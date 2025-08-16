import { HeroCard } from './HeroCard'
import { RecommendedByKeyword } from './RecommendedByKeyword'
import { Top3List } from './Top3List'
import { StartTripCTA } from './StartTripCTA'

const MOCK_IS_LOGGED_IN = false
const MOCK_NICKNAME = '닉네임'

export default function HomeDashboard() {
  const isLoggedIn = MOCK_IS_LOGGED_IN
  const nickname = MOCK_NICKNAME

  return (
    <div className="space-y-6">
      <HeroCard isLoggedIn={isLoggedIn} nickname={nickname} />

      {isLoggedIn && <StartTripCTA />}

      <RecommendedByKeyword />
      <Top3List />
    </div>
  )
}
