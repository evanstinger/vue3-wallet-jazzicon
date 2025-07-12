import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.ts'),
      name: 'Vue3WalletJazzicon',
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    },
    sourcemap: true,
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
})