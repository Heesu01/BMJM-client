import { CommonBtn } from '@/shared/CommonBtn'

type Props = {
  id: string
  title: string
  desc: string
  thumbs: string[]
  onClick?: (id: string) => void
}

export function ThemeCard({ id, title, desc, thumbs, onClick }: Props) {
  return (
    <article className="border-sub flex min-h-[165px] flex-col justify-center rounded-[20px] border bg-white p-[16px]">
      <h3 className="text-semi16 text-black">{title}</h3>
      <p className="text-gray-60 text-medium14 mt-[6px] line-clamp-2">{desc}</p>

      <div className="mt-[11px] flex items-center justify-between">
        <div className="flex">
          {thumbs.slice(0, 3).map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt=""
              className={`border-main h-[59px] w-[59px] rounded-full border-1 object-cover ${i ? '-ml-2' : ''}`}
            />
          ))}
        </div>
        <CommonBtn
          className="bg-main rounded-[10px] px-[24.5px] py-[9.5px]"
          onClick={() => onClick?.(id)}
        >
          테마 보기
        </CommonBtn>
      </div>
    </article>
  )
}
