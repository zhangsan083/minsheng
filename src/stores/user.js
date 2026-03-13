import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    profile: null,
    userInfo: null,
    selectedAddress: null // 用于地址选择回传
  }),
  getters: {
    isAuthenticated: state => !!state.token
  },
  actions: {
    setSelectedAddress(address) {
      this.selectedAddress = address
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setUserInfo(info) {
      this.userInfo = info
      localStorage.setItem('userInfo', JSON.stringify(info))
    },
    // 主动从后端刷新用户信息
    async refreshUserInfo() {
      try {
        const res = await getUserInfo()
        if (res.code === 200 && res.data) {
          this.setUserInfo(res.data)
          return res.data
        }
      } catch (error) {
        console.error('Failed to refresh user info:', error)
      }
      return null
    },
    addScore(points) {
      if (!this.userInfo) return
      const currentScore = Number(this.userInfo.score) || 0
      const addedPoints = Number(points) || 0
      this.userInfo.score = currentScore + addedPoints
      this.setUserInfo(this.userInfo)
    },
    loadFromStorage() {
      const token = localStorage.getItem('token') || ''
      this.token = token
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        try {
          this.userInfo = JSON.parse(userInfo)
        } catch (e) {
          console.error('Failed to parse user info', e)
        }
      }
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})
