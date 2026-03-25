<template>
  <div class="page">
    <!-- 头部 -->
    <div class="header">
      <van-nav-bar
        title="团队工资"
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
                  <img src="@/assets/团队长合作计划/团队长合作计划-V.png" alt="图标" style="width:30px;height:30px;" />
                </div>
                <span>{{ teamLeaderInfo.teamLeaderLevelName || '初级团队长' }}</span>
              </div>
              <div class="recommender-row">
                <span class="label">推荐人：</span>
                <span class="value">{{ teamLeaderInfo.invitationName || '姓名' }}</span>
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

      <!-- 团队工资 -->
      <div class="salary-section">
        <div class="section-header">
          <span class="header-icon"></span>
          <span class="header-title">团队工资</span>
        </div>

        <div v-if="loading" class="loading">
          <van-loading type="spinner" color="#0944fc" />
        </div>
        
        <div v-else-if="teamLeaderLevelList.length > 0" class="salary-levels">
          <div class="salary-levels-container">
            <div v-for="level in teamLeaderLevelList" :key="level.id" class="salary-level-image">
              <div class="image-container">
                <img src="@/assets/团队长合作计划/团队工资等级.png" alt="团队工资等级" class="salary-image" />
                <div class="level-badge">
                  <span class="level-number">{{ level.level }}</span>
                </div>
                <div class="text-overlay">
                  <div class="overlay-title">{{ level.levelName }}</div>
                  <div class="overlay-content">
                    <div class="info-row">
                      <span class="info-label">直推人数要求</span>
                      <span class="info-value">{{ level.inviteReg || 0 }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">总实名人数要求</span>
                      <span class="info-value">{{ level.inviteVerified || 0 }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">活跃度要求</span>
                      <span class="info-value">{{ level.inviteActive || 0 }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">月工资</span>
                      <span class="info-value">{{ level.salary || 0 }}元</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty">
          <div class="empty-text">暂无团队长等级数据</div>
        </div>
      </div>

      <!-- 规则说明 -->
      <div class="rule-section">
        <div class="section-header">
          <span class="header-icon"></span>
          <span class="header-title">规则说明</span>
        </div>
        <div class="rule-content">
          <ul>
            <li>全民行动大使等级是为了促进公民友好互助，团结友爱，发扬社会主义精神而开展的活动。</li>
            <li>当团队长达到激活要求后，会升级到对应等级；团队长即可获得每月奖励（该奖励将在，每月1日0点后自动刷新，登录即可在团队页面领取，如当月不领取则次月会清零，不可累计）。</li>
            <li>金额将派发到团队工资，满100即可提现。</li>
            <li>团队每月保底激活一对应等级团队长，需当月三级内激活人数达到对应指标，才可领取月工资。</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast, Loading } from 'vant'
import { getTeamLeaderWelfare } from '@/api/teamLeader'

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

const teamLeaderLevelList = ref([])
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

const getWelfareData = async () => {
  loading.value = true
  try {
    const response = await getTeamLeaderWelfare()
    if (response.code === 200) {
      teamLeaderLevelList.value = response.data.teamLeaderLevelList || []
    } else {
      showToast('获取数据失败')
    }
  } catch (error) {
    console.error('获取团队长福利信息失败:', error)
    showToast('网络错误')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 从路由参数中获取团队长信息
  const routeTeamLeaderInfo = route.query.teamLeaderInfo
  if (routeTeamLeaderInfo) {
    try {
      const parsedInfo = JSON.parse(routeTeamLeaderInfo)
      teamLeaderInfo.value = {
        teamLeaderLevelName: parsedInfo.teamLeaderLevelName || '',
        invitationName: parsedInfo.invitationName || ''
      }
      
      // 更新用户信息
      userInfo.value = {
        avatar: parsedInfo.avatar || userInfo.value.avatar,
        realName: parsedInfo.realName || userInfo.value.realName,
        inviteCode: parsedInfo.invitationCode || userInfo.value.inviteCode || ''
      }
    } catch (error) {
      console.error('解析团队长信息失败:', error)
    }
  }
  
  // 从用户存储中获取用户信息（作为备用）
  if (userStore.userInfo) {
    userInfo.value = {
      avatar: userInfo.value.avatar || userStore.userInfo.avatar,
      realName: userInfo.value.realName || userStore.userInfo.realName,
      inviteCode: userInfo.value.inviteCode || userStore.userInfo.invitationCode || ''
    }
  }
  
  // 获取团队长福利等级信息
  getWelfareData()
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
  width: 135px;
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
  border-radius: 8px;
  font-size: 12px;
  color: #0944fc;
  font-weight: 500;
  cursor: pointer;
}

/* 团队工资区域 */
.salary-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.empty-text {
  font-size: var(--font-size-base);
  color: #999;
}

.salary-levels {
  margin: 8px 0;
}

.salary-levels-container {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 8px 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.salary-levels-container::-webkit-scrollbar {
  display: none;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.header-icon {
  width: 4px;
  height: 16px;
  background: var(--blue-gradient);
  border-radius: 2px;
  margin-right: 8px;
}

.header-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #333;
}

.salary-level-image {
  flex: 0 0 auto;
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
}

.image-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.salary-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
}

.level-badge {
  position: absolute;
  top: 6px;
  right: 25px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-number {
  font-size: 35px;
  font-weight: bold;
  color: #3986f8;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
  font-family: fantasy;
}

.text-overlay {
  position: absolute;
  top: -15;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.overlay-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #ffeb99;
  margin-bottom: 10px;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:160px;
}

.info-label {
  font-size: var(--font-size-xs);
  color: white;
}

.info-value {
  font-size: var(--font-size-xs);
  color: white;
  font-weight: bold;
}

/* 规则说明 */
.rule-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rule-content {
  font-size: var(--font-size-small);
  color: #666;
  line-height: 1.6;
  text-align: justify;
}

.rule-content ul {
  padding-left: 0;
  margin: 0;
  list-style: none;
}

.rule-content li {
  position: relative;
  padding-left: 5px;
  margin-bottom: 8px;
  text-indent: 2em;
}

.rule-content li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  background: var(--blue-gradient);
  border-radius: 50%;
}
</style>
