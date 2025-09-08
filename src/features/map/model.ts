import { api } from '@/shared/api/client'
import type { Place, Menu, Review } from '@/entities/map'

type PlaceDto = {
  placeName: string
  address: string
  tel?: string
  mainMenu?: string
  otherMenu?: string
  usageTime?: string
  holiday?: string
  content?: string
  mainImageUrl?: string
  scoreAvg?: number
  reviewCount?: number
}

type GetPlaceResp = {
  statusCode: string
  message: string
  data: PlaceDto
}

function extractDirectImage(raw?: string) {
  if (!raw) return ''
  try {
    const outer = new URL(raw)
    if (
      outer.hostname.includes('tripinfo.co.kr') &&
      outer.pathname.endsWith('/thumb.php')
    ) {
      const inner = outer.searchParams.get('url')
      if (inner) {
        const url = new URL(inner.replace(/\?OPT=/g, '&OPT='))
        url.protocol = 'https:'
        url.search = ''
        return url.toString()
      }
    }
  } catch {
    //
  }
  return raw
}

function splitMenuNames(main?: string, others?: string): string[] {
  const tokens = [
    main,
    ...(others ? others.split(/[\/,]/).map((s) => s.trim()) : []),
  ]
  return tokens.filter(Boolean).map((s) => s!.replace(/\s*등$/, ''))
}

export function mapDtoToPlace(dto: PlaceDto): Place {
  const names = splitMenuNames(dto.mainMenu, dto.otherMenu)
  const menus: Menu[] = names.map((n) => ({ name: n, price: 0 }))
  const direct = extractDirectImage(dto.mainImageUrl)

  return {
    id: dto.placeName,
    name: dto.placeName,
    address: dto.address,
    tel: dto.tel ?? '',
    hours: dto.usageTime ?? '',
    website: '',
    photos: direct ? [direct] : [],
    description: dto.content ?? '',
    rating: typeof dto.scoreAvg === 'number' ? dto.scoreAvg : 0,
    reviewCount: dto.reviewCount ?? 0,
    menus,
    reviews: [],
    lat: 0,
    lng: 0,
  }
}

// 장소 단건 조회 API
export async function fetchPlaceByName(name: string): Promise<Place> {
  const { data } = await api.get<GetPlaceResp>('/map', {
    params: { query: name },
  })
  return mapDtoToPlace(data.data)
}

type PlaceReviewDto = {
  userName: string
  userProfileImageUrl: string
  content: string
  placeReviewImageUrls: string[]
  score: number
  createdAt: string
}

type GetPlaceReviewsResp = {
  statusCode: string
  message: string
  data: { placeReviewList: PlaceReviewDto[] }
}

function toReview(dto: PlaceReviewDto, idx: number): Review {
  return {
    id: `${dto.userName}-${dto.createdAt}-${idx}`,
    user: dto.userName,
    userAvatar: extractDirectImage(dto.userProfileImageUrl),
    date: dto.createdAt,
    rating: typeof dto.score === 'number' ? dto.score : 0,
    text: dto.content,
    photos: (dto.placeReviewImageUrls ?? []).map(extractDirectImage),
  }
}

// 리뷰 목록 조회 API
export async function fetchPlaceReviews(placeName: string): Promise<Review[]> {
  const { data } = await api.get<GetPlaceReviewsResp>('/place-reviews/list', {
    params: { placeName },
  })
  const list = data?.data?.placeReviewList ?? []
  return list.map(toReview)
}
