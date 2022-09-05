import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from "node:path"

export default defineConfig({
  plugins: [ vue() ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },

    extensions: ['.js', '.mjs', '.json', '.vue']
  }
})
