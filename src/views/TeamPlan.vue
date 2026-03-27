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
            <img :src="teamLeaderInfo.avatar || userInfo.avatar || '/logo主图形.png'" alt="头像" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />
          </div>
          <div class="info-container">
            <div class="top-row">
              <div class="name">
                {{ teamLeaderInfo.realName || userInfo.realName || '' }}
              </div>
              <div class="invite-code">
                <span class="label">邀请码：</span>
                <span class="value">{{ teamLeaderInfo.invitationCode || userInfo.inviteCode || '' }}</span>
                <img src="@/assets/团队长合作计划/复制.png" alt="复制" class="copy-icon" @click="copyInviteCode" />
              </div>
            </div>
            <div class="bottom-row">
              <div>
                <div class="team-level">
                  <div class="level-icon" v-if="isLeader">
                    <img src="@/assets/团队长合作计划/团队长合作计划-V.png" alt="图标" style="width: 30px; height: 30px;" />
                  </div>
                  <span>{{ teamLevelLabel }}</span>
                </div>
              </div>
              <div class="recommender-row">
                <span class="label">推荐人：</span>
                <span class="value">{{ displayInviteName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 成为团队长按钮 -->
        <div class="become-team-leader" v-if="!isLeader">
          <div class="btn-content">
            <div class="btn-icon">
              <img src="@/assets/团队长合作计划/团队长合作计划-V.png" alt="图标" style="width: 100%; height: 100%; filter: brightness(0) saturate(100%) invert(31%) sepia(98%) saturate(3000%) hue-rotate(214deg) brightness(98%) contrast(119%);" />
            </div>
            <div class="btn-text">成为团队长，获得更多专属权益</div>
          </div>
          <div class="apply-btn" :class="{ disabled: applicationButtonDisabled }" @click="handleApplicationClick">{{ applicationButtonText }}</div>
        </div>
        <div class="become-team-leader success" v-else>
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

        <div v-if="showApplicationResult" class="application-result-card">
          <div class="result-title">申请状态：{{ applicationStatusLabel }}</div>
          <div class="result-body" v-if="applicationStatusLabel === '审核中'">已提交审核，请耐心等待~</div>
          <div class="result-body" v-else-if="applicationStatusLabel === '审核通过'">恭喜您已成为团队长，立即体验专属权益！</div>
          <div class="result-body" v-else-if="applicationStatusLabel === '审核驳回'">审核驳回，请重新提交申请或联系客服。</div>
        </div>
      </div>

      <!-- 收益统计 -->
      <div class="earnings-section">
        <div class="earnings-header">
          <span class="earnings-title">我的推荐总收益：</span>
          <div class="earnings-amount">
            <span class="digit">{{ teamLeaderInfo.teamSalary.salary || 0 }}</span>
          </div>
        </div>
        <div class="team-stats">
          <div class="stat-item">
            <div class="stat-title">我的团队等级</div>
            <div class="stat-value">
              {{ teamLeaderInfo.teamSalary.level || 0 }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-title">当前直属注册数</div>
            <div class="stat-value">
              {{ teamLeaderInfo.teamSalary.regCount || 0 }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-title">当前直属实名数</div>
            <div class="stat-value">
              {{ teamLeaderInfo.teamSalary.verifiedCount || 0 }}
            </div>
          </div>
        </div>
        <div class="salary-btn" :class="{ disabled: !isLeader || teamLeaderInfo.teamSalary.receiveStatus === '1' || teamLeaderInfo.teamSalary.receiveStatus === '' }" @click="claimSalary">
          {{ !teamLeaderInfo.teamSalary ? '领取团队长工资' : teamLeaderInfo.teamSalary.receiveStatus === '1' ? '已领取' : '领取团队长工资' }}
        </div>
      </div>

      <!-- 团队工具 -->
      <div class="team-tools">
        <div class="tool-item" :class="{ disabled: !isLeader }" @click="goToTeamSalary">
          <div class="tool-icon">
            <img src="@/assets/团队长合作计划/团队长合作计划-工资.png" alt="团队工资" />
          </div>
          <div class="tool-info">
            <div class="tool-name">团队工资</div>
            <div class="tool-desc">每月可免费领取</div>
          </div>
          <div class="tool-action" :class="{ disabled: !isLeader }">详情</div>
        </div>
        <div class="tool-item" :class="{ disabled: !isLeader }">
          <div class="tool-icon">
            <img src="@/assets/团队长合作计划/团队长合作计划-团队详情.png" alt="团队详情" />
          </div>
          <div class="tool-info">
            <div class="tool-name">团队详情</div>
            <div class="tool-desc">查看您的团队成员</div>
          </div>
          <div class="tool-action" :class="{ disabled: !isLeader }" @click.stop="goToTeamDetails">详情</div>
        </div>
        <div class="tool-item" :class="{ disabled: !isLeader }" @click="goToTotalEarnings">
          <div class="tool-icon">
            <img src="@/assets/团队长合作计划/团队长合作计划-总收益 .png" alt="推荐总收益" />
          </div>
          <div class="tool-info">
            <div class="tool-name">推荐总收益</div>
            <div class="tool-desc">您的全民收益明细</div>
          </div>
          <div class="tool-action" :class="{ disabled: !isLeader }" @click.stop="goToTotalEarnings">详情</div>
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
            <template v-if="teamLeaderInfo.teamTaskVerifiedList.length > 0">
              <div class="reward-item" v-for="task in teamLeaderInfo.teamTaskVerifiedList" :key="`verified-${task.id}`">
                <div class="reward-info">
                  <div class="reward-name">邀请人数 {{ task.inviteCount || 0 }} 人</div>
                  <div class="reward-amount">奖励金额：{{ task.rewardAmount || 0 }} 元</div>
                </div>
                <div 
                  class="reward-btn" 
                  :class="{ disabled: !isLeader || task.status !== 1 }"
                  @click="task.status === 1 && claimReward(task.id)"
                >
                  {{task.status === 0 ? '待完成' : task.status === 1 ? '待领取' : '已领取' }}
                </div>
              </div>
            </template>
            <div class="reward-item" v-else>
              <div class="reward-info">暂无实名任务</div>
            </div>
          </div>
        </div>

        <!-- 当日直属邀请激活奖励 -->
        <!-- <div class="reward-title">
          <span class="dot"></span>
          当日直属邀请激活奖励
          <span class="dot"></span>
        </div>
        <div class="reward-section">
          <div class="reward-content">
            <template v-if="teamLeaderInfo.teamTaskActivateList.length > 0">
              <div class="reward-item" v-for="task in teamLeaderInfo.teamTaskActivateList" :key="`activate-${task.id}`">
                <div class="reward-info">
                  <div class="reward-name">激活人数 {{ task.inviteCount || 0 }} 人</div>
                  <div class="reward-amount">奖励金额：{{ task.rewardAmount || 0 }} 元</div>
                </div>
                <div 
                  class="reward-btn" 
                  :class="{ disabled: !isLeader || task.status !== 1 }"
                  @click="task.status === 1 && claimReward(task.id)"
                >
                  {{ task.status === 0 ? '待完成' : task.status === 1 ? '待领取' : '已领取' }}
                </div>
              </div>
            </template>
            <div class="reward-item" v-else>
              <div class="reward-info">暂无激活任务</div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import { getTeamLeader, claimTeamLeaderSalary, claimTeamLeaderTask } from '@/api/teamLeader'

const router = useRouter()
const userStore = useUserStore()

const userInfo = ref({
  avatar: '',
  realName: '',
  inviteCode: ''
})

const teamLeaderInfo = ref({
  avatar: '',
  invitationCode: '',
  invitationName: '',
  isTeamLeader: 0,
  realName: '',
  teamLeaderLevelName: '',
  teamLeaderReviewStatus: '',
  teamSalary: {
    activeCount: 0,
    level: 0,
    receiveStatus: '',
    regCount: 0,
    salary: 0,
    verifiedCount: 0
  },
  teamTaskActivateList: [],
  teamTaskVerifiedList: []
})

const applicationButtonText = computed(() => {
  const status = teamLeaderInfo.value.teamLeaderReviewStatus
  // 如果没有审核状态（为空或未定义），显示"立即申请"
  if (!status && status !== 0 && status !== '0') {
    return '立即申请'
  }
  if (status === '0' || status === 0) return '审核中'
  if (status === '2' || status === 2) return '重新申请'
  return '立即申请'
})

const applicationButtonDisabled = computed(() => {
  const status = teamLeaderInfo.value.teamLeaderReviewStatus
  // 如果没有审核状态（为空或未定义），不禁用按钮
  if (!status && status !== 0 && status !== '0') {
    return false
  }
  // 审核通过和待审核时禁用
  return status === '1' || status === 1 || status === '0' || status === 0
})

const applicationStatusLabel = computed(() => {
  const status = teamLeaderInfo.value.teamLeaderReviewStatus
  if (status === '0' || status === 0) return '审核中'
  if (status === '1' || status === 1) return '审核通过'
  if (status === '2' || status === 2) return '审核驳回'
  return '未申请'
})

const showApplicationResult = computed(() => {
  const status = teamLeaderInfo.value.teamLeaderReviewStatus
  return status === '0' || status === '1' || status === '2'
})

const handleApplicationClick = () => {
  const status = teamLeaderInfo.value.teamLeaderReviewStatus
  // 如果没有审核状态（为空或未定义），可以申请
  if (!status && status !== 0 && status !== '0') {
    goToApplication()
    return
  }
  // 只有审核驳回时才能点击
  if (status === '2' || status === 2) {
    goToApplication()
  }
}

const displayInviteName = computed(() => {
  return teamLeaderInfo.value.invitationName || '无'
})

const teamLevelLabel = computed(() => {
  if (teamLeaderInfo.value.isTeamLeader === 1) {
    return teamLeaderInfo.value.teamLeaderLevelName || ''
  }
  return '未获得团队长资格'
})

const isLeader = computed(() => teamLeaderInfo.value.isTeamLeader === 1)

const goBack = () => {
  router.back()
}

const copyInviteCode = () => {
  const inviteCode = teamLeaderInfo.value.invitationCode || userInfo.value.inviteCode || ''
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
  if (!isLeader.value) {
    showToast('只有成为团队长后才能查看')
    return
  }
  try {
    router.push({
      name: 'team-salary'
    })
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const claimSalary = async () => {
  if (!isLeader.value) {
    return
  }
  if (teamLeaderInfo.value.teamSalary.receiveStatus === '1' || teamLeaderInfo.value.teamSalary.receiveStatus === '') {
    return
  }

  const payload = {
    id: teamLeaderInfo.value.teamSalary.id
  }

  try {
    const res = await claimTeamLeaderSalary(payload)
    if (res && (res.code === 0 || res.code === 200)) {
      showToast('领取成功')
      await fetchTeamLeaderInfo()
    } else {
      showToast(res?.msg || '领取失败')
    }
  } catch (error) {
    console.error('领取团队长工资失败:', error)
    showToast('领取失败，请稍后重试')
  }
}

const goToTeamDetails = () => {
  if (!isLeader.value) {
    showToast('只有成为团队长后才能查看')
    return
  }
  try {
    router.push({
      name: 'team-details'
    })
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const goToTotalEarnings = () => {
  if (!isLeader.value) {
    showToast('只有成为团队长后才能查看')
    return
  }
  try {
    router.push({
      name: 'total-earnings'
    })
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const fetchTeamLeaderInfo = async () => {
  try {
    const res = await getTeamLeader()
    if (res && res.code === 200 && res.data) {
      teamLeaderInfo.value = {
        ...teamLeaderInfo.value,
        ...res.data,
        teamSalary: {
          ...teamLeaderInfo.value.teamSalary,
          ...res.data.teamSalary
        },
        teamTaskActivateList: Array.isArray(res.data.teamTaskActivateList) ? res.data.teamTaskActivateList : [],
        teamTaskVerifiedList: Array.isArray(res.data.teamTaskVerifiedList) ? res.data.teamTaskVerifiedList : []
      }

      // 如果用户存储没有最新头像/邀请码等，先同步展示
      userInfo.value = {
        avatar: res.data.avatar || userInfo.value.avatar,
        realName: res.data.realName || userInfo.value.realName,
        inviteCode: res.data.invitationCode || userInfo.value.inviteCode || ''
      }
    }
  } catch (error) {
    console.error('获取团队长信息失败:', error)
    showToast('团队长信息加载失败，请稍后重试')
  }
}

const claimReward = async (taskId) => {
  try {
    const response = await claimTeamLeaderTask(taskId)
    if (response.code === 200) {
      showToast('领取成功')
      // 重新获取团队长信息，更新任务状态
      await fetchTeamLeaderInfo()
    } else {
      showToast(response.msg || '领取失败')
    }
  } catch (error) {
    console.error('领取奖励失败:', error)
    showToast('网络错误')
  }
}

onMounted(async () => {
  if (userStore.userInfo) {
    userInfo.value = {
      avatar: userStore.userInfo.avatar,
      realName: userStore.userInfo.realName,
      inviteCode: userStore.userInfo.invitationCode || ''
    }
  }

  await fetchTeamLeaderInfo()
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
  display: inline-flex;
  align-items: center;
  padding: 4px 6px;
  background: #0944fc;
  border-radius: 12px;
  font-size: 12px;
  color: white;
  font-weight: 500;
  align-self: end;
  white-space: nowrap;
}
.level-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.team-status {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
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
  cursor: pointer;
}

.application-result-card {
  margin-top: 12px;
  border: 1px solid #0066ff;
  background: #f0f6ff;
  border-radius: 10px;
  padding: 10px 12px;
  color: #0047c1;
}

.result-title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 6px;
}

.result-body {
  font-size: 12px;
  color: #333;
}
.apply-btn.disabled {
  background: #999;
  color: white;
  cursor: not-allowed;
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
  height: 24px;
  color: #0066ff;
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
  background: var(--blue-gradient);
  color: white;
  border-radius: 6px;
  text-align: center;
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
}

.salary-btn.disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
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
  cursor: pointer;
}

.tool-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  padding: 6px 21px;
  background: var(--blue-gradient);
  color: white;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  width: 70px;
  cursor: pointer;
}

.tool-action.disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
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
  background: white;
  padding: 4px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 auto 20px;
  width: fit-content;
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