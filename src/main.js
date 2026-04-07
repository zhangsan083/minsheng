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
import { StatusBar, Style } from '@capacitor/status-bar'

const app = createApp(App)

app.use(pinia)

const user = useUserStore(pinia)
user.loadFromStorage()

// 初始化远程配置
const config = useConfigStore(pinia)
// 延迟应用挂载，确保配置加载完成并执行域名跳转后再渲染页面
config.loadConfig().then(() => {
  // 检查并执行域名跳转
  if (import.meta.env.PROD) {
    return config.checkAndRedirectWebDomain()
  }
}).finally(() => {
  // 无论域名跳转是否执行，都挂载应用
  app.use(router)
  app.mount('#app')
})

// 初始化状态栏配置
StatusBar.setStyle({ style: Style.Light })
StatusBar.setOverlaysWebView({ overlay: true })
