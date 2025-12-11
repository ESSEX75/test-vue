import type { RouteRecordRaw } from 'vue-router'
import { AUTH_PATHS } from './paths'
import AuthPage from '../pages/AuthPage.vue'

const authRoutes: RouteRecordRaw[] = [
  {
    path: AUTH_PATHS,
    name: 'authPage',
    component: AuthPage,
    meta: {
      onlyGuest: true,
    },
  },
]

export default authRoutes
