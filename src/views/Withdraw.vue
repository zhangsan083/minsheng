<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="提 现"
        left-arrow
        @click-left="$router.back()"
        @click-right="goRecord"
        :border="false"
        class="nav-bar"
      >
        <template #right>
          <span class="nav-right-text">提现记录</span>
        </template>
      </van-nav-bar>
    </div>

    <div class="content">
      <!-- Withdraw Type -->
      <div class="card type-card">
        <div class="card-title">
          <img :src="iconWithdrawType" class="section-icon" />
          <span>提现类型</span>
        </div>
        <div class="type-options">
          <div class="type-option" :class="{ active: withdrawType === 'recommend' }" @click="withdrawType = 'recommend'">
            <div class="option-left">
              <img :src="withdrawType === 'recommend' ? iconRecommendActive : iconRecommend" class="option-icon" />
              <span>推荐奖励</span>
            </div>
            <div class="radio-circle" :class="{ active: withdrawType === 'recommend' }"></div>
          </div>
          <div class="type-option" :class="{ active: withdrawType === 'profit' }" @click="withdrawType = 'profit'">
            <div class="option-left">
              <img :src="withdrawType === 'profit' ? iconProfitActive : iconProfit" class="option-icon" />
              <span>理财收益</span>
            </div>
            <div class="radio-circle" :class="{ active: withdrawType === 'profit' }"></div>
          </div>
        </div>
      </div>

      <!-- Withdraw Rights -->
      <div class="card rights-card">
        <div class="rights-header">提现权益</div>
        <div class="rights-grid">
          <div class="right-item">
            <van-icon name="checked" color="#0944fc" />
            <span>提现金额/100元起</span>
          </div>
          <div class="right-item">
            <van-icon name="checked" color="#0944fc" />
            <span>免手续费</span>
          </div>
          <div class="right-item">
            <van-icon name="checked" color="#0944fc" />
            <span>24小时内到账</span>
          </div>
          <div class="right-item">
            <van-icon name="checked" color="#0944fc" />
            <span>提现时间为10:00至17:00</span>
          </div>
        </div>
      </div>

      <!-- Amount and Method -->
      <div class="card main-card">
        <div class="balance-row">
          <div class="section-title">
            <img :src="iconAmount" class="section-icon" />
            <span>提现金额</span>
          </div>
          <div class="balance-value">
            可提现金额：<span class="red">¥ {{ availableAmount }}</span>
          </div>
        </div>
        
        <div class="input-wrapper">
          <van-field
            v-model="amount"
            type="number"
            placeholder="输入提现金额"
            class="custom-input"
            :border="false"
          />
          <span class="all-btn" @click="handleAll">全部</span>
        </div>

        <div class="method-section">
          <div class="section-title blue-text">选择提现方式</div>
          <van-radio-group v-model="withdrawMethod">
            <!-- 动态渲染收款账户 -->
            <div 
              class="payment-item" 
              v-for="item in accountList" 
              :key="item.id"
              @click="withdrawMethod = item.id"
            >
              <div class="payment-info">
                <img :src="getAccountIcon(item.accountType)" class="payment-icon" />
                <div class="account-text">
                  <div class="account-name">{{ getAccountTypeName(item.accountType) }}</div>
                  <div class="account-num">{{ formatAccountNum(item.accountNum) }}</div>
                </div>
              </div>
              <van-radio :name="item.id"></van-radio>
            </div>
            
            <!-- 如果没有账户，显示提示或跳转添加 -->
            <div class="no-account" v-if="accountList.length === 0" @click="goAddAccount">
              <van-icon name="plus" />
              <span>添加收款账户</span>
            </div>
          </van-radio-group>
        </div>

        <van-button 
          block 
          round 
          type="primary" 
          class="submit-btn"
          @click="handleWithdraw"
          :disabled="!withdrawMethod"
        >
          立即提现
        </van-button>
      </div>
    </div>

    <!-- 支付密码弹框 -->
    <van-dialog
      v-model:show="showPasswordDialog"
      title="请输入支付密码"
      show-cancel-button
      confirm-button-text="确认"
      cancel-button-text="取消"
      @confirm="handleConfirmPassword"
      @cancel="showPasswordDialog = false"
      class="password-dialog"
    >
      <div class="password-input-wrapper">
        <van-field
          v-model="payPassword"
          type="password"
          placeholder="请输入6位支付密码"
          maxlength="6"
          input-align="center"
          :border="false"
          class="password-field"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast } from 'vant'
import { getAccountList, withdraw } from '@/api/auth'
import { useUserStore } from '@/stores/user'

import iconWithdrawType from '@/assets/立即提现/提现类型.png'
import iconAmount from '@/assets/立即提现/充值金额.png'
import iconAlipay from '@/assets/立即提现/支付宝.png'
import iconBank from '@/assets/立即提现/银行卡.png'
import iconRecommend from '@/assets/资金转换/推荐灰.png'
import iconRecommendActive from '@/assets/资金转换/推荐奖励.png'
import iconProfit from '@/assets/资金转换/理财收益.png'
import iconProfitActive from '@/assets/资金转换/理财收益蓝.png'

const router = useRouter()
const userStore = useUserStore()
const amount = ref('')
const withdrawMethod = ref(null)
const accountList = ref([])
const withdrawType = ref('recommend')
const showPasswordDialog = ref(false)
const payPassword = ref('')

onMounted(() => {
  fetchAccountList()
})

const fetchAccountList = async () => {
  const toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  })
  
  try {
    const res = await getAccountList()
    toast.close()
    if (res && res.code === 200) {
      accountList.value = res.data || []
      // 默认选中第一个
      if (accountList.value.length > 0) {
        withdrawMethod.value = accountList.value[0].id
      }
    }
  } catch (error) {
    toast.close()
    console.error(error)
    showToast('获取账户信息失败')
  }
}

