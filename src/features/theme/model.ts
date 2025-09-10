import { api, type ApiError } from '@/shared/api/client'

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

const normalizeImage = (s?: string) =>
  s && /^https?:\/\//.test(s) ? s : undefined

function mapApiToDetail(api: ThemeDetailApi): ThemeDetail {
  const d = api.data
  return {
    themeId: d.themeId,
    title: d.title,
    introduction: d.introduction,
    tags: d.keywords ?? [],
    mainImageUrl: normalizeImage(d.mainImageUrls?.find(Boolean)),
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
      imageUrl: normalizeImage(it.imageUrl),
      content: it.content,
    })),
  }
}

// [DETAIL] 테마 상세 조회
export async function fetchThemeById(id: string): Promise<ThemeDetail> {
  try {
    if (!id) throw new Error('themeId is required')
    const safe = encodeURIComponent(id)
    const res = await api.get<ThemeDetailApi>(`/themes/${safe}/detail`)
    return mapApiToDetail(res.data)
  } catch (e) {
    throw e as ApiError
  }
}

export type OfficialThemeAPI = {
  themeId: string
  title: string
  introduction: string
  mainImageUrls: string[]
  createdAt: string
  viewCount: number
}
export type OfficialThemeListResp = {
  statusCode: string
  message: string
  data: { themeList: OfficialThemeAPI[] }
}

// [LIST] 오늘의 추천 테마 목록
export async function fetchTodayThemes() {
  try {
    const res = await api.get<OfficialThemeListResp>('/themes/today')
    return res.data.data.themeList ?? []
  } catch (e) {
    throw e as ApiError
  }
}

export type ThemeType = 'official' | 'user'
export type ServerKeyword =
  | 'LOCAL_TOUR'
  | 'FOOD_TOUR'
  | 'ALLEY_TRIP'
  | 'DATE_COURSE'
  | 'SOLO_TRIP'
  | 'FAMILY_WITH_CHILD'
  | 'NIGHT_VIEW'
  | 'CAFE_PHOTO'
  | 'MOVIE_LOCATION'
  | 'LOCAL_COURSE'

// [LIST] 키워드별 테마 목록
export async function fetchThemesByKeyword(params: {
  themeType: ThemeType
  keyword: ServerKeyword
}) {
  try {
    const res = await api.get<OfficialThemeListResp>('/themes/keyword', {
      params,
    })
    return res.data.data.themeList ?? []
  } catch (e) {
    throw e as ApiError
  }
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
  return (api.data?.commentList ?? []).map((c, idx) => ({
    id: `${c.commentId}-${idx}`,
    user: c.writer,
    userAvatar: c.writerProfile,
    content: c.content,
    date: c.createdAt,
  }))
}

// [COMMENT] 댓글 목록
export async function fetchThemeComments(id: string): Promise<ThemeComment[]> {
  try {
    if (!id) throw new Error('themeId is required')
    const safe = encodeURIComponent(id)
    const res = await api.get<ThemeCommentsApi>(`/themes/${safe}/comment/list`)
    return mapCommentsApi(res.data)
  } catch (e) {
    throw e as ApiError
  }
}

export type CreateThemeCommentReq = { content: string }

// [COMMENT] 댓글 작성
export async function createThemeComment(
  themeId: string,
  content: string,
): Promise<ThemeComment[]> {
  try {
    if (!themeId) throw new Error('themeId is required')
    if (!content?.trim()) throw new Error('content is required')

    const safe = encodeURIComponent(themeId)
    await api.post(`/themes/${safe}/comment`, {
      content,
    } satisfies CreateThemeCommentReq)

    return await fetchThemeComments(themeId)
  } catch (e) {
    throw e as ApiError
  }
}

export type ThemeReviewsApi = {
  statusCode: string
  message: string
  data: {
    reviewList: Array<{
      themeReviewId: string
      content: string
      writer: string
      writerProfile?: string
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

// [REVIEW] 리뷰 목록
export async function fetchThemeReviews(id: string): Promise<ThemeReview[]> {
  try {
    if (!id) throw new Error('themeId is required')
    const safe = encodeURIComponent(id)
    const res = await api.get<ThemeReviewsApi>(`/themes/${safe}/review/list`)
    return mapReviewsApi(res.data)
  } catch (e) {
    throw e as ApiError
  }
}

// [SCRAP] 스크랩 등록
export async function scrapTheme(themeId: string): Promise<void> {
  try {
    if (!themeId) throw new Error('themeId is required')
    const safe = encodeURIComponent(themeId)
    await api.post(`/themes/${safe}/scrap`)
  } catch (e) {
    throw e as ApiError
  }
}

// [SCRAP] 스크랩 취소
export async function unscrapTheme(themeId: string): Promise<void> {
  try {
    if (!themeId) throw new Error('themeId is required')
    const safe = encodeURIComponent(themeId)
    await api.delete(`/themes/${safe}/scrap`)
  } catch (e) {
    throw e as ApiError
  }
}

export type CreateThemeItem = {
  content: string
  address: string
  imageFile?: File | null
}

export type CreateThemeReq = {
  title: string
  introduction: string
  keywords: ServerKeyword[]
  items: CreateThemeItem[]
}

// form-data
export function buildThemeFormData(req: CreateThemeReq) {
  const fd = new FormData()
  fd.append('title', req.title)
  fd.append('introduction', req.introduction)

  req.keywords.forEach((kw, i) => fd.append(`keywords[${i}]`, kw))

  req.items.forEach((it, i) => {
    fd.append(`items[${i}].content`, it.content)
    fd.append(`items[${i}].address`, it.address)
    if (it.imageFile) {
      fd.append(`items[${i}].imageFile`, it.imageFile)
    }
  })

  return fd
}

// [CREATE] 테마 생성
export async function createTheme(req: CreateThemeReq) {
  try {
    const form = buildThemeFormData(req)
    const res = await api.post('/themes', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (e) {
    throw e as ApiError
  }
}
