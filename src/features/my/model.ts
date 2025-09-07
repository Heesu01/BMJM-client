import { api } from '@/shared/api/client'

export type MyProfileVM = {
  name: string
  email: string
  title?: string
  avatarUrl?: string
  mainBadgeUrl?: string
  badgeList?: string[]
  completedMissionCount: number
  collectedPuzzleCount: number
}

type UserDto = {
  name: string
  email: string
  profileImage?: string
  mainBadgeName?: string
  mainBadge?: string
  badgeList?: string[]
  completedMissionCount: number
  collectedPuzzleCount: number
}

function toVM(d: UserDto): MyProfileVM {
  return {
    name: d.name,
    email: d.email,
    title: d.mainBadgeName,
    avatarUrl: d.profileImage,
    mainBadgeUrl: d.mainBadge,
    badgeList: d.badgeList ?? [],
    completedMissionCount: d.completedMissionCount ?? 0,
    collectedPuzzleCount: d.collectedPuzzleCount ?? 0,
  }
}

export async function getMyProfile(): Promise<MyProfileVM> {
  const res = await api.get<{ data: UserDto }>('/users')
  return toVM(res.data.data)
}
