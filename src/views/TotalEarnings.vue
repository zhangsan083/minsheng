<template>
  <div class="page">
    <!-- 头部 -->
    <div class="header">
      <van-nav-bar
        title="推荐总收益"
        left-arrow
        @click-left="goBack"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-info">
          <div class="avatar">
            <img :src="userInfo.avatar || '/logo主图形.png'" alt="头像" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />
          </div>
          <div class="info-container">
            <div class="top-row">
              <div class="name">
                {{ userInfo.realName || '未设置' }}
              </div>
              <div class="invite-code">
                <span class="label">邀请码：</span>
                <span class="value">{{ userInfo.inviteCode || '' }}</span>
                <img src="@/assets/团队长合作计划/复制.png" alt="复制" class="copy-icon" @click="copyInviteCode" />
              </div>
            </div>
            <div class="bottom-row">
              <div class="team-level">
                <div class="level-icon">
                  <img src="@/assets/团队长合作计划/团队长合作计划-V.png" alt="图标" style="width: 30px; height: 30px;" />
                </div>
                <span>{{ teamLeaderInfo.teamLeaderLevelName || '' }}</span>
              </div>
              <div class="recommender-row">
                <span class="label">推荐人：</span>
                <span class="value">{{ teamLeaderInfo.invitationName || '无' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 功能按钮 -->
        <div class="function-buttons">
          <div class="btn-item">基础工资体系</div>
          <div class="btn-item">团队拉新奖励</div>
          <div class="btn-item">团队业绩提成</div>
          <div class="btn-item">办公场地支持</div>
          <div class="btn-item">工作室运营扶持</div>
          <div class="btn-item">试用合作协议</div>
          <div class="btn-item">系统培训运营指导</div>
        </div>
      </div>

      <!-- 收益项目标签 -->
      <div class="earnings-tags">
        <div 
          v-for="tag in earningsTags" 
          :key="tag.id" 
          class="tag-item"
          :class="{ 'active': currentType === tag.id }"
          @click="handleTagClick(tag.id)"
        >
          {{ tag.name }}
        </div>
      </div>

      <!-- 总计金额 -->
      <div class="total-amount-section">
        <div class="total-label">总计金额</div>
        <div class="total-value">{{ totalAmount || 0 }}</div>
      </div>

      <!-- 收益明细列表 -->
      <div class="earnings-list">
        <div 
          v-if="loading" 
          class="loading-container"
        >
          <van-loading type="spinner" size="24px" />
          <span class="loading-text">加载中...</span>
        </div>
        <div 
          v-else-if="earningsList.length === 0" 
          class="empty-container"
        >
          <span>暂无收益记录</span>
        </div>
        <div v-else>
          <div 
            class="list-item" 
            v-for="(item, index) in earningsList" 
            :key="index" 
            :class="{ 'item-highlight': index % 2 === 1 }"
          >
            <div class="item-header">
              <div class="item-title">{{ item.walletLogFromTypeLabel || '' }}</div>
              <div class="item-amount">+{{ item.amount || 0 }}</div>
            </div>
            <div class="item-footer">
              <div class="item-desc">{{ item.remark || '' }}</div>
              <div class="item-date">{{ item.createDt || '' }}</div>
            </div>
          </div>
          <div v-if="loadingMore" class="loading-more">
            <van-loading type="spinner" size="20px" />
            <span class="loading-more-text">加载更多...</span>
          </div>
          <div v-else-if="earningsList.length >= total" class="no-more">
            <span>没有更多数据了</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast, Loading, Tabbar, TabbarItem } from 'vant'
import { getTeamLeaderRevenue, getTeamLeaderInfo } from '@/api/teamLeader'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userInfo = ref({
  avatar: '',
  realName: '',
  inviteCode: ''
})

const teamLeaderInfo = ref({
  teamLeaderLevelName: '',
  invitationName: ''
})

// 收益列表数据
const earningsList = ref([])
const totalAmount = ref(0)
const loading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const currentType = ref(0) // 0所有收益，1推荐奖励，2每月薪资，3政策补贴

// 收益类型标签
const earningsTags = [
  { id: 0, name: '所有收益' },
  { id: 1, name: '推荐奖励' },
  { id: 2, name: '每月薪资' },
  { id: 3, name: '政策补贴' },
]

const goBack = () => {
  router.back()
}

const copyInviteCode = () => {
  const inviteCode = userInfo.value.inviteCode || '000000'
  navigator.clipboard.writeText(inviteCode).then(() => {
    showToast('邀请码已复制')
  }).catch(err => {
    console.error('复制失败:', err)
  })
}

const fetchEarningsData = async (isLoadMore = false) => {
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
  }
  try {
    const response = await getTeamLeaderRevenue({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      type: currentType.value
    })
    if (response.code === 200) {
      const newRecords = response.data.records || []
      if (isLoadMore) {
        earningsList.value = [...earningsList.value, ...newRecords]
      } else {
        earningsList.value = newRecords
      }
      total.value = response.data.total || 0
      // 计算总计金额
      totalAmount.value = earningsList.value.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    } else {
      showToast('获取数据失败')
    }
  } catch (error) {
    console.error('获取收益数据失败:', error)
    showToast('网络错误')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const handleTagClick = (tagId) => {
  currentType.value = tagId
  currentPage.value = 1
  fetchEarningsData()
}

const loadMore = () => {
  if (loadingMore.value || loading.value) return
  if (earningsList.value.length >= total.value) return
  currentPage.value++
  fetchEarningsData(true)
}

const getTeamLeaderData = async () => {
  try {
    const response = await getTeamLeaderInfo()
    if (response.code === 200) {
      const data = response.data
      // 更新用户信息
      userInfo.value = {
        avatar: data.avatar || '',
        realName: data.realName || '未设置',
        inviteCode: data.invitationCode || '000000'
      }
      // 更新团队长信息
      teamLeaderInfo.value = {
        teamLeaderLevelName: data.teamLeaderLevelName || '',
        invitationName: data.invitationName || '无'
      }
    } else {
      showToast('获取团队长信息失败')
    }
  } catch (error) {
    console.error('获取团队长信息失败:', error)
    showToast('网络错误')
  }
}

onMounted(async () => {
  // 获取团队长信息
  await getTeamLeaderData()
  // 获取收益数据
  await fetchEarningsData()
  
  // 添加滚动事件监听
  const scrollContainer = document.querySelector('.earnings-list')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        loadMore()
      }
    })
  }
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

