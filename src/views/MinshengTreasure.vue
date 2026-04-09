<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="民生保"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="panel">
        <div class="panel-header">
          <div class="term-row">
            <div
              v-for="t in terms"
              :key="t"
              :class="['term-pill', activeTerm === t ? 'active' : '']"
              @click="activeTerm = t"
            >
              {{ t }}天理财
            </div>
          </div>
        </div>

        <div class="rate-row">
          <div class="rate-label">日利率</div>
          <div class="rate-value">{{ currentPlan.interestRate || 0 }}%</div>
          <div class="rate-note">到期本息一次性支付</div>
        </div>

        <div class="balance-row">
          <div class="balance-box">
            <div class="balance-name">民生保障补助金总金额</div>
            <div class="balance-num">
              <span v-if="showBalance">{{ hmbaoData.welfareSubsidy || 0 }}元</span>
              <span v-else>*****元</span>
            </div>
            <div class="balance-sub" @click="goRecords">点击查看明细</div>
          </div>
          <div class="balance-box">
            <div class="balance-header-row">
              <div class="balance-name">民生保理财金额</div>
              <van-icon :name="showBalance ? 'eye-o' : 'closed-eye'" size="16" color="#2b7afb" @click="showBalance = !showBalance" />
            </div>
            <div class="balance-num">
              <span v-if="showBalance">{{ hmbaoData.investmentAmount || 0 }}元</span>
              <span v-else>*****元</span>
            </div>
            <div class="balance-sub" @click="goRecords">点击查看明细</div>
          </div>
        </div>

        <van-button round block class="detail-btn" @click="goRecords">查看持有详情</van-button>
      </div>

      <div class="transfer-panel">
        <div class="transfer-input">
          <van-field
            v-model="amount"
            placeholder="请输入您需要转入民生保的金额"
            input-align="left"
            type="number"
            class="amount-field"
            :border="false"
          >
            <template #button>
              <span class="all-btn" @click="fillAll">全部</span>
            </template>
          </van-field>
        </div>

        <div class="profit-row">
          <div class="profit-left">
            <div class="profit-title">收益详情</div>
          </div>
          <div class="profit-date">2026-01-01 至 2026-01-01</div>
        </div>

        <div class="profit-grid">
          <div class="profit-item">
            <div class="profit-label">转入金额</div>
            <div class="profit-val">{{ amount || 0 }}元</div>
          </div>
          <div class="profit-item">
            <div class="profit-label">到期收益(本息合计)</div>
            <div class="profit-val">{{ calculateProfit() }}元</div>
          </div>
        </div>

        <van-button round block class="transfer-btn" @click="doTransfer">立即转入</van-button>

        <div class="agree-row">
          <van-checkbox v-model="agreed" icon-size="14" checked-color="var(--blue-deep)">
            已阅读并同意
          </van-checkbox>
          <span class="agree-link" @click="goAgreement">《民生保理财服务用户协议》</span>
        </div>
      </div>

      <div class="service-title">服务简介</div>
      <div class="service-card">
        <div class="service-content-box">
          <div class="service-text">
            为响应国家“共同富裕”战略号召，民生资产APP创新推出“民生保障补助金+民生保理财”双轨服务体系，通过“财政补贴+普惠金融”的联动模式，为中低收入家庭及参与国家重点项目建设的“追梦人群体提供”即时纾困+长效增收”的综合解决方案。
            针对传统金融服务难以触达的群体，以民生保障补助金缓解日常生活压力，同时通过民生保理财实现财富增值，形成“补贴保基本、理财促发展”的良性循环，让每一笔资金都能成为改变生活的起点。
            用户可通过每日签到、邀请好友等方式获取民生保障补助金；民生保理财服务起投金额仅需20,000元
            民生保障补助金，大幅降低理财门槛，真正惠及普通家庭。资金由财政专项托管账户监管，流向全程公开可追溯，严格符合国家补贴政策要求，确保资金安全与合规性。
            2025年试点期间，民生保将构建完整服务链：从补贴发放到理财增值，再到民生消费与经济内循环，形成”改善生活 积累财富 反哺社会”的可持续发展路径。
            民生保不仅是理财产品，更是国家与人民携手共进的纽带——以民生保障补助金温暖当下生活，以理财增值守护未来希望。我们致力于让每一位努力前行的追梦人，都能在时代浪潮中扎根成长，共享发展成果。
          </div>
        </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { getHmBao, investHmBao } from '@/api/assets'

