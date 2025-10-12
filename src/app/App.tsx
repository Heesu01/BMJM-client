import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useEffect, useState } from 'react'
import InstallGuideModal from '@/widgets/InstallGuideModal'
import { usePWAInstallPrompt } from '@/shared/hooks/usePWAInstallPrompt'

const SEEN_KEY = 'install-guide-v5'

export default function App() {
  const { canInstall, promptInstall } = usePWAInstallPrompt()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const seen = localStorage.getItem(SEEN_KEY) === '1'

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator &&
        Boolean((navigator as unknown as { standalone?: boolean }).standalone))

    if (!seen && !isStandalone) {
      queueMicrotask(() => setShow(true))
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    localStorage.setItem(SEEN_KEY, '1')
  }

  return (
    <>
      <RouterProvider router={router} />
      <InstallGuideModal
        open={show}
        onClose={handleClose}
        canAndroidInstall={canInstall}
        onAndroidInstall={promptInstall}
      />
    </>
  )
}
