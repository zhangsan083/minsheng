<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="2026民生计划"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- Wallet Card -->
      <div class="wallet-card">
        <div class="card-bg wallet-bg"></div>
        <div class="card-content">
          <div class="wallet-header">
            <div class="wallet-title">
              <van-icon name="balance-o" size="20" />
              <span>民生消费额度</span>
            </div>
            <div class="wallet-tag">持仓</div>
          </div>
          <div class="wallet-body">
            <div class="wallet-label">可用消费总额度（元）</div>
            <div class="wallet-amount">
              <span class="currency">¥</span>
              <span class="amount">000000</span>
              <span class="decimal">/00.00</span>
            </div>
          </div>
          <div class="wallet-actions">
            <van-button class="action-btn" icon="scan" size="small">扫码支付</van-button>
            <van-button class="action-btn" icon="orders-o" size="small">查看流水</van-button>
          </div>
        </div>
      </div>

      <!-- Plan List -->
      <div class="plan-list">
        <div class="plan-card" v-for="i in 3" :key="i">
          <div class="card-bg plan-bg"></div>
          <div class="card-content">
            <div class="plan-header">
              <div class="plan-title">骏马关怀计划</div>
              <div class="plan-tag">民生资产</div>
            </div>
            <div class="plan-body">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">转化民生消费额度</div>
                  <div class="info-value text-blue">00000元</div>
                </div>
                <div class="info-item">
                  <div class="info-label">每月提额</div>
                  <div class="info-value text-blue">00000元</div>
                </div>
              </div>
              <div class="benefit-box">
                <div class="benefit-title">
                  <van-icon name="chart-trending-o" color="#2b7afb" />
                  双模式收益
                </div>
                <div class="benefit-grid">
                  <div class="benefit-item">
                    <div class="benefit-label">固定周利率/生息</div>
                    <div class="benefit-value">00%/00.00元</div>
                  </div>
                  <div class="benefit-item">
                    <div class="benefit-label">递增式利率</div>
                    <div class="benefit-value">0%-00%</div>
                  </div>
                </div>
                <div class="benefit-note">“增”确认额度100000元</div>
              </div>
            </div>
            <div class="plan-footer">
              <div class="price">价格：000元</div>
              <div class="enter-link" @click="goDetail">点击进入 >>></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goDetail = () => {
  router.push({ name: 'plan-detail' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}

.header-bg {
  height: 200px;
  background: var(--blue-gradient);
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-title-font-size: 18px;
  --van-nav-bar-icon-color: #fff;
}

.content {
  padding: 0 16px;
  margin-top: -140px;
  position: relative;
  z-index: 1;
}

/* Card Common Styles */
.wallet-card, .plan-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(4px);
  transform: scale(1.1); /* Prevent blurred edges */
  z-index: 0;
}

.wallet-bg {
  background-image: url('@/assets/服务/minsheng-plan.png');
}

.plan-bg {
  background-image: url('@/assets/服务/subsidy.png');
}

.card-content {
  position: relative;
  z-index: 1;
  padding: 16px;
}

/* Wallet Card Styles */
.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  margin-bottom: 16px;
}

.wallet-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
}

.wallet-tag {
  border: 1px solid #fff;
  border-radius: 12px;
  padding: 2px 12px;
  font-size: 12px;
}

.wallet-body {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.wallet-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: bold;
}

.wallet-amount {
  color: #2b7afb;
  font-weight: bold;
}

.currency {
  font-size: 16px;
  margin-right: 4px;
}

.amount {
  font-size: 24px;
}

.decimal {
  font-size: 14px;
  color: #666;
}

.wallet-actions {
  display: flex;
  gap: 16px;
}

.wallet-actions .action-btn {
  flex: 1;
  border-radius: 8px;
  color: #2b7afb;
  font-weight: bold;
}

/* Plan Card Styles */
.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  margin-bottom: 12px;
}

.plan-title {
  font-size: 18px;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.plan-tag {
  font-size: 12px;
  opacity: 0.9;
}

.plan-body {
  display: flex;
  gap: 12px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 120px;
}

.info-item {
  background: #fff;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
}

.info-label {
  font-size: 10px;
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  font-weight: bold;
}

.text-blue {
  color: #2b7afb;
}

.benefit-box {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  padding: 8px;
}

.benefit-title {
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.benefit-grid {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.benefit-item {
  flex: 1;
  background: #eef4ff;
  padding: 4px;
  border-radius: 4px;
  text-align: center;
}

.benefit-label {
  font-size: 10px;
  color: #666;
  transform: scale(0.9);
}

.benefit-value {
  font-size: 10px;
  color: #2b7afb;
  font-weight: bold;
}

.benefit-note {
  font-size: 10px;
  color: #666;
}

.plan-footer {
  background: #fff;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #2b7afb;
  font-weight: bold;
  font-size: 14px;
}

.enter-link {
  color: #2b7afb;
  font-size: 14px;
  font-weight: bold;
}
</style>
