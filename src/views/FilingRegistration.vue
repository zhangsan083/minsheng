<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="备案登记"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- User Info Card -->
      <div class="card user-info-card">
        <div class="info-rows">
          <div class="info-row">
            <span class="label">真实姓名：</span>
            <span class="value">{{ userInfo.realName }}</span>
          </div>
          <div class="info-row">
            <span class="label">手机号码：</span>
            <span class="value">{{ showPhone ? userInfo.fullPhone : userInfo.phone }}</span>
            <van-icon :name="showPhone ? 'eye-o' : 'closed-eye'" class="eye-icon" @click="showPhone = !showPhone" />
          </div>
          <div class="info-row">
            <span class="label">身份证号：</span>
            <span class="value">{{ showIdCard ? userInfo.fullIdCard : userInfo.idCard }}</span>
            <van-icon :name="showIdCard ? 'eye-o' : 'closed-eye'" class="eye-icon" @click="showIdCard = !showIdCard" />
          </div>
        </div>
        <div class="logo">
          <img src="@/assets/资产/china-dream-logo.png" alt="China Dream" />
        </div>
      </div>

      <!-- China Dream Project Section -->
      <div class="china-dream-section">
        <div class="china-dream-header" @click="showProjectPicker = true">
          <div class="china-dream-icon">
            <img src="@/assets/资产/china-dream-logo.png" alt="China Dream" />
          </div>
          <div class="china-dream-title">
            <div class="main-title">其余中国梦项目</div>
            <div class="sub-title">更多项目审核请选择</div>
          </div>
          <van-icon name="arrow-down" class="dropdown-icon" />
        </div>
        
        <!-- Selected Project Display -->
        <div v-if="formData.project" class="selected-project">
          <div class="project-name">{{ formData.project }}</div>
          <van-button 
            type="primary" 
            round 
            class="submit-btn"
            @click="handleSubmit"
          >
            提交审核
          </van-button>
        </div>
      </div>

      <!-- National Projects Grid -->
      <div class="national-projects-grid">
        <div 
          v-for="(project, index) in nationalProjects" 
          :key="index" 
          class="national-project-card"
        >
          <div class="project-badge">国家级项目</div>
          <div class="project-image" v-if="project.coverImg">
            <img :src="project.coverImg" alt="项目封面" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div class="project-image" v-else></div>
          <div class="project-info">
            <div class="project-name">{{ project.name }}</div>
            <van-button 
              type="primary" 
              round 
              class="submit-btn"
              @click="submitNationalProject(project.name, project.id)"
            >
              提交审核
            </van-button>
          </div>
        </div>
      </div>

      <div class="notice">
        <span class="dot">●</span> 注意事项：根据《中华人民共和国统计法》等相关法律法规规定，登记人在填写资料时，应当依法如实提交申请资料，确保所提供信息的真实性、准确性和完整性。对于采取虚构事实、隐瞒真相等方式提交虚假材料的行为，国家数据局有权依法撤销相关申请认证，并按照有关规定采取信用惩戒等监管措施。因登记资料缺失实引发的项目受阻、权益受损等不利后果，均由登记申请人自行承担一切法律责任及由此造成的经济损失。
      </div>
    </div>

    <!-- Popups -->
    <!-- <van-calendar v-model:show="showCalendar" @confirm="onDateConfirm" color="#2b7afb" /> -->
    
    <!-- 项目名称搜索选择器 -->
    <van-popup v-model:show="showProjectPicker" position="bottom" :style="{ height: '60%' }">
      <div class="picker-header">
        <div class="header-title">中国梦项目名称选择</div>
      </div>
      <div class="search-container">
        <van-field
          v-model="projectSearchText"
          placeholder="搜索选项"
          @input="filterProjects"
          clearable
          @change="filterProjects"
        />
      </div>
      <div class="picker-content" @scroll="onPickerScroll">
        <div
          v-for="item in filteredProjects"
          :key="item.value"
          class="picker-item"
          :class="{ active: selectedProject === item.value }"
          @click="selectedProject = item.value"
        >
          {{ item.text }}
        </div>
        <div v-if="filteredProjects.length === 0 && !loading" class="no-result">
          无搜索结果
        </div>
        <div v-if="loading" class="loading">
          加载中...
        </div>
        <div v-if="!hasMore && filteredProjects.length > 0" class="no-more">
          没有更多了
        </div>
      </div>
      <div class="picker-footer">
        <van-button 
          block 
          type="primary" 
          round 
          @click="confirmProjectSelection"
        >
          确认选择
        </van-button>
      </div>
    </van-popup>

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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { getProjectPage } from '@/api/assets'

const router = useRouter()
const userStore = useUserStore()

const showPhone = ref(false)
const showIdCard = ref(false)

// 从用户存储中获取信息
const userInfo = computed(() => {
  const info = userStore.userInfo || {}
  return {
    realName: info.realName || '未获取',
    phone: info.phonenumber ? hidePhone(info.phonenumber) : '未获取',
    fullPhone: info.phonenumber || '未获取',
    idCard: info.idNumber ? hideIdCard(info.idNumber) : '未获取',
    fullIdCard: info.idNumber || '未获取'
  }
})

// 隐藏手机号
const hidePhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 隐藏身份证号
const hideIdCard = (idCard) => {
  if (!idCard) return ''
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
}

onMounted(async () => {
  // 确保用户信息已加载
  if (!userStore.userInfo) {
    await userStore.refreshUserInfo()
  }
  
  // 加载国家级项目（热门项目）
  await loadProjects(true, true)
  
  // 加载更多项目
  projectPage.value = 1
  projectList.value = []
  hasMore.value = true
  await loadProjects(false, true)
})

// 国家级项目列表
const nationalProjects = ref([])

