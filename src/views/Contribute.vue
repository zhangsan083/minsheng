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
        <div class="upload-list">
          <div 
            class="upload-item" 
            v-for="(item, index) in uploadedFiles" 
            :key="index"
          >
            <div class="upload-preview">
              <img :src="item.url" alt="预览" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
              <div class="remove-icon" @click="removeFile(index)">×</div>
            </div>
          </div>
          <div 
            class="upload-area" 
            @click="selectMedia" 
            v-if="uploadedFiles.length < 9"
          >
            <div class="upload-icon">+</div>
          </div>
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
import { uploadFile, addWellbeingApply } from '@/api/assets'

const router = useRouter()
const content = ref('')
const uploadedFiles = ref([])
const loading = ref(false)

const goBack = () => {
  router.back()
}

const selectMedia = () => {
  // 创建文件选择器
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*,video/*'
  input.multiple = true
  
  input.onchange = async (e) => {
    const files = e.target.files
    if (files.length > 0) {
      // 检查是否超过最大上传数量
      if (uploadedFiles.value.length + files.length > 9) {
        showToast('最多只能上传9个文件')
        return
      }
      
      // 逐个上传文件
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // 限制文件大小
        if (file.size > 10 * 1024 * 1024) {
          showToast('文件大小不能超过10MB')
          continue
        }
        
        await uploadFileItem(file)
      }
    }
  }
  
  input.click()
}

const uploadFileItem = async (file) => {
  loading.value = true
  try {
    const res = await uploadFile(file)
    if (res.code === 200) {
      uploadedFiles.value.push({
        url: res.url,
        fileName: res.fileName
      })
      showToast('文件上传成功')
    } else {
      showToast('文件上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    showToast('文件上传失败')
  } finally {
    loading.value = false
  }
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (!content.value) {
    showToast('请输入投稿内容')
    return
  }
  
  loading.value = true
  try {
    // 提取 fileName 字段，用逗号分隔
    const wellbeingImg = uploadedFiles.value.map(item => item.fileName).join(',')
    
    const params = {
      content: content.value,
      wellbeingImg: wellbeingImg
    }
    
    const res = await addWellbeingApply(params)
    if (res.code === 200) {
      showToast('投稿成功')
      setTimeout(() => {
        router.push('/my-contributions')
      }, 1500)
    } else {
      showToast(res.msg || '投稿失败')
    }
  } catch (error) {
    console.error('投稿失败:', error)
    showToast('投稿失败，请稍后重试')
  } finally {
    loading.value = false
  }
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
  margin-bottom: 24px;
}

.upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.upload-item {
  width: calc(33.333% - 8px);
}

.upload-area {
  width: calc(33.333% - 8px);
  aspect-ratio: 1;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-icon {
  font-size: 24px;
  color: #999;
}

.upload-preview {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
  overflow: hidden;
}

.remove-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
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