type Props = {
  open: boolean
  onClose: () => void
  onAndroidInstall?: () => void
  canAndroidInstall?: boolean
}

export default function InstallGuideModal({
  open,
  onClose,
  onAndroidInstall,
  canAndroidInstall,
}: Props) {
  if (!open) return null

  const ua =
    typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : ''
  const isIOS = /iphone|ipad|ipod/.test(ua)
  const isAndroid = /android/.test(ua)

  const isDesktop = !isAndroid && !isIOS
  const isMac =
    typeof navigator !== 'undefined' &&
    /macintosh|mac os x/.test(navigator.userAgent.toLowerCase())

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="w-[92%] max-w-[520px] rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-xl font-semibold">앱처럼 사용하기</h2>
        {isAndroid && (
          <div className="mt-3 space-y-2 text-sm">
            <p>안드로이드: 홈 화면에 추가하면 전체화면으로 실행된다.</p>
            {canAndroidInstall ? (
              <button
                className="mt-2 w-full rounded-lg bg-black px-4 py-2 text-white"
                onClick={onAndroidInstall}
              >
                설치 배너 열기
              </button>
            ) : (
              <ol className="list-decimal space-y-1 pl-5">
                <li>브라우저 메뉴(⋮) 열기</li>
                <li>“홈 화면에 추가” 선택</li>
              </ol>
            )}
          </div>
        )}
        {isIOS && (
          <div className="mt-3 space-y-2 text-sm">
            <p>iOS(Safari): 공유 버튼 → “홈 화면에 추가”를 선택한다.</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>사파리 하단 더보기(···) 아이콘 → 공유 선택</li>
              <li>더보기 → “홈 화면에 추가” 선택</li>
              <li>홈 화면 아이콘으로 실행</li>
            </ol>
          </div>
        )}
        {isDesktop && (
          <div className="mt-3 space-y-3 text-sm">
            <p className="font-medium">
              데스크톱에서 모바일 화면으로 확인하는 방법 (Chrome 기준)
            </p>

            {isMac ? (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="mb-1 font-medium">맥북 · macOS (Chrome)</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    개발자도구 열기: <b>⌘ + ⌥ + I</b> (또는 <b>F12</b>)
                  </li>
                  <li>
                    모바일 미리보기(디바이스 툴바) 토글: <b>⌘ + ⇧ + M</b>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="mb-1 font-medium">
                  일반 노트북 · Windows / Linux (Chrome)
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    개발자도구 열기: <b>F12</b> (또는 <b>Ctrl + Shift + I</b>)
                  </li>
                  <li>
                    모바일 미리보기(디바이스 툴바) 토글: <b>Ctrl + Shift + M</b>
                  </li>
                </ul>
              </div>
            )}

            <p className="text-gray-600">
              상단 크기 선택에서 iPhone·Galaxy 등을 고르시고 해상도/픽셀 비율을
              조정하시면 실제 앱과 유사한 화면을 확인하실 수 있습니다.
            </p>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button className="rounded-lg border px-4 py-2" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
