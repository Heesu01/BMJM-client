import { useEffect, useState } from 'react'
import { IoIosCall } from 'react-icons/io'
import { MdLocationOn } from 'react-icons/md'

type TabKey = 'all' | 'food' | 'spot'

interface AddressResult {
  address: {
    address_name: string
  }
  road_address?: {
    address_name: string
  }
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function PlacePreviewCard({
  place,
  myLoc,
  anchorBottomPx = 94,
  onClose,
  onDetail,
  onNearby,
}: {
  place: kakao.maps.services.Place
  myLoc: { lat: number; lng: number } | null
  anchorBottomPx?: number
  onClose: () => void
  onDetail: () => void
  onNearby: () => void
}) {
  const name = place.place_name
  const lat = Number(place.y)
  const lng = Number(place.x)

  const initialAddress = place.road_address_name ?? place.address_name ?? ''
  const [address, setAddress] = useState(initialAddress)

  useEffect(() => {
    setAddress(initialAddress)
    if (initialAddress) return
    const kakaoNS = window.kakao
    if (!kakaoNS?.maps?.services?.Geocoder) return
    const geocoder = new kakaoNS.maps.services.Geocoder()
    geocoder.coord2Address(
      lng,
      lat,
      (result: AddressResult[], status: kakao.maps.services.Status) => {
        if (status !== kakaoNS.maps.services.Status.OK) return
        const a =
          result?.[0]?.road_address?.address_name ||
          result?.[0]?.address?.address_name ||
          ''
        if (a) setAddress(a)
      },
    )
  }, [place.id, initialAddress, lat, lng])

  const phone = place.phone

  const distText = (() => {
    const dStr = place.distance
    if (dStr && !Number.isNaN(Number(dStr))) {
      const m = Number(dStr)
      return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`
    }
    if (!myLoc) return undefined
    const m = haversine(myLoc.lat, myLoc.lng, lat, lng)
    return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`
  })()

  return (
    <div
      className="pointer-events-auto absolute right-0 left-0 z-10 px-4"
      style={{ bottom: anchorBottomPx }}
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
        <div className="grid h-[120px] w-full place-items-center bg-gradient-to-br from-gray-100 to-gray-200">
          <span className="text-sm text-gray-500">이미지 없음</span>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="text-[17px] font-semibold text-black">{name}</h3>
            <button
              onClick={onClose}
              aria-label="닫기"
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-2 flex items-center gap-2 text-[13px] text-gray-600">
            <MdLocationOn className="text-main" size={16} />
            <span className="line-clamp-1">{address || '주소 정보 없음'}</span>
          </div>

          <div className="mb-3 flex items-center justify-between text-[13px] text-gray-600">
            <div className="flex items-center gap-3">
              {phone && (
                <a className="underline" href={`tel:${phone}`}>
                  <IoIosCall className="-mt-[2px] inline-block" /> {phone}
                </a>
              )}
              {distText && <span>· {distText}</span>}
            </div>
            {place.category_group_name && (
              <span className="rounded-full border px-2 py-[2px] text-[12px] text-gray-700">
                {place.category_group_name}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onDetail}
              className="bg-main flex-1 rounded-lg px-3 py-2 text-[14px] font-medium text-white active:scale-[0.98]"
            >
              상세보기
            </button>
            <button
              onClick={onNearby}
              className="flex-1 rounded-lg border px-3 py-2 text-[14px] font-medium text-black active:scale-[0.98]"
            >
              근처 둘러보기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NearbyListSheet({
  anchorBottomPx = 94,
  base,
  list,
  loading,
  error,
  tabs,
  activeTab,
  onTab,
  onClose,
  onFocusItem,
  onDetailItem,
}: {
  anchorBottomPx?: number
  base: kakao.maps.services.Place
  list: kakao.maps.services.Place[]
  loading: boolean
  error: string | null
  tabs: ReadonlyArray<{ key: TabKey; label: string }>
  activeTab: TabKey
  onTab: (k: TabKey) => void
  onClose: () => void
  onFocusItem: (p: kakao.maps.services.Place) => void
  onDetailItem: (p: kakao.maps.services.Place) => void
}) {
  const baseName = base.place_name

  return (
    <div
      className="pointer-events-auto absolute right-0 left-0 z-20 px-4"
      style={{ bottom: anchorBottomPx }}
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-[15px] font-semibold text-black">
            {baseName} 주변
          </div>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-[13px] text-gray-500 hover:bg-gray-100"
          >
            닫기
          </button>
        </div>

        <div className="flex gap-2 px-4 pb-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              className={`rounded-full px-3 py-1 text-[13px] ${activeTab === t.key ? 'bg-main text-white' : 'border bg-white text-gray-900'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="max-h-[40vh] overflow-y-auto px-2 pb-2">
          {loading && (
            <div className="p-4 text-center text-[13px] text-gray-500">
              불러오는 중…
            </div>
          )}
          {error && (
            <div className="p-4 text-center text-[13px] text-red-500">
              {error}
            </div>
          )}
          {!loading && !error && list.length === 0 && (
            <div className="p-4 text-center text-[13px] text-gray-500">
              주변에 결과가 없어요.
            </div>
          )}

          {list.map((p) => {
            const name = p.place_name
            const addr = p.road_address_name ?? p.address_name ?? ''
            const phone = p.phone
            const dist =
              p.distance && !Number.isNaN(Number(p.distance))
                ? Number(p.distance)
                : undefined
            const distText =
              dist != null
                ? dist >= 1000
                  ? `${(dist / 1000).toFixed(1)}km`
                  : `${dist}m`
                : ''

            return (
              <div
                key={p.id}
                className="mx-2 mb-2 rounded-xl border bg-white p-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-[15px] font-medium text-black">
                    {name}
                  </div>
                  {distText && (
                    <div className="text-[12px] text-gray-500">{distText}</div>
                  )}
                </div>
                <div className="mb-1 line-clamp-1 text-[13px] text-gray-600">
                  {addr}
                </div>
                <div className="mb-2 text-[13px] text-gray-600">
                  {phone ?? ''}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onFocusItem(p)}
                    className="flex-1 rounded-lg border px-3 py-2 text-[13px] font-medium text-black active:scale-[0.98]"
                  >
                    지도에서 보기
                  </button>
                  <button
                    onClick={() => onDetailItem(p)}
                    className="bg-main flex-1 rounded-lg px-3 py-2 text-[13px] font-medium text-white active:scale-[0.98]"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