// 分页相关状态
const projectPage = ref(1)
const projectPageSize = ref(20)
const projectList = ref([])
const hasMore = ref(true)
const loading = ref(false)

const formData = reactive({
  project: '',
  projectId: ''
})



const showProjectPicker = ref(false)

// 搜索相关数据
const projectSearchText = ref('')

// 选中的数据
const selectedProject = ref('')

// 过滤后的数据
const filteredProjects = ref([])

// 防抖函数
const debounce = (func, delay) => {
  let timeoutId
  return function() {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, arguments), delay)
  }
}

// 加载项目列表
const loadProjects = async (isHot = false, isSearch = false) => {
  if (loading.value || (!isHot && !isSearch && !hasMore.value)) return
  
  loading.value = true
  try {
    const res = await getProjectPage({
      page: isSearch ? 1 : projectPage.value,
      pageSize: projectPageSize.value,
      isHot: isHot ? 1 : 0,
      projectName: projectSearchText.value
    })
    
    if (res.code === 200) {
      const newProjects = res.data.records.map(item => ({
        text: item.projectName,
        value: item.id
      }))
      
      // 如果是热门项目，加载到 nationalProjects
      if (isHot) {
        nationalProjects.value = res.data.records.map(item => ({
          name: item.projectName,
          id: item.id,
          coverImg: item.coverImg
        }))
      } else {
        // 否则加载到 projectList
        if (isSearch || projectPage.value === 1) {
          projectList.value = newProjects
        } else {
          projectList.value = [...projectList.value, ...newProjects]
        }
        
        hasMore.value = projectList.value.length < res.data.total
        if (!isSearch) {
          projectPage.value++
        }
        
        // 更新过滤后的数据
        filteredProjects.value = [...projectList.value]
      }
    } else {
      showToast(res.msg || '获取项目列表失败')
    }
  } catch (error) {
    console.error('Load projects failed:', error)
    showToast('获取项目列表失败')
  } finally {
    loading.value = false
  }
}

// 过滤项目名称
const filterProjects = debounce(() => {
  projectPage.value = 1
  projectList.value = []
  hasMore.value = true
  loadProjects(false, true)
}, 300)

// 滚动加载更多
const onPickerScroll = (event) => {
  const target = event.target
  const scrollHeight = target.scrollHeight
  const scrollTop = target.scrollTop
  const clientHeight = target.clientHeight
  
  if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore.value && !loading.value) {
    loadProjects(false, false)
  }
}

// 确认项目选择
const confirmProjectSelection = () => {
  if (selectedProject.value) {
    const selectedItem = projectList.value.find(item => item.value === selectedProject.value)
    if (selectedItem) {
      formData.project = selectedItem.text
      formData.projectId = selectedItem.value
    }
  }
  showProjectPicker.value = false
  projectSearchText.value = ''
  selectedProject.value = ''
  projectPage.value = 1
  projectList.value = []
  hasMore.value = true
  // 重置过滤
  loadProjects(false, true)
}

// 提交国家级项目
const submitNationalProject = (projectName, projectId) => {
  // 跳转到 filing-submit 界面，传递项目名称和ID
  router.push({
    path: '/filing-submit',
    query: { project: projectName, projectId: projectId }
  })
}

// 提交审核
const handleSubmit = () => {
  if (!formData.project) {
    showToast('请选择项目名称')
    return
  }
  
  // 跳转到 filing-submit 界面，传递项目名称和ID
  router.push({
    path: '/filing-submit',
    query: { project: formData.project, projectId: formData.projectId }
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px; /* Increased padding for tabbar */
}

.header-bg {
  height: 240px;
  background: url('@/assets/资产/asset-filing-header-bg.png') no-repeat top center;
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

.content {
  padding: 0 16px;
  margin-top: -50px;
  position: relative;
  z-index: 1;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 24px;
}

.user-info-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #2b7afb;
}

.info-rows {
  flex: 1;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: var(--font-size-small);
  color: #333;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #333;
  width: 80px;
}

.value {
  color: #333;
  font-weight: 500;
}

.eye-icon {
  margin-left: 8px;
  color: #2b7afb;
  font-size: 16px;
}

.logo img {
  width: 80px;
  height: auto;
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
}

/* China Dream Project Section */
.china-dream-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 24px;
}

.china-dream-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.china-dream-icon {
  margin-right: 12px;
}

.china-dream-icon img {
  width: 90px;
  height: 60px;
  object-fit: cover;
}

.china-dream-title {
  flex: 1;
}

.china-dream-title .main-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.china-dream-title .sub-title {
  font-size: var(--font-size-small);
  color: #666;
}

.dropdown-icon {
  font-size: 16px;
  color: #999;
}

.selected-project {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.selected-project .project-name {
  font-size: var(--font-size-base);
  color: #333;
  font-weight: 500;
  margin-bottom: 12px;
  width: 100%;
  text-align: center;
  background: white;
  border-radius: 8px;
  padding:10px;
}

/* National Projects Grid */
.national-projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.national-project-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
}

.project-badge {
  position: absolute;
  top: 0;
  left: 2%;
  background: #2b7afb;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 0 8px 8px 0;
  z-index: 1;
}

.project-image {
  width: 96%;
  height: 120px;
  background: #f5f7fa;
  margin: 2%;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.project-info {
  padding: 12px 16px 16px;
  text-align: center;
}

.project-info .project-name {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.submit-btn {
  background: #2b7afb;
  border: none;
  height: 32px !important;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(43, 122, 251, 0.3);
  width: 120px;
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

.loading {
  padding: 20px 0;
  text-align: center;
  color: #2b7afb;
  font-size: var(--font-size-small);
}

.no-more {
  padding: 20px 0;
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
  padding: 7px;
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