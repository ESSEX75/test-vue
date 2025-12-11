import type { RouteRecordRaw } from 'vue-router'
import OrdersPage from '../pages/OrdersPage.vue'
import { ORDERS_PATHS } from './paths'

const ordersRoutes: RouteRecordRaw[] = [
  {
    path: ORDERS_PATHS,
    name: 'ordersPage',
    component: OrdersPage,
    meta: {
      requiresAuth: true,
    },
  },
]

export default ordersRoutes
