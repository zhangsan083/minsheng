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
          <div class="card-image-left"></div>
            <h3 class="project-name-text">2026年新年贺词摘录</h3>
            <p class="headline-text">
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 
            </p>
        </div>
      </div>

      <!-- 投稿列表 -->
      <div class="contribution-list">
        <!-- 投稿项 1 -->
        <div class="contribution-item">
          <div class="contributor-info">
            <div class="avatar"></div>
            <div class="contributor-details">
              <div class="name">姓名</div>
              <div class="time">0天前</div>
            </div>
          </div>
          <div class="contribution-content">
            <div class="content-text">
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </div>
            <div class="image-grid">
              <div class="grid-image"></div>
              <div class="grid-image"></div>
              <div class="grid-image"></div>
              <div class="grid-image"></div>
            </div>
            <div class="contribution-footer">
              <div class="publish-time">00天前发布</div>
              <div class="view-count">浏览总人数: 000000</div>
            </div>
          </div>
        </div>

        <!-- 投稿项 2 -->
        <div class="contribution-item">
          <div class="contributor-info">
            <div class="avatar"></div>
            <div class="contributor-details">
              <div class="name">姓名</div>
              <div class="time">0天前</div>
            </div>
          </div>
          <div class="contribution-content">
            <div class="content-text">
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </div>
            <div class="image-grid">
              <div class="grid-image"></div>
              <div class="grid-image"></div>
              <div class="grid-image"></div>
              <div class="grid-image"></div>
            </div>
            <div class="contribution-footer">
              <div class="publish-time">00天前发布</div>
              <div class="view-count">浏览总人数: 000000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goToContribute = () => {
  router.push('/contribute')
}

const goToMyContributions = () => {
  router.push('/my-contributions')
}
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
  text-align: right;
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
</style>