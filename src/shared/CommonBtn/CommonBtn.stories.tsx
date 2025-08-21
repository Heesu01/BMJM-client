import type { Meta, StoryObj } from '@storybook/react-vite'
import CommonBtn from './CommonBtn'

const meta: Meta<typeof CommonBtn> = {
  title: 'Shared/CommonBtn',
  component: CommonBtn,
  argTypes: {
    children: { control: 'text' },
    className: { control: 'text' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: {
    children: '버튼',
    className:
      'px-4 py-2 rounded-md bg-main text-white hover:bg-main/90 active:bg-main/80',
    disabled: false,
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const CustomStyled: Story = {
  args: {
    children: '회색 버튼',
    className:
      'px-4 py-2 rounded-md bg-gray-200 text-gray-40 hover:bg-gray-300 active:bg-gray-400',
  },
}
