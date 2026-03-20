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
      <!-- <div class="image-card project-name-card">
        <h3 class="project-name-text">中国梦项目名称</h3>
        <div class="card-content-wrapper">
          <div class="card-image-left"></div>
          <p class="project-description">
            中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介中国梦项目简介
          </p>
        </div>
      </div> -->
      
      <!-- <div class="image-card national-project-card">
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
      </div> -->
      
      <div class="section-title">
        <img src="@/assets/资产/标题前缀.png" alt="标题前缀" style="width: 20px; height: 20px; filter: brightness(0) invert(1);" />
        <span class="text">申请资料</span>
      </div>
      <div class="form-card">
        <div class="form-item">
          <div class="form-label">中国梦项目名称：</div>
          <div class="form-value">{{ projectName }}</div>
        </div>

        <div class="form-item">
          <div class="form-label">姓名：</div>
          <div class="form-value">{{ userStore.userInfo?.realName || '未获取' }}</div>
        </div>

        <div class="form-item">
          <div class="form-label">身份证号：</div>
          <div class="form-value">{{ userStore.userInfo?.idNumber || '未获取' }}</div>
        </div>

        <div class="form-item">
          <div class="form-label">手机号：</div>
          <div class="form-value">
            <van-field
              v-model="phone"
              type="tel"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="请输入手机号"
              :maxlength="11"
              style="width: 100%;"
              @input="handlePhoneInput"
            />
          </div>
        </div>

        <div class="form-item" @click="showCalendar = true">
          <div class="form-label">预计参与日期：</div>
          <div class="form-value placeholder" v-if="!date">点击选择</div>
          <div class="form-value" v-else>{{ date }}</div>
        </div>
        
        <div class="form-item" @click="showAssetPicker = true">
          <div class="form-label">项目未下发资产：</div>
          <div class="form-value placeholder" v-if="!asset">点击选择</div>
          <div class="form-value" v-else>{{ asset }}</div>
        </div>
      </div>

      <div class="submit-btn-wrapper">
        <van-button 
          block 
          round 
          type="primary" 
          class="submit-btn"
          @click="handleSubmit"
          :disabled="!date || !asset || !phone"
        >
          提交审核
        </van-button>
      </div>

      <div class="notice">
        <span class="dot">●</span> 注意事项：根据《中华人民共和国统计法》等相关法律法规规定，登记人在填写资料时，应当依法如实提交申请资料，确保所提供信息的真实性、准确性和完整性。对于采取虚构事实、隐瞒真相等方式提交虚假材料的行为，国家数据局有权依法撤销相关申请认证，并按照有关规定采取信用惩戒等监管措施。因登记资料缺失实引发的项目受阻、权益受损等不利后果，均由登记申请人自行承担一切法律责任及由此造成的经济损失。
      </div>
    </div>
    
    <!-- 日期选择器 -->
    <van-calendar
      v-model:show="showCalendar"
      @confirm="onDateConfirm"
      color="#2b7afb"
    />
    
    <!-- 资产范围搜索选择器 -->
    <van-popup v-model:show="showAssetPicker" position="bottom" :style="{ height: '60%' }">
      <div class="picker-header">
        <div class="header-title">项目未下发资产选择</div>
      </div>
      <div class="search-container">
        <van-field
          v-model="assetSearchText"
          placeholder="搜索选项"
          @input="filterAssets"
          clearable
          @change="filterAssets"
        />
      </div>
      <div class="picker-content">
        <div
          v-for="(item, index) in filteredAssets"
          :key="item.value"
          class="picker-item"
          :class="{ active: selectedAsset === item.value }"
          @click="selectedAsset = item.value"
        >
          {{ item.text }}
        </div>
        <div v-if="filteredAssets.length === 0" class="no-result">
          无搜索结果
        </div>
      </div>
      <div class="picker-footer">
        <van-button 
          block 
          type="primary" 
          round 
          @click="confirmAssetSelection"
        >
          确认选择
        </van-button>
      </div>
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
const phone = ref('')

const showCalendar = ref(false)
const showAssetPicker = ref(false)

// 资产选择器相关
const assetSearchText = ref('')
const selectedAsset = ref('')
const assets = ref([
  { value: '1', text: '0-100万' },
  { value: '2', text: '100万-500万' },
  { value: '3', text: '500万-1000万' },
  { value: '4', text: '1000万-5000万' },
  { value: '5', text: '5000万-1亿' }
])
const filteredAssets = ref([...assets.value])

const goBack = () => {
  router.back()
}

const onDateConfirm = (dateObj) => {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  date.value = `${year}-${month}-${day}`
  showCalendar.value = false
}

const filterAssets = () => {
  if (assetSearchText.value) {
    filteredAssets.value = assets.value.filter(item => 
      item.text.includes(assetSearchText.value)
    )
  } else {
    filteredAssets.value = [...assets.value]
  }
}

const confirmAssetSelection = () => {
  if (selectedAsset.value) {
    const selectedItem = assets.value.find(item => item.value === selectedAsset.value)
    if (selectedItem) {
      asset.value = selectedItem.text
    }
  }
  showAssetPicker.value = false
}

const handlePhoneInput = (event) => {
  // 只保留数字
  phone.value = event.target.value.replace(/\D/g, '')
}

const handleSubmit = async () => {
  if (!date.value || !asset.value || !phone.value) {
    showToast('请填写完整信息')
    return
  }
  
  try {
    const selectedItem = assets.value.find(item => item.text === asset.value)
    const amountScope = selectedItem ? selectedItem.value : ''
    
    const params = {
      amountScope: amountScope,
      participateDt: date.value,
      projectName: projectName.value,
      phone: phone.value
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

onMounted(async () => {
  // 确保用户信息已加载
  if (!userStore.userInfo) {
    await userStore.refreshUserInfo()
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
  word-break: break-all;
  overflow-wrap: break-word;
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
  word-break: break-all;
  overflow-wrap: break-word;
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
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  font-size: var(--font-size-small);
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  color: #333;
  font-weight: 500;
}

.form-value {
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.form-value.placeholder {
  color: #2b7afb;
  cursor: pointer;
}

.clickable {
  color: #2b7afb;
  cursor: pointer;
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

.form-card {
  background: white;
  border-radius: 12px;
  padding: 0 20px;
  margin-bottom: 30px;
}

.notice {
  font-size: var(--font-size-xs);
  color: #333;
  line-height: 1.6;
  text-align: justify;
  padding: 0 4px;
}

.dot {
  color: #2b7afb;
  margin-right: 4px;
  font-weight: bold;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: var(--font-size-base);
  /* color: #333; */
  color: white;
}

.section-title .text {
  margin-left: 8px;
}

/* 自定义选择器样式 */
.picker-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.header-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #333;
  text-align: center;
}

.no-result {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: var(--font-size-small);
}

.search-container {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.search-container .van-field {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.search-container .van-field__control {
  font-size: var(--font-size-small);
}

.picker-content {
  height: calc(100% - 200px);
  overflow-y: auto;
  background-color: #fff;
}

.picker-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: var(--font-size-small);
  color: #333;
  cursor: pointer;
  position: relative;
}

.picker-item:active {
  background-color: #f5f7fa;
}

.picker-item.active {
  color: #2b7afb;
  background-color: #f5f7fa;
}

.picker-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
}

.picker-footer .van-button {
  height: 44px;
  font-size: var(--font-size-base);
  font-weight: bold;
  background-color: #2b7afb;
  border: none;
}

.picker-footer .van-button:hover {
  background-color: #1a66e5;
}

.picker-footer .van-button:active {
  background-color: #0f52c1;
}
</style>