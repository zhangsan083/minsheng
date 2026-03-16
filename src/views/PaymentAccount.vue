<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="收款账户"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- Alipay Card (Bound) -->
      <div class="card alipay-card" v-if="alipayAccount">
        <div class="card-header">
          <span class="card-title">支付宝</span>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="label">真实姓名：</span>
            <span class="value">{{ alipayAccount.realName }}</span>
          </div>
          <div class="info-row">
            <span class="label">支付宝账号：</span>
            <span class="value">{{ alipayAccount.accountNum }}</span>
          </div>
        </div>
        <div class="card-action">
          <div class="action-btn" @click.stop="goBindAlipay">
            <van-icon name="arrow" color="#999" />
          </div>
        </div>
        <img :src="iconAlipayDecor" class="watermark-img" alt="alipay" />
      </div>

      <!-- Bank Card (Bound) -->
      <div class="card bank-card" v-if="bankAccount">
        <div class="card-header">
          <span class="card-title">{{ bankAccount.openName }}</span>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="label">真实姓名：</span>
            <span class="value">{{ bankAccount.realName }}</span>
          </div>
          <div class="info-row">
            <span class="label">银行卡号：</span>
            <span class="value">{{ bankAccount.accountNum }}</span>
          </div>
        </div>
        <div class="card-action">
          <div class="action-btn" @click.stop="goBindBankCard">
            <van-icon name="arrow" color="#999" />
          </div>
        </div>
        <img :src="iconUnionPayDecor" class="watermark-img" alt="unionpay" />
      </div>

      <!-- Add Alipay Card (Show if not bound) -->
      <div class="card add-card" v-if="!alipayAccount">
        <div class="add-icon-wrapper">
          <img :src="iconAlipayDecor" class="unionpay-bind-img" alt="alipay-bind" style="object-fit: contain;" />
        </div>
        <div class="add-info">
          <div class="add-title">支付宝添加</div>
          <div class="add-desc">支持绑定支付宝收款账户</div>
        </div>
        <div class="add-btn" @click="goBindAlipay">
          <van-icon name="plus" size="24" color="#999" />
        </div>
      </div>

      <!-- Add Bank Card (Show if not bound) -->
      <div class="card add-card" v-if="!bankAccount">
        <div class="add-icon-wrapper">
          <img :src="iconUnionPayBind" class="unionpay-bind-img" alt="unionpay-bind" />
        </div>
        <div class="add-info">
          <div class="add-title">银行卡添加</div>
          <div class="add-desc">支持各类银行卡/银联等个大商业银行卡</div>
        </div>
        <div class="add-btn" @click="goBindBankCard">
          <van-icon name="plus" size="24" color="#999" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast } from 'vant'
import { getAccountList } from '@/api/auth'

// Import assets
import iconAlipayDecor from '@/assets/收款账户/我的账户支付宝装饰.png'
import iconUnionPayDecor from '@/assets/收款账户/我的账户银联装饰.png'
import iconUnionPayBind from '@/assets/收款账户/绑定银联.png'

const router = useRouter()
const alipayAccount = ref(null)
const bankAccount = ref(null)

onMounted(async () => {
  await fetchAccountList()
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
      const list = res.data || []
      // accountType: 0银行卡 1支付宝
      alipayAccount.value = list.find(item => String(item.accountType) === '1') || null
      bankAccount.value = list.find(item => String(item.accountType) === '0') || null
    }
  } catch (error) {
    toast.close()
    console.error(error)
    showToast('获取账户信息失败')
  }
}

const goBindAlipay = () => {
  const id = alipayAccount.value?.id || ''
  router.push({ name: 'bind-alipay', query: { id } })
}

const goBindBankCard = () => {
  const id = bankAccount.value?.id || ''
  router.push({ name: 'bind-bank-card', query: { id } })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
}

.header-bg {
  background: var(--blue-gradient);
  height: 200px;
  padding-bottom: 20px;
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
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #4da9ff; /* Blue border for the first card as per image? Or maybe focus state. */
  border: 1px solid transparent; /* Default border */
}

/* Add blue border to first card to match reference image if needed, 
   but usually it's selection state. I'll stick to a subtle border or none.
   Wait, the first card in the image has a blue border. 
   I'll add a class for active state or just style all similarly.
   The image shows white cards. Let's keep it simple.
*/
.alipay-card, .bank-card {
  border: 1px solid #2979ff; /* Matching the blue border in the image for cards */
  height: 160px;
  display: flex;
  flex-direction: column;
}

.add-card {
  border: 1px solid #2979ff;
  display: flex;
  align-items: center;
  padding: 20px;
  height: 100px;
}

.card-header {
  margin-bottom: 12px;
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #333;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
  position: relative;
}

.info-row {
  display: flex;
  font-size: var(--font-size-small);
  color: #666;
  align-items: center;
}

.label {
  min-width: 80px;
  flex-shrink: 0;
}

.value {
  color: #333;
  font-size: var(--font-size-small);
}

.card-action {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  cursor: pointer;
}

.card-action .action-btn {
  width: 40px;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.watermark-img {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 80px;
  z-index: 1;
  opacity: 1;
}

/* Add Card Styling */
.add-icon-wrapper {
  margin-right: 16px;
}

.unionpay-bind-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.add-info {
  flex: 1;
}
.add-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
.add-desc {
  font-size: 12px;
  color: #999;
}
.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 10;
}
</style>
