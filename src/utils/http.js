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
    // 确保 baseUrl 存在且不为空
    if (!configStore.baseUrl) {
      throw new Error('API base URL is not configured. Please check your network connection and try again.')
    }
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
      // 尝试切换到备用域名
      const switched = configStore.switchToNextDomain()
      if (switched) {
        err.config._retry = true
        
        // 重新发起请求
        return instance(err.config)
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
