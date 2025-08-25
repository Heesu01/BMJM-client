import type { ComponentType, SVGProps } from 'react'
import { icons, type IconName } from './icons'

type Props = {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
  decorative?: boolean
  title?: string
}

export default function Icon({
  name,
  size,
  className = '',
  strokeWidth,
  decorative,
  title,
}: Props) {
  const C = icons[name] as ComponentType<SVGProps<SVGSVGElement>>
  const a11y = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': title ?? name }
  const dimProps = size ? { width: size, height: size } : {}

  const forceFill =
    '[&_path]:fill-current [&_rect]:fill-current [&_circle]:fill-current [&_polygon]:fill-current [&_g]:fill-current'

  return (
    <C
      {...dimProps}
      strokeWidth={strokeWidth}
      className={`inline-block align-middle ${forceFill} ${className}`}
      {...a11y}
    />
  )
}
