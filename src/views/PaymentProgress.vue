<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="兑付进度查询"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- Bank Card Info -->
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
            <div class="card-logo">LOGO</div>
            <div class="card-slogan">资产为民 发展为我</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <van-button 
          block 
          round 
          type="primary"
          class="action-btn"
          to="/payment-progress-detail"
        >
          兑付进度查询
        </van-button>
        <van-button 
          block 
          round 
          type="primary"
          class="action-btn"
          @click="showRefundPopup = true"
        >
          验证金退还
        </van-button>
      </div>

      <!-- Refund Popup -->
      <van-popup v-model:show="showRefundPopup" round class="refund-popup">
        <div class="popup-header">
          <div class="header-left">
            <div class="logo-circle">logo</div>
            <span class="popup-title">验证金退还</span>
          </div>
          <van-icon name="cross" class="close-icon" @click="showRefundPopup = false" />
        </div>
        <div class="divider-line"></div>
        
        <div class="popup-form">
          <div class="form-row">
            <span class="label">姓名：</span>
            <div class="input-box disabled"></div>
          </div>
          <div class="form-row">
            <span class="label">退还方式：</span>
            <div class="input-box disabled"></div>
          </div>
          <div class="form-row">
            <span class="label">支付宝账号：</span>
            <div class="input-box disabled"></div>
          </div>
        </div>

        <van-button 
          block 
          round 
          type="primary" 
          class="submit-btn"
          @click="showRefundPopup = false"
        >
          已完成
        </van-button>
      </van-popup>

      <!-- Notice Card -->
      <div class="notice-card">
        <div class="notice-title">民生资产账户开通</div>
        <div class="notice-content">
          <p>为贯彻落实国家金融科技监管政策，切实保障用户交易安全与资产兑付透明度，数字钱包平台现已推出央行认证数字钱包账户开通验证服务。该项服务已通过中国人民银行数字货币研究所技术认证，系统架构与操作流程均全面符合国家级合规标准，有效保障大额资金流动的全程可追溯与安全控制。</p>
          <p>用户在开通数字钱包账户时需预存450元作为验证金，用于身份及账户安全核验。该验证金将在10至30个工作日内全额原路退回，且平台承诺不收取任何隐性费用。每位推荐人成功邀请一名直属下级完成账户开通并通过合规审核后，将获得50元的推荐奖励。所有资金流动均在央行的监管之下，以确保其安全性。</p>
          <p>我们的技术与业务流程已通过央行审核，资金流动实时受到监管，有效防范安全隐患。账户开通后，用户资产兑付通道将自动激活，整个兑付链路均可追溯，显著缩短传统兑付周期，提升资金使用效率。我们的使命是在国家级技术标准与合规监管体系的保障下，保护每一笔数字资产，共同建设安全、高效、可信的数字金融生态。如需查询兑付进展或咨询其他问题，请随时联系在线客服（服务时间：每日8:30-21:30）。</p>
        </div>
        <div class="customer-service-btn-wrapper">
          <van-button 
            block 
            round 
            color="#2b7afb" 
            class="service-btn"
          >
            <van-icon name="service" size="20" style="margin-right: 6px;" />
            在线客服
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showRefundPopup = ref(false)
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
  --van-nav-bar-title-font-size: 18px;
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
  background-size: 135% 150%; /* Scale up significantly to remove whitespace */
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
  font-size: 12px;
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
  align-items: center; /* Center label and box relative to each other */
  width: 160px; /* Fixed width for the alignment area */
}

.balance-label {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  width: 100%;
  text-align: center;
}

.balance-value-box {
  background: white;
  color: #2b7afb;
  font-size: 24px;
  font-weight: bold;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  width: 100%; /* Match width of balance-area */
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
  font-size: 20px;
  font-weight: bold;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.card-slogan {
  font-size: 12px;
  opacity: 0.8;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.action-buttons {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-btn {
  height: 50px;
  font-size: 18px;
  font-weight: bold;
  background: var(--blue-gradient); /* Ensure it matches header bg */
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(9, 68, 252, 0.4); /* Deeper blue shadow */
}

.action-buttons {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-btn {
  height: 48px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(43, 122, 251, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5); /* Subtle border */
}

.notice-card {
  background: white;
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.notice-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #2b7afb;
  margin-bottom: 20px;
}

.notice-content {
  font-size: 13px;
  color: #333;
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 24px;
}

.notice-content p {
  margin-bottom: 16px;
  text-indent: 2em;
}

.notice-content p:last-child {
  margin-bottom: 0;
}

.service-btn {
  height: 44px;
  font-size: 15px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(43, 122, 251, 0.3);
}

/* Refund Popup Styles */
.refund-popup {
  width: 90%;
  padding: 24px 20px;
  background: white;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-circle {
  width: 32px;
  height: 32px;
  background: #999;
  border-radius: 50%;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  color: #2b7afb;
}

.close-icon {
  font-size: 20px;
  color: #000;
  background: #eee;
  border-radius: 50%;
  padding: 2px;
}

.divider-line {
  height: 1px;
  background: #eee;
  border-top: 1px dashed #2b7afb;
  margin-bottom: 24px;
}

.popup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.form-row {
  display: flex;
  align-items: center;
}

.form-row .label {
  width: 90px;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.input-box {
  flex: 1;
  height: 36px;
  background: #eee;
  border-radius: 6px;
}

.submit-btn {
  height: 50px;
  font-size: 18px;
  font-weight: bold;
  background: var(--blue-gradient);
  box-shadow: 0 4px 12px rgba(9, 68, 252, 0.4);
}
</style>