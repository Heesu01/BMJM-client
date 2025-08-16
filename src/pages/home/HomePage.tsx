import { HomeHeader } from '@/shared/HomeHeader'
import { BottomTabBar } from '@/shared/BottomTabBar'
import { HeroCard } from '@/widgets/home/HeroCard'
import { RecommendedByKeyword } from '@/widgets/home/RecommendedByKeyword'
import { Top3List } from '@/widgets/home/Top3List'

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#F9F9F9]">
      <HomeHeader />

      <main className="mx-auto px-[20px] pt-[75px] pb-[80px]">
        <HeroCard isLoggedIn={false} />
        <RecommendedByKeyword />
        <Top3List />
      </main>

      <BottomTabBar />
    </div>
  )
}
