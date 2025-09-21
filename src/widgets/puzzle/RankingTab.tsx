import { FaCrown } from 'react-icons/fa6'

type RankUser = {
  id: string
  name: string
  avatarUrl: string
  successCount: number
}
type Props = { users?: RankUser[]; isLoading?: boolean }

export default function RankingTab({ users, isLoading }: Props) {
  const data: RankUser[] = users ?? []

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">랭킹 불러오는 중…</div>
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-4xl">🧩</div>
        <div className="text-[15px] font-semibold text-gray-800">
          아직 랭킹이 없어요
        </div>
        <div className="text-sm text-gray-500">
          첫 미션을 완료하고 랭킹의 주인공이 되어보세요!
        </div>
      </div>
    )
  }

  const top3 = data.slice(0, 3)
  const topCount = top3.length
  const rest = data.slice(topCount)

  const podiumWrapClass =
    topCount === 1
      ? 'justify-center'
      : topCount === 2
        ? 'justify-center gap-10'
        : 'justify-between'

  const startRank = topCount + 1

  return (
    <div>
      <div className={`flex items-end px-[20px] pt-[35px] ${podiumWrapClass}`}>
        {top3[1] && (
          <PodiumCard
            rank={2}
            name={top3[1].name}
            avatarUrl={top3[1].avatarUrl}
            count={top3[1].successCount}
            size={topCount === 2 ? 'sm' : 'sm'}
          />
        )}

        {top3[0] && (
          <PodiumCard
            rank={1}
            name={top3[0].name}
            avatarUrl={top3[0].avatarUrl}
            count={top3[0].successCount}
            size={topCount === 1 ? 'md' : 'md'}
            crown
          />
        )}

        {top3[2] && (
          <PodiumCard
            rank={3}
            name={top3[2].name}
            avatarUrl={top3[2].avatarUrl}
            count={top3[2].successCount}
            size="sm"
          />
        )}
      </div>

      <div className="mt-6 space-y-[10px] bg-[#f9f9f9] pt-[20px] pb-[87px]">
        {rest.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-400">
            상위 {topCount}명 외 랭커가 아직 없어요.
          </div>
        ) : (
          rest.map((u, idx) => (
            <ListItem
              key={u.id}
              rank={startRank + idx}
              name={u.name}
              avatarUrl={u.avatarUrl}
              count={u.successCount}
            />
          ))
        )}
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
    rank === 1 ? '' : rank === 2 ? 'bg-[#CECECE]' : 'bg-[#CB8600]'

  return (
    <div className="flex w-[110px] flex-col items-center">
      <div className="relative">
        {crown && (
          <div className="absolute -top-5 left-[50px] -translate-x-1/2 text-2xl">
            <FaCrown size={35} color="#FFD600" />
          </div>
        )}

        <img
          src={avatarUrl}
          alt={name}
          className={`${avatarSize} rounded-full object-cover shadow`}
        />

        <div className="absolute -top-2.5 left-[calc(1/2*100%)] -translate-x-1/2">
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
      <div className="w-6 shrink-0 text-right font-semibold text-gray-700">
        {rank}
      </div>

      <div className="flex h-[72px] flex-1 items-center rounded-2xl bg-white px-4 shadow-sm ring-1 ring-gray-100">
        <img
          src={avatarUrl}
          alt={name}
          className="h-[44px] w-[44px] rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          <div className="text-[15px] leading-none font-semibold text-gray-800">
            {name}
          </div>
        </div>
        <div className="text-medium12 text-gray-80">{count}개</div>
      </div>
    </div>
  )
}
