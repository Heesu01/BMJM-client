import { useEffect, useRef, useState } from 'react'
import MapCanvas from '@/widgets/map/MapCanvas'
import { TopSearchBar } from '@/widgets/map/TopSearchBar'
import { useFilteredMarkers } from '@/features/map/MapMarkers'
import type { RawPlace } from '@/features/map/MapMarkers'
import { BottomTabBar } from '@/shared/BottomTabBar'
import { BiCurrentLocation } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

const MOCK: RawPlace[] = [
  { id: '1', lat: 35.101, lng: 129.034, type: 'food', name: '먹' },
  { id: '2', lat: 35.1, lng: 129.03, type: 'spot', name: '찍' },
  { id: '3', lat: 35.102, lng: 129.032, type: 'spot', name: '찍' },
  { id: '4', lat: 35.103, lng: 129.036, type: 'food', name: '먹' },
]

const DEFAULT_CENTER = { lat: 35.101, lng: 129.034 }

type TabKey = 'all' | 'food' | 'spot'
const isTabKey = (k: string): k is TabKey =>
  k === 'all' || k === 'food' || k === 'spot'

const tabs = [
  { key: 'all', label: '전체' },
  { key: 'food', label: '맛집' },
  { key: 'spot', label: '관광지' },
] satisfies { key: TabKey; label: string }[]

export default function MapPage() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<'all' | 'food' | 'spot'>('all')
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [myLoc, setMyLoc] = useState<{
    lat: number
    lng: number
    accuracy?: number
  } | null>(null)
  const markers = useFilteredMarkers(MOCK, tab)

  const watchIdRef = useRef<number | null>(null)

  // 현재 위치 가져오기
  useEffect(() => {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }
        setCenter(loc)
        setMyLoc(loc)
      },
      (err) => {
        console.warn('Geolocation error (once):', err?.message)
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 },
    )
  }, [])

  // 실시간 위치 추적
  useEffect(() => {
    if (!('geolocation' in navigator)) return

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }
        setMyLoc(loc)
        setCenter(loc)
      },
      (err) => {
        console.warn('watchPosition error:', err?.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 5_000,
      },
    )

    watchIdRef.current = id
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative min-h-dvh">
      <TopSearchBar
        value={q}
        onChange={setQ}
        tabs={tabs}
        active={tab}
        onTab={(k) => {
          if (isTabKey(k)) setTab(k)
        }}
      />
      <MapCanvas
        appKey={import.meta.env.VITE_KAKAO_APP_KEY}
        center={center}
        level={4}
        markers={markers}
        myLocation={myLoc}
        className="h-dvh"
        onMarkerClick={(id) => navigate(`/map/${id}`)}
      />

      <BottomTabBar />

      {/* 현재 위치로 이동 (수동) */}
      <button
        onClick={() => {
          if (!('geolocation' in navigator)) return
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const loc = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              }
              setCenter(loc)
              setMyLoc(loc)
            },
            () => {
              setCenter(DEFAULT_CENTER)
              setMyLoc(null)
            },
          )
        }}
        className="text-main absolute right-[20px] bottom-[150px] z-10 h-[44px] w-[44px] rounded-full bg-white p-3 shadow"
      >
        <BiCurrentLocation size={20} />
      </button>
    </div>
  )
}
