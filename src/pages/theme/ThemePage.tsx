import { useSearchParams } from 'react-router-dom'
import ThemeTabNav from '@/widgets/theme/ThemeTabNav'
import ThemeOfficialSection from '@/widgets/theme/ThemeOfficialSection'
import ThemeUserSection from '@/widgets/theme/ThemeUserSection'
import { BottomTabBar } from '@/shared/BottomTabBar'

export default function ThemePage() {
  const [params, setParams] = useSearchParams()

  const tab: 'official' | 'user' =
    params.get('tab') === 'user' ? 'user' : 'official'

  const handleChange = (next: 'official' | 'user') => {
    const nextParams = new URLSearchParams(params)
    nextParams.set('tab', next)
    setParams(nextParams, { replace: true })
  }

  return (
    <div className="bg-gray-10 min-h-dvh">
      <ThemeTabNav value={tab} onChange={handleChange} />
      <main className="px-[20px] pb-[120px]">
        {tab === 'official' && <ThemeOfficialSection className="mt-[20px]" />}
        {tab === 'user' && <ThemeUserSection className="mt-[20px]" />}
      </main>
      <BottomTabBar />
    </div>
  )
}
