import { PiClockFill } from 'react-icons/pi'
import { IoIosCall } from 'react-icons/io'
import { MdLocationOn } from 'react-icons/md'
import { IoSearchCircle } from 'react-icons/io5'
import type { Place } from '@/entities/map'

export default function HomeTab({ place }: { place: Place }) {
  const { tel = '', address = '', hours = '', website = '' } = place ?? {}

  const Row = ({
    icon,
    children,
  }: {
    icon: React.ReactNode
    children: React.ReactNode
  }) => (
    <div className="flex items-center gap-[10px] py-[15px]">
      <span className="text-gray-500">{icon}</span>
      <div className="flex-1 text-[15px]">{children}</div>
    </div>
  )

  return (
    <section className="mt-[14px] text-black">
      <Row
        icon={<PiClockFill className="text-gray-80 -scale-x-100 transform" />}
      >
        {hours ? <>영업중 {hours}</> : '영업 정보 없음'}
      </Row>
      <div className="text-gray-20 border-t" />

      {tel && (
        <>
          <Row icon={<IoIosCall className="text-gray-80" />}>{tel}</Row>
          <div className="text-gray-20 border-t" />
        </>
      )}

      <Row icon={<MdLocationOn className="text-gray-80" />}>
        {address || '주소 정보 없음'}
      </Row>
      <div className="text-gray-20 border-t" />

      {website && (
        <>
          <Row icon={<IoSearchCircle className="text-gray-80" />}>
            <a href={website} target="_blank" rel="noreferrer">
              {website}
            </a>
          </Row>
          <div className="text-gray-20 border-t" />
        </>
      )}
    </section>
  )
}
