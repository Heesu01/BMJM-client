import { useCallback, useEffect, useState } from 'react'

type PWAInstallPromptEvent = Event & {
  readonly platforms?: string[]
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>
}

export function usePWAInstallPrompt() {
  const [deferred, setDeferred] = useState<PWAInstallPromptEvent | null>(null)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      const maybe = e as Partial<PWAInstallPromptEvent>
      if (typeof maybe.prompt === 'function' && maybe.userChoice) {
        e.preventDefault()
        setDeferred(maybe as PWAInstallPromptEvent)
      }
    }

    window.addEventListener('beforeinstallprompt', onPrompt as EventListener)
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        onPrompt as EventListener,
      )
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferred) return false
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    return outcome === 'accepted'
  }, [deferred])

  return { canInstall: !!deferred, promptInstall }
}
