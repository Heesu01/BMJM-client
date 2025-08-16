import { HomeHeader } from '@/shared/HomeHeader'
import { BottomTabBar } from '@/shared/BottomTabBar'
import { HeroCard } from '@/widgets/home/HeroCard'

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#F9F9F9]">
      <HomeHeader />

      <main className="mx-auto px-[20px]">
        <HeroCard isLoggedIn={false} />
      </main>

      <BottomTabBar />
    </div>
  )
}
