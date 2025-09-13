import { useMissionRecords } from '@/features/puzzle/model'

type Props = { missionId: string }

export default function MissionRecordTab({ missionId }: Props) {
  const { data, loading } = useMissionRecords(missionId)

  return (
    <div className="mt-[30px] pb-30">
      <div className="flex w-full justify-center">
        <div className="text-main border-main text-semi16 w-full border-b-[4px] py-[15px] text-center">
          기록
        </div>
      </div>

      <div className="px-[20px]">
        {loading && (
          <div className="px-4 py-6 text-sm text-gray-500">
            기록 불러오는 중…
          </div>
        )}

        {!loading && (!data || data.length === 0) && (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 text-gray-400">
            <span className="text-3xl">📝</span>
            <span>아직 등록된 기록이 없어요.</span>
          </div>
        )}

        {!loading && data && data.length > 0 && (
          <div className="space-y-6 pt-6">
            {data.map((r, idx) => (
              <div
                key={idx}
                className="border-gray-20 space-y-2 border-b pb-[20px]"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={r.userProfile}
                    alt={r.userName}
                    className="h-[44px] w-[44px] rounded-full object-cover"
                  />
                  <div>
                    <div className="text-medium14 text-[15px]">
                      {r.userName}
                    </div>
                    <div className="text-gray-80 text-medium12">
                      {r.createdAt}
                    </div>
                  </div>
                </div>

                {r.imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {r.imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`record-${i}`}
                        className="h-[100px] w-[100px] w-full rounded-md object-cover"
                      />
                    ))}
                  </div>
                )}

                <p className="text-medium16 text-gray-80">{r.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
