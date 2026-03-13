<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="资金转换"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- Conversion Type Card -->
      <div class="card type-card">
        <div class="card-title">
          <div class="icon-circle">
            <img :src="iconConversionType" class="section-icon" />
          </div>
          <span>转换类型</span>
        </div>
        <div class="type-options">
          <div class="type-option" :class="{ active: conversionType === 'recommend' }" @click="conversionType = 'recommend'">
            <div class="option-left">
              <img :src="conversionType === 'recommend' ? iconRecommendActive : iconRecommend" class="option-icon" />
              <span>推荐奖励</span>
            </div>
            <van-radio-group v-model="conversionType">
              <van-radio name="recommend"></van-radio>
            </van-radio-group>
          </div>
          <div class="type-option" :class="{ active: conversionType === 'profit' }" @click="conversionType = 'profit'">
            <div class="option-left">
              <img :src="conversionType === 'profit' ? iconProfitActive : iconProfit" class="option-icon" />
              <span>理财收益</span>
            </div>
            <van-radio-group v-model="conversionType">
              <van-radio name="profit"></van-radio>
            </van-radio-group>
          </div>
        </div>
      </div>

      <!-- Amount Card -->
      <div class="card amount-card">
        <div class="balance-row">
          <div class="balance-label">
            <div class="icon-circle">
              <img :src="iconAmount" class="section-icon" />
            </div>
            <span>转换金额</span>
          </div>
          <div class="balance-value">
            可转换金额：<span class="red">¥ {{ availableAmount }}</span>
          </div>
        </div>

        <div class="input-wrapper">
          <van-field
            v-model="amount"
            type="number"
            placeholder="输入转换金额"
            class="custom-input"
            :border="false"
          />
          <span class="all-btn" @click="handleAll">全部</span>
        </div>

        <van-button 
          block 
          round 
          type="primary" 
          class="confirm-btn"
          @click="handleConvert"
        >
          确认转换
        </van-button>

        <div class="reminder">
          <div class="reminder-title">温馨提醒：</div>
          <div class="reminder-text">
            本次转换为单向处理，转换完成后将无法逆转。请务必核实后再进行操作。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { fundConversion } from '@/api/assets'

import iconConversionType from '@/assets/资金转换/转换类型.png'
import iconRecommend from '@/assets/资金转换/推荐灰.png'
import iconRecommendActive from '@/assets/资金转换/推荐奖励.png'
import iconProfit from '@/assets/资金转换/理财收益.png'
import iconProfitActive from '@/assets/资金转换/理财收益蓝.png'
import iconAmount from '@/assets/资金转换/转换金额.png'

const userStore = useUserStore()
const conversionType = ref('recommend')
const amount = ref('')

const availableAmount = computed(() => {
  if (conversionType.value === 'recommend') {
    return userStore.userInfo?.referralBonus || 0
  } else {
    return userStore.userInfo?.investmentIncome || 0
  }
})

const handleAll = () => {
  amount.value = availableAmount.value.toString()
}

const handleConvert = async () => {
  if (!amount.value) {
    showToast('请输入转换金额')
    return
  }
  
  const numAmount = parseFloat(amount.value)
  if (isNaN(numAmount) || numAmount <= 0) {
    showToast('请输入有效的转换金额')
    return
  }
  
  if (numAmount > availableAmount.value) {
    showToast('转换金额不能超过可转换金额')
    return
  }
  
  try {
    const params = {
      amount: numAmount,
      conversionType: conversionType.value === 'recommend' ? 1 : 2
    }
    
    const res = await fundConversion(params)
    if (res.code === 200 || res.code === 0) {
      showToast('转换成功')
      // 刷新用户信息
      await userStore.refreshUserInfo()
      // 清空输入
      amount.value = ''
    } else {
      showToast(res.msg || '转换失败')
    }
  } catch (error) {
    console.error('Fund conversion failed:', error)
    showToast('转换失败，请稍后重试')
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
}

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
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
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

.type-option.disabled .option-left {
  color: #999;
}

.radio-circle.disabled {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ddd;
}

.balance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.balance-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 16px;
}

.balance-value {
  font-size: 13px;
  color: #666;
}

.red {
  color: #ff4d4f;
  font-weight: bold;
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

.confirm-btn {
  margin-bottom: 24px;
  font-size: 16px;
  background: var(--blue-gradient);
  border: none;
}

.reminder {
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}

.reminder-title {
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
}
</style>