const router = useRouter()

const terms = ref([])
const activeTerm = ref(0)
const amount = ref('')
const agreed = ref(false)
const showBalance = ref(false)
const showPasswordDialog = ref(false)
const payPassword = ref('')
const hmbaoData = ref({
  investmentAmount: 0,
  welfareSubsidy: 0,
  hmbaoPlanList: []
})

const loadHmBaoData = async () => {
  try {
    const res = await getHmBao()
    if (res.code === 200 && res.data) {
      hmbaoData.value = res.data
      terms.value = res.data.hmbaoPlanList?.map(p => p.period) || []
      if (terms.value.length > 0) {
        activeTerm.value = terms.value[0]
      }
    }
  } catch (error) {
    console.error('Failed to load hmBao data:', error)
  }
}

const currentPlan = computed(() => {
  return hmbaoData.value.hmbaoPlanList?.find(p => p.period === activeTerm.value) || {}
})

const calculateProfit = () => {
  if (!amount.value || !currentPlan.value.interestRate) return 0
  const principal = parseFloat(amount.value)
  const rate = currentPlan.value.interestRate / 100
  const days = currentPlan.value.period || 0
  const profit = principal * rate * days
  return (principal + profit).toFixed(2)
}

const goRecords = () => {
  router.push({ name: 'minsheng-treasure-records' })
}

const fillAll = () => {
  amount.value = hmbaoData.value.welfareSubsidy?.toString() || '0'
}

const goAgreement = () => {
  router.push({ name: 'hmbao-agreement' })
}

const doTransfer = async () => {
  if (!agreed.value) {
    showToast('已阅读并同意民生保理财服务用户协议')
    return
  }
  
  if (!amount.value || parseFloat(amount.value) <= 0) {
    showToast('请输入投资金额')
    return
  }
  
  const selectedPlan = hmbaoData.value.hmbaoPlanList?.find(p => p.period === activeTerm.value)
  if (!selectedPlan) {
    showToast('请选择投资方案')
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
  
  const selectedPlan = hmbaoData.value.hmbaoPlanList?.find(p => p.period === activeTerm.value)
  if (!selectedPlan) {
    showToast('请选择投资方案')
    return
  }
  
  try {
    const res = await investHmBao({
      amount: parseFloat(amount.value),
      hmbaoPlanId: selectedPlan.id,
      payPassword: payPassword.value
    })
    if (res.code === 200) {
      showToast('投资成功')
      // 关闭弹框
      showPasswordDialog.value = false
      // 重新加载数据
      loadHmBaoData()
      // 清空输入
      amount.value = ''
    } else {
      showToast(res.msg || '投资失败')
    }
  } catch (error) {
    console.error('Invest failed:', error)
    showToast('投资失败，请稍后重试')
  }
}

onMounted(() => {
  loadHmBaoData()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}
.header {
  height: 220px;
  background: url('@/assets/民生保/民生保底图.png') no-repeat center top;
  background-size: 100% 100%;
  position: relative;
  padding-top: 4px;
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
  margin-top: -80px;
  position: relative;
  z-index: 1;
}
.panel {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 10px 22px rgba(9, 68, 252, 0.18);
}
.panel-header {
  background: var(--blue-gradient);
  border-radius: 8px 8px 0 0;
  padding: 6px;
  margin: -12px -12px 12px -12px;
}
.term-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 6px 0 10px;
}
.term-pill {
  min-width: 100px;
  height: 36px;
  border-radius: 999px;
  background: #eef5ff;
  color: #2b7afb;
  font-size: var(--font-size-base);
  display: flex;
  align-items: center;
  justify-content: center;
}
.term-pill.active {
  background: #fff;
  box-shadow: 0 6px 14px rgba(9, 68, 252, 0.18);
  font-weight: 700;
}
.rate-row {
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
}
.rate-label {
  font-size: var(--font-size-small);
  color: #666;
}

.rate-value {
  color: #2b7afb;
  font-weight: 900;
  font-size: 28px;
  margin-top: 2px;
}

.rate-note {
  font-size: var(--font-size-small);
  color: #999;
  margin-top: 2px;
}
.balance-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.balance-box {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
}
.balance-name {
  font-size: var(--font-size-small);
  color: #333;
  font-weight: 700;
}
.balance-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.balance-num {
  margin-top: 6px;
  font-size: var(--font-size-base);
  font-weight: 900;
  color: #2b7afb;
}
.balance-sub {
  margin-top: 2px;
  font-size: var(--font-size-small);
  color: #2b7afb;
  transform: scale(0.9);
  transform-origin: left;
}
.detail-btn {
  height: var(--button-normal-height);
  background: var(--blue-gradient);
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: var(--font-size-base);
}
.transfer-panel {
  margin-top: 12px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 10px 22px rgba(9, 68, 252, 0.18);
}
.profit-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 2px 12px;
}
.profit-title {
  font-size: var(--font-size-base);
  font-weight: 800;
  color: #2b7afb;
}

