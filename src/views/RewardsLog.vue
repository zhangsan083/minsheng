<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="贡献奖励"
        left-arrow
        @click-left="$router.back()"
        @click-right="goHistory"
        :border="false"
        class="nav-bar"
      >
        <template #right>
          <span class="nav-right-text">领取记录</span>
        </template>
      </van-nav-bar>
    </div>

    <div class="content">
      <!-- 贡献奖励列表 -->
      <div 
        v-for="reward in rewardsList" 
        :key="reward.id"
        class="reward-card"
      >
        <div class="card-header">
          <span>{{ reward.name }}</span>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="label">达成条件:</span>
            <span class="value">{{ reward.condit || '无' }}</span>
          </div>
          <div class="info-row">
            <span class="label">完成进度:</span>
            <span class="value highlight">{{ reward.isComplete === 1 ? '已完成' : `${reward.progress}/${reward.num}` }}</span>
          </div>
          <div class="info-row">
            <span class="label">任务奖励:</span>
            <span class="value">{{ reward.reward }}</span>
          </div>
          <div class="btn-container">
            <van-button 
              v-if="reward.isComplete === 1"
              type="default"
              class="claim-btn claimed"
              disabled
            >
              已领取
            </van-button>
            <van-button 
              v-else-if="reward.progress >= reward.num"
              type="primary" 
              color="var(--blue-gradient)" 
              class="claim-btn"
              @click="claimReward(reward.id)"
            >
              领取奖励
            </van-button>
            <van-button 
              v-else
              type="default"
              class="claim-btn claimed"
              disabled
            >
              领取奖励
            </van-button>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div class="empty-state" v-if="rewardsList.length === 0">
        <van-icon name="award-o" size="64" color="#c8c9cc" />
        <p class="empty-text">暂无贡献奖励</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getTaskList, claimTaskReward } from '@/api/assets'

const router = useRouter()
const rewardsList = ref([])

const goHistory = () => {
  router.push({ name: 'rewards-history' })
}

const claimReward = async (id) => {
  try {
    const res = await claimTaskReward(id)
    if (res.code === 200) {
      showToast('领取成功')
      // 重新加载数据
      loadRewardsData()
    } else {
      showToast(res.msg || '领取失败')
    }
  } catch (error) {
    console.error('Claim reward failed:', error)
    showToast('领取失败，请稍后重试')
  }
}

const loadRewardsData = async () => {
  try {
    const res = await getTaskList()
    if (res.code === 200 && res.data) {
      rewardsList.value = res.data
    } else {
      showToast(res.msg || '获取贡献奖励失败')
    }
  } catch (error) {
    console.error('Failed to load rewards data:', error)
    showToast('获取贡献奖励失败，请稍后重试')
  }
}

onMounted(() => {
  loadRewardsData()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}

.nav-right-text {
  color: #fff;
  font-size: var(--font-size-small);
  text-decoration: underline;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.reward-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  height: 48px;
  background: var(--blue-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: var(--font-size-base);
  font-weight: bold;
}

.card-body {
  padding: 20px 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: var(--font-size-small);
  color: #666;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #999;
}

.value {
  color: #333;
}

.value.highlight {
  color: var(--blue-deep);
}

.btn-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.claim-btn {
  width: 160px;
  border-radius: 6px;
  font-size: var(--font-size-base);
  height: 40px;
}

.claim-btn.claimed {
  background: #e6e6e6 !important;
  color: #999 !important;
  border: none !important;
}

.claimed-text {
  width: 160px;
  height: 40px;
  border-radius: 6px;
  background: #e6e6e6;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.empty-text {
  margin-top: 16px;
  font-size: var(--font-size-small);
  color: #999;
}
</style>
