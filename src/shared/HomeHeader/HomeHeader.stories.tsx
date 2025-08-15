import type { Meta, StoryObj } from '@storybook/react-vite'
import Header from './HomeHeader'

const meta = {
  title: 'Shared/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: {
    showBell: false,
    className: '',
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBell: Story = {
  args: { showBell: true },
}

export const Sticky: Story = {
  args: { showBell: true, className: 'sticky top-0 z-50' },
}
