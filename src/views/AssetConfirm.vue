<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="资产确权中心"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- Bank Card Info (Reused from PaymentProgress) -->
      <div class="bank-card-container">
        <div class="bank-card-bg">
          <div class="detail-tag">资金明细查询</div>
          <div class="card-content">
            <div class="balance-area">
              <div class="balance-label">民生资产兑付余额</div>
              <div class="balance-value-box">¥00000000.00</div>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-logo"><img src="/logo主图形.png" alt="logo" style="width: 48px; height: 48px; object-fit: contain;" /></div>
            <div class="card-slogan">资产为民 发展为我</div>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="action-buttons">
        <van-button 
          block 
          round 
          type="primary"
          class="action-btn"
          @click="$router.back()"
        >
          返回
        </van-button>
      </div>

      <!-- Progress Timeline -->
      <div class="progress-card">
        <div class="card-title">兑付进度查询</div>
        <div class="timeline">
          <div class="timeline-item" v-for="(item, index) in steps" :key="index">
            <div class="timeline-line" v-if="index < steps.length - 1" :class="{ active: item.status === 'completed' }"></div>
            <div class="timeline-dot" :class="{ active: item.status === 'completed' }"></div>
            <div class="timeline-content">
              <div class="step-name">{{ item.name }}</div>
              <div class="step-status" :class="item.status">{{ getStatusText(item.status) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const steps = reactive([
  { name: '申请人核验', status: 'completed' },
  { name: '兑付条件审核', status: 'completed' },
  { name: '兑付指令发起', status: 'completed' },
  { name: '优先级执行', status: 'completed' },
  { name: '审计查验', status: 'completed' },
  { name: '申请已通过', status: 'pending' },
])

const getStatusText = (status) => {
  return status === 'completed' ? '已完成' : '未完成'
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px; /* Increased padding for tabbar */
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

:deep(.van-nav-bar__title) {
  color: #fff;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

/* Bank Card Styles (Reused) */
.bank-card-container {
  margin-bottom: 30px;
  border-radius: 12px;
  padding: 4px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bank-card-bg {
  height: 200px;
  background: url('@/assets/资产/银行卡.png') no-repeat center center;
  background-size: 135% 150%;
  border-radius: 8px;
  position: relative;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-tag {
  position: absolute;
  top: 16px;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  color: #2b7afb;
  font-size: var(--font-size-xs);
  padding: 4px 12px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  font-weight: bold;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-right: 0;
  margin-top: 30px;
}

.balance-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
}

.balance-label {
  color: white;
  font-size: var(--font-size-large);
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  width: 100%;
  text-align: center;
}

.balance-value-box {
  background: white;
  color: #2b7afb;
  font-size: 28px;
  font-weight: bold;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  width: 100%;
  text-align: center;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: white;
  margin-top: auto;
}

.card-logo {
  font-size: 24px;
  font-weight: bold;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.card-slogan {
  font-size: var(--font-size-small);
  opacity: 0.8;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.action-buttons {
  margin-bottom: 30px;
}

.action-btn {
  height: var(--button-large-height);
  font-size: var(--font-size-base);
  font-weight: bold;
  background: var(--blue-gradient);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(9, 68, 252, 0.4);
}

/* Progress Timeline Styles */
.progress-card {
  background: white;
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-height: 400px;
}

.card-title {
  text-align: center;
  font-size: var(--font-size-large);
  font-weight: bold;
  color: #2b7afb;
  margin-bottom: 30px;
}

.timeline {
  padding-left: 10px;
  padding-right: 10px;
}

.timeline-item {
  position: relative;
  padding-bottom: 40px;
  display: flex;
  align-items: center;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #dceafc; /* Light blue */
  margin-right: 20px;
  z-index: 1;
  position: relative;
}

.timeline-dot.active {
  background: #2b7afb; /* Active blue */
  box-shadow: 0 0 0 4px #dceafc; /* Ring effect */
}

.timeline-line {
  position: absolute;
  top: 16px;
  left: 7px; /* Center of dot (16/2 - 2/2) */
  width: 4px;
  height: 100%;
  background: #eef0f4;
  z-index: 0;
}

.timeline-line.active {
  background: #2b7afb;
}

.timeline-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-name {
  font-size: var(--font-size-base);
  color: #333;
  font-weight: bold;
}

.step-status {
  font-size: var(--font-size-small);
  font-weight: bold;
}

.step-status.completed {
  color: #2b7afb;
}

.step-status.pending {
  color: #c0c4cc;
}
</style>