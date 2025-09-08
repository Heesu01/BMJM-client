import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/home/HomePage'
import LoginPage from '@/pages/home/LoginPage'
import ThemesKeywordsPage from '@/pages/home/ThemesKeywordsPage'
import ThemesResultPage from '@/pages/home/ThemesResultPage'
import MapPage from '@/pages/map/MapPage'
import PlaceDetailPage from '@/pages/map/PlaceDetailPage'
import MyPage from '@/pages/my/MyPage'
import BadgesPage from '@/pages/my/BadgesPage'
import ThemePage from '@/pages/theme/ThemePage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/recommend', element: <ThemesKeywordsPage /> },
  { path: '/recommend/result', element: <ThemesResultPage /> },
  { path: '/map', element: <MapPage /> },
  { path: '/map/:placeId', element: <PlaceDetailPage /> },
  { path: '/my', element: <MyPage /> },
  { path: '/my/badges', element: <BadgesPage /> },
  { path: '/theme', element: <ThemePage /> },
])
