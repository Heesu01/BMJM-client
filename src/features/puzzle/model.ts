import { useEffect, useMemo, useState } from 'react'

export type PuzzleProgressDto = {
  puzzleId: string
  puzzleRegion: string
  totalMissionCount: number
  collectedMissionCount: number
  puzzleCompleted: boolean
}

export type PuzzleMapProgressResp = {
  statusCode: string
  message: string
  data: {
    puzzleMapProgressDtos: PuzzleProgressDto[]
  }
}

export type RegionMissionsResp = {
  statusCode: string
  message: string
  data: {
    regionName: string
    missions: {
      missionId: string
      missionTitle: string
      missionDescription: string
    }[]
  }
}

const MOCK_PROGRESS: PuzzleMapProgressResp = {
  statusCode: '200 OK',
  message: '전체 지역별 퍼즐맵 진행 상황 조회 완료',
  data: {
    puzzleMapProgressDtos: [
      {
        puzzleId: '04168b53-ed3f-415e-9bbf-a22f826803a1',
        puzzleRegion: '금정구',
        totalMissionCount: 6,
        collectedMissionCount: 0,
        puzzleCompleted: false,
      },
      {
        puzzleId: '02a2ede9-5326-4fbf-960a-6e33d63364e9',
        puzzleRegion: '해운대구',
        totalMissionCount: 6,
        collectedMissionCount: 3,
        puzzleCompleted: false,
      },
      {
        puzzleId: '0ce91127-c29d-4f91-ba16-a1adf27df6a8',
        puzzleRegion: '사하구',
        totalMissionCount: 6,
        collectedMissionCount: 6,
        puzzleCompleted: true,
      },
    ],
  },
}

const MOCK_MISSIONS: Record<string, RegionMissionsResp> = {
  금정구: {
    statusCode: '200 OK',
    message: '지역 관련 미션 목록 조회 완료',
    data: {
      regionName: '금정구',
      missions: [
        {
          missionId: '48b3791c-5497-4e9a-bb46-a4352276b5c3',
          missionTitle: '💧 회동수원지 산책',
          missionDescription: '자연 속에서 산책과 힐링을 즐길 수 있는 명소',
        },
        {
          missionId: '4931dfac-05e6-471c-b372-2dad54a054fa',
          missionTitle: '📚 요산 김정한 문학관 방문',
          missionDescription: '부산 대표 작가의 삶과 작품을 만나는 문학관',
        },
        {
          missionId: '83674b51-4708-49a4-a798-9088e1112148',
          missionTitle: '🏯 금정산성 걷기',
          missionDescription:
            '산성과 부산 전경을 동시에 즐길 수 있는 역사 탐방지',
        },
        {
          missionId: '84bfba02-9745-46a0-bf6c-50db9406e4b5',
          missionTitle: '🛕 범어사 탐방',
          missionDescription: '천년 고찰에서 느끼는 고즈넉한 불교 문화',
        },
      ],
    },
  },
}

export function progressMapByRegion(list: PuzzleProgressDto[]) {
  const map: Record<string, PuzzleProgressDto> = {}
  list.forEach((p) => (map[p.puzzleRegion] = p))
  return map
}

export function usePuzzleMapProgress() {
  const [data, setData] = useState<PuzzleProgressDto[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const data = MOCK_PROGRESS
        if (!alive) return
        setData(data.data.puzzleMapProgressDtos)
      } catch (e) {
        if (!alive) return
        setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const byRegion = useMemo(
    () => (data ? progressMapByRegion(data) : {}),
    [data],
  )

  const totalCollected = useMemo(
    () =>
      data
        ? data.reduce((acc, cur) => acc + (cur.puzzleCompleted ? 1 : 0), 0)
        : 0,
    [data],
  )

  return { data, byRegion, totalCollected, loading, error }
}

export function useRegionMissions(regionName?: string) {
  const [data, setData] = useState<RegionMissionsResp['data'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!regionName) return
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const data = MOCK_MISSIONS[regionName]
        if (!alive) return
        setData(data?.data ?? { regionName, missions: [] })
      } catch (e) {
        if (!alive) return
        setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [regionName])

  return { data, loading, error }
}

export type MissionRankUserDto = {
  userName: string
  profileImage: string
  successMissionCount: number
  rank: number
}

export type MissionRankingResp = {
  statusCode: string
  message: string
  data: {
    missionRankings: MissionRankUserDto[]
  }
}

const MOCK_RANKINGS: MissionRankingResp = {
  statusCode: '200 OK',
  message: '퍼즐맵 미션 유저 랭킹 조회 완료',
  data: {
    missionRankings: [
      {
        userName: '유저1',
        profileImage:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        successMissionCount: 10,
        rank: 1,
      },
      {
        userName: '유저2',
        profileImage:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        successMissionCount: 2,
        rank: 2,
      },
      {
        userName: '유저3',
        profileImage:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        successMissionCount: 1,
        rank: 3,
      },
      {
        userName: '유저4',
        profileImage:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        successMissionCount: 0,
        rank: 4,
      },
      {
        userName: '유저5',
        profileImage:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        successMissionCount: 0,
        rank: 5,
      },
    ],
  },
}

export type RankUserUI = {
  id: string
  name: string
  avatarUrl: string
  successCount: number
  rank: number
}

function adaptMissionRankingToUI(list: MissionRankUserDto[]): RankUserUI[] {
  return list
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((u) => ({
      id: `${u.rank}-${u.userName}`,
      name: u.userName,
      avatarUrl: u.profileImage,
      successCount: u.successMissionCount,
      rank: u.rank,
    }))
}

export function useMissionRanking() {
  const [users, setUsers] = useState<RankUserUI[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const data = MOCK_RANKINGS
        const adapted = adaptMissionRankingToUI(data.data.missionRankings ?? [])
        if (!alive) return
        setUsers(adapted)
      } catch (e) {
        if (!alive) return
        setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(
    () => ({ users: users ?? [], loading, error }),
    [users, loading, error],
  )
  return value
}
