import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import BottomTabBar from './BottomTabBar'

const withPath = (path: string) => (Story: React.ComponentType) => (
  <MemoryRouter initialEntries={[path]}>
    <div className="relative min-h-[520px]">
      <Story />
    </div>
  </MemoryRouter>
)

const meta = {
  title: 'Shared/BottomTabBar',
  component: BottomTabBar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BottomTabBar>

export default meta
type Story = StoryObj<typeof meta>

export const Home: Story = { decorators: [withPath('/')] }
export const Themes: Story = { decorators: [withPath('/themes')] }
export const Puzzle: Story = { decorators: [withPath('/puzzle')] }
export const My: Story = { decorators: [withPath('/my')] }
export const MapCenter: Story = { decorators: [withPath('/map')] }

export const OnDark: Story = {
  decorators: [withPath('/')],
  parameters: { backgrounds: { default: 'Gray' } },
}
