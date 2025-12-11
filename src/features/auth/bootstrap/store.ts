import { defineStore } from 'pinia'
import { UNAUTHORIZED_ERROR } from '@common/api/errorCode'
import api from '@common/api'
import type { ILoginPayload, ILoginResponse, IUserData } from '../types'

const useAuthStore = defineStore('auth', {
  state: () => ({
    userData: null as IUserData | null,
    accessToken: localStorage.getItem('accessToken') || null,
  }),

  getters: {
    isAuthorized: (state) => !!state.accessToken,
    isAdmin: (state) => state.userData?.role === 'ADMIN',
  },

  actions: {
    async login(payload: ILoginPayload) {
      try {
        const { data } = await api.post<ILoginResponse>('/login', payload)
        this.accessToken = data.accessToken
        localStorage.setItem('accessToken', data.accessToken)
        this.userData = { name: data.name, role: data.role }
      } catch (error: unknown) {
        this.accessToken = null
        this.userData = null

        if (typeof error === 'object' && error !== null && 'code' in error) {
          if ((error as { code: string }).code === UNAUTHORIZED_ERROR) {
            throw new Error('Неверный логин или пароль')
          }
        }
        throw error
      }
    },

    logout() {
      console.log('logaut')
      this.accessToken = null
      this.userData = null
      localStorage.removeItem('accessToken')
    },
  },

  persist: true,
})

export default useAuthStore
