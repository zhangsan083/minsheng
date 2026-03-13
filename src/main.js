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

const app = createApp(App)

app.use(pinia)

const user = useUserStore(pinia)
user.loadFromStorage()

// 初始化远程配置
const config = useConfigStore(pinia)
// 注意：这里不阻塞应用挂载，而是让配置在后台加载
// 实际生产中，可能需要显示一个 Loading 页面直到配置加载完成
config.loadConfig().finally(() => {
  // 如果需要严格保证配置加载完再渲染，可以将 app.mount 移到这里
  // 但为了用户体验，通常先渲染 UI（可能显示骨架屏），等配置加载完再发起 API 请求
})

app.use(router)

app.mount('#app')
