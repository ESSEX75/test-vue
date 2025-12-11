import type { Router } from 'vue-router'
import { useOrdersStore } from '@features/orders'

export function setupAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    const token = localStorage.getItem('accessToken')

    if (!token && to.meta.requiresAuth) {
      return {
        path: '/auth',
        query: { redirect: to.fullPath },
      }
    }

    if (to.meta.onlyGuest && token) {
      return '/orders'
    }

    if (to.path === '/orders' && token) {
      const ordersStore = useOrdersStore()

      if (!ordersStore.hasOrders && !ordersStore.isLoading) {
        await ordersStore.getOrders()
      }
    }
  })
}
