type TabKey = 'official' | 'user'

type Props = {
  value: TabKey
  onChange: (v: TabKey) => void
  className?: string
}

export default function ThemeTabNav({
  value,
  onChange,
  className = '',
}: Props) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'official', label: '공식 테마' },
    { key: 'user', label: '유저 테마' },
  ]

  return (
    <nav
      className={['sticky top-0 z-40', 'bg-white', 'mb-[30px]', className].join(
        ' ',
      )}
    >
      <div className="h-[10px] w-full"></div>
      <div className="text-gray-60 text-semi16 grid h-[55px] grid-cols-2 text-center">
        {tabs.map((t) => {
          const active = value === t.key
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`relative text-base ${active ? 'text-main' : ''}`}
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
