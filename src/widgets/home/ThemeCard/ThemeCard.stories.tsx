import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeCard } from './ThemeCard'

const thumbs = [
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400',
  'https://images.unsplash.com/photo-1534982841079-afde227ada8f?q=80&w=400',
  'https://images.unsplash.com/photo-1525054098605-8e762c017741?q=80&w=400',
]

const meta = {
  title: 'Widgets/home/theme',
  component: ThemeCard,
  parameters: {
    layout: 'padded',
  },
  args: {
    id: 'ij-market',
    title: "영화 '국제시장' 테마",
    desc: "부산을 배경으로 한 영화 '국제시장'의 명소를 둘러보세요",
    thumbs,
  },
  argTypes: {
    onClick: { action: 'open-theme' },
  },
} satisfies Meta<typeof ThemeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongText: Story = {
  args: {
    title:
      "사진 남기기 딱 좋은 '국제시장 + 보수동 책방골목 + 깡통시장' 종합 테마 코스",
    desc: '로컬 감성을 느낄 수 있는 골목 투어와 함께 맛집, 카페, 야경 스폿까지 한 번에 즐겨보세요. 이동 동선이 짧아 한나절 코스로도 충분해요.',
  },
}

export const ManyThumbs: Story = {
  args: {
    thumbs: [
      ...thumbs,
      'https://images.unsplash.com/photo-1519160558534-579f5104c771?q=80&w=400',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=400',
    ],
  },
}

export const NoThumbs: Story = {
  args: { thumbs: [] },
}

export const CustomAction: Story = {
  args: {
    onClick: (id: string) => alert(`테마 열기: ${id}`),
  },
}
