import { Link } from 'react-router-dom'

export default function StartTripCTA() {
  return (
    <Link
      to="/themes"
      aria-label="취향을 선택하고 여행을 시작하세요"
      className="bg-main text-semi16 mt-[16px] flex h-[60px] w-full items-center justify-center rounded-[30px] px-[43px] text-gray-100 active:scale-[0.98]"
    >
      <span className="font-semibold">
        + 취향을 선택하고 여행을 시작하세요!
      </span>
    </Link>
  )
}
