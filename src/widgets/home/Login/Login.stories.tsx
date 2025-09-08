import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'

const meta: Meta<typeof Login> = {
  title: 'Widgets/home/Login',
  component: Login,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="mx-auto w-[360px] bg-[#F9F9F9] p-5">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  // argTypes: {
  //   onKakaoLogin: { action: 'kakao login click' },
  // },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: {} }
