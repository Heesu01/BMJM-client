import { useMemo } from 'react'

export type RawPlace = {
  id: string
  lat: number
  lng: number
  type: 'food' | 'spot'
  name: string
}

export function useFilteredMarkers(
  places: RawPlace[],
  filter: 'all' | 'food' | 'spot',
) {
  return useMemo(() => {
    const list =
      filter === 'all' ? places : places.filter((p) => p.type === filter)
    return list.map((p) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      label: p.name,
      type: p.type,
    }))
  }, [places, filter])
}
