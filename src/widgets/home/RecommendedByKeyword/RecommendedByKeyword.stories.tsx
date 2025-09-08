import type { Meta, StoryObj } from '@storybook/react-vite'
import RecommendedByKeyword from './RecommendedByKeyword'

import { THEME_KEYWORDS, type ThemeKeyword } from '@/features/home/model'

const meta: Meta<typeof RecommendedByKeyword> = {
  title: 'Widgets/Home/RecommendedByKeyword',
  component: RecommendedByKeyword,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[360px] bg-[#F9F9F9] p-5">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    initialKeyword: {
      control: 'select',
      options: THEME_KEYWORDS.map((k) => k.value) as ThemeKeyword[],
    },
    onKeywordChange: { action: 'keyword changed' },
    className: { control: 'text' },
  },
}
export default meta

type Story = StoryObj<typeof RecommendedByKeyword>

export const Default: Story = {
  args: {},
}

export const WithInitial: Story = {
  args: {
    initialKeyword: THEME_KEYWORDS[0]?.value,
  },
}
