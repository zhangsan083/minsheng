<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="充 值"
        left-arrow
        @click-left="$router.back()"
        @click-right="goRechargeRecord"
        :border="false"
        class="nav-bar"
      >
        <template #right>
          <span class="nav-right-text">充值记录</span>
        </template>
      </van-nav-bar>
    </div>

    <div class="content">
      <div class="recharge-card">
        <div class="input-section">
          <div class="section-title">
            <div class="icon-circle">
              <img :src="iconAmount" class="section-icon" />
            </div>
            <span>充值金额</span>
          </div>
          <div class="input-wrapper">
            <van-field
              v-model="amount"
              type="number"
              placeholder="输入充值金额"
              class="custom-input"
              :border="false"
            />
          </div>
        </div>

        <div class="method-section">
          <div class="section-title blue-text">选择充值方式</div>
          <van-radio-group v-model="paymentMethod">
            <div class="payment-item" @click="paymentMethod = 'alipay'">
              <div class="payment-info">
                <img :src="iconAlipay" class="payment-icon" />
                <span>支付宝支付</span>
              </div>
              <van-radio name="alipay"></van-radio>
            </div>
            
            <div class="payment-item" @click="paymentMethod = 'wechat'">
              <div class="payment-info">
                <img :src="iconWechat" class="payment-icon" />
                <span>微信支付</span>
              </div>
              <van-radio name="wechat"></van-radio>
            </div>
            
            <div class="payment-item" @click="paymentMethod = 'bank'">
              <div class="payment-info">
                <img :src="iconBank" class="payment-icon" />
                <span>银行卡支付</span>
              </div>
              <van-radio name="bank"></van-radio>
            </div>
          </van-radio-group>
        </div>

        <div class="action-buttons">
          <van-button 
            block 
            round 
            type="primary" 
            class="mb-16 btn-submit"
            @click="handleRecharge"
          >
            立即充值
          </van-button>
          
          <van-button 
            block 
            round 
            plain 
            type="primary" 
            color="#0944fc"
            @click="contactService"
          >
            联系客服
          </van-button>
        </div>

        <div class="instructions">
          <div class="inst-title">充值说明</div>
          <div class="inst-content">
            <p>1.单笔充值金额不得低于100元人民币，低于100元的充值请求将自动驳回。</p>
            <p>2.支付成功后资金将实时到账，如遇支付通道高峰期，到账可能延迟1-10分钟。若超过10分钟仍未到账，请通过 <span class="link" @click="contactService">在线客服</span> 提交订单信息核查。</p>
            <p>3.充值前请务必关闭所有VPN加速器及代理工具，若检测到异常，系统可能自动触发风控机制，导致交易延迟或中断。</p>
          </div>
          
          <div class="inst-title">温馨提示</div>
          <div class="inst-content">
            <p>若充值过程中出现支付失败、延迟到账或其他异常情况，请立即联系 <span class="link" @click="contactService">在线客服</span> 并提供以下信息以便快速处理：充值订单号，支付凭证截图，异常现象描述。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import iconAmount from '@/assets/立即充值/充值金额.png'
import iconAlipay from '@/assets/立即充值/支付宝.png'
import iconWechat from '@/assets/立即充值/微信.png'
import iconBank from '@/assets/立即充值/银行卡.png'

const router = useRouter()
const amount = ref('')
const paymentMethod = ref('alipay')

const goRechargeRecord = () => {
  // router.push({ name: 'recharge-record' })
  showToast('充值记录开发中')
}

const handleRecharge = () => {
  if (!amount.value) {
    showToast('请输入充值金额')
    return
  }
  if (Number(amount.value) < 100) {
    showToast('单笔充值金额不得低于100元')
    return
  }
  showToast('发起充值: ' + amount.value)
}

const contactService = () => {
  showToast('联系客服')
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

.nav-right-text {
  color: #fff;
  font-size: 14px;
}

:deep(.van-nav-bar__title) { color: #fff; font-weight: bold; font-size: 18px; }
:deep(.van-icon) { color: #fff; }

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.recharge-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  min-height: 500px;
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

.blue-text {
  color: var(--blue-deep);
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

.payment-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.currency-symbol {
  font-size: 14px;
  font-weight: bold;
}

.input-wrapper {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 4px 12px;
  margin-bottom: 24px;
}

.custom-input {
  background: transparent;
  padding: 10px 0;
  font-size: 16px;
}

.payment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.payment-item:last-child {
  border-bottom: none;
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #333;
}

.method-section {
  margin-bottom: 30px;
}

.action-buttons {
  margin-bottom: 30px;
}

.mb-16 {
  margin-bottom: 16px;
}

.btn-submit {
  background: var(--blue-gradient);
  border: none;
}

.instructions {
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}

.inst-title {
  color: #333;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 16px;
}

.inst-title:first-child {
  margin-top: 0;
}

.inst-content p {
  margin-bottom: 8px;
  text-align: justify;
}

.link {
  color: #ff4d4f;
  text-decoration: underline;
  cursor: pointer;
}
</style>