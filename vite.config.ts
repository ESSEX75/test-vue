import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@common': fileURLToPath(new URL('./src/common', import.meta.url)),
      '@bootstrap': fileURLToPath(new URL('./src/bootstrap', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@common/styles/variables.scss";`,
      },
    },
  },
})
