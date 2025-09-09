export type ThemeDetailApi = {
  statusCode: string
  message: string
  data: {
    themeId: string
    title: string
    introduction: string
    mainImageUrls: string[]
    scrapped: boolean
    writer: string
    writerProfile?: string
    viewCount: number
    keywords: string[]
    themeItems: Array<{
      content: string
      address: string
      imageUrl?: string
    }>
  }
}

export type ThemeSection = {
  id: string
  authorName: string
  authorAvatar?: string
  date: string
  placeName: string
  address: string
  imageUrl?: string
  content: string
}

export type ThemeDetail = {
  themeId: string
  title: string
  introduction: string
  tags: string[]
  mainImageUrl?: string
  createdAt: string
  viewCount: number
  scrapped: boolean
  sections: ThemeSection[]
}

const IMG_MAP: Record<string, string> = {
  img8: 'https://images.unsplash.com/photo-1551276317-801d8e52d0d5?q=80&w=1600',
  img9: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=1600',
  img10:
    'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1600',
  img11:
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1600',
  img12:
    'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600',
  img13:
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1600',
}
const toUrl = (k?: string) =>
  !k
    ? undefined
    : k.startsWith('http')
      ? k
      : (IMG_MAP[k] ?? `https://picsum.photos/seed/${k}/1600/900`)

const MOCK_DETAIL_API: ThemeDetailApi = {
  statusCode: '200 OK',
  message: '테마 상세 조회 성공',
  data: {
    themeId: 'c90a8acd-e407-40da-8070-752ceb6eb348',
    title: '🎨 지금 가장 핫한 팝업 & 전시 in 부산 ✨',
    introduction:
      '올여름, 부산 곳곳에서 열리는 특별한 팝업과 전시를 놓치지 마세요!',
    mainImageUrls: ['img9', 'img8', 'img10'],
    scrapped: true,
    writer: '최현서',
    writerProfile:
      'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
    viewCount: 1,
    keywords: ['혼행 감성', '데이트 코스'],
    themeItems: [
      {
        content:
          '🖼 힐마 아프 클린트 : 적절한 소환\n📍 위치 : 부산 사하구 낙동남로 1191 부산 현대미술관\n📅 기간 : 2025.07.19 ~ 2025.10.26\n💡 팁 : 스웨덴 추상미술의 거장을 직접 만나는 시간, 색채와 패턴 속 몰입 경험 가능.',
        address: '부산 사하구 낙동남로 1191 부산 현대미술관',
        imageUrl: 'img13',
      },
      {
        content:
          '🧞 알라딘 팝업\n📍 위치 : 부산 영도구 해양로195번길 180 (동삼동) 피아크 3-4F\n📅 기간 : 2025.06.25 ~ 2025.08.31\n💡 팁 : 마법의 램프 속 세계로 들어간 듯한 이색 체험! 화려한 배경에서 사진 찍기 좋아요.',
        address: '부산 영도구 해양로195번길 180 (동삼동) 피아크 3-4F',
        imageUrl: 'img12',
      },
      {
        content:
          '🏕 짱구와 함께 떠나는 캠핑 어드벤처 전시\n📍 위치 : 부산 영도구 해양로195번길 180 (동삼동)\n📅 기간 : 2025.06.28 ~ 2025.11.02\n💡 팁 : 귀여운 짱구와 함께 캠핑 컨셉의 포토존에서 인생샷을 남겨보세요.',
        address: '부산 영도구 해양로195번길 180 (동삼동)',
        imageUrl: 'img8',
      },
      {
        content:
          '🍍 스펀지밥 X 팝퍼블 콜라보 카페\n📍 위치 : 부산 수영구 민락수변로17번길 56 (민락동)\n📅 기간 : 2025.07.04 ~ 2025.10.12\n💡 팁 : 바닷가 감성과 스펀지밥의 발랄함이 어우러진 카페에서 귀여운 메뉴까지 즐겨보세요.',
        address: '부산 수영구 민락수변로17번길 56 (민락동)',
        imageUrl: 'img11',
      },
      {
        content:
          '🛍 누누 부산 팝업스토어\n📍 위치 : 부산 기장군 기장읍 동부산관광1로 60 라우어 애비뉴\n📅 기간 : 2025.06.21 ~ 2025.12.31\n💡 팁 : 시즌 한정 컬렉션과 기장 바닷바람을 함께 즐길 수 있는 쇼핑 스팟.',
        address: '부산 기장군 기장읍 동부산관광1로 60 라우어 애비뉴',
        imageUrl: 'img10',
      },
      {
        content:
          '⚡ 포켓몬 팝업 - 부산\n📍 위치 : 부산 부산진구 가야대로 772 (롯데백화점 부산본점)\n📅 기간 : 2025.07.25 ~ 2025.08.17\n💡 팁 : 한정 굿즈와 포토존이 가득한, 덕후들의 성지! 피카츄와 인증샷 필수.',
        address: '부산 부산진구 가야대로 772 (롯데백화점 부산본점)',
        imageUrl: 'img9',
      },
    ],
  },
}

