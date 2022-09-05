import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from "node:path"

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/custom.scss";
        `
      }
    }
  },

  plugins: [ vue() ],


  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },

    extensions: ['.js', '.mjs', '.json', '.vue']
  },

  server: {
    port: '8080'
  }
})
