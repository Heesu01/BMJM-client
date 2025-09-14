import { CommonHeader } from '@/shared/CommonHeader'
import MissionRunWidget from '@/widgets/puzzle/Detail/MissionRun'
import { useEffect } from 'react'

export default function MissionRunPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-dvh bg-white">
      <div className="pt-[75px]">
        <CommonHeader title="미션 진행" />
      </div>
      <MissionRunWidget />
    </div>
  )
}
