import { useSyncExternalStore } from 'react'

export function useIsLoggedIn() {
  const subscribe = (cb: () => void) => {
    window.addEventListener('storage', cb)
    window.addEventListener('auth:changed', cb)
    return () => {
      window.removeEventListener('storage', cb)
      window.removeEventListener('auth:changed', cb)
    }
  }
  const getSnapshot = () => !!localStorage.getItem('accessToken')
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
