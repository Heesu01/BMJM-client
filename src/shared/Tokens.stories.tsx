import type { Meta, StoryObj } from '@storybook/react-vite'

const ColorBox = ({ name, cls }: { name: string; cls: string }) => (
  <div className="flex items-center gap-3">
    <div className={`h-10 w-10 rounded ${cls} border-gray-20 border`} />
    <span className="text-body">{name}</span>
  </div>
)

const meta = {
  title: 'Tokens/Overview',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <ColorBox name="brand" cls="bg-brand" />
      <ColorBox name="brand-pressed" cls="bg-brand-pressed" />
      <ColorBox name="sub" cls="bg-sub" />
      <ColorBox name="sub-2" cls="bg-sub-2" />
      <ColorBox name="gray-100" cls="bg-gray-100" />
      <ColorBox name="gray-20" cls="bg-gray-20" />
      <ColorBox name="gray-40" cls="bg-gray-40" />
      <ColorBox name="gray-60" cls="bg-gray-60" />
      <ColorBox name="gray-80" cls="bg-gray-80" />
      <ColorBox name="black" cls="bg-black" />
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div className="space-y-3">
      <p className="text-display font-display">부산바다체 Display 24</p>
      <p className="text-h1 font-sans">Semibold 24</p>
      <p className="text-h2 font-sans">Semibold 20</p>
      <p className="text-body font-sans">Medium 16</p>
      <p className="text-body-sm font-sans">Regular 14</p>
      <p className="text-caption font-sans">Regular 12</p>
    </div>
  ),
}
