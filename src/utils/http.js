import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useConfigStore } from '@/stores/config'
import { pinia } from '@/stores'

let isAuthRedirecting = false

const redirectToLogin = async () => {
  if (isAuthRedirecting) return
  isAuthRedirecting = true

  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
  try {
    const { default: router } = await import('@/router')
    const currentName = router.currentRoute.value?.name
    if (currentName === 'login') return
    await router.replace({ name: 'login', query: { redirect: currentUrl } })
  } catch {
    if (window.location.pathname !== '/login') {
      window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`
    }
  } finally {
    setTimeout(() => {
      isAuthRedirecting = false
    }, 500)
  }
}

const instance = axios.create({
  // 移除默认 baseURL，改为在请求拦截器中动态拼接
  timeout: 15000
})

instance.interceptors.request.use(config => {
  const user = useUserStore(pinia)
  const configStore = useConfigStore(pinia)

  // 动态设置 Base URL
  // 如果 url 已经是绝对路径（http 开头），则不处理
  if (!config.url.startsWith('http')) {
    // 确保 baseUrl 不以 / 结尾，url 不以 / 开头，避免双斜杠（虽然 axios 通常能处理）
    const baseUrl = configStore.baseUrl.replace(/\/$/, '')
    const url = config.url.replace(/^\//, '')
    config.url = `${baseUrl}/${url}`
  }

  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

instance.interceptors.response.use(
  async res => {
    const payload = res.data
    const code = payload?.code
    if (code === 401 || code === 403) {
      const user = useUserStore(pinia)
      user.logout()
      await redirectToLogin()
      return Promise.reject(new Error('Unauthorized'))
    }
    return payload
  },
  async err => {
    const configStore = useConfigStore(pinia)
    
    // 检查是否是网络层错误（域名被封、DNS解析失败、连接超时等）
    // 注意：排除 HTTP 状态码错误（如 404, 500 等），因为这些意味着域名是通的
    const isNetworkError = !err.response && (
      err.message === 'Network Error' || 
      err.code === 'ECONNABORTED' || 
      err.message.includes('timeout') ||
      err.message.includes('Network Error')
    )

    if (isNetworkError && !err.config._retry) {
      console.warn('Network error detected. Checking internet connection before failover...', err.message)
      
      // 核心逻辑：区分"真断网"和"域名被封"
      // 方法：尝试请求一个极大概率可用的静态资源（如 config.json，因为它本身就是从 OSS/COS 加载的，或者 index.html）
       // 如果静态资源能通，说明网是好的，仅仅是 API 域名不通 -> 判定为被封，切换
       // 如果静态资源也不通，说明真断网了 -> 不切换，等待网络恢复
       try {
         // 使用 fetch 发起一个快速检测，不依赖 axios 拦截器
         // 加上时间戳防止缓存
         // 使用当前页面的 index.html 作为检测目标，因为它是 SPA 应用必有的
         await fetch(`${window.location.origin}/index.html?t=${Date.now()}`, { 
           method: 'HEAD', 
           mode: 'no-cors', // 允许跨域（虽然这里是同域），不关心内容只关心是否抛错
           cache: 'no-store'
         })
         
         console.log('Internet connection confirmed. API domain is likely blocked.')
        
        // 网是通的，但 API 不通 -> 切换域名
        const switched = configStore.switchToNextDomain()
        if (switched) {
          err.config._retry = true
          
          // 暴力替换策略：
          const oldBaseUrl = configStore.failedUrls[configStore.failedUrls.length - 1]
          const newBaseUrl = configStore.baseUrl
          
          if (oldBaseUrl && newBaseUrl && err.config.url.startsWith(oldBaseUrl)) {
            err.config.url = err.config.url.replace(oldBaseUrl, newBaseUrl)
            console.log(`Retrying request with new domain: ${err.config.url}`)
            return instance(err.config)
          }
        }
      } catch (networkCheckErr) {
        console.warn('Internet connection check failed. User is likely offline.', networkCheckErr)
        // 真断网了，什么都不做，直接抛出错误让 UI 提示"网络连接异常"
      }
    }

    const status = err.response?.status
    // 401: Unauthorized - Token 失效或未登录
    // 403: Forbidden - Token 有效但无权限（通常也需要重新登录或刷新 Token）
    if (status === 401 || status === 403) {
      const user = useUserStore(pinia)
      user.logout()
      await redirectToLogin()
    }
    return Promise.reject(err)
  }
)

export default instance
