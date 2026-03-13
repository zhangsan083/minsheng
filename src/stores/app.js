import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light',
    locale: 'zh-CN'
  }),
  actions: {
    setTheme(theme) {
      this.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
    },
    setLocale(locale) {
      this.locale = locale
    }
  }
})
