import { useState } from 'react'
import { CommonBtn } from '@/shared/CommonBtn'
import { CommonHeader } from '@/shared/CommonHeader'
import { KeywordGroup } from '@/widgets/home/KeywordGroup'
import { useNavigate } from 'react-router-dom'

const goals = [
  '가족끼리 여행',
  '친구와 우정 여행',
  '혼자 여행',
  '하루 코스로 가볍게',
  '부산 첫 여행',
  '데이트 코스',
  '골목 여행',
  '해안 도로 여행',
  '먹고 죽자 투어',
  '힐링하러 왔어요',
]

const foods = [
  '국밥파',
  '밀면 러버',
  '어묵 마니아',
  '디저트',
  '수산시장 필수',
  '길거리 간식',
  '핫플 맛집',
  '고깃집',
]

const moods = [
  '사진 남기고 싶어요',
  '브이로그 스타일',
  '조용하고 한적한',
  '현지인 추천',
  '유명 관광지',
  '비 오는 날',
  '시끌 벅적',
  '성지 순례',
]

export default function ThemesKeywordsPage() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedFoods, setSelectedFoods] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const navigate = useNavigate()

  const toggle = (
    list: string[],
    setList: (val: string[]) => void,
    label: string,
  ) => {
    setList(
      list.includes(label) ? list.filter((l) => l !== label) : [...list, label],
    )
  }

  const handleSubmit = () => {
    navigate('/recommend/result', {
      state: {
        goals: selectedGoals,
        foods: selectedFoods,
        moods: selectedMoods,
      },
    })
  }

  return (
    <div className="min-h-dvh bg-gray-100 px-[20px] pt-[75px] pb-[30px]">
      <CommonHeader title="키워드 선택" />

      <p className="text-semi16 text-main mt-[20px] mb-[30px]">
        여행 키워드를 선택하고,
        <br />
        여행 테마를 추천 받으세요!
      </p>

      <KeywordGroup
        title="🧭 여행 목적"
        description="어떤 여행을 좋아하시나요?"
        items={goals}
        selected={selectedGoals}
        onToggle={(label) => toggle(selectedGoals, setSelectedGoals, label)}
      />

      <KeywordGroup
        title="🍲 음식 취향"
        description="좋아하는 음식 취향을 마음껏 골라주세요!"
        items={foods}
        selected={selectedFoods}
        onToggle={(label) => toggle(selectedFoods, setSelectedFoods, label)}
      />

      <KeywordGroup
        title="🌈 감성 테마"
        description="어떤 테마의 여행을 좋아하세요?"
        items={moods}
        selected={selectedMoods}
        onToggle={(label) => toggle(selectedMoods, setSelectedMoods, label)}
      />

      <div className="left-0 w-full">
        <CommonBtn className="bg-main w-full" onClick={handleSubmit}>
          추천 받기
        </CommonBtn>
      </div>
    </div>
  )
}
