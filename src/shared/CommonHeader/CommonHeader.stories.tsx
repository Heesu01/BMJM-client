import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import CommonHeader from './CommonHeader'

const meta: Meta<typeof CommonHeader> = {
  title: 'Shared/CommonHeader',
  component: CommonHeader,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="relative min-h-[260px] bg-gray-100">
          <Story />
          <div className="px-4 pt-[72px]">
            <p>본문 예시 영역</p>
          </div>
        </div>
      </MemoryRouter>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: '로그인' },
}

export const WithRootPath: Story = {
  args: { title: '설정', rootPath: '/home' },
}

export const CustomOnBack: Story = {
  args: { title: '타이틀', onBack: () => alert('뒤로가기!') },
}
