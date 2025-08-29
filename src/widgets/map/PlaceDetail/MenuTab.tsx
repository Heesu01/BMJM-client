import type { Menu } from '@/entities/map'

export default function MenuList({ menus = [] }: { menus: Menu[] }) {
  return (
    <section className="mt-[14px]">
      <div>
        {menus.map((m, i) => (
          <div key={i} className="border-gray-20 border-b px-4 py-3">
            <div className="text-regular14 mb-[5px]">{m.name}</div>
            <div className="text-semi14">{m.price.toLocaleString()}원</div>
          </div>
        ))}
      </div>
    </section>
  )
}
