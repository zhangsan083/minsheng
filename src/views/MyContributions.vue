<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="我的投稿"
        left-arrow
        @click-left="goBack"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="contribution-item" v-for="(item, index) in contributions" :key="item.id || index">
        <div class="contribution-content">
          <div class="contribution-image" v-if="item.wellbeingImg">
            <img :src="getFirstMedia(item.wellbeingImg)" alt="图片" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
          </div>
          <div class="contribution-image" v-else></div>
          <div class="contribution-text">{{ item.content }}</div>
        </div>
        <div class="contribution-info">
          <span class="publish-time">发布时间：{{ item.createDtFormat || '未知时间' }}</span>
          <span class="status" :class="getStatusClass(item.reviewStatus)">{{ getStatusText(item.reviewStatus) }}</span>
          <span class="view-count">浏览总人数：{{ item.browse || 0 }}</span>
        </div>
      </div>
      
      <!-- 加载更多 -->
      <div v-if="loading" class="loading-more">
        加载中...
      </div>
      <div v-if="!hasMore && contributions.length > 0" class="no-more">
        没有更多了
      </div>
      <div v-if="contributions.length === 0 && !loading" class="no-data">
        暂无投稿数据
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyWellbeingPage } from '@/api/assets'

const router = useRouter()

// 投稿列表数据
const contributions = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loading = ref(false)

const goBack = () => {
  router.back()
}

// 获取审核状态文本
const getStatusText = (status) => {
  switch (status) {
    case '0':
      return '审核中'
    case '1':
      return '审核通过'
    case '2':
      return '审核驳回'
    default:
      return '未知状态'
  }
}

// 获取审核状态类名
const getStatusClass = (status) => {
  switch (status) {
    case '0':
      return 'status-pending'
    case '1':
      return 'status-pass'
    case '2':
      return 'status-fail'
    default:
      return ''
  }
}

// 获取第一个媒体文件
const getFirstMedia = (wellbeingImg) => {
  if (!wellbeingImg) return ''
  
  // 分割字符串，获取第一个文件
  const firstFile = wellbeingImg.split(',')[0]
  
  // 检查是否是视频文件
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv']
  const isVideo = videoExtensions.some(ext => firstFile.toLowerCase().includes(ext))
  
  if (isVideo) {
    // 如果是视频，返回 logo 图片
    return '/logo主图形.png'
  } else {
    // 如果是图片，返回完整路径
    // 注意：这里需要根据实际情况调整路径，可能需要拼接完整的 URL
    return firstFile
  }
}

// 加载投稿列表
const loadContributions = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    const res = await getMyWellbeingPage({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    
    if (res.code === 200) {
      if (pageNum.value === 1) {
        contributions.value = res.data.records
      } else {
        contributions.value = [...contributions.value, ...res.data.records]
      }
      
      hasMore.value = contributions.value.length < res.data.total
      pageNum.value++
    }
  } catch (error) {
    console.error('获取投稿列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 滚动加载更多
const onScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  const clientHeight = document.documentElement.clientHeight || window.innerHeight
  
  if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore.value && !loading.value) {
    loadContributions()
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  await loadContributions()
  window.addEventListener('scroll', onScroll)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.header {
  height: 220px;
  background: var(--blue-gradient);
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.contribution-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin-bottom: 16px;
}

.contribution-content {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.contribution-image {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 8px;
  flex-shrink: 0;
}

.contribution-text {
  flex: 1;
  font-size: var(--font-size-small);
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.contribution-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
  color: #999;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.status {
  font-weight: 500;
}

.status-pass {
  color: #52c41a;
}

.status-fail {
  color: #ff4d4f;
}

.status-pending {
  color: #faad14;
}

.view-count {
  color: #999;
}

.loading-more {
  padding: 20px 0;
  text-align: center;
  color: #2b7afb;
  font-size: 14px;
}

.no-more {
  padding: 20px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.no-data {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>