import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
})

api.defaults.headers.common.Accept = 'application/json'

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
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
    const e = err as AxiosError<ErrorBody>
    return {
      status: e.response?.status ?? 0,
      code: e.response?.data?.code,
      message: e.response?.data?.message ?? e.message,
      raw: err,
    }
  }
  return { status: 0, message: 'Unknown error', raw: err }
}

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(toApiError(err)),
)
