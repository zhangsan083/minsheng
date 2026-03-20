<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="我要投稿"
        left-arrow
        @click-left="goBack"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="input-section">
        <textarea
          v-model="content"
          placeholder="请输入您的投稿内容..."
          class="content-input"
        ></textarea>
      </div>

      <div class="upload-section">
        <div class="upload-area" @click="selectMedia">
          <div class="upload-icon">+</div>
        </div>
        <p class="upload-tip">注意：图片/视频最多只能传9张</p>
      </div>

      <div class="submit-btn-wrapper">
        <van-button 
          block 
          round 
          type="primary" 
          class="submit-btn"
          @click="handleSubmit"
          :disabled="!content"
        >
          投稿
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const content = ref('')

const goBack = () => {
  router.back()
}

const selectMedia = () => {
  // 这里可以实现图片/视频选择逻辑
  showToast('选择媒体文件')
}

const handleSubmit = () => {
  if (!content.value) {
    showToast('请输入投稿内容')
    return
  }
  
  // 这里可以实现投稿提交逻辑
  showToast('投稿成功')
  setTimeout(() => {
    router.push('/my-contributions')
  }, 1500)
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

.input-section {
  margin-bottom: 24px;
}

.content-input {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background-color: #fff;
  font-size: var(--font-size-small);
  resize: none;
  outline: none;
}

.upload-section {
  margin-bottom: 32px;
}

.upload-area {
  width: 100%;
  height: 120px;
  border: 1px dashed #e5e5e5;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 8px;
}

.upload-icon {
  font-size: 24px;
  color: #999;
}

.upload-tip {
  font-size: var(--font-size-xs);
  color: #999;
  text-align: center;
  margin: 0;
}

.submit-btn-wrapper {
  margin-bottom: 24px;
}

.submit-btn {
  background: #2b7afb;
  border: none;
  height: 48px;
  font-size: var(--font-size-base);
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(43, 122, 251, 0.3);
}
</style>