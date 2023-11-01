import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    open: true, // 是否自动打开浏览器
    port: 3000, // 端口号

    // 代理解决跨域
    proxy: {
      '/api': {
        target: 'http://mobilecdn.kugou.com',  // 接口源地址
        changeOrigin: true,   // 开启跨域
        rewrite: (path => path.replace('/^\\/api/', ''))
      },
      '/yy': {
        target: 'http://wwwapi.kugou.com',  // 接口源地址
        changeOrigin: true,   // 开启跨域
        rewrite: (path => path.replace('/^\\/yy/', ''))
      },
      '/a': {
        target: 'http://www.xmsj.org/',  // 接口源地址
        changeOrigin: true,   // 开启跨域
        rewrite: (path => path.replace('/a', ''))
      }
    }
  }

})
