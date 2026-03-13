import { defineStore } from 'pinia'

export const useRewardsStore = defineStore('rewards', {
  state: () => ({
    claims: []
  }),
  actions: {
    load() {
      const demo = []
      for (let i = 0; i < 25; i++) {
        demo.push({
          ts: `2024-01-${String(i + 1).padStart(2, '0')} 10:00`,
          type: '签到奖励',
          points: 10
        })
      }
      this.claims = demo
    }
  }
})

