type TabKey = 'about' | 'review'
type Props = {
  value: TabKey
  onChange: (v: TabKey) => void
  className?: string
}

export default function DetailTabNav({
  value,
  onChange,
  className = '',
}: Props) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'about', label: '테마 설명' },
    { key: 'review', label: '테마 리뷰' },
  ]
  return (
    <nav className={`sticky top-0 z-30 bg-white ${className}`}>
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
                className={`absolute inset-x-0 bottom-[-1px] h-[3px] ${
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
