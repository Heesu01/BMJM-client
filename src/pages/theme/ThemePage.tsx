import { useState } from 'react'
import ThemeTabNav from '@/widgets/theme/ThemeTabNav'
import ThemeOfficialSection from '@/widgets/theme/ThemeOfficialSection'
import ThemeUserSection from '@/widgets/theme/ThemeUserSection'
import { BottomTabBar } from '@/shared/BottomTabBar'

export default function ThemePage() {
  const [tab, setTab] = useState<'official' | 'user'>('official')

  return (
    <div className="bg-gray-10 min-h-dvh">
      <ThemeTabNav value={tab} onChange={setTab} />
      <main className="px-[20px] pb-[120px]">
        {tab === 'official' && (
          <ThemeOfficialSection
            onKeywordItemClick={(id) =>
              console.log('official keyword click:', id)
            }
            className="mt-[20px]"
          />
        )}

        {tab === 'user' && <ThemeUserSection className="mt-[20px]" />}
      </main>
      <BottomTabBar />
    </div>
  )
}
