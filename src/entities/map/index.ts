export type Menu = { name: string; price: number }

export type Review = {
  id: string
  user: string
  userAvatar?: string
  date: string
  rating: number
  text: string
  photos?: string[]
}

export type Place = {
  id: string
  name: string
  address: string
  tel?: string
  website?: string
  rating: number
  reviewCount: number
  hours?: string
  lat: number
  lng: number
  photos: string[]
  menus: Menu[]
  reviews: Review[]
  description?: string
}

const mockPlaces: Place[] = [
  {
    id: '1',
    name: '은이네 해장국',
    address: '부산광역시 동구 중앙대로214번길 3-8',
    tel: '051-123-4567',
    website: 'https://example.com/euni-haejang',
    rating: 4.7,
    reviewCount: 25,
    hours: '08:00-22:00',
    lat: 35.1001,
    lng: 129.0401,
    photos: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
    ],
    menus: [
      { name: '은이 해장국', price: 12000 },
      { name: '은이 해장국 (특)', price: 14000 },
      { name: '돼지고기 수육', price: 24000 },
      { name: '소주', price: 4000 },
      { name: '맥주', price: 5000 },
      { name: '막걸리', price: 6000 },
    ],
    reviews: [
      {
        id: 'r1',
        user: 'lki3532',
        userAvatar: 'https://i.pravatar.cc/100?img=5',
        date: '2025-07-06',
        rating: 4.7,
        text: '국물 진하고 속 편안함. 재방문 의사 있음!',
        photos: [
          'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
        ],
      },
      {
        id: 'r2',
        user: 'eunhee',
        date: '2025-07-02',
        rating: 4.5,
        text: '국물 진하고 속 편안해짐. 재방문 의사 있습니다.',
      },
    ],
  },
]

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getPlaceById(id: string): Promise<Place> {
  await delay(120)
  return mockPlaces.find((p) => p.id === id) ?? mockPlaces[0]
}

export async function getAllPlaces(): Promise<Place[]> {
  await delay(120)
  return mockPlaces
}
