import { NavLink, Link } from 'react-router-dom'
import { Icon } from '@/shared/icons'
import type { IconName } from '@/shared/icons'
import type { CSSProperties } from 'react'

type Props = { className?: string }

type TabBarVars = {
  '--notch-y': string
  '--notch-r': string
  '--notch-w': string
}

export default function BottomTabBar({ className = '' }: Props) {
  const barStyle: CSSProperties & TabBarVars = {
    '--notch-y': '-5px',
    '--notch-r': '25px',
    '--notch-w': '12px',
    paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
  }

  return (
    <nav
      className={`fixed inset-x-0 z-50 ${className}`}
      style={{ bottom: '20px' }}
    >
      <div className="relative mx-auto w-full max-w-[680px] px-[20px]">
        <div
          className="tab-cutout grid h-[60px] grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center rounded-full bg-white px-[20px] py-[7px]"
          style={barStyle}
        >
          <Tab to="/" label="홈" icon="home" className="justify-self-center" />
          <Tab
            to="/themes"
            label="테마"
            icon="list"
            className="justify-self-center"
          />
          <div aria-hidden className="h-0" />
          <Tab
            to="/puzzle"
            label="퍼즐맵"
            icon="grid"
            className="justify-self-center"
          />
          <Tab
            to="/my"
            label="내 정보"
            icon="user"
            className="justify-self-center"
          />
        </div>

        <Link
          to="/map"
          aria-label="지도"
          className="absolute -top-8 left-1/2 z-20 -translate-x-1/2"
        >
          <div className="bg-main flex size-[58px] items-center justify-center rounded-full transition-transform active:scale-95">
            <Icon name="pin" size={30} className="text-gray-100" />
          </div>
        </Link>
      </div>
    </nav>
  )
}

function Tab({
  to,
  label,
  icon,
  className = '',
}: {
  to: string
  label: string
  icon: IconName
  className?: string
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `text-medium10 flex flex-col items-center gap-1 transition-colors ${className} ${isActive ? 'text-main' : 'text-gray-60 hover:text-gray-80'}`
      }
    >
      <Icon
        name={icon}
        size={30}
        className="fill-current [&_circle]:fill-current [&_g]:fill-current [&_path]:fill-current [&_polygon]:fill-current [&_rect]:fill-current"
      />
      <span className="font-medium10">{label}</span>
    </NavLink>
  )
}
