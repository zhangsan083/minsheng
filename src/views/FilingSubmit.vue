<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="项目名称"
        left-arrow
        @click-left="goBack"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="image-card project-name-card">
        <h3 class="project-name-text">中国梦项目名称</h3>
        <div class="card-content-wrapper">
          <div class="card-image-left"></div>
          <p class="project-description">
            中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介
          </p>
        </div>
      </div>
      
      <div class="image-card national-project-card">
        <div class="card-header">
          <div class="card-title">国家级项目</div>
        </div>
        <div class="card-image"></div>
          <p class="project-text">
            内容明细内容明细内容明细内容明细内容明细内容明细内容明细内容明细内容明细内容
          </p>
        <div class="card-content">
          <div class="point-title">
            <span class="point-title-chip" data-index="1">内容标题</span>
          </div>
          <p class="highlight-content">
            内容明细内容明细内容明细内容明细内容明细明细内容明细内容明细内容明细
          </p>
          
          <div class="point-title">
            <span class="point-title-chip" data-index="2">内容标题</span>
          </div>
          <p class="highlight-content">
            内容明细内容明细内容明细内容明细内容明细内容明细内容
          </p>
          
          <div class="point-title">
            <span class="point-title-chip" data-index="3">内容标题</span>
          </div>
          <p class="highlight-content">
            内容明细内容明细内容明细内容明细内容明细内容明细内容明细
          </p>
        </div>
      </div>
      
      <div class="application-card">
        <div class="section-header">申请资料</div>
        
        <div class="form-item">
          <span class="form-label">中国梦项目名称:</span>
          <span class="form-value">{{ projectName }}</span>
        </div>
        
        <div class="form-item" @click="showCalendar = true">
          <span class="form-label">预计参与日期:</span>
          <div class="form-value clickable">
            点击选择
          </div>
        </div>
        
        <div class="form-item" @click="showAssetPicker = true">
          <span class="form-label">项目未下发资产:</span>
          <div class="form-value clickable">
            点击选择
          </div>
        </div>
        
        <div class="submit-btn-wrapper">
          <van-button 
            block 
            type="primary" 
            class="submit-btn"
            @click="handleSubmit"
            :disabled="!date || !asset"
          >
            提交审核
          </van-button>
        </div>
      </div>
      
      <div class="info-card">
        <div class="letter-content">
          <p class="note-content">
            <span class="note-bullet">◆</span> 注意事项：根据《中华人民共和国数据安全法》等相关法律法规规定，您在填写本表格时，应保证所提交的相关资料真实、完整、有效。
          </p>
          <p class="note-content">
            <span class="note-bullet">◆</span> 若发现弄虚作假、隐瞒实际情况，对干扰政府部门正常工作秩序、侵害国家利益的行为，将依法追究相关责任。
          </p>
          <p class="note-content">
            <span class="note-bullet">◆</span> 本资产备案申请表格所有数据项均为必填项，应填写完整。数据提交前请认真核对，若因数据不完整或错误导致审核不通过，备案登记申请人自行承担一切法律责任及由此造成的经济损失。
          </p>
        </div>
      </div>
    </div>
    
    <!-- 日期选择器 -->
    <van-calendar
      v-model:show="showCalendar"
      type="date"
      title="选择预计参与日期"
      @confirm="onDateConfirm"
    />
    
    <!-- 资产选择器 -->
    <van-popup
      v-model:show="showAssetPicker"
      position="bottom"
      round
      style="height: 80%"
    >
      <van-picker
        title="选择项目未下发资产"
        :columns="assetColumns"
        @confirm="onAssetConfirm"
        @cancel="showAssetPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { addAssetFiling } from '@/api/assets'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 从路由参数获取项目名称
const projectName = ref(route.query.project || '')
const date = ref('')
const asset = ref('')
const assetIndex = ref(0)

const showCalendar = ref(false)
const showAssetPicker = ref(false)

const assetColumns = [
  '0-100万','100万-500万','500万-1000万','1000万-5000万','5000万-1亿'
]

const goBack = () => {
  router.back()
}

const onDateConfirm = (value) => {
  date.value = value
  showCalendar.value = false
}

