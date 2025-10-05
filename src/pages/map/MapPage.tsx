import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapCanvas from '@/widgets/map/MapCanvas'
import { TopSearchBar } from '@/widgets/map/TopSearchBar'
import { useFilteredMarkers } from '@/features/map/MapMarkers'
import type { RawPlace } from '@/features/map/MapMarkers'
import type { Place } from '@/entities/map'
import { BottomTabBar } from '@/shared/BottomTabBar'
import { BiCurrentLocation } from 'react-icons/bi'
import { PlacePreviewCard, NearbyListSheet } from '@/widgets/map/PlaceOverlays'

const DEFAULT_CENTER = { lat: 35.1587, lng: 129.1604 }
const CAT: Record<'food' | 'spot', 'FD6' | 'AT4'> = { food: 'FD6', spot: 'AT4' }

type TabKey = 'all' | 'food' | 'spot'
const isTabKey = (k: string): k is TabKey =>
  k === 'all' || k === 'food' || k === 'spot'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'food', label: '맛집' },
  { key: 'spot', label: '관광지' },
]

const NEARBY_SHEET_ANCHOR = 94
// const PREVIEW_LIFT_WHEN_SHEET_OPEN = 260

export default function MapPage() {
  const navigate = useNavigate()

  const [q, setQ] = useState('')
  const [tab, setTab] = useState<TabKey>('all')
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [myLoc, setMyLoc] = useState<{
    lat: number
    lng: number
    accuracy?: number
  } | null>(null)

  const kakaoRef = useRef<typeof kakao | null>(null)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const [idleTick, setIdleTick] = useState(0)

  const [raw, setRaw] = useState<RawPlace[]>([])
  const markers = useFilteredMarkers(raw, tab)

  const placeDictRef = useRef<Map<string, kakao.maps.services.Place>>(new Map())

  const [selected, setSelected] = useState<kakao.maps.services.Place | null>(
    null,
  )

  const [nearbyOpen, setNearbyOpen] = useState(false)
  const [nearbyTab, setNearbyTab] = useState<TabKey>('all')
  const [nearbyLoading, setNearbyLoading] = useState(false)
  const [nearby, setNearby] = useState<kakao.maps.services.Place[]>([])
  const [nearbyError, setNearbyError] = useState<string | null>(null)
  const NEARBY_RADIUS = 1000

  const kakaoToPlace = (p: kakao.maps.services.Place): Place => ({
    id: p.id,
    name: p.place_name,
    address: p.road_address_name ?? p.address_name ?? '',
    tel: p.phone ?? undefined,
    website: undefined,
    rating: 0,
    reviewCount: 0,
    hours: undefined,
    lat: Number(p.y),
    lng: Number(p.x),
    photos: [],
    menus: [],
    reviews: [],
  })

  // 현재 위치 1회
  // useEffect(() => {
  //   if (!('geolocation' in navigator)) return
  //   navigator.geolocation.getCurrentPosition(
  //     (pos) => {
  //       const loc = {
  //         lat: pos.coords.latitude,
  //         lng: pos.coords.longitude,
  //         accuracy: pos.coords.accuracy,
  //       }
  //       setCenter(loc)
  //       setMyLoc(loc)
  //     },
  //     () => {},
  //     { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 },
  //   )
  // }, [])

  // 실시간 위치 추적
  // useEffect(() => {
  //   if (!('geolocation' in navigator)) return
  //   const id = navigator.geolocation.watchPosition(
  //     (pos) => {
  //       const loc = {
  //         lat: pos.coords.latitude,
  //         lng: pos.coords.longitude,
  //         accuracy: pos.coords.accuracy,
  //       }
  //       setMyLoc(loc)
  //       setCenter(loc)
  //     },
  //     () => {},
  //     { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 },
  //   )
  //   return () => navigator.geolocation.clearWatch(id)
  // }, [])

  // 카카오 Places 검색
  useEffect(() => {
    const kakaoNS = kakaoRef.current
    const map = mapRef.current
    if (!kakaoNS || !map) return

    const places = new kakaoNS.maps.services.Places(map)

    const toRaw = (p: kakao.maps.services.Place): RawPlace | null => {
      const code = p.category_group_code
      const type =
        code === CAT.food ? 'food' : code === CAT.spot ? 'spot' : null
      if (!type) return null
      return {
        id: p.id,
        lat: Number(p.y),
        lng: Number(p.x),
        type,
        name: p.place_name,
      }
    }

    const merge = (listA: RawPlace[], listB: RawPlace[]) => {
      const m = new Map<string, RawPlace>()
      ;[...listA, ...listB].forEach((it) => m.set(it.id, it))
      return [...m.values()]
    }

    const handle = (
      status: kakao.maps.services.Status,
      data: kakao.maps.services.Place[],
      resolve: (v: RawPlace[]) => void,
    ) => {
      if (status !== kakaoNS.maps.services.Status.OK) return resolve([])
      data.forEach((p) => placeDictRef.current.set(p.id, p))
      const rows = data.map(toRaw).filter(Boolean) as RawPlace[]
      resolve(rows)
    }

    const run = async () => {
      const options: kakao.maps.services.PlacesSearchOptions = {
        useMapBounds: true,
      }

      if (q.trim()) {
        if (tab === 'all') {
          await new Promise<void>((done) => {
            places.keywordSearch(
              q.trim(),
              (res, status) => {
                handle(status, res, (rows) => {
                  setRaw(rows)
                  done()
                })
              },
              options,
            )
          })
        } else {
          await new Promise<void>((done) => {
            places.keywordSearch(
              q.trim(),
              (res, status) => {
                handle(status, res, (rows) => {
                  setRaw(rows.filter((r) => r.type === tab))
                  done()
                })
              },
              { ...options, category_group_code: CAT[tab] },
            )
          })
        }
      } else {
        if (tab === 'all') {
          const rowsFood = await new Promise<RawPlace[]>((done) => {
            places.categorySearch(
              CAT.food,
              (res, status) => handle(status, res, done),
              options,
            )
          })
          const rowsSpot = await new Promise<RawPlace[]>((done) => {
            places.categorySearch(
              CAT.spot,
              (res, status) => handle(status, res, done),
              options,
            )
          })
          setRaw(merge(rowsFood, rowsSpot))
        } else {
          const only = await new Promise<RawPlace[]>((done) => {
            places.categorySearch(
              CAT[tab],
              (res, status) => handle(status, res, done),
              options,
            )
          })
          setRaw(only)
        }
      }
    }

    run()
  }, [q, tab, idleTick])

  // 주변 검색: 선택 좌표 기준, 반경/거리순
  const fetchNearby = async (
    base: kakao.maps.services.Place,
    filter: TabKey,
  ) => {
    const kakaoNS = kakaoRef.current
    if (!kakaoNS) return
    setNearbyLoading(true)
    setNearbyError(null)

    const svc = new kakaoNS.maps.services.Places()
    const loc = new kakaoNS.maps.LatLng(Number(base.y), Number(base.x))

    const searchOne = (code: 'FD6' | 'AT4') =>
      new Promise<kakao.maps.services.Place[]>((done) => {
        svc.categorySearch(
          code,
          (res, status) => {
            if (status !== kakaoNS.maps.services.Status.OK) return done([])
            const filtered = res.filter((p) => p.id !== base.id)
            done(filtered)
          },
          {
            location: loc,
            radius: NEARBY_RADIUS,
            sort: 'distance',
            useMapBounds: false,
          },
        )
      })

    try {
      if (filter === 'food') {
        setNearby(await searchOne('FD6'))
      } else if (filter === 'spot') {
        setNearby(await searchOne('AT4'))
      } else {
        const [a, b] = await Promise.all([searchOne('FD6'), searchOne('AT4')])
        const merged = [...a, ...b].sort(
          (p1, p2) =>
            Number(p1.distance ?? Infinity) - Number(p2.distance ?? Infinity),
        )
        setNearby(merged)
      }
    } catch (e: unknown) {
      setNearbyError(e instanceof Error ? e.message : '주변 검색 오류')
      setNearby([])
    } finally {
      setNearbyLoading(false)
    }
  }

  // 선택 변경 시: 동일 카테고리 탭으로 초기화
  useEffect(() => {
    if (!selected) {
      setNearbyOpen(false)
      return
    }
    const selType: TabKey =
      selected.category_group_code === CAT.food
        ? 'food'
        : selected.category_group_code === CAT.spot
          ? 'spot'
          : 'all'
    setNearbyTab(selType)
    fetchNearby(selected, selType)
  }, [selected])

  // 탭 전환 시 주변 재검색
  useEffect(() => {
    if (selected && nearbyOpen) fetchNearby(selected, nearbyTab)
  }, [nearbyTab, nearbyOpen, selected])

  // 근처 시트 탭 목록
  const nearbyTabs = useMemo(
    () => [
      { key: 'all' as TabKey, label: '전체' },
      { key: 'food' as TabKey, label: '맛집' },
      { key: 'spot' as TabKey, label: '관광지' },
    ],
    [],
  )

  // // 프리뷰 카드 위치
  // const previewBottom = nearbyOpen
  //   ? NEARBY_SHEET_ANCHOR + PREVIEW_LIFT_WHEN_SHEET_OPEN
  //   : NEARBY_SHEET_ANCHOR

  return (
    <div className="relative min-h-dvh">
      <TopSearchBar
        value={q}
        onChange={setQ}
        tabs={tabs}
        active={tab}
        onTab={(k) => isTabKey(k) && setTab(k)}
      />

      <MapCanvas
        appKey={import.meta.env.VITE_KAKAO_APP_KEY}
        center={center}
        level={4}
        markers={markers}
        myLocation={myLoc}
        className="h-dvh"
        onReady={(map, kakaoNS) => {
          kakaoRef.current = kakaoNS
          mapRef.current = map
          kakaoNS.maps.event.addListener(map, 'idle', () =>
            setIdleTick((t) => t + 1),
          )
          setIdleTick((t) => t + 1)
        }}
        onMarkerClick={(id) => {
          const p = placeDictRef.current.get(id)
          if (!p) return
          setSelected(p)
          setNearbyOpen(false)
          setCenter({ lat: Number(p.y), lng: Number(p.x) })
        }}
      />

      {/* 프리뷰 카드 */}
      {selected && (
        <PlacePreviewCard
          place={selected}
          myLoc={myLoc}
          anchorBottomPx={NEARBY_SHEET_ANCHOR}
          onClose={() => setSelected(null)}
          onDetail={() => {
            const place = kakaoToPlace(selected)
            navigate(`/map/${encodeURIComponent(place.name)}`, {
              state: { place },
            })
          }}
          onNearby={() => setNearbyOpen(true)}
        />
      )}

      {/* 주변 리스트 */}
      {selected && nearbyOpen && (
        <NearbyListSheet
          anchorBottomPx={NEARBY_SHEET_ANCHOR}
          base={selected}
          list={nearby}
          loading={nearbyLoading}
          error={nearbyError}
          tabs={nearbyTabs}
          activeTab={nearbyTab}
          onTab={(k) => isTabKey(k) && setNearbyTab(k)}
          onClose={() => setNearbyOpen(false)}
          onFocusItem={(p) => setCenter({ lat: Number(p.y), lng: Number(p.x) })}
          onDetailItem={(p) => {
            const place = kakaoToPlace(p)
            navigate(`/map/${encodeURIComponent(place.name)}`, {
              state: { place },
            })
          }}
        />
      )}

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
        className="text-main absolute right-[20px] bottom-[150px] z-1 h-[44px] w-[44px] rounded-full bg-white p-3 shadow"
      >
        <BiCurrentLocation size={20} />
      </button>
    </div>
  )
}
