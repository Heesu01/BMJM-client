import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import { TopSearchBar } from './TopSearchBar'

const meta: Meta<typeof TopSearchBar> = {
  title: 'Widgets/Map/TopSearchBar',
  component: TopSearchBar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative h-[480px] w-full overflow-hidden">
        <div className="h-full w-full bg-[url('https://picsum.photos/1200/800?blur=2')] bg-cover bg-center" />
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof TopSearchBar>

const sampleTabs = [
  { key: 'all', label: '전체' },
  { key: 'spot', label: '관광지' },
  { key: 'food', label: '맛집' },
  { key: 'cafe', label: '카페' },
]

function DemoTopSearchBar(
  props: Partial<React.ComponentProps<typeof TopSearchBar>>,
) {
  const [value, setValue] = useState(props.value ?? '')
  const [active, setActive] = useState(props.active ?? sampleTabs[0].key)

  return (
    <TopSearchBar
      value={value}
      onChange={(v) => {
        setValue(v)
      }}
      tabs={props.tabs ?? sampleTabs}
      active={active}
      onTab={(key) => {
        setActive(key)
      }}
    />
  )
}

export const Default: Story = {
  name: '기본',
  render: () => <DemoTopSearchBar />,
}

export const WithInitialValue: Story = {
  name: '초깃값 포함',
  render: () => <DemoTopSearchBar value="한강공원" />,
}

export const SecondTabActive: Story = {
  name: '두 번째 탭 활성화',
  render: () => <DemoTopSearchBar active="spot" />,
}

export const ManyTabs: Story = {
  name: '탭이 많은 경우',
  render: () => (
    <DemoTopSearchBar
      tabs={[
        { key: 'all', label: '전체' },
        { key: 'spot', label: '관광지' },
        { key: 'food', label: '맛집' },
        { key: 'cafe', label: '카페' },
        { key: 'hotel', label: '숙소' },
        { key: 'market', label: '시장' },
        { key: 'museum', label: '박물관' },
      ]}
    />
  ),
}

export const LongLabels: Story = {
  name: '라벨이 긴 탭',
  render: () => (
    <DemoTopSearchBar
      tabs={[
        { key: 'all', label: '전체' },
        { key: 'verylong', label: '아주아주아주긴탭라벨예시' },
        { key: 'food', label: '맛집' },
      ]}
    />
  ),
}
