import { HomeHeader } from '@/shared/HomeHeader'
import { HomeDashboard } from '@/widgets/home'
import { BottomTabBar } from '@/shared/BottomTabBar'

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#F9F9F9]">
      <HomeHeader />
      <main className="mx-auto px-[20px] pt-[75px] pb-[80px]">
        <HomeDashboard />
      </main>
      <BottomTabBar />
    </div>
  )
}
