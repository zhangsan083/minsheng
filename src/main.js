import { createApp } from 'vue'
import { pinia } from './stores'
import App from './App.vue'
import router from './router'
import './styles/theme.scss'
// 引入 Vant 函数式组件的样式 (unplugin-vue-components 无法自动处理函数式调用的样式)
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

import { useUserStore } from './stores/user'
import { useConfigStore } from './stores/config'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

const app = createApp(App)
const isNative = Capacitor.isNativePlatform()

app.use(pinia)

const user = useUserStore(pinia)
user.loadFromStorage()

// 初始化远程配置
const config = useConfigStore(pinia)
config.loadConfig().then(() => {
  // App 环境下不执行域名跳转（App 不需要）
  if (import.meta.env.PROD && !isNative) {
    return config.checkAndRedirectWebDomain()
  }
}).finally(() => {
  app.use(router)
  app.mount('#app')
})

// 初始化状态栏配置（仅在 App 环境下执行）
if (isNative) {
  StatusBar.setStyle({ style: Style.Dark })
  StatusBar.setOverlaysWebView({ overlay: false })
  // CSS 兜底顶部和底部 padding（Android 会被 MainActivity 注入精确值覆盖）
  if (!document.querySelector('#status-bar-padding')) {
    const style = document.createElement('style')
    style.id = 'status-bar-padding'
    style.textContent = 'html { padding-top: env(safe-area-inset-top, 28px) !important; padding-bottom: env(safe-area-inset-bottom, 28px) !important; }'
    document.head.appendChild(style)
  }
  // 延迟检测：仅在 iOS 上检测是否需要去掉兜底（Android 由 MainActivity 精确注入）
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  if (isIOS) {
    setTimeout(() => {
      const webviewTop = document.documentElement.getBoundingClientRect().top
      if (webviewTop > 10 || screen.height - window.innerHeight > 80) {
        const s = document.getElementById('status-bar-padding')
        if (s) s.textContent = ''
      }
    }, 1000)
  }
}
