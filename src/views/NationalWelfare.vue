<template>
  <div class="page">
    <!-- 顶部 Header -->
    <div class="header-bg">
      <van-nav-bar
        class="nav-bar"
        title="国家民生福祉"
        left-arrow
        @click-left="goBack"
        :border="false"
      />
      <div class="header-content">
        <h1 class="main-title">共享时代政策红利</h1>
        <div class="btn-group">
          <van-button type="primary" round class="header-btn" @click="goToMyContributions">我的投稿</van-button>
          <van-button type="primary" round class="header-btn" @click="goToContribute">我要投稿</van-button>
        </div>
      </div>
    </div>

    <div class="page__body">
      <!-- 头条文章 -->
      <div class="image-card headline-card">
        <div class="headline-layout">
          <div class="card-image-left" v-if="article.coverImg">
            <img :src="article.coverImg" alt="文章封面" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
          </div>
          <div class="card-image-left" v-else></div>
            <h3 class="project-name-text">{{ article.title }}</h3>
            <p class="headline-text">{{ article.content }}</p>
        </div>
      </div>

      <!-- 投稿列表 -->
      <div class="contribution-list">
        <div 
          v-for="(item, index) in contributions" 
          :key="item.id || index" 
          class="contribution-item"
        >
          <div class="contributor-info">
            <div class="avatar">
              <img :src="item.avatar || '/logo主图形.png'" alt="头像" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />
            </div>
            <div class="contributor-details">
              <div class="name">{{ item.realName || '匿名' }}</div>
              <div class="time">{{ item.publishDt || '未知时间' }}</div>
            </div>
          </div>
          <div class="contribution-content">
            <div class="content-text">{{ item.content }}</div>
            <div class="image-grid" v-if="item.wellbeingImg">
              <div class="grid-image" v-for="(media, index) in getMediaList(item.wellbeingImg)" :key="index" @click="openImageViewer(item, index)">
                <img :src="media" alt="图片" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px; cursor: pointer;" />
              </div>
            </div>
            <div class="contribution-footer">
              <div class="publish-time">{{ item.publishDt || '未知时间' }}发布</div>
              <div class="view-count">浏览总人数: {{ item.browse || 0 }}</div>
            </div>
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

    <!-- 图片查看器弹框 -->
    <van-popup v-model:show="imageViewer.show" position="center" :round="true" class="image-viewer-popup" overlay-class="image-viewer-overlay">
      <div class="image-viewer-container">
        <div class="image-viewer-header">
          <span class="image-counter">{{ imageViewer.currentIndex + 1 }} / {{ imageViewer.images.length }}</span>
          <div class="close-icon" @click="imageViewer.show = false">×</div>
        </div>
        <div class="image-viewer-content">
          <img :src="imageViewer.images[imageViewer.currentIndex]" alt="查看图片" />
          <div class="image-viewer-controls" v-if="imageViewer.images.length > 1">
            <div class="control-icon left" @click="prevImage">‹</div>
            <div class="control-icon right" @click="nextImage">›</div>
          </div>
        </div>
        <div class="image-viewer-footer">
          <div class="contributor-info">
            <div class="avatar">
              <img :src="imageViewer.currentContribution?.avatar || '/logo主图形.png'" alt="头像" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />
            </div>
            <div class="contributor-details">
              <div class="popname">{{ imageViewer.currentContribution?.realName || '匿名' }}</div>
              <div class="content-preview">{{ imageViewer.currentContribution?.content || '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getWellbeingArticle, getWellbeingPage } from '@/api/assets'
import { Icon } from 'vant'

const router = useRouter()

// 文章数据
const article = ref({
  title: '',
  content: '',
  coverImg: ''
})

// 投稿列表数据
const contributions = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loading = ref(false)

// 图片查看器状态
const imageViewer = ref({
  show: false,
  images: [],
  currentIndex: 0,
  currentContribution: null
})

const goBack = () => {
  router.back()
}

const goToContribute = () => {
  router.push('/contribute')
}

const goToMyContributions = () => {
  router.push('/my-contributions')
}

// 打开图片查看器
const openImageViewer = (contribution, index) => {
  imageViewer.value = {
    show: true,
    images: getMediaList(contribution.wellbeingImg),
    currentIndex: index,
    currentContribution: contribution
  }
}

// 切换到上一张图片
const prevImage = () => {
  if (imageViewer.value.currentIndex > 0) {
    imageViewer.value.currentIndex--
  }
}

// 切换到下一张图片
const nextImage = () => {
  if (imageViewer.value.currentIndex < imageViewer.value.images.length - 1) {
    imageViewer.value.currentIndex++
  }
}

// 获取媒体列表
const getMediaList = (wellbeingImg) => {
  if (!wellbeingImg) return []
  
  // 分割字符串，获取所有文件
  const mediaList = wellbeingImg.split(',')
  
  // 检查每个文件是否是视频文件
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv']
  
  return mediaList.map(media => {
    const isVideo = videoExtensions.some(ext => media.toLowerCase().includes(ext))
    if (isVideo) {
      // 如果是视频，返回 logo 图片
      return '/logo主图形.png'
    } else {
      // 如果是图片，返回完整路径
      return media
    }
  })
}

// 获取文章数据
onMounted(async () => {
  try {
    const res = await getWellbeingArticle()
    if (res.code === 200 && res.data?.wellbeingArticle) {
      article.value = {
        title: res.data.wellbeingArticle.title || article.value.title,
        content: res.data.wellbeingArticle.content || article.value.content,
        coverImg: res.data.wellbeingArticle.coverImg || ''
      }
    }
  } catch (error) {
    console.error('获取文章失败:', error)
  }
  
  // 加载投稿列表
  await loadContributions()
})

// 加载投稿列表
const loadContributions = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    const res = await getWellbeingPage({
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
  
  if (contributions.value.length > 0 && scrollTop + clientHeight >= scrollHeight - 100 && hasMore.value && !loading.value) {
    loadContributions()
  }
}

// 添加滚动事件监听器
onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

// 清理滚动事件监听器
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 70px;
}

.header-bg {
  height: 240px;
  background: url('@/assets/国家民生福祉/民生福祉背景.png') no-repeat top center;
  background-size: 100% auto;
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}

:deep(.van-nav-bar__title) {
  color: #fff;
}

.header-content {
  padding: 0 20px;
  text-align: center;
  position: relative;
  z-index: 1;
  margin-top: 40px;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  letter-spacing: 2px;
  color: #fff;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.header-btn {
  background: var(--blue-gradient);
  border: 1px solid white;
  color: #fff;
  font-size: 16px;
  padding: 0 24px;
  height: 40px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.page__body {
  padding: 0 16px;
  margin-top: -30px;
  position: relative;
  z-index: 1;
}

.image-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 16px;
}

.headline-layout {
  overflow: hidden;
  position: relative;
}

.card-image-left {
  width: 120px;
  height: 160px;
  background: #f0f0f0;
  border-radius: 8px;
  float: left;
    margin-right: 20px;
    margin-bottom: 10px;
}

.project-name-text {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: left;
  margin-bottom: 12px;
  margin-top: 0;
}

.headline-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  text-align: justify;
  margin: 0;
  padding: 0;
  display: block;
  word-break: break-all;
  overflow-wrap: break-word;
}

.contribution-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contribution-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
}

