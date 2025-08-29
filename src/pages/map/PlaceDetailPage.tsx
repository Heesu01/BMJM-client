import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPlaceById } from '@/entities/map'
import type { Place } from '@/entities/map'
import PlaceHeader from '@/widgets/map/PlaceDetail/PlaceHeader'
import TabNav from '@/widgets/map/PlaceDetail/TabNav'
import HomeTab from '@/widgets/map/PlaceDetail/HomeTab'
import MenuTab from '@/widgets/map/PlaceDetail/MenuTab'
import ReviewTab from '@/widgets/map/PlaceDetail/ReviewTab'

export default function PlaceDetailPage() {
  const navigate = useNavigate()
  const { placeId = '' } = useParams()
  const [place, setPlace] = useState<Place | null>(null)
  const [tab, setTab] = useState<'home' | 'menu' | 'review'>('home')

  useEffect(() => {
    getPlaceById(placeId).then(setPlace)
  }, [placeId])

  if (!place) return <div className="p-4">로딩중…</div>

  return (
    <div className="min-h-dvh bg-white">
      <PlaceHeader place={place} onBack={() => navigate(-1)} />
      <TabNav value={tab} onChange={setTab} />
      <div className="px-[20px]">
        {tab === 'home' && <HomeTab place={place} />}
        {tab === 'menu' && <MenuTab menus={place.menus} />}
        {tab === 'review' && <ReviewTab reviews={place.reviews} />}
      </div>
    </div>
  )
}
