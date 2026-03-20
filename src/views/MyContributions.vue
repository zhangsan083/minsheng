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
      <div class="contribution-item" v-for="(item, index) in contributions" :key="index">
        <div class="contribution-content">
          <div class="contribution-image"></div>
          <div class="contribution-text">{{ item.content }}</div>
        </div>
        <div class="contribution-info">
          <span class="publish-time">发布时间：{{ item.publishTime }}</span>
          <span class="status" :class="item.statusClass">{{ item.status }}</span>
          <span class="view-count">浏览总人数：{{ item.viewCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟投稿数据
const contributions = ref([
  {
    content: '文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章',
    publishTime: '0天前',
    status: '审核通过',
    statusClass: 'status-pass',
    viewCount: '000000'
  },
  {
    content: '文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章',
    publishTime: '0天前',
    status: '审核未通过',
    statusClass: 'status-fail',
    viewCount: '000000'
  },
  {
    content: '文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章文稿文章',
    publishTime: '0天前',
    status: '审核中',
    statusClass: 'status-pending',
    viewCount: '000000'
  }
])

const goBack = () => {
  router.back()
}
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
</style>