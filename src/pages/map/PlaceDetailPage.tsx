import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import type { Place } from '@/entities/map'
import { fetchPlaceByName, fetchPlaceReviews } from '@/features/map/model'

import PlaceHeader from '@/widgets/map/PlaceDetail/PlaceHeader'
import TabNav from '@/widgets/map/PlaceDetail/TabNav'
import HomeTab from '@/widgets/map/PlaceDetail/HomeTab'
import MenuTab from '@/widgets/map/PlaceDetail/MenuTab'
import ReviewTab from '@/widgets/map/PlaceDetail/ReviewTab'

type LocState = { state?: { place?: Place } }

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as {
      status?: number | string
      code?: string
      message?: string
    }
    const status = e.status ? String(e.status) + ' ' : ''
    const code = e.code ? e.code + ' ' : ''
    const msg = e.message ?? '요청 실패'
    return (status + code + msg).trim()
  }
  return '요청 실패'
}

export default function PlaceDetailPage() {
  const navigate = useNavigate()
  const { placeId = '' } = useParams()
  const loc = useLocation() as LocState

  const [place, setPlace] = useState<Place | null>(loc.state?.place ?? null)
  const [tab, setTab] = useState<'home' | 'menu' | 'review'>('home')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const raw = placeId || ''
    let name = raw
    try {
      name = decodeURIComponent(raw).replace(/\+/g, ' ')
    } catch {
      name = raw
    }

    setErr(null)
    ;(async () => {
      try {
        const base = await fetchPlaceByName(name)
        setPlace(base)

        try {
          const reviews = await fetchPlaceReviews(base.name)

          setPlace((prev) => {
            if (!prev) return prev

            const nextReviewCount =
              typeof prev.reviewCount === 'number'
                ? prev.reviewCount
                : reviews.length

            return {
              ...prev,
              reviews,
              reviewCount: nextReviewCount,
            }
          })
        } catch (e: unknown) {
          console.error('[fetchPlaceReviews] fail', e)
        }
      } catch (e: unknown) {
        console.error('[fetchPlaceByName] fail', e)
        setErr(getErrorMessage(e))
      }
    })()
  }, [placeId])

  if (err) return <div className="p-4 text-red-500">{err}</div>
  if (!place) return <div className="p-4">로딩중…</div>

  return (
    <div className="min-h-dvh bg-white">
      <PlaceHeader place={place} onBack={() => navigate(-1)} />
      <TabNav value={tab} onChange={setTab} />
      <div className="px-[20px]">
        {tab === 'home' && <HomeTab place={place} />}
        {tab === 'menu' && <MenuTab menus={place.menus ?? []} />}
        {tab === 'review' && <ReviewTab reviews={place.reviews ?? []} />}
      </div>
    </div>
  )
}
