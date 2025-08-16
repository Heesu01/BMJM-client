import type { Meta, StoryObj } from '@storybook/react-vite'
import HeroCard from './HeroCard'

const meta: Meta<typeof HeroCard> = {
  title: 'Widgets/Home/HeroCard',
  component: HeroCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[360px] bg-[#F9F9F9] p-5">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isLoggedIn: { control: 'boolean' },
    nickname: { control: 'text' },
    current: { control: { type: 'number', min: 0 } },
    total: { control: { type: 'number', min: 1 } },
    successMissions: { control: { type: 'number', min: 0 } },
    runningThemes: { control: { type: 'number', min: 0 } },
    onLoginClick: { action: 'login clicked' },
  },
}
export default meta
type Story = StoryObj<typeof HeroCard>

export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
    nickname: '닉네임',
    current: 3,
    total: 10,
    successMissions: 10,
    runningThemes: 2,
  },
}

export const LoggedOut: Story = {
  args: {
    isLoggedIn: false,
  },
}

export const ZeroProgress: Story = {
  args: {
    isLoggedIn: true,
    nickname: '여행자',
    current: 0,
    total: 10,
    successMissions: 0,
    runningThemes: 0,
  },
}

export const AlmostDone: Story = {
  args: {
    isLoggedIn: true,
    nickname: '네임',
    current: 9,
    total: 10,
    successMissions: 27,
    runningThemes: 5,
  },
}
