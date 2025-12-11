import { createApp } from 'vue'
import router from './router/index'
import pinia from './store'

import App from '@/App.vue'

export function createVueApp() {
  const app = createApp(App)

  app.use(router)
  app.use(pinia)

  return app
}