.profit-date {
  font-size: var(--font-size-small);
  color: #8aa0b5;
  margin-top: 0;
}
.profit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}
.profit-item {
  background: transparent;
  border-radius: 0;
  padding: 0 12px;
  text-align: center;
}
.profit-label {
  font-size: var(--font-size-xs);
  color: #666;
}

.profit-val {
  margin-top: 6px;
  font-size: var(--font-size-base);
  font-weight: 900;
  color: #2b7afb;
}
.transfer-input {
  background: #f7f9fc;
  border-radius: 8px;
  overflow: hidden;
}
.amount-field {
  background: transparent;
}
.amount-field :deep(.van-field__control) {
  font-size: 14px;
  color: #2b7afb;
}
.amount-field :deep(.van-field__control) {
  font-size: var(--font-size-base);
  color: #2b7afb;
}

.all-btn {
  color: #2b7afb;
  font-weight: 700;
  font-size: var(--font-size-base);
  padding: 0 6px;
}
.agree-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  color: #333;
}
.transfer-btn {
  height: var(--button-normal-height);
  background: var(--blue-gradient);
  border: none;
  color: #fff;
  font-weight: 800;
  font-size: var(--font-size-base);
  box-shadow: 0 4px 12px rgba(9, 68, 252, 0.3);
}
.agree-link {
  margin-left: 6px;
  color: #2b7afb;
  font-weight: 700;
}
.service-title {
  margin: 12px auto -25px;
  width: 160px;
  height: 34px;
  background: url('@/assets/战略/标题.png') no-repeat center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 20px;
  position: relative;
  z-index: 2;
}
.service-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 24px 16px 16px;
  box-shadow: 0 10px 22px rgba(9, 68, 252, 0.18);
}
.service-content-box {
  background: #f7f9fc;
  border-radius: 8px;
  padding: 16px;
}
.service-text {
  font-size: var(--font-size-base);
  line-height: 2.0;
  color: #333;
  text-align: justify;
  text-indent: 2em;
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
  font-size: var(--font-size-base);
  color: #333;
  letter-spacing: 4px;
}

:deep(.van-dialog.password-dialog) {
  border-radius: 12px;
}

:deep(.van-dialog.password-dialog .van-dialog__header) {
  font-size: var(--font-size-base);
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
  height: var(--button-mini-height);
}

:deep(.van-dialog.password-dialog .van-dialog__cancel) {
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  height: var(--button-mini-height);
  margin-right: 8px;
}
</style>

