import { useEffect, useRef, useState } from 'react'
import { loadKakao } from '@/shared/lib/loadKakao'
import meokIconUrl from '@/assets/meok.svg?url'
import jjiIconUrl from '@/assets/jji.svg?url'

type Marker = {
  id: string
  lat: number
  lng: number
  label?: string
  type?: 'food' | 'spot'
}

type Props = {
  appKey: string
  center: { lat: number; lng: number }
  level?: number
  markers?: Marker[]
  myLocation?: { lat: number; lng: number; accuracy?: number } | null
  className?: string
  onReady?: (map: kakao.maps.Map, kakaoNS: typeof kakao) => void
  onMarkerClick?: (id: string, mk: Marker) => void
}

export default function MapCanvas({
  appKey,
  center,
  level = 4,
  markers = [],
  myLocation,
  className = 'h-full',
  onReady,
  onMarkerClick,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const initialCenterRef = useRef(center)
  const initialLevelRef = useRef(level)
  const onReadyRef = useRef(onReady)
  const [ready, setReady] = useState(false)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const kakaoRef = useRef<typeof kakao | null>(null)

  const markerRefs = useRef<kakao.maps.Marker[]>([])
  const myMarkerRef = useRef<kakao.maps.Marker | null>(null)
  const myCircleRef = useRef<kakao.maps.Circle | null>(null)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  // 지도 최초 로드
  useEffect(() => {
    let mounted = true
    loadKakao(appKey).then((kakao) => {
      if (!mounted || !ref.current) return
      kakaoRef.current = kakao
      mapRef.current = new kakao.maps.Map(ref.current, {
        center: new kakao.maps.LatLng(
          initialCenterRef.current.lat,
          initialCenterRef.current.lng,
        ),
        level: initialLevelRef.current,
      })
      setReady(true)
      onReadyRef.current?.(mapRef.current!, kakao)
    })
    return () => {
      mounted = false
      markerRefs.current.forEach((m) => m.setMap(null))
      myMarkerRef.current?.setMap(null)
      myCircleRef.current?.setMap(null)
      mapRef.current = null
      kakaoRef.current = null
    }
  }, [appKey])

  // center 변경 시 이동
  useEffect(() => {
    const kakao = kakaoRef.current
    const map = mapRef.current
    if (!map || !kakao?.maps) return
    map.panTo(new kakao.maps.LatLng(center.lat, center.lng))
  }, [center])

  // level 변경 시 레벨 변경
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setLevel(level)
  }, [level])

  // center 변경 시 지도 이동
  useEffect(() => {
    const kakao = kakaoRef.current
    const map = mapRef.current
    if (!map || !kakao?.maps) return
    map.panTo(new kakao.maps.LatLng(center.lat, center.lng))
  }, [center])

  // 일반 마커 동기화
  useEffect(() => {
    const kakao = kakaoRef.current
    const map = mapRef.current
    if (!map || !kakao?.maps) return

    markerRefs.current.forEach((m) => m.setMap(null))

    markerRefs.current = markers.map((mk) => {
      let iconUrl: string | null = null
      if (mk.type === 'food') iconUrl = meokIconUrl
      else if (mk.type === 'spot') iconUrl = jjiIconUrl

      let image: kakao.maps.MarkerImage | undefined
      if (iconUrl) {
        const size = new kakao.maps.Size(32, 32)
        const offset = new kakao.maps.Point(16, 32)
        image = new kakao.maps.MarkerImage(iconUrl, size, { offset })
      }

      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(mk.lat, mk.lng),
        image,
      })

      if (onMarkerClick) {
        kakao.maps.event.addListener(marker, 'click', () =>
          onMarkerClick(mk.id, mk),
        )
      } else if (mk.label) {
        const iw = new kakao.maps.InfoWindow({
          content: `<div style="padding:6px 8px">${mk.label}</div>`,
        })
        kakao.maps.event.addListener(marker, 'click', () =>
          iw.open(map, marker),
        )
      }

      return marker
    })
  }, [markers, ready, onMarkerClick])

  // 내 위치 표시
  useEffect(() => {
    const kakao = kakaoRef.current
    const map = mapRef.current
    if (!map || !kakao?.maps) return

    myMarkerRef.current?.setMap(null)
    myCircleRef.current?.setMap(null)

    if (!myLocation) return

    const { lat, lng, accuracy = 50 } = myLocation
    const pos = new kakao.maps.LatLng(lat, lng)

    const imageSrc =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
         <circle cx="9" cy="9" r="6" fill="#3B82F6"/>
         <circle cx="9" cy="9" r="8" fill="none" stroke="#3B82F6" stroke-width="2" opacity="0.4"/>
       </svg>`,
      )
    const imageSize = new kakao.maps.Size(18, 18)
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)

    myMarkerRef.current = new kakao.maps.Marker({
      map,
      position: pos,
      image: markerImage,
      zIndex: 10,
    })

    myCircleRef.current = new kakao.maps.Circle({
      center: pos,
      radius: Math.max(accuracy, 20),
      strokeWeight: 0,
      fillColor: '#3B82F6',
      fillOpacity: 0.2,
      zIndex: 5,
    })
    myCircleRef.current.setMap(map)
  }, [myLocation, ready])

  return <div ref={ref} className={className} />
}
