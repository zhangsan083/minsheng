import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import { copyFileSync, existsSync, mkdirSync } from 'fs'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11', 'Android >= 5', 'iOS >= 10'],
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: false
    }),
    Components({
      resolvers: [VantResolver()],
      dts: false
    }),
    {
      name: 'copy-chatlink',
      writeBundle() {
        const srcPath = path.resolve(__dirname, 'chatlink.html')
        const distPath = path.resolve(__dirname, 'dist', 'chatlink.html')
        
        if (existsSync(srcPath)) {
          // 确保dist目录存在
          const distDir = path.resolve(__dirname, 'dist')
          if (!existsSync(distDir)) {
            mkdirSync(distDir, { recursive: true })
          }
          
          // 复制文件
          copyFileSync(srcPath, distPath)
          console.log('✅ chatlink.html copied to dist directory')
        } else {
          console.warn('⚠️ chatlink.html not found, skipping copy')
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  },
  build: {
    // target: ['es2015', 'chrome50', 'safari10', 'ios10'], // Conflict with plugin-legacy
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          ui: ['vant']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        // 本地开发代理目标，仅开发环境生效
        // 生产环境由 config.json 控制，不使用此配置
        target: 'http://43.129.68.128:18002',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      }
    }
  }
})
