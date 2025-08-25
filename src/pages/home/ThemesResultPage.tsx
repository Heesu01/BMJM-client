import { useLocation, useNavigate } from 'react-router-dom'
import { CommonHeader } from '@/shared/CommonHeader'
import { ThemeCard } from '@/widgets/home/ThemeCard'

type LocationState = {
  userName?: string
  goals?: string[]
  foods?: string[]
  moods?: string[]
}

const MOCK_THEMES = [
  {
    id: 'ij-market',
    title: "영화 '국제시장' 테마",
    desc: '부산을 배경으로 한 영화 ‘국제시장’의 명소를 둘러보세요',
    thumbs: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400',
      'https://images.unsplash.com/photo-1534982841079-afde227ada8f?q=80&w=400',
      'https://images.unsplash.com/photo-1525054098605-8e762c017741?q=80&w=400',
    ],
  },
]

export default function ThemeResultPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { userName = '여행자' } = (state as LocationState) || {}

  const themes = MOCK_THEMES.concat(MOCK_THEMES, MOCK_THEMES)
  const count = themes.length

  const openTheme = (id: string) => {
    navigate(`/recommend/theme/${id}`, { state })
  }

  return (
    <div className="min-h-dvh bg-gray-100 px-[20px] pt-[75px] pb-[24px]">
      <CommonHeader title="맞춤 테마" />

      <section className="mt-[20px] mb-[20px]">
        <p className="text-medium16 text-black">
          {userName}님에게 딱맞는
          <br />
          여행 테마를
          <span className="text-main font-bold underline">{count}개</span>
          찾았어요!
        </p>
      </section>

      <section className="space-y-[12px]">
        {themes.map((t) => (
          <ThemeCard
            key={t.id + Math.random()}
            id={t.id}
            title={t.title}
            desc={t.desc}
            thumbs={t.thumbs}
            onClick={openTheme}
          />
        ))}
      </section>
    </div>
  )
}
