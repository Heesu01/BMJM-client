type Props = {
  title: string
  description: string
  items: string[]
  selected: string[]
  onToggle: (label: string) => void
}

export function KeywordGroup({
  title,
  description,
  items,
  selected,
  onToggle,
}: Props) {
  return (
    <section className="mb-[40px]">
      <h2 className="text-semi16 mb-[10px] text-black">{title}</h2>
      <p className="text-semi14 text-gray-40 mb-[16px]">{description}</p>

      <div className="flex flex-wrap gap-[10px]">
        {items.map((label) => {
          const active = selected.includes(label)
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className={`text-semi14 rounded-full border p-[8px] transition ${
                active
                  ? 'bg-main border-main text-white'
                  : 'border-sub bg-white text-black'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
