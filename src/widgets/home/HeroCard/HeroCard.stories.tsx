import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import HeroCard from './HeroCard'

const meta: Meta<typeof HeroCard> = {
  title: 'Widgets/Home/HeroCard',
  component: HeroCard,
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
  argTypes: {
    isLoggedIn: { control: 'boolean' },
  },
  args: {
    isLoggedIn: false,
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const LoggedOut: Story = {
  args: { isLoggedIn: false },
}

export const LoggedIn: Story = {
  args: { isLoggedIn: true },
}
