import Home from '@/assets/home.svg?react'
import List from '@/assets/list.svg?react'
import Grid from '@/assets/grid.svg?react'
import User from '@/assets/user.svg?react'
import Pin from '@/assets/pin.svg?react'

export const icons = {
  home: Home,
  list: List,
  grid: Grid,
  user: User,
  pin: Pin,
} as const

export type IconName = keyof typeof icons
