import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes }  from '@features/auth'
import { ordersRoutes }  from '@features/orders'
import { setupAuthGuard } from './guard'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    ...ordersRoutes,
    { path: '/:pathMatch(.*)*', redirect: '/auth' },
  ],
})

setupAuthGuard(router)

export default router
