import axios from 'axios'

/**
 * Configuration Loader
 * Supports loading config from Aliyun OSS, Tencent Cloud COS, or standard HTTP URL.
 * Supports hot updates.
 */
class ConfigLoader {
  constructor() {
    this.config = null
    this.timer = null
    this.subscribers = []
  }

  /**
   * Initialize and load configuration
   * @param {Object} options
   * @param {string} options.mode - 'aliyun' | 'tencent' | 'url' | 'auto'
   * @param {Object} options.aliyun - Aliyun OSS options { region, accessKeyId, accessKeySecret, bucket, file }
   * @param {Object} options.tencent - Tencent COS options { SecretId, SecretKey, Region, Bucket, Key }
   * @param {string} options.url - Direct URL to config file (legacy single URL)
   * @param {string[]} options.urls - List of URLs for failover (preferred if mode='url')
   * @param {number} options.interval - Hot update interval in ms (default: 0, disabled)
   */
  async init(options = {}) {
    this.options = options
    await this.load()

    if (options.interval > 0) {
      this.startAutoRefresh(options.interval)
    }

    return this.config
  }

  async load() {
    const { mode = 'auto' } = this.options
    let config = null
    let error = null

    try {
      if (mode === 'aliyun' || (mode === 'auto' && this.options.aliyun?.accessKeyId)) {
        config = await this.loadFromAliyun()
      } else if (mode === 'tencent' || (mode === 'auto' && this.options.tencent?.SecretId)) {
        config = await this.loadFromTencent()
      } else if (mode === 'url' || (mode === 'auto' && (this.options.url || this.options.urls))) {
        config = await this.loadFromUrl()
      }
    } catch (err) {
      console.warn('Primary config load failed:', err)
      error = err
    }

    // Fallback logic could be implemented here if needed
    if (!config && mode === 'auto') {
      // Try fallback to URL if SDK failed
      if (this.options.url) {
        try {
          config = await this.loadFromUrl()
        } catch (e) {
          console.error('Fallback config load failed:', e)
        }
      }
    }

    if (config) {
      // Check if config changed
      const isChanged = JSON.stringify(this.config) !== JSON.stringify(config)
      this.config = config
      if (isChanged) {
        this.notifySubscribers(config)
      }
      return config
    }
    
    throw error || new Error('No config loaded')
  }

  async loadFromTencent() {
    const { SecretId, SecretKey, Region, Bucket, Key } = this.options.tencent
    console.log(`[ConfigLoader] Loading from Tencent COS: ${Bucket}/${Key}`)

    // Dynamic import to reduce bundle size
    const COS = (await import('cos-js-sdk-v5')).default

    // WARNING: Exposing SecretId and SecretKey in frontend code is insecure.
    const cos = new COS({
      SecretId,
      SecretKey,
    })

    return new Promise((resolve, reject) => {
      cos.getObject({
        Bucket,
        Region,
        Key,
      }, (err, data) => {
        if (err) {
          console.error('[ConfigLoader] Tencent COS Error:', err)
          reject(err)
        } else {
          try {
            const text = data.Body
            // Body can be string or Blob in browser depending on implementation, 
            // cos-js-sdk-v5 usually returns string or Blob.
            if (typeof text === 'string') {
              resolve(JSON.parse(text))
            } else if (text instanceof Blob) {
               const reader = new FileReader();
               reader.onload = () => {
                 resolve(JSON.parse(reader.result));
               };
               reader.readAsText(text);
            } else {
              // Assuming it might be simple object if parsed
               resolve(JSON.parse(JSON.stringify(text)))
            }
          } catch (parseErr) {
            reject(parseErr)
          }
        }
      })
    })
  }

  async loadFromUrl() {
    const { url, urls } = this.options
    // Construct a list of URLs to try: `urls` array takes precedence, fallback to single `url`
    const candidateUrls = []
    if (urls && Array.isArray(urls)) {
      candidateUrls.push(...urls.filter(u => !!u))
    }
    if (url && !candidateUrls.includes(url)) {
      candidateUrls.push(url)
    }

    if (candidateUrls.length === 0) {
      throw new Error('No configuration URLs provided')
    }

    console.log(`[ConfigLoader] Loading from URLs (Failover strategy):`, candidateUrls)

    let lastError = null
    for (const targetUrl of candidateUrls) {
      try {
        console.log(`[ConfigLoader] Trying: ${targetUrl}`)
        // 增加超时时间到 10s，避免跨域或网络慢导致 Aborted
        const res = await axios.get(`${targetUrl}?t=${Date.now()}`, { timeout: 10000 }) 
        if (res && typeof res.data !== 'undefined') {
          const payload = res.data
          console.log(`[ConfigLoader] Successfully loaded from: ${targetUrl}`)
          if (typeof payload === 'string') {
            try {
              // 清理潜在的 BOM 并解析
              const cleaned = payload.replace(/^\uFEFF/, '')
              return JSON.parse(cleaned)
            } catch {
              console.warn('[ConfigLoader] JSON parse failed for string payload, returning raw string')
              return payload
            }
          }
          return payload
        }
      } catch (err) {
        console.warn(`[ConfigLoader] Failed to load from ${targetUrl}:`, err.message, err.code)
        // 如果是 CORS 错误，通常 message 是 Network Error，需要检查控制台详细报错
        lastError = err
      }
    }

    throw lastError || new Error('All configuration URLs failed')
  }

  startAutoRefresh(interval) {
    if (this.timer) clearInterval(this.timer)
    console.log(`[ConfigLoader] Starting auto refresh every ${interval}ms`)
    this.timer = setInterval(() => {
      this.load().catch(err => console.warn('Auto refresh failed:', err))
    }, interval)
  }

  stopAutoRefresh() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback)
    // Immediately call with current config if exists
    if (this.config) callback(this.config)
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback)
    }
  }

  notifySubscribers(config) {
    this.subscribers.forEach(cb => cb(config))
  }
}

export const configLoader = new ConfigLoader()
