<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="团队长合作计划"
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
                未获得团队长资格
              </div>
              <div class="recommender-row">
                <span class="label">推荐人：</span>
                <span class="value">姓名</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 成为团队长按钮 -->
        <div class="become-team-leader">
          <div class="btn-content">
            <div class="btn-icon">
              <img src="@/assets/团队长合作计划/团队长合作计划-V.png" alt="图标" style="width: 100%; height: 100%; filter: brightness(0) saturate(100%) invert(31%) sepia(98%) saturate(3000%) hue-rotate(214deg) brightness(98%) contrast(119%);" />
            </div>
            <div class="btn-text">成为团队长，获得更多专属权益</div>
          </div>
          <div class="apply-btn" @click="goToApplication">立即申请</div>
        </div>
      </div>

      <!-- 收益统计 -->
      <div class="earnings-section">
        <div class="earnings-header">
          <span class="earnings-title">我的推荐总收益：</span>
          <div class="earnings-amount">
            <span class="digit">0</span>
            <span class="digit">0</span>
            <span class="digit">0</span>
            <span class="digit">0</span>
            <span class="digit">0</span>
            <span class="digit">0</span>
          </div>
        </div>
        <div class="team-stats">
          <div class="stat-item">
            <div class="stat-title">我的团队等级</div>
            <div class="stat-value">
              <span class="digit">0</span>
              <span class="digit">0</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-title">当前直属注册数</div>
            <div class="stat-value">
              <span class="digit">0</span>
              <span class="digit">0</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-title">当前直属实名数</div>
            <div class="stat-value">
              <span class="digit">0</span>
              <span class="digit">0</span>
            </div>
          </div>
        </div>
        <div class="salary-btn">领取团队长工资</div>
      </div>

      <!-- 团队工具 -->
      <div class="team-tools">
        <div class="tool-item" @click="goToTeamSalary">
          <div class="tool-icon">
            <img src="@/assets/团队长合作计划/团队长合作计划-工资.png" alt="团队工资" />
          </div>
          <div class="tool-info">
            <div class="tool-name">团队工资</div>
            <div class="tool-desc">每月可免费领取</div>
          </div>
          <div class="tool-action">详情</div>
        </div>
        <div class="tool-item">
          <div class="tool-icon">
            <img src="@/assets/团队长合作计划/团队长合作计划-团队详情.png" alt="团队详情" />
          </div>
          <div class="tool-info">
            <div class="tool-name">团队详情</div>
            <div class="tool-desc">查看您的团队成员</div>
          </div>
          <div class="tool-action" @click.stop="goToTeamDetails">详情</div>
        </div>
        <div class="tool-item" @click="goToTotalEarnings">
          <div class="tool-icon">
            <img src="@/assets/团队长合作计划/团队长合作计划-总收益 .png" alt="推荐总收益" />
          </div>
          <div class="tool-info">
            <div class="tool-name">推荐总收益</div>
            <div class="tool-desc">您的全民收益明细</div>
          </div>
          <div class="tool-action" @click.stop="goToTotalEarnings">详情</div>
        </div>
      </div>

      <!-- 活动目标 -->
      <div class="activity-target">
        <div class="target-title">活动目标</div>
        <div class="target-content">
          <p>以"十五五"规划开局为契机，倡导全民参与、协同共建的发展理念，通过互动参与形式，增强用户参与感与获得感，在实践中推动共建共享理念深入人心，共同为未来发展凝聚力量。</p>
          <p>活动期间，所有用户均可参与共建共享行动，通过邀请参与等方式共同推动活动开展。成功邀请新用户参与并完成相关流程的，可获得全民行动发放的现金红包奖励，共享发展成果。</p>
        </div>
      </div>

      <!-- 奖励卡片 -->
      <div class="reward-card">
          <div class="reward-title">
            <span class="dot"></span>
            当日直属邀请注册实名奖励
            <span class="dot"></span>
          </div>
        <!-- 当日直属邀请注册实名奖励 -->
        <div class="reward-section">
          <div class="reward-content">
            <div class="reward-item">
              <div class="reward-info">
                <div class="reward-name">当日邀请人数0人</div>
                <div class="reward-amount">现金红包奖励: 00元</div>
              </div>
              <div class="reward-status claimed">已领取</div>
            </div>
            <div class="reward-item">
              <div class="reward-info">
                <div class="reward-name">当日邀请人数0人</div>
                <div class="reward-amount">现金红包奖励: 00元</div>
              </div>
              <div class="reward-btn">领取</div>
            </div>
            <div class="reward-item">
              <div class="reward-info">
                <div class="reward-name">当日邀请人数0人</div>
                <div class="reward-amount">现金红包奖励: 00元</div>
              </div>
              <div class="reward-btn disabled">领取</div>
            </div>
            <div class="reward-item">
              <div class="reward-info">
                <div class="reward-name">当日邀请人数0人</div>
                <div class="reward-amount">现金红包奖励: 00元</div>
              </div>
              <div class="reward-btn disabled">领取</div>
            </div>
          </div>
        </div>

        <!-- 当日直属邀请激活奖励
          <div class="reward-title">
            <span class="dot"></span>
            当日直属邀请激活奖励
            <span class="dot"></span>
          </div>
        <div class="reward-section">
          <div class="reward-content">
            <div class="reward-item">
              <div class="reward-info">
                <div class="reward-name">当日激活人数0人</div>
                <div class="reward-amount">奖励规则奖励规则奖励规则</div>
              </div>
              <div class="reward-btn">领取</div>
            </div>
            <div class="reward-item">
              <div class="reward-info">
                <div class="reward-name">当日激活人数0人</div>
                <div class="reward-amount">奖励规则奖励规则奖励规则</div>
              </div>
              <div class="reward-btn">领取</div>
            </div>
            <div class="reward-item">
              <div class="reward-info">
                <div class="reward-name">当日激活人数0人</div>
                <div class="reward-amount">奖励规则奖励规则奖励规则</div>
              </div>
              <div class="reward-btn disabled">领取</div>
            </div>
            <div class="reward-item">
              <div class="reward-info">
                <div class="reward-name">当日激活人数0人</div>
                <div class="reward-amount">获得初级团队长专属权益</div>
              </div>
              <div class="reward-btn disabled">领取</div>
            </div>
          </div>
        </div> -->
      </div>

      <!-- 规则说明 -->
      <div class="rule-section">
        <div class="target-title">规则说明</div>
        <div class="rule-content">
          <p>规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容规则内容</p>
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

