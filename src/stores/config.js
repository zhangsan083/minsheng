import { defineStore } from 'pinia'
import { configLoader } from '@/utils/config-loader'

export const useConfigStore = defineStore('config', {
  state: () => ({
    baseUrl: localStorage.getItem('api_base_url') || '', // 优先从本地缓存读取，防止刷新后丢失
    backupUrls: JSON.parse(localStorage.getItem('api_backup_urls') || '[]'),
    failedUrls: [], // 已标记为失败的域名
    webBaseUrl: '', // 网站主域名（从 config.json 获取）
    webBackupUrls: [], // 网站备用域名（从 config.json 获取）
    configLoaded: false,
    rawConfig: null
  }),
  actions: {
    /**
     * 检查并重定向到正确的网站域名
     * 逻辑：如果当前域名不在配置的允许列表中，或者配置要求跳转，则尝试跳转到第一个可用的配置域名
     * 注意：App环境下不执行Web域名跳转（capacitor:// 或非 http/https 协议）
     */
    async checkAndRedirectWebDomain() {
      // 仅在生产环境执行
      if (!import.meta.env.PROD) return
      
      // App环境下不执行Web域名跳转（capacitor://, ionic://, file:// 等）
      const isApp = !window.location.protocol.startsWith('http')
      if (isApp) {
        console.log('App environment detected, skipping web domain redirect.')
        return
      }
      
      // 从配置或环境变量获取web域名列表
      const webBaseUrl = this.webBaseUrl || import.meta.env.VITE_WEB_BASE_URL || ''
      const webBackupUrls = this.webBackupUrls.length > 0 
        ? this.webBackupUrls 
        : (import.meta.env.VITE_WEB_BACKUP_URLS ? JSON.parse(import.meta.env.VITE_WEB_BACKUP_URLS) : [])
      
      // 构建候选域名列表
      const candidates = [webBaseUrl, ...webBackupUrls].filter(Boolean)
      
      // 如果没有配置域名，无法执行跳转
      if (candidates.length === 0) {
        console.warn('No web domains configured, skipping redirect.')
        return
      }

      const currentOrigin = window.location.origin
      
      // 检查当前域名是否在候选列表中
      // 注意：我们需要处理协议差异（http vs https），最好统一比较 hostname
      const normalize = (url) => {
        try { return new URL(url).hostname } catch { return '' }
      }
      const currentHost = normalize(currentOrigin)
      const isCurrentInCandidates = candidates.some(url => normalize(url) === currentHost)

      // 如果当前域名在列表中，还需要检测当前域名是否可用
      if (isCurrentInCandidates) {
        console.log('Current domain is in the configuration list. Checking availability...')
        const isCurrentReachable = await this.checkDomainConnectivity(currentOrigin)
        
        if (isCurrentReachable) {
          console.log('Current domain is reachable. No redirect needed.')
          return
        } else {
          console.warn('Current domain is in the configuration list but unreachable! Will try to redirect to other domains.')
        }
      } else {
        console.log('Current domain is not in the allowed list. Checking for available redirect target...')
      }

      // 遍历候选列表，寻找第一个可用的域名
      for (const url of candidates) {
        // 避免跳转回当前已经失败的域名
        if (normalize(url) === currentHost) continue

        console.log(`Checking connectivity for: ${url}`)
        const isReachable = await this.checkDomainConnectivity(url)
        
        if (isReachable) {
          console.log(`Redirecting to available domain: ${url}`)
          // 构建新的跳转地址，保留路径和参数
          const newUrl = new URL(url)
          newUrl.pathname = window.location.pathname
          newUrl.search = window.location.search
          newUrl.hash = window.location.hash
          
          window.location.href = newUrl.toString()
          return // 跳转后停止执行
        } else {
          console.warn(`Domain ${url} is unreachable. Trying next...`)
        }
      }
      
      console.error('All configured web domains are unreachable!')
    },

    /**
     * 检测域名连通性
     * @param {string} url - 目标域名（带协议，如 https://example.com）
     */
    async checkDomainConnectivity(url) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时
        
        // 尝试请求 index.html 来检测连通性
        // mode: 'no-cors' 允许跨域请求（虽然拿不到内容，但只要不报错/不超时就说明域名解析和连接是通的）
        await fetch(`${url}/index.html?t=${Date.now()}`, { 
          mode: 'no-cors', 
          signal: controller.signal 
        })
        
        clearTimeout(timeoutId)
        return true
      } catch {
        return false
      }
    },

    /**
     * 初始化并加载配置
     */
    async loadConfig() {
      if (this.configLoaded) return

      // 优先级逻辑调整：
      // 1. 如果 VITE_USE_LOCAL_CONFIG 显式为 'true' -> 强制使用本地配置
      // 2. 如果 VITE_USE_LOCAL_CONFIG 显式为 'false' -> 强制尝试远程配置（即使是开发环境）
      // 3. 默认情况（未设置或为其他值）：开发环境使用本地配置，生产环境使用远程配置
      const forceLocal = import.meta.env.VITE_USE_LOCAL_CONFIG === 'true'
      const forceRemote = import.meta.env.VITE_USE_LOCAL_CONFIG === 'false'
      const isDevDefault = import.meta.env.DEV && !forceRemote

      if (forceLocal || isDevDefault) {
        console.log(`Using local configuration (ForceLocal: ${forceLocal}, DevDefault: ${isDevDefault}).`)
        this.updateConfig({
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
          webBaseUrl: import.meta.env.VITE_WEB_BASE_URL || '',
          webBackupUrls: import.meta.env.VITE_WEB_BACKUP_URLS ? JSON.parse(import.meta.env.VITE_WEB_BACKUP_URLS) : [],
          version: 'local',
          notice: '当前为本地/测试配置模式'
        })
        this.configLoaded = true
        return
      }
      
      try {
        // 强制使用 URL 模式，直接通过 HTTP 请求获取配置，避免 COS SDK 配置问题
        const mode = 'url'
        // 构建候选配置地址列表：优先使用环境变量
        const candidateUrls = [
          import.meta.env.VITE_CONFIG_URL_COS
        ].filter(Boolean)

        const config = await configLoader.init({
          mode,
          // 禁用腾讯云 COS SDK，直接使用 URL 请求
          tencent: undefined,
          // 远程配置地址
          urls: candidateUrls,
          interval: Number(import.meta.env.VITE_CONFIG_REFRESH_INTERVAL) || 0
        })

        this.updateConfig(config)
        this.configLoaded = true

        // 监听配置热更新
        configLoader.subscribe(newConfig => {
          console.log('Configuration hot updated')
          this.updateConfig(newConfig)
        })
      } catch (error) {
        console.error('Failed to load remote config:', error)
        // 使用环境变量作为默认值
        console.log('Using fallback configuration from environment variables')
        this.updateConfig({
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
          webBaseUrl: import.meta.env.VITE_WEB_BASE_URL || '',
          webBackupUrls: import.meta.env.VITE_WEB_BACKUP_URLS ? JSON.parse(import.meta.env.VITE_WEB_BACKUP_URLS) : [],
          version: 'fallback',
          notice: '使用环境变量配置'
        })
        // 标记为已加载，避免无限循环尝试加载
        this.configLoaded = true
      }
    },

    updateConfig(config) {
      if (!config) return

      // 清理 URL 中的反引号和空格
      const cleanUrl = (url) => {
        if (typeof url === 'string') {
          return url.replace(/[`\s]/g, '').trim()
        }
        return url
      }

      // 处理主域名和备用域名列表
      const primaryUrl = cleanUrl(config.apiBaseUrl || config.apiBase || config.baseUrl || config.domain || config.primary)
      const backupsRaw = config.backupUrls || config.backups || config.urls || config.endpoints
      const backups = Array.isArray(backupsRaw) ? backupsRaw.map(cleanUrl) : []
      
      // 合并去重，构成完整的候选列表
      const allUrls = [primaryUrl, ...backups].filter(url => url && !this.failedUrls.includes(url))
      
      // 这里的逻辑是：如果当前 baseUrl 为空或者不在新的列表中，则更新为第一个可用的
      // 如果当前 baseUrl 还在列表中且没被标记失败，则保持不变（避免刷新配置时导致连接断开）
      if (allUrls.length > 0) {
        if (!this.baseUrl || !allUrls.includes(this.baseUrl)) {
           this.baseUrl = allUrls[0]
           console.log('Switched API domain to:', this.baseUrl)
        }
        this.backupUrls = allUrls.slice(1)
      }

      // 解析网站主域名和备用域名
      this.webBaseUrl = config.webBaseUrl || config.siteUrl || import.meta.env.VITE_WEB_BASE_URL || ''
      this.webBackupUrls = Array.isArray(config.webBackupUrls || config.siteBackupUrls) 
        ? (config.webBackupUrls || config.siteBackupUrls) 
        : (import.meta.env.VITE_WEB_BACKUP_URLS ? JSON.parse(import.meta.env.VITE_WEB_BACKUP_URLS) : [])

      this.rawConfig = config
      // 持久化存储，防止刷新丢失
      localStorage.setItem('api_base_url', this.baseUrl)
      localStorage.setItem('api_backup_urls', JSON.stringify(this.backupUrls))
      localStorage.setItem('web_base_url', this.webBaseUrl)
      localStorage.setItem('web_backup_urls', JSON.stringify(this.webBackupUrls))
      console.log('Config updated. Current:', this.baseUrl, 'Backups:', this.backupUrls)
      console.log('Web domain updated. Current:', this.webBaseUrl, 'Web backups:', this.webBackupUrls)
    },

    /**
     * 标记当前域名失败，并尝试切换到下一个
     */
    switchToNextDomain() {
      if (!this.baseUrl) return false

      console.warn(`Domain ${this.baseUrl} marked as failed. Switching...`)
      this.failedUrls.push(this.baseUrl)
      
      // 从备用列表中找一个没失败过的
      const nextUrlIndex = this.backupUrls.findIndex(url => !this.failedUrls.includes(url))
      const nextUrl = nextUrlIndex >= 0 ? this.backupUrls[nextUrlIndex] : null
      
      if (nextUrl) {
        // 从备用列表中移除这个域名，作为新的主域名
        this.backupUrls.splice(nextUrlIndex, 1)
        this.baseUrl = nextUrl
        // 切换域名后也要更新本地存储
        localStorage.setItem('api_base_url', this.baseUrl)
        localStorage.setItem('api_backup_urls', JSON.stringify(this.backupUrls))
        console.log(`Successfully switched to backup domain: ${nextUrl}`)
        console.log('Remaining backup domains:', this.backupUrls)
        return true
      } else {
        console.error('All configured domains failed!')
        return false
      }
    },

    /**
     * 手动刷新配置
     */
    async refreshConfig() {
      try {
        const config = await configLoader.load()
        this.updateConfig(config)
        return true
      } catch (error) {
        console.error('Manual refresh failed:', error)
        return false
      }
    }
  }
})