/* 用户信息卡片 */
.user-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: url('@/assets/团队长合作计划/用户卡片背景.png') no-repeat top center; */
  background-size: 100% auto;
  opacity: 0.1;
  z-index: 0;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f0f0;
  flex-shrink: 0;
}

.info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.top-row,
.bottom-row {
  display: flex;
  width: 100%;
}

.name {
  font-size: 18px;
  font-weight: bold;
  width: 35%;
  align-self: start;
}

.invite-code {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xs);
  width: 65%;
  justify-content: flex-end;
  align-self: start;
}

.invite-code .label {
  font-size: var(--font-size-xs);
  color: #666;
  width: 60px;
}

.invite-code .value {
  font-size: var(--font-size-xs);
  color: #333;
  font-weight: 500;
}

.copy-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-left: 8px;
}

.team-level {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: #0944fc;
  border-radius: 12px;
  font-size: 12px;
  color: white;
  font-weight: 500;
  align-self: end;
}

.level-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recommender-row {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xs);
  width: 50%;
  justify-content: flex-end;
  align-self: center;
}

.recommender-row .label {
  font-size: 12px;
}

.recommender-row .value {
  font-size: 12px;
  font-weight: 500;
}

/* 功能按钮 */
.function-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.btn-item {
  padding: 6px 6px;
  background: white;
  border: 1px solid #0944fc;
  border-radius: 12px;
  font-size: 12px;
  color: #0944fc;
  font-weight: 500;
  cursor: pointer;
}

/* 收益项目标签 */
.earnings-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.tag-item {
  background: var(--blue-gradient);
  color: white;
  text-align: center;
  padding: 10px 10px;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 76px;
  box-sizing: border-box;
}

.tag-item.active {
  background: linear-gradient(90deg, #00c2ff 0%, #0944fc 100%);
  transform: scale(1.05);
}

/* 总计金额 */
.total-amount-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.total-label {
  font-size: var(--font-size-small);
  color: #333;
}

.total-value {
  font-size: var(--font-size-base);
  color: #0944fc;
  font-weight: bold;
}

/* 收益明细列表 */
.earnings-list {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 80px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 300px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 12px;
}

.loading-text {
  font-size: var(--font-size-small);
  color: #666;
}

.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  font-size: var(--font-size-small);
  color: #999;
}

.list-item {
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.list-item:last-child {
  margin-bottom: 0;
}

.item-highlight {
  background: #e6f0ff;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-title {
  font-size: var(--font-size-base);
  color: #333;
  font-weight: 500;
}

.item-amount {
  font-size: var(--font-size-base);
  color: #0944fc;
  font-weight: bold;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-desc {
  font-size: var(--font-size-xs);
  color: #999;
  width:120px;
}

.item-date {
  font-size: var(--font-size-xs);
  color: #999;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 8px;
}

.loading-more-text {
  font-size: var(--font-size-small);
  color: #666;
}

.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  font-size: var(--font-size-small);
  color: #999;
}
</style>
