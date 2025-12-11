import { defineStore } from 'pinia'
import api from '@common/api'
import type { IOrder, TOrderStatus } from '../type'
import { ORDERS_PATHS } from './paths'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as IOrder[],
    error: null as string | null,
  }),

  getters: {
    hasOrders: (state) => state.orders.length > 0,
  },

  actions: {
    async getOrders() {
      this.error = null

      try {
        const { data } = await api.get<IOrder[]>(ORDERS_PATHS)
        console.log('data', data)
        this.orders = data
      } catch {
        this.error = 'Ошибка загрузки заказов'
        this.orders = []
      }
    },

    async addOrder(payload: { name: string; address: string; comment?: string }) {
      this.error = null

      try {
        const fullPayload = {
          ...payload,
          date: new Date().toISOString(),
          status: 'NEW' as TOrderStatus,
        }
        const { data } = await api.post<IOrder[]>('/orders-add', fullPayload)
        this.orders = data
      } catch {
        this.error = 'Ошибка добавления заказа'
      }
    },

    async deleteOrder(id: number | null) {
      this.error = null

      try {
        const { data } = await api.delete<IOrder[]>(`/orders/${id}`)
        this.orders = data
      } catch {
        this.error = 'Ошибка удаления заказа'
      }
    },
  },

  persist: true,
})
