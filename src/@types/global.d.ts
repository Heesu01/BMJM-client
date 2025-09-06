export {}

declare global {
  type KakaoNS = typeof kakao
  interface Window {
    kakao: KakaoNS
  }

  namespace kakao {
    namespace maps {
      function load(cb: () => void): void

      class LatLng {
        constructor(lat: number, lng: number)
      }
      class Size {
        constructor(width: number, height: number)
      }
      class Point {
        constructor(x: number, y: number)
      }

      class LatLngBounds {
        constructor(sw: LatLng, ne: LatLng)
        getSouthWest(): LatLng
        getNorthEast(): LatLng
      }

      class Map {
        constructor(
          container: HTMLElement,
          opts: { center: LatLng; level?: number },
        )
        panTo(latlng: LatLng): void
        setLevel(level: number): void
        getBounds(): LatLngBounds
      }

      class MarkerImage {
        constructor(src: string, size: Size, opts?: { offset?: Point })
      }
      class Marker {
        constructor(opts: {
          map?: Map
          position: LatLng
          image?: MarkerImage
          zIndex?: number
        })
        setMap(map: Map | null): void
      }

      class InfoWindow {
        constructor(opts: { content: string })
        open(map: Map, marker?: Marker): void
        close(): void
      }

      class Circle {
        constructor(opts: {
          center: LatLng
          radius: number
          strokeWeight?: number
          fillColor?: string
          fillOpacity?: number
          zIndex?: number
        })
        setMap(map: Map | null): void
      }

      namespace event {
        function addListener(
          target: unknown,
          type: 'click' | 'idle' | string,
          handler: (...args: unknown[]) => void,
        ): void
      }

      namespace services {
        type Status = 'OK' | 'ZERO_RESULT' | 'ERROR'
        const Status: { OK: 'OK'; ZERO_RESULT: 'ZERO_RESULT'; ERROR: 'ERROR' }

        interface PlacesSearchOptions {
          location?: LatLng
          radius?: number
          bounds?: LatLngBounds
          useMapBounds?: boolean
          page?: number
          size?: number
          sort?: 'accuracy' | 'distance'
          category_group_code?: string
        }

        interface Pagination {
          current: number
          last: number
          totalCount: number
          gotoPage(page: number): void
        }

        interface Place {
          id: string
          place_name: string
          x: string
          y: string
          phone?: string
          address_name?: string
          road_address_name?: string
          category_group_code?: string
          category_group_name?: string
          place_url?: string
          distance?: string
        }

        class Places {
          constructor(map?: maps.Map | null)
          keywordSearch(
            query: string,
            callback: (
              data: Place[],
              status: Status,
              pagination?: Pagination,
            ) => void,
            options?: PlacesSearchOptions,
          ): void
          categorySearch(
            category: string,
            callback: (
              data: Place[],
              status: Status,
              pagination?: Pagination,
            ) => void,
            options?: PlacesSearchOptions,
          ): void
        }

        class Geocoder {
          coord2Address(
            x: number,
            y: number,
            cb: (result: AddressResult[], status: Status) => void,
          ): void
        }
      }
    }
  }
}
