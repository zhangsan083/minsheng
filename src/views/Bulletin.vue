<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="人民资产公告"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
        class="nav-bar"
      />
    </div>
    
    <div class="content-wrapper">
      <div class="content-card">
        <h2 class="title">{{ title }}</h2>
        <div class="content" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBulletinDetail } from '@/api/assets'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()

const title = ref('')
const content = ref('')

onMounted(() => {
  const id = route.query.id
  if (id) {
    loadData(id)
  }
})

const loadData = async (id) => {
  try {
    const res = await getBulletinDetail(id)
    if (res.code === 200) {
      title.value = res.data.title
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
    } else {
      showToast(res.msg || '获取详情失败')
    }
  } catch (error) {
    console.error('Failed to load bulletin detail:', error)
    showToast('获取详情失败')
  }
}

const onClickLeft = () => {
  router.back()
}
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
  padding: 0 16px 16px;
  margin-top: -235px;
  display: flex;
  flex-direction: column;
}

.content-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  flex: 1;
  overflow-y: auto;
}

.title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
}

.content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap; /* 保留换行符 */
}

/* 适配内容中的样式 */
:deep(.content p) {
  margin-bottom: 16px;
}

/* 控制图片大小 */
:deep(.content img) {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