function mapApiToDetail(api: ThemeDetailApi): ThemeDetail {
  const d = api.data
  return {
    themeId: d.themeId,
    title: d.title,
    introduction: d.introduction,
    tags: d.keywords ?? [],
    mainImageUrl: toUrl(d.mainImageUrls?.[0]),
    createdAt: new Date().toISOString().slice(0, 10),
    viewCount: d.viewCount ?? 0,
    scrapped: !!d.scrapped,
    sections: (d.themeItems ?? []).map((it, idx) => ({
      id: `sec-${idx}`,
      authorName: d.writer,
      authorAvatar: d.writerProfile,
      date: new Date().toISOString().slice(0, 10),
      placeName: it.address?.split(' ').slice(-1)[0] || '장소',
      address: it.address,
      imageUrl: toUrl(it.imageUrl),
      content: it.content,
    })),
  }
}

export async function fetchThemeById(id: string): Promise<ThemeDetail> {
  await new Promise((r) => setTimeout(r, 150))
  return mapApiToDetail(MOCK_DETAIL_API)
}

export type ThemeCommentsApi = {
  statusCode: string
  message: string
  data: {
    commentList: Array<{
      commentId: string
      writer: string
      writerProfile?: string
      content: string
      createdAt: string
    }>
  }
}

export type ThemeComment = {
  id: string
  user: string
  userAvatar?: string
  content: string
  date: string
}

function mapCommentsApi(api: ThemeCommentsApi): ThemeComment[] {
  const list = api.data?.commentList ?? []
  return list.map((c, idx) => ({
    id: `${c.commentId}-${idx}`,
    user: c.writer,
    userAvatar: c.writerProfile,
    content: c.content,
    date: c.createdAt,
  }))
}

const MOCK_COMMENTS_API: ThemeCommentsApi = {
  statusCode: '200 OK',
  message: '테마 댓글 목록 조회 성공',
  data: {
    commentList: [
      {
        commentId: 'ee96b91a-72c4-4286-ace4-c026fdabf113',
        writer: '최현서',
        writerProfile:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        content: '테스트 댓글 달아보기3',
        createdAt: '2025-09-04',
      },
      {
        commentId: 'ee96b91a-72c4-4286-ace4-c026fdabf113',
        writer: '최현서',
        writerProfile:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        content: '테스트 댓글 달아보기2',
        createdAt: '2025-09-04',
      },
      {
        commentId: 'ee96b91a-72c4-4286-ace4-c026fdabf113',
        writer: '최현서',
        writerProfile:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        content: '테스트 댓글 달아보기1',
        createdAt: '2025-09-04',
      },
    ],
  },
}

export async function fetchThemeComments(id: string): Promise<ThemeComment[]> {
  await new Promise((r) => setTimeout(r, 120))
  return mapCommentsApi(MOCK_COMMENTS_API)
}

export type ThemeReviewsApi = {
  statusCode: string
  message: string
  data: {
    reviewList: Array<{
      themeReviewId: string
      writer: string
      writerProfile?: string
      content: string
      createdAt: string
      imageUrls?: string[]
    }>
  }
}

export type ThemeReview = {
  id: string
  user: string
  userAvatar?: string
  content: string
  date: string
  imageUrls?: string[]
}

function mapReviewsApi(api: ThemeReviewsApi): ThemeReview[] {
  return (api.data?.reviewList ?? []).map((r, idx) => ({
    id: `${r.themeReviewId}-${idx}`,
    user: r.writer,
    userAvatar: r.writerProfile,
    content: r.content,
    date: r.createdAt,
    imageUrls: r.imageUrls ?? [],
  }))
}

const MOCK_REVIEWS_API: ThemeReviewsApi = {
  statusCode: '200 OK',
  message: '테마 리뷰 목록 조회 성공',
  data: {
    reviewList: [
      {
        themeReviewId: '4a93ca17-2390-45cc-8cf4-8bb7753e8f00',
        writer: '최현서',
        writerProfile:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        content: '테마 리뷰 테스트3',
        createdAt: '2025-09-04',
        imageUrls: [
          'https://bjjm-bucket.s3.ap-northeast-2.amazonaws.com/theme-reviews/343b24af-d8f4-4e0b-b700-0d2504856026.png',
          'https://bjjm-bucket.s3.ap-northeast-2.amazonaws.com/theme-reviews/1c34ca23-51a4-4993-994d-fe47e34fb0f7.png',
        ],
      },
      {
        themeReviewId: '4a93ca17-2390-45cc-8cf4-8bb7753e8f00',
        writer: '최현서',
        writerProfile:
          'http://k.kakaocdn.net/dn/OJ3hv/btsP11uwjuZ/mJ69R18pQBiGaU7ys8k3h0/img_640x640.jpg',
        content: '테마 리뷰 테스트3',
        createdAt: '2025-09-04',
        imageUrls: [
          'https://bjjm-bucket.s3.ap-northeast-2.amazonaws.com/theme-reviews/343b24af-d8f4-4e0b-b700-0d2504856026.png',
          'https://bjjm-bucket.s3.ap-northeast-2.amazonaws.com/theme-reviews/1c34ca23-51a4-4993-994d-fe47e34fb0f7.png',
        ],
      },
    ],
  },
}

export async function fetchThemeReviews(id: string): Promise<ThemeReview[]> {
  await new Promise((r) => setTimeout(r, 100))
  return mapReviewsApi(MOCK_REVIEWS_API)
}
