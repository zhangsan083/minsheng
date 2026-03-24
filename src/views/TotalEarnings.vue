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
                <span class="value">{{ userInfo.inviteCode || '000000' }}</span>
                <img src="@/assets/团队长合作计划/复制.png" alt="复制" class="copy-icon" @click="copyInviteCode" />
              </div>
            </div>
            <div class="bottom-row">
              <div class="team-level">
                <div class="level-icon">
                  <img src="@/assets/团队长合作计划/团队长合作计划-V.png" alt="图标" style="width: 30px; height: 30px;" />
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

      <!-- 收益项目标签 -->
      <div class="earnings-tags">
        <div class="tag-item">收益项目</div>
        <div class="tag-item">收益项目</div>
        <div class="tag-item">收益项目</div>
        <div class="tag-item">收益项目</div>
        <div class="tag-item">收益项目</div>
        <div class="tag-item">收益项目</div>
        <div class="tag-item">收益项目</div>
        <div class="tag-item">收益项目</div>
      </div>

      <!-- 总计金额 -->
      <div class="total-amount-section">
        <div class="total-label">总计金额</div>
        <div class="total-value">0000</div>
      </div>

      <!-- 收益明细列表 -->
      <div class="earnings-list">
        <div class="list-item" v-for="(item, index) in earningsList" :key="index" :class="{ 'item-highlight': index % 2 === 1 }">
          <div class="item-header">
            <div class="item-title">收益项目</div>
            <div class="item-amount">+00000</div>
          </div>
          <div class="item-footer">
            <div class="item-desc">收益项目及明细信息</div>
            <div class="item-date">2026-01-01 00:00:00</div>
          </div>
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

// 收益列表数据
const earningsList = ref([
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 }
])

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
  border-radius: 12px;
  font-size: 12px;
  color: #0944fc;
  font-weight: 500;
  cursor: pointer;
}

/* 收益项目标签 */
.earnings-tags {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  margin-bottom: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
}

.item-date {
  font-size: var(--font-size-xs);
  color: #999;
}
</style>
