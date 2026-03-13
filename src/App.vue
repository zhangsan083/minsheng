<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

onMounted(() => {
  // 检查是否在生产环境
  if (import.meta.env.PROD) {
    // 监听配置加载完成
    if (configStore.configLoaded) {
      configStore.checkAndRedirectWebDomain()
    } else {
      const unwatch = watch(() => configStore.configLoaded, (loaded) => {
        if (loaded) {
          configStore.checkAndRedirectWebDomain()
          unwatch()
        }
      })
    }
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--color-bg);
}
</style>
