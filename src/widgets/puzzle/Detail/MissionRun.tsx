import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CommonBtn } from '@/shared/CommonBtn'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { AiOutlineStar, AiFillStar } from 'react-icons/ai'
import {
  createMissionRecord,
  verifyMissionLocation,
} from '@/features/puzzle/model'

type PhotoFile = { id: string; file: File; url: string }

export default function MissionRun() {
  const { missionId } = useParams<{ missionId: string }>()
  const nav = useNavigate()

  const [geoErr, setGeoErr] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  )
  const [locVerified, setLocVerified] = useState(false)
  const [locPosting, setLocPosting] = useState(false)

  const [photos, setPhotos] = useState<PhotoFile[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const handlePick = () => fileInputRef.current?.click()
  const onFiles = (files: FileList | null) => {
    if (!files || !files.length) return
    const remain = Math.max(0, 5 - photos.length)
    const arr = Array.from(files).slice(0, remain)
    const next = arr.map((f) => ({
      id: `${Date.now()}-${f.name}-${Math.random()}`,
      file: f,
      url: URL.createObjectURL(f),
    }))
    setPhotos((p) => [...p, ...next])
  }
  const removePhoto = (id: string) => {
    setPhotos((p) => {
      const t = p.find((x) => x.id === id)
      if (t) URL.revokeObjectURL(t.url)
      return p.filter((x) => x.id !== id)
    })
  }

  const photosRef = useRef<PhotoFile[]>([])
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [])

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const limit = 300
  const remain = `${review.length}/${limit}`

  const step1Done = locVerified
  const step2Done = photos.length > 0
  const step3Done = rating > 0 && review.trim().length >= 1
  const allDone = step1Done && step2Done && step3Done

  const [recordPosting, setRecordPosting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoErr('이 브라우저에서는 위치 기능을 사용할 수 없어요.')
      showToast('위치 기능을 사용할 수 없어요.')
      return
    }
    setGeoErr(null)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setCoords({ lat, lng })
        try {
          if (!missionId) return
          setLocPosting(true)
          await verifyMissionLocation({ missionId, x: lng, y: lat })
          setLocVerified(true)
          showToast('위치 인증 완료!')
        } catch {
          showToast('위치 인증에 실패했어요.')
        } finally {
          setLocPosting(false)
        }
      },
      (err) => {
        setGeoErr(err.message || '위치를 가져오지 못했어요.')
        showToast('위치를 가져오지 못했어요. 권한을 확인해 주세요.')
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  const submit = async () => {
    if (!allDone || !missionId) return
    try {
      setRecordPosting(true)
      await createMissionRecord({
        missionId,
        score: rating,
        content: review.trim(),
        images: photos.map((p) => p.file),
      })
      showToast('기록이 등록되었어요.')
      nav(`/missions/${missionId}`)
    } catch {
      showToast('등록에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setRecordPosting(false)
    }
  }

  const invalidMission = !missionId

  if (invalidMission) {
    return (
      <div className="px-[20px] py-10 text-sm text-gray-500">
        잘못된 접근입니다. (missionId가 없습니다)
      </div>
    )
  }

  return (
    <>
      <div className="space-y-10 px-[20px] pb-[140px]">
        <StepCard
          step="1"
          title="현재 위치 인증하기"
          done={step1Done}
          content={
            <div>
              <div className="mt-3 h-[140px] w-full overflow-hidden rounded-[12px] bg-gray-100">
                <div className="flex h-full items-center justify-center text-gray-400">
                  {coords ? (
                    <div className="text-[13px]">
                      lat: {coords.lat.toFixed(5)}, lng: {coords.lng.toFixed(5)}
                    </div>
                  ) : (
                    '지도가 표시될 영역'
                  )}
                </div>
              </div>

              <CommonBtn
                onClick={requestLocation}
                className="bg-main mt-3 w-full"
                disabled={locPosting}
              >
                {locPosting ? '인증 중…' : '내 위치 인증'}
              </CommonBtn>

              {geoErr && (
                <p className="mt-2 text-[12px] text-red-500">※ {geoErr}</p>
              )}
            </div>
          }
        />

        <StepCard
          step="2"
          title="사진 등록하기"
          done={step2Done}
          content={
            <div>
              <div className="mt-3 flex gap-2 overflow-x-auto">
                <button
                  onClick={handlePick}
                  className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[12px] border border-dashed border-gray-300 text-2xl text-gray-400"
                >
                  +
                </button>

                {photos.map((p) => (
                  <div
                    key={p.id}
                    className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[12px] bg-gray-100"
                  >
                    <img
                      src={p.url}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(p.id)}
                      className="absolute top-[-8px] right-[-8px] rounded-full bg-white p-1 shadow"
                      aria-label="remove"
                    >
                      <IoCloseCircle className="text-[18px] text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
            </div>
          }
        />

        <StepCard
          step="3"
          title="후기 작성"
          done={step3Done}
          content={
            <div className="space-y-3">
              <StarRating value={rating} onChange={setRating} />
              <div className="rounded-[12px] border border-gray-200 p-3">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value.slice(0, limit))}
                  placeholder="후기를 입력해주세요."
                  className="min-h-[120px] w-full resize-none outline-none"
                />
                <div className="mt-1 text-right text-[12px] text-gray-400">
                  {remain}
                </div>
              </div>
            </div>
          }
        />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10">
        <div className="pointer-events-auto rounded-t-[20px] bg-[#FDFDFD] px-[20px] pt-[16px] pb-[36px] shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
          <CommonBtn
            onClick={submit}
            className={`w-full ${allDone && !recordPosting ? 'bg-main' : 'bg-gray-300'}`}
            disabled={!allDone || recordPosting}
          >
            {recordPosting ? '등록 중…' : '미션 완료'}
          </CommonBtn>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-[110px] left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-[12px] text-white">
          {toast}
        </div>
      )}
    </>
  )
}

function StepCard({
  step,
  title,
  done,
  content,
}: {
  step: string
  title: string
  done: boolean
  content: React.ReactNode
}) {
  return (
    <div
      className={`rounded-[14px] border p-4 ${done ? 'border-main/60' : 'border-gray-200'}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border text-[12px] text-gray-600">
            {step}
          </span>
          <span className="text-[15px] font-semibold text-gray-800">
            {title}
          </span>
        </div>
        {done ? (
          <IoCheckmarkCircle className="text-main text-[20px]" />
        ) : (
          <span className="text-gray-300">○</span>
        )}
      </div>
      <div>{content}</div>
    </div>
  )
}

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const stars = useMemo(() => [1, 2, 3, 4, 5], [])
  return (
    <div className="flex items-center gap-2">
      {stars.map((s) =>
        s <= value ? (
          <button
            key={s}
            onClick={() => onChange(s)}
            aria-label={`${s}점`}
            className="text-[22px] text-[#1E88E5]"
          >
            <AiFillStar />
          </button>
        ) : (
          <button
            key={s}
            onClick={() => onChange(s)}
            aria-label={`${s}점`}
            className="text-[22px] text-gray-300"
          >
            <AiOutlineStar />
          </button>
        ),
      )}
    </div>
  )
}
