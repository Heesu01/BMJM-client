import { useNavigate, useParams } from 'react-router-dom'
import MissionDetailHeader from '@/widgets/puzzle/Detail/MissionHeader'
import { useMissionDetail } from '@/features/puzzle/model'
import { CommonHeader } from '@/shared/CommonHeader'
import { CommonBtn } from '@/shared/CommonBtn'
import MissionRecordTab from '@/widgets/puzzle/Detail/MissionRecordTab'

export default function MissionDetailPage() {
  const { missionId } = useParams<{ missionId: string }>()
  const { data, loading, error } = useMissionDetail(missionId)
  const navigate = useNavigate()

  if (!missionId) {
    return (
      <div className="min-h-dvh bg-white pt-[75px]">
        <CommonHeader title="상세 미션" />
        <div className="px-[20px] py-10 text-sm text-gray-500">
          잘못된 접근입니다. (missionId가 없습니다)
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-white pt-[75px]">
      <CommonHeader title="상세 미션" />

      <MissionDetailHeader
        loading={loading}
        error={error}
        mission={
          data
            ? {
                missionTitle: data.missionTitle,
                missionIntroduction: data.missionIntroduction,
                missionContent: data.missionContent,
                missionImageUrl: data.missionImageUrl,
                x: data.x,
                y: data.y,
              }
            : undefined
        }
      />
      <MissionRecordTab missionId={missionId} />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10">
        <div className="pointer-events-auto rounded-t-[20px] bg-[#FDFDFD] px-[20px] pt-[16px] pb-[36px] shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
          <CommonBtn
            onClick={() => navigate(`/puzzle/${missionId}/run`)}
            className="bg-main w-full"
          >
            미션 시작
          </CommonBtn>
        </div>
      </div>
    </div>
  )
}
