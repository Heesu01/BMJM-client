import type { ThemeComment } from '@/features/theme/model'
import { useState } from 'react'
import { IoIosSend } from 'react-icons/io'

type Props = {
  comments: ThemeComment[]
}

export default function ThemeComments({ comments }: Props) {
  const [text, setText] = useState('')

  return (
    <section className="border-gray-20 mt-6 border-t">
      <div className="px-[20px]">
        <h3 className="text-semi16 mt-[30px] mb-[20px]">
          댓글 {comments.length}
        </h3>
        <div>
          {comments.map((c) => (
            <article
              key={c.id}
              className="border-gray-20 mb-[20px] border-b bg-white pb-[30px]"
            >
              <div className="flex gap-[10px]">
                <img
                  src={c.userAvatar}
                  alt={c.user}
                  className="h-[44px] w-[44px] flex-shrink-0 rounded-full object-cover"
                />
                <div className="mb-[20px] min-w-0">
                  <div className="flex flex-col">
                    <p className="text-medium14">{c.user}</p>
                    <span className="text-medium12 text-gray-80">{c.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-medium16 text-gray-80 whitespace-pre-line">
                {c.content}
              </p>
            </article>
          ))}

          {comments.length === 0 && (
            <p className="py-6 text-center text-gray-400">
              아직 댓글이 없습니다.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white px-[20px] pt-[20px] pb-[38px] shadow-[0_-4px_10px_-6px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2 rounded-[10px] bg-[#f9f9f9] px-[10px] py-[12px]">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="댓글을 남겨주세요."
            className="text-regular16 placeholder:text-gray-40 h-full w-full rounded-[10px] outline-none"
          />
          <button
            type="button"
            aria-label="댓글 등록"
            onClick={() => {
              if (!text.trim()) return
              setText('')
            }}
          >
            <IoIosSend size={20} className="text-main" />
          </button>
        </div>
      </div>
    </section>
  )
}
