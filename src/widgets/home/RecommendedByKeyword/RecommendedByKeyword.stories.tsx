// widgets/home/RecommendedByKeyword/RecommendedByKeyword.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import RecommendedByKeyword from './RecommendedByKeyword'

// 카드 아이템 타입
type Item = {
  id: string
  title: string
  address: string
  imageUrl: string
}

// 키워드
const keywords = ['전통시장', '둘레길', '해운대', '국밥투어', '카페거리']

// 키워드별 아이템 (any 금지)
const itemsByKeyword: Record<string, Item[]> = {
  전통시장: [
    {
      id: '1',
      title: '전통시장 국수',
      address: '사하구 61-2',
      imageUrl: 'https://picsum.photos/seed/market1/400/300',
    },
    {
      id: '2',
      title: '은이네 해장국',
      address: '사하구 61-2',
      imageUrl: 'https://picsum.photos/seed/market2/400/300',
    },
    {
      id: '3',
      title: '분식골목',
      address: '중구 부평동',
      imageUrl: 'https://picsum.photos/seed/market3/400/300',
    },
  ],
  둘레길: [
    {
      id: '4',
      title: '갈맷길 1코스',
      address: '영도구',
      imageUrl: 'https://picsum.photos/seed/trail1/400/300',
    },
    {
      id: '5',
      title: '해안산책로',
      address: '기장군',
      imageUrl: 'https://picsum.photos/seed/trail2/400/300',
    },
  ],
  해운대: [
    {
      id: '6',
      title: '해운대 초밥집',
      address: '해운대구',
      imageUrl: 'https://picsum.photos/seed/haeundae1/400/300',
    },
  ],
  국밥투어: [
    {
      id: '7',
      title: '돼지국밥 성지',
      address: '부산진구',
      imageUrl: 'https://picsum.photos/seed/gukbap1/400/300',
    },
    {
      id: '8',
      title: '할매국밥',
      address: '동래구',
      imageUrl: 'https://picsum.photos/seed/gukbap2/400/300',
    },
  ],
  카페거리: [
    {
      id: '9',
      title: '오션뷰 카페',
      address: '수영구 광안리',
      imageUrl: 'https://picsum.photos/seed/cafe1/400/300',
    },
  ],
} as const satisfies Record<string, Item[]>

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
    initialKeyword: { control: 'select', options: keywords },
    onKeywordChange: { action: 'keyword changed' },
  },
}
export default meta
type Story = StoryObj<typeof RecommendedByKeyword>

export const Default: Story = {
  args: {
    keywords: [...keywords],
    itemsByKeyword, // ✅ any 제거
  },
}

export const InitialHaeundae: Story = {
  args: {
    keywords: [...keywords],
    itemsByKeyword,
    initialKeyword: '해운대',
  },
}

const manyItems: Record<string, Item[]> = {
  전통시장: Array.from({ length: 8 }).map((_, i) => ({
    id: `mk-${i}`,
    title: `시장 맛집 ${i + 1}`,
    address: '부산 어딘가',
    imageUrl: `https://picsum.photos/seed/mk-${i}/400/300`,
  })),
}

export const ManyCardsScroll: Story = {
  args: {
    keywords: ['전통시장'],
    itemsByKeyword: manyItems,
  },
}

export const EmptyState: Story = {
  args: {
    keywords: ['빈키워드'],
    itemsByKeyword: { 빈키워드: [] } as Record<string, Item[]>,
  },
}
