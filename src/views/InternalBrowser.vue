<template>
  <div class="page">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="$router.back()"
      class="nav-bar"
    />
    <div class="iframe-container">
      <iframe :src="url" class="iframe" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const url = ref('')
const title = ref('详情')

onMounted(() => {
  const targetUrl = route.query.url
  if (targetUrl) {
    url.value = decodeURIComponent(targetUrl)
  }
  if (route.query.title) {
    title.value = decodeURIComponent(route.query.title)
  }
})
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.iframe-container {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.nav-bar {
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
  flex-shrink: 0;
}

:deep(.van-nav-bar__title) {
  font-size: var(--font-size-large);
  font-weight: bold;
}
</style>