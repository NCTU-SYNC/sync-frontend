import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue2'
import legacy from '@vitejs/plugin-legacy'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'node:path'

// / <reference types="vitest" />
// / <reference types="vite/client" />
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

  plugins: [
    vue({
      target: 'modern',
      vueTemplateOptions: {
        compilerOptions: {
          whiteSpace: 'condense'
        },

        transformAssetUrls: {
          video: ['src', 'poster'],
          source: ['src'],
          img: ['src'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href'],
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': 'src',
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src'
        }
      }
    }),

    legacy({
      targets: [
        'defaults and not IE 11'
      ]
    }),

    // Good chunking strategy for SPA
    // See: https://vitejs.dev/guide/build.html#chunking-strategy
    splitVendorChunkPlugin(),

    createSvgIconsPlugin({
      iconDirs: [
        path.resolve(__dirname, 'src/assets/icons/editor'),
        path.resolve(__dirname, 'src/assets/icons')
      ],
      symbolId: '[name]'
    })
  ],

  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },

    extensions: ['.js', '.mjs', '.json', '.vue']
  },

  server: {
    port: '8080'
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'tests/jest-setup.js'
  }
})