const onAssetConfirm = (value) => {
  asset.value = value
  assetIndex.value = assetColumns.indexOf(value) + 1
  showAssetPicker.value = false
}

const handleSubmit = async () => {
  if (!date.value || !asset.value) {
    showToast('请填写完整信息')
    return
  }
  
  try {
    const params = {
      amountScope: assetIndex.value,
      participateDt: date.value,
      projectName: projectName.value
    }
    
    const res = await addAssetFiling(params)
    if (res.code === 200) {
      // 刷新用户信息，确保资产备案数等数据最新
      await userStore.refreshUserInfo()
      
      showToast('提交成功')
      setTimeout(() => {
        router.push('/assets')
      }, 1500)
    } else {
      showToast(res.msg || '提交失败')
    }
  } catch (error) {
    console.error('Submit failed:', error)
    showToast('提交失败，请稍后重试')
  }
}

onMounted(() => {
  // 确保用户信息已加载
  if (!userStore.userInfo) {
    userStore.refreshUserInfo()
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px; /* Increased padding for tabbar */
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

.image-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.project-text {
  font-size: var(--font-size-small);
  color: #666;
  line-height: 1.5;
  text-align: justify;
  margin:18px 18px 0px 18px;
}

.project-name-card {
  padding: 20px;
}

.card-content-wrapper {
  position: relative;
}

.card-image-left {
  width: 120px;
  height: 120px;
  background: #d9d1c7;
  border-radius: 8px;
  float: left;
  margin-right: 20px;
  margin-bottom: 10px;
}

.project-description {
  font-size: var(--font-size-small);
  color: #666;
  line-height: 1.5;
  text-align: justify;
  margin: 0;
  padding: 0;
  display: block;
}


.card-header {
  position: absolute;
  top: 25px;
  left: 20px;
  z-index: 2;
}

.card-title {
  background: #2b7afb;
  color: white;
  font-size: var(--font-size-base);
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 0 12px 12px 0;
}

.card-image {
  width: 89%;
  min-height: 120px;
  background: #d9d1c7;
  border-radius: 0;
  position: relative;
  margin: 18px auto;
  border: 1px solid #e0e0e0;
}

.point-title-chip {
  display: inline-block;
  height: 30px;
  line-height: 24px;
  padding: 3px 45px 3px 35px;
  color: #fff;
  font-weight: 700;
  background: #2b7afb;
  border-radius: 999px;
  position: relative;
  font-size: 16px;
}

.card-content {
  position: relative;
  z-index: 1;
}

.project-name-text {
  font-size: var(--font-size-large);
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 16px;
}

.point-title {
  display: flex;
  align-items: center;
  margin: 16px 0 8px;
  font-weight: bold;
  gap: 8px;
}

.point-title-chip {
  display: inline-block;
  height: 30px;
  line-height: 24px;
  padding: 3px 45px 3px 35px;
  color: #fff;
  font-weight: 700;
  background: url('@/assets/惠民补助金/未标题-1.png') no-repeat center;
  background-size: 100% 100%;
  border-radius: 999px;
  position: relative;
  font-size: 16px;
}

.point-title-chip::before {
  content: attr(data-index);
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.highlight-content {
  margin:0px 18px 0px 18px;
  margin-bottom: 16px;
  text-align: justify;
  color: #666;
  font-size: var(--font-size-small);
  line-height: 1.5;
}

.section-header {
  background: #2b7afb;
  color: white;
  font-size: var(--font-size-base);
  font-weight: bold;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
}

.application-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  font-size: var(--font-size-base);
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  color: #333;
  font-weight: 500;
  width: 120px;
}

.form-value {
  color: #666;
  display: flex;
  align-items: center;
}

.clickable {
  color: #2b7afb;
  cursor: pointer;
}

.submit-btn-wrapper {
  padding: 20px 16px;
}

.submit-btn {
  background: #2b7afb;
  border: none;
  font-weight: bold;
  font-size: var(--font-size-base);
  height: 48px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(43, 122, 251, 0.3);
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.note-content {
  font-size: var(--font-size-small);
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}

.note-bullet {
  color: #2b7afb;
  margin-right: 8px;
  font-weight: bold;
}
</style>