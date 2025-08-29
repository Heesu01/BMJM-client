type TabKey = 'home' | 'menu' | 'review'
type Props = { value: TabKey; onChange: (v: TabKey) => void }

export default function TabNav({ value, onChange }: Props) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: '홈' },
    { key: 'menu', label: '메뉴' },
    { key: 'review', label: '후기' },
  ]

  return (
    <nav className="mt-[26px]">
      <div className="text-gray-80 grid grid-cols-3 text-center">
        {tabs.map((t) => {
          const active = value === t.key
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`relative px-3 py-3 text-base ${
                active ? 'text-semi16 text-main' : ''
              }`}
            >
              {t.label}
              <span
                className={`absolute inset-x-0 bottom-[-1px] h-[4px] ${
                  active ? 'bg-main' : 'bg-transparent'
                }`}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