.contributor-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  margin-right: 12px;
}

.contributor-details {
  flex: 1;
}

.name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}
.popname {
  font-size: 16px;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
}

.time {
  font-size: 12px;
  color: #999;
}

.contribution-content {
  width: 100%;
}

.content-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  text-align: justify;
  margin-bottom: 12px;
  word-break: break-all;
  overflow-wrap: break-word;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.grid-image {
  aspect-ratio: 1;
  background: #f0f0f0;
  border-radius: 4px;
}

.contribution-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
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

/* 图片查看器样式 */
.image-viewer-overlay {
  background: rgba(0, 0, 0, 0.5) !important;
}

.image-viewer-popup {
  width: 95%;
  max-width: 95vw;
  max-height: 90vh;
  background: rgba(0, 0, 0, 0.5) !important;
  border-radius: 12px;
  overflow: hidden;
}

.image-viewer-container {
  position: relative;
  padding: 12px;
  border-radius: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.image-viewer-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  min-height: 400px;
  max-height: none;
  position: relative;
  width: 100%;
}

.image-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.image-counter {
  font-size: 14px;
  color: white;
}

.close-icon {
  font-size: 28px;
  color: white;
  cursor: pointer;
  line-height: 1;
}

.image-viewer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  min-height: 400px;
  max-height: 70vh;
  position: relative;
  width: 100%;
}

.image-viewer-content img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  max-width: none !important;
  max-height: none !important;
}

.image-viewer-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  min-height: 80px;
}

.content-preview {
  font-size: 14px;
  color: white;
  margin-top: 4px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.image-viewer-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  z-index: 10;
}

.control-icon {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
}

.control-icon.left {
  margin-left: -5px;
}

.control-icon.right {
  margin-right: -5px;
}
</style>