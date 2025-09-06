import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import {
  MyHeaderBadge,
  MyProfileCard,
  MyStatRow,
  type MyProfile,
} from './MyPageWidgets'

const meta = {
  title: 'Widgets/My',
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="mx-auto max-w-[420px] bg-gray-50 p-16">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta
export default meta
type Story = StoryObj

export const HeaderBadge: Story = {
  render: () => <MyHeaderBadge label="부산 맛집왕" />,
}

export const ProfileCard: Story = {
  render: () => {
    const profile: MyProfile = {
      name: '이윤재',
      email: 'lki3532@naver.com',
    }
    return <MyProfileCard profile={profile} />
  },
}

export const StatRow: Story = {
  render: () => (
    <MyStatRow
      items={[
        { label: '성공 미션', value: 10 },
        { label: '퍼즐 수집', value: 2 },
      ]}
    />
  ),
}
