<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="资金转出"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- Transfer Type Card -->
      <div class="card type-card">
        <div class="card-title">
          <div class="icon-circle">
            <img :src="iconTransferTypeLarge" class="section-icon" />
          </div>
          <span>转出类型</span>
        </div>
        <div class="type-options">
          <div class="type-option" :class="{ active: transferType === 'recommend' }" @click="transferType = 'recommend'">
            <div class="option-left">
              <img :src="transferType === 'recommend' ? iconRecommendActive : iconRecommend" class="option-icon" />
              <span>推荐奖励</span>
            </div>
            <div v-if="transferType === 'recommend'" class="radio-selected"></div>
            <div v-else class="radio-circle"></div>
          </div>
          <div class="type-option" :class="{ active: transferType === 'profit' }" @click="transferType = 'profit'">
            <div class="option-left">
              <img :src="transferType === 'profit' ? iconProfitActive : iconProfit" class="option-icon" />
              <span>理财收益</span>
            </div>
            <div v-if="transferType === 'profit'" class="radio-selected"></div>
            <div v-else class="radio-circle"></div>
          </div>
        </div>
      </div>

      <!-- Transfer Form Card -->
      <div class="card form-card">
        <div class="balance-row">
          <div class="balance-label">
            <div class="icon-circle">
              <img :src="iconAmountLarge" class="section-icon" />
            </div>
            <span>转出金额</span>
          </div>
          <div class="balance-value">
            可转出金额：<span class="red">¥ {{ availableAmount }}</span>
          </div>
        </div>

        <div class="form-item">
          <div class="item-icon">
            <img :src="iconTransferTypeSmall" class="form-icon-img" />
          </div>
          <div class="item-label">转出类型</div>
          <div class="item-value-text">{{ transferType === 'recommend' ? '推荐奖励余额' : '理财收益余额' }}</div>
        </div>

        <van-field
          v-model="phone"
          type="tel"
          label="收款人手机号"
          placeholder="请输入收款人手机号"
          maxlength="11"
          input-align="right"
          @update:model-value="handlePhoneInput"
        >
          <template #left-icon>
            <img :src="iconPhone" class="form-icon-img" />
          </template>
        </van-field>

        <van-field
          v-model="amount"
          type="digit"
          label="转出金额"
          placeholder="请输入转出金额"
          input-align="right"
          @update:model-value="handleAmountInput"
        >
          <template #left-icon>
            <img :src="iconAmountSmall" class="form-icon-img" />
          </template>
        </van-field>

        <van-button 
          block 
          round 
          type="primary" 
          class="confirm-btn"
          @click="handleTransfer"
        >
          确认转出
        </van-button>
      </div>

      <div class="reminder">
        <div class="reminder-title">温馨提醒：</div>
        <div class="reminder-text">
          请仔细核对收款对方身份信息，确认后进行操作，如遇问题，请联系在线客服。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { fundTransfer } from '@/api/assets'

import iconTransferTypeSmall from '@/assets/资金转出/转出类型56x57.png'
import iconTransferTypeLarge from '@/assets/资金转出/转出类型65x65.png'
import iconRecommend from '@/assets/资金转出/推荐灰.png'
import iconRecommendActive from '@/assets/资金转出/推荐奖励.png'
import iconProfit from '@/assets/资金转出/理财收益.png'
import iconProfitActive from '@/assets/资金转出/理财收益蓝.png'
import iconAmountSmall from '@/assets/资金转出/转出金额58x58.png'
import iconAmountLarge from '@/assets/资金转出/转出金额68x68.png'
import iconPhone from '@/assets/资金转出/手机号.png'

const userStore = useUserStore()
const transferType = ref('recommend')
const phone = ref('')
const amount = ref('')

const availableAmount = computed(() => {
  if (transferType.value === 'recommend') {
    return userStore.userInfo?.referralBonus || 0
  } else {
    return userStore.userInfo?.investmentIncome || 0
  }
})

const handleAll = () => {
  amount.value = availableAmount.value.toString()
}

const handlePhoneInput = (val) => {
  phone.value = val.replace(/[^0-9]/g, '')
}

const handleAmountInput = (val) => {
  let v = val.replace(/[^0-9.]/g, '')
  const parts = v.split('.')
  if (parts.length > 2) {
    v = parts[0] + '.' + parts.slice(1).join('')
  }
  if (parts.length === 2 && parts[1].length > 2) {
    v = parts[0] + '.' + parts[1].slice(0, 2)
  }
  amount.value = v
}

const handleTransfer = async () => {
  if (!phone.value) {
    showToast('请输入收款人手机号')
    return
  }
  if (!amount.value) {
    showToast('请输入转出金额')
    return
  }
  
  const numAmount = parseFloat(amount.value)
  if (isNaN(numAmount) || numAmount <= 0) {
    showToast('请输入有效的转出金额')
    return
  }
  
  if (numAmount < 100) {
    showToast('转出金额最低100元')
    return
  }
  
  if (numAmount > availableAmount.value) {
    showToast('转出金额不能超过可转出金额')
    return
  }
  
  // 验证手机号格式
  // const phoneRegex = /^1[3-9]\d{9}$/
  // if (!phoneRegex.test(phone.value)) {
  //   showToast('请输入有效的手机号码')
  //   return
  // }
  
  try {
    const params = {
      amount: numAmount,
      collPhonenumber: phone.value,
      conversionType: transferType.value === 'recommend' ? 1 : 2
    }
    
    const res = await fundTransfer(params)
    if (res.code === 200 || res.code === 0) {
      showToast('转出成功')
      // 刷新用户信息
      await userStore.refreshUserInfo()
      // 清空输入
      phone.value = ''
      amount.value = ''
    } else {
      showToast(res.msg || '转出失败')
    }
  } catch (error) {
    console.error('Fund transfer failed:', error)
    showToast('转出失败，请稍后重试')
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
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
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}

.content {
  padding: 0 16px;
  padding-bottom: 80px; /* Add bottom padding for tabbar */
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.icon-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.section-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.option-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.form-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

/* van-field 内图标和输入框样式 */
:deep(.van-field__left-icon) {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

:deep(.van-field__label) {
  width: auto;
  max-width: 110px;
  font-weight: bold;
}

.type-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
}

.type-option.active {
  background: #e6f7ff;
}

.option-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-base);
  color: #333;
}

.radio-selected {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--blue-deep);
}

.radio-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
}

.balance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.balance-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: var(--font-size-base);
}

.balance-value {
  font-size: var(--font-size-small);
  color: #333;
}

.red { color: #ff4d4f; font-weight: bold; }

.form-item {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.item-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.item-label {
  font-size: var(--font-size-small);
  color: #333;
  width: 110px;
  font-weight: bold;
  white-space: nowrap;
}

.item-value-text {
  font-size: var(--font-size-small);
  color: #333;
  font-weight: bold;
  flex: 1;
  text-align: right;
}

.item-input {
  border: none;
  background: transparent;
  flex: 1;
  width: 0;
  min-width: 0;
  text-align: right;
  font-size: var(--font-size-small);
  outline: none;
  box-sizing: border-box;
}

.blue-text { color: var(--blue-deep); }
.blue-text::placeholder { color: var(--blue-deep); opacity: 0.6; }

.confirm-btn {
  margin-top: 24px;
  font-size: var(--font-size-base);
  background: var(--blue-gradient);
  border: none;
  height: var(--button-normal-height);
}

.reminder {
  padding: 0 4px;
  color: #666;
  font-size: var(--font-size-small);
  line-height: 1.6;
}

.reminder-title {
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
}
</style>