const getAccountIcon = (type) => {
  // 0银行卡 1支付宝
  return String(type) === '1' ? iconAlipay : iconBank
}

const getAccountTypeName = (type) => {
  return String(type) === '1' ? '支付宝' : '银行卡'
}

const formatAccountNum = (num) => {
  if (!num) return ''
  // 简单脱敏或格式化，这里直接显示
  return num
}

const goAddAccount = () => {
  router.push({ name: 'payment-account' })
}

const goRecord = () => {
  router.push({ name: 'withdraw-record' })
}

const availableAmount = computed(() => {
  if (withdrawType.value === 'recommend') {
    return userStore.userInfo?.referralBonus || 0
  } else {
    return userStore.userInfo?.investmentIncome || 0
  }
})

const handleAll = () => {
  amount.value = availableAmount.value.toString()
}

const handleWithdraw = () => {
  if (!amount.value) {
    showToast('请输入提现金额')
    return
  }
  if (!withdrawMethod.value) {
    showToast('请选择提现方式')
    return
  }
  
  // 检查提现金额是否满100元
  const withdrawAmount = parseFloat(amount.value)
  if (withdrawAmount < 100) {
    showToast('提现金额需100元起')
    return
  }
  
  // 检查提现时间是否在10:00至17:00之间
  const now = new Date()
  const hour = now.getHours()
  if (hour < 10 || hour >= 17) {
    showToast('提现时间为10:00至17:00')
    return
  }
  
  // 清空密码并显示支付密码输入弹框
  payPassword.value = ''
  showPasswordDialog.value = true
}

const handleConfirmPassword = async () => {
  if (!payPassword.value || payPassword.value.length !== 6) {
    showToast('请输入6位数字支付密码')
    return
  }
  
  const toast = showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0
  })
  
  try {
    const walletType = withdrawType.value === 'recommend' ? '2' : '3'
    const params = {
      accountId: withdrawMethod.value,
      amount: parseFloat(amount.value),
      payPassword: payPassword.value,
      walletType: walletType
    }
    
    const res = await withdraw(params)
    toast.close()
    
    if (res.code === 200) {
      showToast('提现申请已提交')
      showPasswordDialog.value = false
      amount.value = ''
      payPassword.value = ''
      // 更新缓存中的用户信息
      await userStore.refreshUserInfo()
    } else {
      showToast(res.msg || '提现失败')
    }
  } catch (error) {
    toast.close()
    console.error('Withdraw failed:', error)
    showToast('提现失败，请稍后重试')
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 40px;
}

.header-bg {
  background: var(--blue-gradient);
  height: 220px;
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
}

.nav-right-text { color: #fff; font-size: 14px; }
:deep(.van-nav-bar__title) { color: #fff; font-weight: bold; font-size: 18px; }
:deep(.van-icon) { color: #fff; }

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
}

.type-card {
  padding: 16px;
}

.type-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.option-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.payment-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: var(--blue-deep);
  margin-bottom: 12px;
}

.type-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.type-option.active {
  background: #e6f7ff;
}

.option-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #333;
}

.radio-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-circle.active {
  border-color: #1890ff;
  background: #1890ff;
}

.radio-circle.active::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.balance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.balance-value {
  font-size: 13px;
  color: #666;
}

.red {
  color: #ff4d4f;
  font-weight: bold;
}

.rights-card {
  border: 1px solid var(--blue-deep);
}

.rights-header {
  background: var(--blue-deep);
  color: #fff;
  text-align: center;
  padding: 8px 0;
  font-weight: bold;
  font-size: 15px;
}

.rights-grid {
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.right-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.main-card {
  padding: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: var(--blue-deep);
  margin-bottom: 12px;
}

.blue-text { color: var(--blue-deep); }
.blue-text::placeholder { color: var(--blue-deep); opacity: 0.6; }

.icon-circle.blue {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--blue-deep);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-wrapper {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 4px 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.custom-input {
  background: transparent;
  padding: 12px 0;
  font-size: 16px;
}

.all-btn {
  color: var(--blue-deep);
  font-size: 14px;
  font-weight: bold;
  padding-left: 12px;
  border-left: 1px solid #ddd;
  cursor: pointer;
}

.payment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f6f7;
}

.payment-item:last-child {
  border-bottom: none;
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.account-text {
  display: flex;
  flex-direction: column;
}

.account-name {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.account-num {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.no-account {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  color: var(--blue-deep);
  font-size: 14px;
  cursor: pointer;
  border: 1px dashed var(--blue-deep);
  border-radius: 8px;
  margin-top: 10px;
}

.submit-btn {
  margin-top: 30px;
  font-size: 16px;
  background: var(--blue-gradient);
  border: none;
}

/* 支付密码弹框样式 */
.password-input-wrapper {
  padding: 20px 16px;
}

.password-field {
  background: #f7f9fc;
  border-radius: 8px;
}

.password-field :deep(.van-field__control) {
  font-size: 16px;
  color: #333;
  letter-spacing: 4px;
}

:deep(.van-dialog.password-dialog) {
  border-radius: 12px;
}

:deep(.van-dialog.password-dialog .van-dialog__header) {
  font-size: 16px;
  font-weight: bold;
  padding-top: 20px;
}

:deep(.van-dialog.password-dialog .van-dialog__footer) {
  padding: 0 16px 16px;
}

:deep(.van-dialog.password-dialog .van-dialog__confirm) {
  background: var(--blue-gradient);
  color: #fff;
  border: none;
  border-radius: 8px;
  height: 40px;
}

:deep(.van-dialog.password-dialog .van-dialog__cancel) {
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  height: 40px;
  margin-right: 8px;
}
</style>