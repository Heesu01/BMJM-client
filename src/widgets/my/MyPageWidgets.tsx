import { Link, useNavigate } from 'react-router-dom'

export type MyProfile = {
  name: string
  email: string
  title?: string
  avatarUrl?: string
}

export function MyHeaderBadge({
  label,
  badgeUrl,
}: {
  label: string
  badgeUrl?: string
}) {
  return (
    <div className="grid place-items-center">
      <Link to="/my/badges">
        <div className="bg-sub text-main text-bold14 rounded-full px-[60px] py-[6.5px]">
          {label}
        </div>
        <div className="mt-[14px] grid place-items-center">
          <img
            src={badgeUrl}
            alt={label}
            className="h-[143px] w-[143px] cursor-pointer"
          />
        </div>
      </Link>
    </div>
  )
}

export function MyProfileCard({ profile }: { profile: MyProfile }) {
  const { name, email, avatarUrl } = profile
  return (
    <div className="ring-sub m-auto mt-[19px] w-[90%] rounded-full bg-white px-[20px] py-[17px] shadow-sm ring-1">
      <div className="flex items-center gap-3">
        <div className="bg-sub grid h-[44px] w-[44px] place-items-center rounded-full">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name} 프로필`}
              className="h-[44px] w-[44px] rounded-full object-cover"
            />
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="text-blue-500"
            >
              <path
                d="M12 12a5 5 0 100-10 5 5 0 000 10zm-8 9a8 8 0 1116 0H4z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>

        <div className="min-w-0">
          <div className="text-medium16 truncate text-[15px] text-gray-900">
            {name}
          </div>
          <div className="text-medium14 text-gray-80 truncate text-[13px]">
            {email}
          </div>
        </div>
      </div>
    </div>
  )
}

export type StatItem = { label: string; value: number }
export function MyStatRow({ items }: { items: StatItem[] }) {
  return (
    <div className="mt-[20px] grid grid-cols-2 bg-white p-[20px]">
      {items.map((s, i) => (
        <div
          key={i}
          className="border-sub flex flex-col items-center justify-center border-r last:border-0"
        >
          <div className="text-medium12 text-gray-80">{s.label}</div>
          <div className="text-medium20 text-main">{s.value}개</div>
        </div>
      ))}
    </div>
  )
}

export type MenuItem = { label: string; to: string; rightText?: string }
export function MyMenuSection() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/', { replace: true })
  }

  return (
    <div className="overflow-hidden rounded-t-[20px] bg-[#F9F9F9] px-[20px] pt-[30px]">
      <span className="text-semi16">나의기록</span>
      <ul className="border-gray-20 mt-[20px] gap-[10px] border-t border-b">
        <li>
          <Link
            to={`/my/scrap`}
            className="flex items-center justify-between py-[15px]"
          >
            <span className="text-semi16 text-gray-80">스크랩모음</span>
            <span className="text-gray-40 flex items-center text-[13px]">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </li>
        <li>
          <Link
            to={`/my/reviews`}
            className="mt-[10px] flex items-center justify-between py-[15px]"
          >
            <span className="text-semi16 text-gray-80">내가 쓴 후기</span>
            <span className="text-gray-40 flex items-center text-[13px]">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </li>
      </ul>
      <button
        className="text-danger text-semi16 w-full py-[18px] text-center"
        type="button"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  )
}
