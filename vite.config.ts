import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3066,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '/src'),
    },
  },
})
