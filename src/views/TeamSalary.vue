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
                <span>初级团队长</span>
              </div>
              <div class="recommender-row">
                <span class="label">推荐人：</span>
                <span class="value">姓名</span>
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

        <div class="salary-cards">
          <!-- 一级全民行动大使 -->
          <div class="salary-card level-1">
            <div class="card-content">
              <div class="level-name">一级全民行动大使</div>
              <div class="salary-info">
                <div class="info-row">
                  <span class="info-label">一级团队激活</span>
                  <span class="info-value">000</span>
                </div>
                <div class="info-row">
                  <span class="info-label">团队每月保底激活</span>
                  <span class="info-value">000</span>
                </div>
                <div class="info-row">
                  <span class="info-label">每月保底工资</span>
                  <span class="info-value">000</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 二级全民行动大使 -->
          <div class="salary-card level-2">
            <div class="card-content">
              <div class="level-name">二级全民行动大使</div>
              <div class="salary-info">
                <div class="info-row">
                  <span class="info-label">二级团队激活</span>
                  <span class="info-value">000</span>
                </div>
                <div class="info-row">
                  <span class="info-label">团队每月保底激活</span>
                  <span class="info-value">000</span>
                </div>
                <div class="info-row">
                  <span class="info-label">每月保底工资</span>
                  <span class="info-value">000</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 三级全民行动大使 -->
          <div class="salary-card level-3">
            <div class="card-content">
              <div class="level-name">三级全民行动大使</div>
              <div class="salary-info">
                <div class="info-row">
                  <span class="info-label">三级团队激活</span>
                  <span class="info-value">000</span>
                </div>
                <div class="info-row">
                  <span class="info-label">团队每月保底激活</span>
                  <span class="info-value">000</span>
                </div>
                <div class="info-row">
                  <span class="info-label">每月保底工资</span>
                  <span class="info-value">000</span>
                </div>
              </div>
            </div>
          </div>
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
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const userInfo = ref({
  avatar: '',
  realName: '',
  inviteCode: ''
})

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

onMounted(() => {
  // 从用户存储中获取用户信息
  if (userStore.userInfo) {
    userInfo.value = {
      avatar: userStore.userInfo.avatar,
      realName: userStore.userInfo.realName,
      inviteCode: userStore.userInfo.invitationCode || '000000'
    }
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

.salary-cards {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.salary-card {
  flex-shrink: 0;
  width: 320px;
  height: 200px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.salary-card.level-1 {
  background: url('@/assets/团队长合作计划/团队工资-1级.png') no-repeat center;
  background-size: cover;
}

.salary-card.level-2 {
  background: url('@/assets/团队长合作计划/团队工资-2级.png') no-repeat center;
  background-size: cover;
}

.salary-card.level-3 {
  background: url('@/assets/团队长合作计划/团队工资-3级.png') no-repeat center;
  background-size: cover;
}

.card-content {
  padding: 16px;
  color: white;
  width:200px;
}

.level-name {
  font-size: var(--font-size-small);
  font-weight: bold;
  margin-bottom: 12px;
  color: rgb(233, 192, 12);
}

.salary-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

.info-value {
  font-size: var(--font-size-xs);
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
