<template>
  <div class="page">
    <!-- 头部 -->
    <div class="header">
      <van-nav-bar
        title="团队详情"
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
                <span class="value">{{ userInfo.inviteCode || '000000' }}</span>
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

      <!-- 一级团队 -->
      <div class="team-section">
        <div class="section-header">一级团队</div>
        <div class="section-content">
          <!-- <div class="total-amount">
            <span class="label">总消费金额</span>
            <span class="value">0000</span>
          </div> -->
          <div class="stats-row">
            <div class="stat-item">
              <span class="label">总人数</span>
              <span class="value">{{ teamDetail.level1Total || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="label">总实名</span>
              <span class="value">{{ teamDetail.level1VerifiedTotal || 0 }}</span>
            </div>
          </div>
          <div class="today-new">
            <div class="today-label">今日新增</div>
            <div class="today-stats">
              <div class="today-item">
                <span class="label">注册</span>
                <span class="value">{{ teamDetail.level1RegToday || 0 }}</span>
              </div>
              <div class="today-item">
                <span class="label">实名</span>
                <span class="value">{{ teamDetail.level1VerifiedToday || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 二级团队 -->
      <div class="team-section">
        <div class="section-header">二级团队</div>
        <div class="section-content">
          <!-- <div class="total-amount">
            <span class="label">总消费金额</span>
            <span class="value">0000</span>
          </div> -->
          <div class="stats-row">
            <div class="stat-item">
              <span class="label">总人数</span>
              <span class="value">{{ teamDetail.level2Total || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="label">总实名</span>
              <span class="value">{{ teamDetail.level2VerifiedTotal || 0 }}</span>
            </div>
          </div>
          <div class="today-new">
            <div class="today-label">今日新增</div>
            <div class="today-stats">
              <div class="today-item">
                <span class="label">注册</span>
                <span class="value">{{ teamDetail.level2RegToday || 0 }}</span>
              </div>
              <div class="today-item">
                <span class="label">实名</span>
                <span class="value">{{ teamDetail.level2VerifiedToday || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 三级团队 -->
      <div class="team-section last-team-section">
        <div class="section-header">三级团队</div>
        <div class="section-content">
          <!-- <div class="total-amount">
            <span class="label">总消费金额</span>
            <span class="value">0000</span>
          </div> -->
          <div class="stats-row">
            <div class="stat-item">
              <span class="label">总人数</span>
              <span class="value">{{ teamDetail.level3Total || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="label">总实名</span>
              <span class="value">{{ teamDetail.level3VerifiedTotal || 0 }}</span>
            </div>
          </div>
          <div class="today-new">
            <div class="today-label">今日新增</div>
            <div class="today-stats">
              <div class="today-item">
                <span class="label">注册</span>
                <span class="value">{{ teamDetail.level3RegToday || 0 }}</span>
              </div>
              <div class="today-item">
                <span class="label">实名</span>
                <span class="value">{{ teamDetail.level3VerifiedToday || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 奖励规则 -->
      <!-- <div class="reward-rules">
        <div class="rules-header">
          <span class="header-text">奖励规则</span>
        </div>
        <div class="rules-content">
          <div class="rule-item">
            <span class="rule-dot"></span>
            <div class="rule-content">
              <span class="rule-label">一级推荐奖励：</span>
              <span class="rule-value">00%</span>
            </div>
            <span class="rule-dot"></span>
          </div>
          <div class="rule-item">
            <span class="rule-dot"></span>
            <div class="rule-content">
              <span class="rule-label">二级推荐奖励：</span>
              <span class="rule-value">00%</span>
            </div>
            <span class="rule-dot"></span>
          </div>
          <div class="rule-item">
            <span class="rule-dot"></span>
            <div class="rule-content">
              <span class="rule-label">三级推荐奖励：</span>
              <span class="rule-value">00%</span>
            </div>
            <span class="rule-dot"></span>
          </div>
        </div>
        <img src="@/assets/我的团队/我的团队$.png" alt="奖金图标" class="money-icon" />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast, Loading } from 'vant'
import { getTeamLeaderDetail, getTeamLeaderInfo } from '@/api/teamLeader'

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

const teamDetail = ref({
  level1RegToday: 0,
  level1Total: 0,
  level1VerifiedToday: 0,
  level1VerifiedTotal: 0,
  level2RegToday: 0,
  level2Total: 0,
  level2VerifiedToday: 0,
  level2VerifiedTotal: 0,
  level3RegToday: 0,
  level3Total: 0,
  level3VerifiedToday: 0,
  level3VerifiedTotal: 0
})

const loading = ref(false)

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

const fetchTeamDetail = async () => {
  loading.value = true
  try {
    const response = await getTeamLeaderDetail()
    if (response.code === 200) {
      teamDetail.value = response.data
    } else {
      showToast('获取数据失败')
    }
  } catch (error) {
    console.error('获取团队详情失败:', error)
    showToast('网络错误')
  } finally {
    loading.value = false
  }
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
  // 获取团队详情数据
  await fetchTeamDetail()
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

/* 团队区域 */
.team-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.last-team-section {
  margin-bottom: 80px;
}

.section-header {
  background: var(--blue-gradient);
  color: white;
  text-align: center;
  padding: 12px;
  font-size: var(--font-size-base);
  font-weight: bold;
}

.section-content {
  padding: 16px;
}

.total-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.total-amount .label {
  font-size: var(--font-size-small);
  color: #333;
}

.total-amount .value {
  font-size: var(--font-size-base);
  color: #0944fc;
  font-weight: bold;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stat-item {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 8px;
  margin: 0 4px;
}

.stat-item:first-child {
  margin-left: 0;
}

.stat-item:last-child {
  margin-right: 0;
}

.stat-item .label {
  font-size: var(--font-size-small);
  color: #333;
}

.stat-item .value {
  font-size: var(--font-size-base);
  color: #0944fc;
  font-weight: bold;
}

.today-new {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.today-label {
  font-size: var(--font-size-small);
  color: #0944fc;
  font-weight: 500;
  width: 80px;
}

.today-stats {
  flex: 1;
  display: flex;
  justify-content: right;
}

.today-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left:12px;
}

.today-item .label {
  font-size: var(--font-size-small);
  color: #333;
}

.today-item .value {
  font-size: var(--font-size-base);
  color: #0944fc;
  font-weight: bold;
}

/* 奖励规则 */
.reward-rules {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  border: 1px solid #e0e0e0;
}

.rules-header {
  text-align: center;
  padding: 8px 32px;
  font-size: var(--font-size-base);
  font-weight: bold;
  display: inline-block;
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: url('@/assets/团队长合作计划/section-title.png') no-repeat center;
  background-size: 100% auto;
  width: 140px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text {
  color: white;
  font-size: var(--font-size-base);
  font-weight: bold;
  z-index: 1;
}

.rules-content {
  margin-top: 16px;
}

.rule-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: linear-gradient(90deg, #e6f0ff 0%, #d4e4ff 100%);
  border-radius: 20px;
  margin-bottom: 8px;
  position: relative;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-dot {
  width: 6px;
  height: 6px;
  background: #0944fc;
  border-radius: 50%;
  flex-shrink: 0;
}

.rule-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.rule-label {
  font-size: var(--font-size-small);
  color: #333;
  text-align: center;
}

.rule-value {
  font-size: var(--font-size-base);
  color: #0944fc;
  font-weight: bold;
  text-align: center;
  flex-shrink: 0;
}

.money-icon {
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 60px;
  height: 60px;
  opacity: 0.8;
}
</style>
