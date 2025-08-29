export {}

declare global {
  interface Window {
    kakao: typeof kakao
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

      class Map {
        constructor(
          container: HTMLElement,
          opts: { center: LatLng; level?: number },
        )
        panTo(latlng: LatLng): void
        setLevel(level: number): void
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
          type: string,
          handler: (...args: unknown[]) => void,
        ): void
      }
    }
  }
}
