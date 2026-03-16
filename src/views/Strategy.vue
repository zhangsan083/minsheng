<template>
  <div class="strategy-page">
    <div class="header">
      <van-nav-bar title="中国梦战略规则" :border="false" class="nav-bar" />
    </div>
    
    <div class="content">
      <!-- Account Info Card -->
      <div class="info-card">
        <div class="section">
          <div class="section-header">
            <span class="label">已预订兑付额度</span>
          </div>
          <div class="amount-row">
            <div class="amount">
              <span class="symbol">¥</span>
              <span class="num">{{ accountInfo.reservedQuota }}</span>
            </div>
            <van-button size="small" type="primary" class="action-btn" @click="$router.push('/reserve-quota')">预定额度</van-button>
          </div>
          <div class="desc">
            您当前已成功预订{{ accountInfo.reservedQuota }}元兑付额度，预订的额度已为您留存，请您确认后开启兑付流程。
          </div>
        </div>

        <div class="divider"></div>

        <div class="section">
          <div class="section-header">
            <span class="label">已确认兑付额度</span>
            <span class="tag">明细</span>
          </div>
          <div class="amount-row">
            <div class="amount">
              <span class="symbol">¥</span>
              <span class="num">{{ accountInfo.confirmedQuota }}</span>
            </div>
            <div class="btn-group">
              <van-button size="small" type="primary" class="action-btn" @click="$router.push('/filing-record')">存档备案</van-button>
              <van-button size="small" type="primary" class="action-btn" @click="$router.push('/payment-progress')">兑付进度</van-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Plan List -->
      <div class="plan-card" v-for="(item, index) in planList" :key="index">
        <div class="card-tag" v-if="item.tag">{{ item.tag }}</div>
        
        <div class="plan-header">
          <div class="plan-title">{{ item.name }}</div>
          <div class="plan-subtitle">{{ item.subtitle }}</div>
        </div>
        
        <div class="plan-desc">{{ item.desc }}</div>
        
        <div class="dashed-divider"></div>
        
        <div class="rights-section">
          <div class="rights-title">权益</div>
          <div class="right-item" v-for="(right, rIndex) in item.rights" :key="rIndex">
            <van-icon name="star" color="#1989fa" size="14" class="star-icon" />
            <span>{{ right }}</span>
          </div>
        </div>
        
        <div class="action-area">
          <van-button block color="var(--blue-gradient)" round class="confirm-btn" @click="handleConfirm">
            确认额度
          </van-button>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <van-dialog
      v-model:show="showConfirmDialog"
      title="温馨提示"
      :show-confirm-button="false"
      class="custom-dialog"
    >
      <div class="dialog-body">
        <div class="dialog-message">
          <span class="bullet">●</span>
          <span class="text">当前留存500万元以内的预订兑付额度。为最终锁定该权益，请完成1500元的支付确认，另有 500元定金抵扣可用。</span>
        </div>
        <div class="dialog-actions">
          <van-button 
            type="primary" 
            color="#2b6bff" 
            class="dialog-btn confirm"
            @click="handleConfirmPay"
          >
            确认支付
          </van-button>
          <van-button 
            type="default" 
            color="#999" 
            class="dialog-btn cancel"
            @click="showConfirmDialog = false"
          >
            稍后再说
          </van-button>
        </div>
      </div>
    </van-dialog>

    <!-- Payment Password Dialog -->
    <van-dialog 
      v-model:show="showPaymentPassword" 
      title="请输入支付密码" 
      show-cancel-button
      @confirm="handlePaymentConfirm"
      class="payment-dialog"
    >
      <div class="payment-input-container">
        <van-field
          v-model="paymentPassword"
          type="password"
          placeholder="请输入6位支付密码"
          maxlength="6"
          center
          input-align="center"
          class="payment-input"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const showConfirmDialog = ref(false)
const showPaymentPassword = ref(false)
const paymentPassword = ref('')

const accountInfo = ref({
  reservedQuota: '000,000,000',
  confirmedQuota: '000,000,000'
})

const handleConfirm = () => {
  showConfirmDialog.value = true
}

const handleConfirmPay = () => {
  showConfirmDialog.value = false
  showPaymentPassword.value = true
}

const handlePaymentConfirm = () => {
  if (paymentPassword.value.length !== 6) {
    showToast('请输入6位支付密码')
    return false // Prevent dialog close
  }
  
  // Simulate API call
  setTimeout(() => {
    router.push('/payment-success')
  }, 500)
}