const goToApplication = () => {
  try {
    router.push({ name: 'team-leader-application' })
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const goToTeamSalary = () => {
  try {
    router.push({ name: 'team-salary' })
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const goToTeamDetails = () => {
  try {
    router.push({ name: 'team-details' })
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const goToTotalEarnings = () => {
  try {
    router.push({ name: 'total-earnings' })
  } catch (error) {
    console.error('Navigation error:', error)
  }
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
  width:60px;
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
  display: inline-block;
  padding: 4px 12px;
  background: #666;
  border-radius: 12px;
  font-size: 12px;
  color: white;
  font-weight: 500;
  width: 135px;
  align-self: end;
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

/* 成为团队长按钮 */
.become-team-leader {
  background: white;
  padding: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.btn-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-content {
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #0944fc;
  border-radius: 12px 12px 12px 12px;
  padding: 1px 0px;
}

.btn-text {
  font-size: var(--font-size-xs);
  color: #0944fc;
  font-weight: 500;
}

.apply-btn {
  padding: 4px 14px;
  background: #0944fc;
  color: white;
  border-radius: 12px 12px 12px 12px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  margin-left: 10px;
  z-index: 1;
}

/* 收益统计 */
.earnings-section {
  background: white;
  border: 1px solid #0066ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.earnings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 8px 8px;
  background: #e6f0ff;
  border-radius: 6px;
}

.earnings-title {
  font-size: var(--font-size-small);
  color: #0066ff;
  font-weight: 500;
}

.earnings-amount {
  display: flex;
  gap: 4px;
}

.digit {
  display: inline-block;
  width: 24px;
  height: 24px;
  background: #0066ff;
  color: white;
  text-align: center;
  line-height: 24px;
  border-radius: 4px;
  font-size: var(--font-size-base);
  font-weight: bold;
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #e6f0ff;
  border-radius: 6px;
}

.stat-title {
  font-size: var(--font-size-small);
  color: #0066ff;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.salary-btn {
  width: 100%;
  padding: 12px;
  background: #666;
  color: white;
  border-radius: 6px;
  text-align: center;
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
}

/* 团队工具 */
.team-tools {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}


.tool-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.tool-item:last-child {
  border-bottom: none;
}

.tool-icon {
  width: 48px;
  height: 48px;
  margin-right: 16px;
  flex-shrink: 0;
}

.tool-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tool-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.tool-name {
  font-size: var(--font-size-base);
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
  width: 120px;
}

.tool-desc {
  font-size: var(--font-size-xs);
  color: #999;
  width: 120px;
}

.tool-action {
  padding: 6px 16px;
  background: #f5f7fa;
  color: #666;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  width: 70px;
}

/* 活动目标 */
.activity-target {
  background: white;
  border-radius: 12px;
  padding: 30px 20px 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.target-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: white;
  text-align: center;
  background: url('@/assets/团队长合作计划/section-title.png') no-repeat center;
  background-size: 100% auto;
  padding: 8px 32px;
  border-radius: 20px;
  display: inline-block;
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  margin: 0;
}



.target-content {
  font-size: var(--font-size-small);
  color: #666;
  line-height: 1.5;
  text-align: justify;
}

.target-content p {
  margin-bottom: 8px;
}

/* 奖励卡片 */
.reward-card {
  background: var(--blue-gradient);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 奖励部分 */
.reward-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.reward-section:last-child {
  margin-bottom: 0;
}

.reward-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: var(--blue-gradient);
  text-align: center;
  background: white;
  padding: 4px 20px;
  border-radius: 20px;
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--blue-gradient);
  border-radius: 50%;
}

.reward-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reward-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.reward-info {
  flex: 1;
}

.reward-name {
  font-size: var(--font-size-base);
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.reward-amount {
  font-size: var(--font-size-xs);
  color: #666;
}

.reward-status {
  padding: 6px 16px;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  background: #e0e0e0;
  color: #666;
}

.reward-status.claimed {
  background: #e0e0e0;
  color: #666;
}

.reward-btn {
  padding: 6px 16px;
  background: var(--blue-gradient);
  color: white;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  cursor: pointer;
}

.reward-btn.disabled {
  background: #e0e0e0;
  color: #666;
  cursor: not-allowed;
}

/* 规则说明 */
.rule-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.rule-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: white;
  text-align: center;
  background: var(--blue-gradient);
  padding: 8px 32px;
  border-radius: 20px;
  display: inline-block;
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
}

.rule-content {
  font-size: var(--font-size-small);
  color: #666;
  line-height: 1.5;
  text-align: justify;
  margin-top: 16px;
}

.rule-content p {
  margin-bottom: 8px;
}
</style>