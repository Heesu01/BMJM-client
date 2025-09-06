import { IoSearch } from 'react-icons/io5'

type Props = {
  value: string
  onChange: (v: string) => void
  tabs: ReadonlyArray<{ key: string; label: string }>
  active: string
  onTab: (key: string) => void
}

export function TopSearchBar({ value, onChange, tabs, active, onTab }: Props) {
  return (
    <div className="pointer-events-none absolute top-[20px] left-1/2 z-10 w-[90%] -translate-x-1/2 space-y-3">
      <div className="border-main pointer-events-auto flex items-center gap-[4px] rounded-full border bg-white p-[12px]">
        <IoSearch className="text-main" size={20} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="주변의 관광지와 맛집을 찾아보세요!"
          className="placeholder-gray-60 text-regular16 w-full outline-none"
        />
      </div>

      <div className="pointer-events-auto flex gap-[10px]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onTab(t.key)}
            className={`text-semi14 rounded-[4px] px-[10px] py-[4px] transition-colors ${
              active === t.key
                ? 'bg-main text-white'
                : 'border-sub border bg-white text-black'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