const planList = ref([
  {
    name: '额度兑付确认方案A',
    subtitle: '适用于500万以内预定额度用户',
    tag: '定金抵扣500元',
    desc: '无需复杂审批手续，完成兑付前额度确认后即可开启兑付流程，兑付流程公开，确认该方案适配用户当前已预订的兑付额度。',
    rights: [
      '额外赠送30万元惠民补贴金',
      '民生计划：获得民生资产民生计划入场资格。'
    ]
  }
  // ,
  // {
  //   name: '额度兑付确认方案B',
  //   subtitle: '适用于1000万以内预定额度用户',
  //   tag: '',
  //   desc: '无需复杂审批手续，完成兑付前额度确认后即可开启兑付流程，兑付流程公开，确认该方案适配用户当前已预订的兑付额度。',
  //   rights: [
  //     '额外赠送50万元惠民补贴金',
  //     '民生计划：获得民生资产民生计划入场资格。'
  //   ]
  // }
])
</script>

<style scoped>
.strategy-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}

.header {
  height: 220px;
  background: url('@/assets/战略/strategy-bg1.png') no-repeat center top;
  background-size: 100% 100%;
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}

:deep(.van-nav-bar .van-icon) {
  color: #fff;
}

.content {
  padding: 0 16px;
  margin-top: -60px;
  position: relative;
  z-index: 1;
}

/* Info Card */
.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 2px solid #5a9cf8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section {
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.label {
  font-size: var(--font-size-small);
  color: #333;
  font-weight: bold;
}

.tag {
  font-size: var(--font-size-xs);
  color: #fff;
  background: #1989fa;
  padding: 1px 4px;
  border-radius: 4px;
  margin-left: 6px;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.amount {
  color: #333;
  font-weight: bold;
  font-size: 22px;
}

.symbol {
  font-size: var(--font-size-small);
  margin-right: 4px;
}

.action-btn {
  background: #1989fa;
  border: none;
  border-radius: 6px;
  height: 32px;
  line-height: 30px;
  padding: 0 16px;
  font-size: var(--font-size-small);
  font-weight: bold;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.desc {
  font-size: var(--font-size-xs);
  color: #666;
  line-height: 1.5;
  text-align: justify;
}

.divider {
  height: 1px;
  background: #ebedf0;
  margin: 12px 0;
}

/* Plan Card */
.plan-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 16px 16px;
  margin-bottom: 16px;
  border: 1px solid #1989fa;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: #1989fa;
  color: #fff;
  font-size: var(--font-size-xs);
  padding: 4px 12px;
  border-bottom-left-radius: 12px;
  border-top-right-radius: 12px;
  font-weight: bold;
}

.plan-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #1989fa;
  margin-bottom: 6px;
}

.plan-subtitle {
  font-size: var(--font-size-xs);
  color: #1989fa;
  margin-bottom: 12px;
  font-weight: bold;
}

.plan-desc {
  font-size: var(--font-size-xs);
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
  text-align: justify;
}

.dashed-divider {
  border-top: 1px dashed #1989fa;
  margin: 12px 0;
}

.rights-title {
  font-size: var(--font-size-small);
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.right-item {
  display: flex;
  align-items: flex-start;
  font-size: var(--font-size-xs);
  color: #666;
  margin-bottom: 6px;
  line-height: 1.4;
}

.star-icon {
  margin-right: 6px;
  margin-top: 2px;
}

.action-area {
  margin-top: 20px;
}

.confirm-btn {
  font-size: var(--font-size-base);
  font-weight: bold;
  height: 48px;
  box-shadow: 0 4px 10px rgba(25, 137, 250, 0.3);
}

/* Dialog Styles */
.custom-dialog {
  width: 320px !important;
  border-radius: 12px !important;
  overflow: hidden;
}

:deep(.van-dialog__header) {
  padding-top: 24px;
  font-weight: bold;
  color: #1989fa;
  font-size: var(--font-size-base);
}

.dialog-body {
  padding: 20px 24px 24px;
}

.dialog-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  color: #333;
  font-size: var(--font-size-small);
  line-height: 1.6;
  text-align: justify;
}

.bullet {
  color: #1989fa;
  margin-right: 8px;
  font-size: var(--font-size-xs);
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.dialog-btn {
  flex: 1;
  height: 44px;
  font-size: var(--font-size-small);
  font-weight: bold;
  border-radius: 20px !important;
}

.dialog-btn.cancel {
  background: #999 !important;
  border: none !important;
  color: #fff !important;
}

.payment-input-container {
  padding: 20px 16px;
}

.payment-input {
  border: 1px solid #ebedf0;
  border-radius: 4px;
  padding: 10px;
}
</style>
