<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="民生资产资讯"
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
import { getNewsDetail } from '@/api/home'

const route = useRoute()

const title = ref('')
const content = ref('')
const time = ref('')

const loadDetail = async id => {
  try {
    const res = await getNewsDetail(id)
    if (res.code === 200 && res.data) {
      title.value = res.data.title || ''
      // 处理 content，移除图片的内联 width 属性，确保图片自适应
      let processedContent = res.data.content || ''
      // 移除图片的内联 width 属性
      processedContent = processedContent.replace(/<img[^>]*width="[^"]*"[^>]*>/g, (match) => {
        return match.replace(/width="[^"]*"/g, '')
      })
      // 移除图片的内联 style 属性中的 width
      processedContent = processedContent.replace(/<img[^>]*style="[^"]*width:[^;]*;?[^"]*"[^>]*>/g, (match) => {
        return match.replace(/width:[^;]*;?/g, '')
      })
      content.value = processedContent
      time.value = res.data.publishDt || ''
    } else {
      showToast(res.msg || '获取资讯详情失败')
    }
  } catch (error) {
    showToast('获取资讯详情失败，请稍后重试')
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
  background: linear-gradient(180deg, var(--blue-deep) 0%, var(--blue-deep) 70%, #f7f8fa 70%);
  height: 315px;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
}

.content-wrapper {
  flex: 1;
  padding: 0 16px 80px;
  margin-top: -255px;
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
  font-size: var(--font-size-small);
  color: #999;
  text-align: center;
  margin-bottom: 12px;
}

.body {
  font-size: var(--font-size-base);
  color: #333;
  line-height: 1.7;
}

.body p {
  margin: 0 0 10px;
}

.body a {
  color: var(--blue-deep);
}

/* 确保样式能应用到 v-html 渲染的内容 */
.content-card :deep(img) {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
