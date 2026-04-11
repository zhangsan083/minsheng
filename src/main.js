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
  StatusBar.setStyle({ style: Style.Light })
  StatusBar.setBackgroundColor({ color: '#0944fc' })
  StatusBar.setOverlaysWebView({ overlay: false })
  // 兜底：如果原生注入的 CSS 还没生效，先用默认值
  if (!document.querySelector('#status-bar-padding')) {
    const style = document.createElement('style')
    style.id = 'status-bar-padding'
    style.textContent = 'html { padding-top: 28px !important; }'
    document.head.appendChild(style)
  }

  // 修复 Android 15 键盘弹出时输入框被遮挡的问题
  document.addEventListener('focusin', (e) => {
    const el = e.target
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  })
}
