import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

api.defaults.headers.common['Accept'] = 'application/json'

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

type ErrorBody = { code?: string; message?: string } | undefined

export type ApiError = {
  status: number
  code?: string
  message: string
  raw: unknown
}

function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError<ErrorBody>(err)) {
    return {
      status: err.response?.status ?? 0,
      code: err.response?.data?.code,
      message: err.response?.data?.message ?? err.message,
      raw: err,
    }
  }
  return { status: 0, message: 'Unknown error', raw: err }
}

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(toApiError(err)),
)

const boot = localStorage.getItem('accessToken')
setAuthToken(boot)
