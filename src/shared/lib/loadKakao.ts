let cached: Promise<typeof window.kakao> | null = null

export function loadKakao(appKey: string) {
  if (cached) return cached
  cached = new Promise((resolve, reject) => {
    if (window.kakao?.maps) return resolve(window.kakao)

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao))
    }
    script.onerror = () => reject(new Error('Kakao SDK load failed'))
    document.head.appendChild(script)
  })
  return cached
}
