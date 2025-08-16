// StartTripCTA.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import StartTripCTA from './StartTripCTA'

const meta: Meta<typeof StartTripCTA> = {
  title: 'Widgets/Home/StartTripCTA',
  component: StartTripCTA,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <div className="w-[360px] bg-[#F9F9F9] p-5">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof StartTripCTA>
export const Default: Story = {}
