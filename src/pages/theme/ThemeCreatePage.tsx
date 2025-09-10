import { CommonBtn } from '@/shared/CommonBtn'
import { CommonHeader } from '@/shared/CommonHeader'
import React, { useMemo, useRef, useState } from 'react'
import { GrGallery } from 'react-icons/gr'
import { RiResetLeftLine } from 'react-icons/ri'
import { THEME_KEYWORDS, type ThemeKeyword } from '@/features/home/model'
import { createTheme, type CreateThemeReq } from '@/features/theme/model'
import { useNavigate } from 'react-router-dom'

export type ThemePlace = {
  id: string
  image?: File | null
  imageUrl?: string
  address: string
  description: string
}

const makeId = () => Math.random().toString(36).slice(2, 9) + '-' + Date.now()

export default function ThemeCreatePage() {
  const [topicSheetOpen, setTopicSheetOpen] = useState(false)
  const [topics, setTopics] = useState<ThemeKeyword[]>([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [places, setPlaces] = useState<ThemePlace[]>([])
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const canSubmit = useMemo(
    () =>
      Boolean(
        topics.length > 0 &&
          title.trim() &&
          summary.trim() &&
          places.length > 0,
      ),
    [topics.length, title, summary, places.length],
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return

    const cleaned = places
      .map((p) => ({
        address: p.address.trim(),
        content: p.description.trim(),
        imageFile: p.image ?? undefined,
      }))
      .filter((p) => p.address && p.content)

    if (cleaned.length === 0) {
      alert('장소의 주소/설명을 1개 이상 입력해주세요.')
      return
    }

    const payload: CreateThemeReq = {
      title: title.trim(),
      introduction: summary.trim(),
      keywords: topics,
      items: cleaned,
    }

    try {
      setSubmitting(true)
      await createTheme(payload)
      alert('테마가 등록되었습니다.')
      navigate(`/theme`)
    } catch (err: unknown) {
      console.error(err)
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : '등록에 실패했어요.'
      alert(message)
    } finally {
      setSubmitting(false)
    }
  }

  const addPlace = () =>
    setPlaces((prev) => [
      ...prev,
      { id: makeId(), image: null, imageUrl: '', address: '', description: '' },
    ])

  const updatePlace = (id: string, patch: Partial<ThemePlace>) =>
    setPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))

  const removePlace = (id: string) =>
    setPlaces((prev) => prev.filter((p) => p.id !== id))

  const selectedLabels = THEME_KEYWORDS.filter((k) =>
    topics.includes(k.value as ThemeKeyword),
  ).map((k) => k.label)

  return (
    <div className="mx-auto max-w-md bg-white pb-[10px]">
      <CommonHeader title="테마 작성" />

      <form onSubmit={onSubmit} className="px-[20px] pt-[75px]">
        <section className="mt-[10px]">
          <button
            type="button"
            onClick={() => setTopicSheetOpen(true)}
            className="border-sub text-medium16 flex h-[50px] w-full items-center justify-between rounded-full border-[1.5px] px-[12px]"
          >
            {selectedLabels.length > 0 ? (
              <div className="flex items-center gap-[8px] overflow-hidden">
                {selectedLabels.slice(0, 2).map((label) => (
                  <span
                    key={label}
                    className="bg-main inline-flex h-[30px] items-center rounded-full px-[12px] text-white"
                  >
                    {label}
                  </span>
                ))}
                {selectedLabels.length > 2 && (
                  <span className="text-main text-medium14">
                    +{selectedLabels.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-80 w-full text-center">
                + 테마 주제를 선택해주세요.
              </span>
            )}
          </button>
        </section>

        <section className="mt-[39px]">
          <div>
            <input
              className="border-gray-20 focus:border-gray-60 text-semi16 text-gray-80 w-full border-b pb-[13px] outline-none placeholder:text-[#686868]"
              placeholder="테마 제목을 입력해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={40}
            />
          </div>
          <div>
            <input
              className="border-gray-20 focus:border-gray-60 text-semi14 text-gray-80 mt-[20px] w-full border-b pb-[13px] outline-none placeholder:text-[#686868]"
              placeholder="테마에 대한 짧은 설명을 남겨주세요."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={80}
            />
          </div>
        </section>

        <section className="mt-[43px]">
          <h2 className="font-semi16 mb-[23px]">테마 설명</h2>
          <div className="space-y-6">
            {places.map((p, i) => (
              <PlaceEditor
                key={p.id}
                index={i + 1}
                place={p}
                onChange={(patch) => updatePlace(p.id, patch)}
                onRemove={() => removePlace(p.id)}
              />
            ))}

            <button
              type="button"
              onClick={addPlace}
              className="bg-sub-2 text-medium14 text-main flex h-[42px] w-full items-center justify-center rounded-[10px]"
            >
              <span>+ 장소 추가</span>
            </button>
          </div>
        </section>
        <button type="submit" className="w-full">
          <CommonBtn
            disabled={!canSubmit || submitting}
            className={`text-medium16 mt-[30px] w-full rounded-xl ${canSubmit && !submitting ? 'bg-main text-white' : 'bg-gray-200 text-gray-400'}`}
          >
            {submitting ? '작성 중…' : '작성 완료'}
          </CommonBtn>
        </button>
      </form>

      {topicSheetOpen && (
        <TopicSheet
          current={topics}
          onPick={(arr) => {
            setTopics(arr)
            setTopicSheetOpen(false)
          }}
          onClose={() => setTopicSheetOpen(false)}
        />
      )}
    </div>
  )
}

function PlaceEditor({
  place,
  index,
  onChange,
  onRemove,
}: {
  place: ThemePlace
  index: number
  onChange: (patch: Partial<ThemePlace>) => void
  onRemove: () => void
}) {
  const fileRef = useRef<HTMLInputElement | null>(null)

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    onChange({ image: f, imageUrl: url })
  }

  return (
    <div className="border-gray-20 border-b pb-[20px]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-medium12 bg-sub-2 text-main rounded-full px-[10px] py-[5px]">
          장소 {index}
        </p>
        <button
          onClick={onRemove}
          className="text-gray-400"
          aria-label="장소 삭제"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div
        className="group relative grid h-40 place-items-center overflow-hidden rounded-xl bg-gray-50"
        onClick={() => fileRef.current?.click()}
      >
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt="place"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-gray-40 flex flex-col items-center gap-[12px]">
            <GrGallery size={25} />
            <span className="text-medium14">+ 장소의 사진을 첨부해주세요.</span>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2 rounded-full border border-gray-200 px-4">
          <input
            className="text-medium14 placeholder:text-gray-40 h-[38px] flex-1 text-center outline-none"
            placeholder="+ 장소의 위치 정보를 입력해주세요."
            value={place.address}
            onChange={(e) => onChange({ address: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-3">
        <textarea
          className="placeholder:text-gray-40 text-medium14 min-h-[100px] w-full resize-y rounded-xl border border-gray-200 p-4 outline-none"
          placeholder="장소에 대한 설명을 작성해주세요."
          value={place.description}
          onChange={(e) => onChange({ description: e.target.value })}
          maxLength={300}
        />
      </div>
    </div>
  )
}

function TopicSheet({
  current,
  onPick,
  onClose,
}: {
  current?: ThemeKeyword[]
  onPick: (t: ThemeKeyword[]) => void
  onClose: () => void
}) {
  const [sel, setSel] = useState<ThemeKeyword[]>(current || [])

  const toggle = (v: ThemeKeyword) =>
    setSel((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    )

  const chip = (active: boolean) =>
    `inline-flex items-center rounded-full px-[12px] h-[30px] text-medium14 border transition border-sub ${
      active ? 'bg-main text-white' : 'bg-white'
    }`

  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md rounded-t-2xl bg-white p-5 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]">
        <div className="mx-auto mt-1 mb-4 h-[4px] w-[56px] rounded-full bg-gray-200" />

        <h3 className="font-medium16 mb-[20px]">테마 주제</h3>

        <div className="flex flex-wrap gap-[12px]">
          {THEME_KEYWORDS.map((opt) => {
            const v = opt.value as ThemeKeyword
            const active = sel.includes(v)
            return (
              <button
                key={v}
                type="button"
                onClick={() => toggle(v)}
                className={chip(active)}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        <div className="mt-[60px] flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSel([])}
            className="text-medium16 border-gray-20 text-gray-80 h-[46px] flex-1 rounded-[8px] border"
          >
            <div className="flex items-center justify-center gap-[5px]">
              <RiResetLeftLine />
              초기화
            </div>
          </button>
          <button
            type="button"
            onClick={() => onPick(sel)}
            className="bg-main text-medium16 h-[46px] flex-1 rounded-[8px] text-white"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  )
}
