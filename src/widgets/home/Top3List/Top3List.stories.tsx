import type { Meta, StoryObj } from '@storybook/react-vite'
import Top3List from './Top3List'
import type { Top3Item } from '@/features/home/model'

const items: Top3Item[] = [
  {
    id: '1',
    title: '부산 최고 맛집, 피리피리',
    address: '해운대구 6-2',
    imageUrl: 'https://picsum.photos/seed/top1/1200/800',
  },
  {
    id: '2',
    title: '부산 최고 맛집, 피리피리',
    address: '해운대구 6-2',
    imageUrl: 'https://picsum.photos/seed/top2/1200/800',
  },
  {
    id: '3',
    title: '부산 최고 맛집, 피리피리',
    address: '해운대구 6-2',
    imageUrl: 'https://picsum.photos/seed/top3/1200/800',
  },
]

const meta: Meta<typeof Top3List> = {
  title: 'Widgets/Home/Top3List',
  component: Top3List,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[360px] bg-[#F9F9F9] p-5">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onItemClick: { action: 'clicked' },
    className: { control: 'text' },
  },
}
export default meta

type Story = StoryObj<typeof Top3List>

export const WithData: Story = {
  args: { items },
}

export const Fallback: Story = {
  args: {},
}

export const WithBrokenImages: Story = {
  args: {
    items: items.map((it) => ({ ...it, imageUrl: 'https://invalid.example' })),
  },
}
