<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="政策详情"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content-wrapper">
      <div class="content-card">
        <h2 class="title">{{ title }}</h2>
        <div v-if="time" class="time">{{ time }}</div>
        <div class="body" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { getPolicyDetail } from '@/api/assets'

const route = useRoute()

const title = ref('')
const content = ref('')
const time = ref('')

const loadDetail = async id => {
  try {
    const res = await getPolicyDetail(id)
    if (res.code === 200 && res.data) {
      title.value = res.data.title || ''
      content.value = res.data.content || ''
      time.value = res.data.createDt || ''
    } else {
      showToast(res.msg || '获取政策详情失败')
    }
  } catch (error) {
    showToast('获取政策详情失败，请稍后重试')
    console.error(error)
  }
}

onMounted(() => {
  const query = route.query
  if (query.id) {
    loadDetail(query.id)
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.header-bg {
  background: var(--blue-gradient);
  height: 220px;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}

/* Deep selector to ensure title color is correct if variable doesn't work */
:deep(.van-nav-bar__title) {
  color: #fff;
  font-size: var(--font-size-large);
  font-weight: bold;
}
:deep(.van-icon) {
  color: #fff;
}

.content-wrapper {
  flex: 1;
  padding: 0 16px 100px;
  margin-top: -160px;
  display: flex;
  flex-direction: column;
}

.content-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 16px 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: var(--font-size-large);
  font-weight: 700;
  color: #333;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 12px;
}

.time {
  font-size: var(--font-size-xs);
  color: #999;
  text-align: center;
  margin-bottom: 12px;
}

.body {
  font-size: var(--font-size-small);
  color: #333;
  line-height: 1.7;
  overflow-x: hidden;
}

/* Ensure images in rich text fit */
:deep(.body img) {
  max-width: 100%;
  height: auto;
}
</style>