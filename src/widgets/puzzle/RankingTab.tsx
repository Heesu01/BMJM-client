import { FaCrown } from 'react-icons/fa6'

type RankUser = {
  id: string
  name: string
  avatarUrl: string
  successCount: number
}

type Props = {
  users?: RankUser[]
  isLoading?: boolean
}

export default function RankingTab({ users, isLoading }: Props) {
  const data: RankUser[] = users ?? []
  const top3 = data.slice(0, 3)
  const rest = data.slice(3)

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">랭킹 불러오는 중…</div>
  }

  return (
    <div>
      <div className="flex items-end justify-between px-[20px] pt-[35px]">
        {top3.length === 3 && (
          <>
            <PodiumCard
              rank={2}
              name={top3[1].name}
              avatarUrl={top3[1].avatarUrl}
              count={top3[1].successCount}
              size="sm"
            />
            <PodiumCard
              rank={1}
              name={top3[0].name}
              avatarUrl={top3[0].avatarUrl}
              count={top3[0].successCount}
              size="md"
              crown
            />
            <PodiumCard
              rank={3}
              name={top3[2].name}
              avatarUrl={top3[2].avatarUrl}
              count={top3[2].successCount}
              size="sm"
            />
          </>
        )}
      </div>

      <div className="mt-6 space-y-[10px] bg-[#f9f9f9] pt-[20px] pb-[87px]">
        {rest.map((u: RankUser, idx: number) => (
          <ListItem
            key={u.id}
            rank={idx + 4}
            name={u.name}
            avatarUrl={u.avatarUrl}
            count={u.successCount}
          />
        ))}
      </div>
    </div>
  )
}

function PodiumCard({
  rank,
  name,
  avatarUrl,
  count,
  crown,
  size = 'sm',
}: {
  rank: 1 | 2 | 3
  name: string
  avatarUrl: string
  count: number
  crown?: boolean
  size?: 'sm' | 'md'
}) {
  const avatarSize = size === 'md' ? 'h-[99px] w-[99px]' : 'h-[79px] w-[79px]'
  const badgeColor =
    rank === 1 ? 'bg-none' : rank === 2 ? 'bg-[#CECECE]' : 'bg-[#CB8600]'

  return (
    <div className="flex w-[110px] flex-col items-center">
      <div className="relative">
        {crown && (
          <div className="absolute -top-5 left-11.5 -translate-x-1/2 text-2xl">
            <FaCrown size={35} color="#FFD600" />
          </div>
        )}

        <img
          src={avatarUrl}
          alt={name}
          className={`${avatarSize} rounded-full object-cover shadow`}
        />

        <div className="absolute -top-2.5 left-1/3">
          <div
            className={`${badgeColor} flex h-[24px] w-[24px] items-center justify-center rounded-full text-[12px] text-white`}
          >
            {rank}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="text-bold14 text-gray-80 leading-tight">{name}</div>
        <div className="text-medium10 mt-[2px] text-gray-400">성공 미션</div>
        <div className="text-semi12 text-blue-600">{count}개</div>
      </div>
    </div>
  )
}

function ListItem({
  rank,
  name,
  avatarUrl,
  count,
}: {
  rank: number
  name: string
  avatarUrl: string
  count: number
}) {
  return (
    <div className="flex items-center gap-3 pr-[20px]">
      <div className="font-semi14 text-gray-80 w-6 shrink-0 text-right">
        {rank}
      </div>

      <div className="flex h-[72px] flex-1 items-center rounded-2xl bg-white px-4 shadow-sm ring-1 ring-gray-100">
        <img
          src={avatarUrl}
          alt={name}
          className="h-[44px] w-[44px] rounded-full object-cover"
        />

        <div className="ml-3 flex-1">
          <div className="text-semi16 text-[15px] leading-none text-gray-800">
            {name}
          </div>
        </div>

        <div className="text-medium12 text-gray-80">{count}개</div>
      </div>
    </div>
  )
}
