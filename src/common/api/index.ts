import axios from "axios"
import { BASE_PATH } from "./path"
import { UNAUTHORIZED_ERROR } from "./errorCode"

export const api = axios.create({
  baseURL: BASE_PATH,
})

api.interceptors.request.use(config => {
  const accessToken =localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      return Promise.reject({ code: UNAUTHORIZED_ERROR })
    }
    return Promise.reject(error)
  }
)

export default api
