<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="积分商城"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="custom-nav-bar"
      />
    </div>

    <div class="content">
      <!-- Product Image -->
      <div class="product-hero">
        <van-image 
          v-if="detail.coverImg"
          :src="detail.coverImg" 
          fit="cover" 
          width="100%" 
          height="100%" 
        />
        <div v-else class="placeholder-img">暂无图片</div>
      </div>

      <!-- Product Info -->
      <div class="product-info-card">
        <div class="info-row">
          <div class="p-name">{{ detail.goodsName || '商品名称' }}</div>
        </div>
        <div class="info-row">
          <div class="p-score">{{ detail.score || 0 }}积分</div>
        </div>
        <div class="info-row" v-if="detail.tags">
          <div class="p-tags">
            <span v-for="(tag, index) in detail.tags?.split(',') || []" :key="index" class="p-tag">{{ tag }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="p-stock">商品库存 {{ detail.stock || 0 }} 件</div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="product-desc-card">
        <div class="desc-title">商品介绍</div>
        <div class="desc-content-wrapper">
          <!-- Rich Text Content -->
          <div class="rich-content" v-html="detail.content"></div>
          
          <!-- Detail Images -->
          <div class="detail-images" v-if="detailImages.length > 0">
            <van-image
              v-for="(img, index) in detailImages"
              :key="index"
              :src="img"
              width="100%"
              fit="contain"
              class="detail-img-item"
            />
          </div>
          
          <div v-if="!detail.content && detailImages.length === 0" class="desc-placeholder">
            暂无介绍
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="bottom-action">
      <div class="price-display">
        <span class="label">兑换所需积分:</span>
        <span class="points-label">{{ detail.score || 0 }}积分</span>
      </div>
      <van-button type="primary" class="redeem-btn" @click="showPopup = true">
        立即兑换
      </van-button>
    </div>

    <!-- Redemption Popup -->
    <van-popup
      v-model:show="showPopup"
      position="bottom"
      round
      class="redeem-popup"
    >
      <!-- Custom Header -->
      <div class="popup-header-banner">
        <div class="ph-logo">
          <div class="logo-circle"></div>
          <span class="ph-text">民生资产</span>
        </div>
        <div class="ph-slogan">本次兑换由民生资产为您提供</div>
      </div>

      <div class="popup-content">
        <!-- Product Row -->
        <div class="popup-product">
          <div class="pp-img">
            <van-image 
              v-if="detail.coverImg"
              :src="detail.coverImg" 
              fit="cover" 
              width="100%" 
              height="100%" 
              radius="4"
            />
          </div>
          <div class="pp-info">
            <div class="pp-name">{{ detail.goodsName }}</div>
            <div class="pp-price"><span class="pp-tag">{{ detail.score }}积分</span></div>
          </div>
        </div>

        <!-- Quantity Row -->
        <div class="form-row">
          <div class="row-label">兑换份数</div>
          <div class="row-right">
             <span class="my-points">我的积分：{{ detail.userScore || 0 }}积分</span>
          </div>
        </div>
        
        <!-- Stepper Row -->
        <div class="stepper-row">
           <van-stepper v-model="quantity" min="1" integer />
           <div class="stepper-label">{{ quantity }}份</div>
        </div>
        
        <!-- Total Row -->
        <div class="total-row">
          <span class="total-label">合计：</span>
          <span class="total-value">{{ totalPoints }}积分</span>
        </div>

        <!-- Address Row -->
        <div class="address-row" @click="selectAddress">
          <div v-if="currentAddress" class="addr-info">
            <div class="addr-top">
              <span class="addr-name">{{ currentAddress.realName }}</span>
              <span class="addr-phone">{{ currentAddress.phonenumber }}</span>
            </div>
            <div class="addr-detail">{{ currentAddress.address }}</div>
          </div>
          <div v-else class="addr-text">请选择收货地址</div>
          <van-icon name="arrow" />
        </div>

        <!-- Submit Button -->
        <div class="popup-footer">
          <van-button block type="primary" class="confirm-btn" :loading="submitting" @click="handleRedeem">
            立即兑换
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { showToast } from 'vant'
import { getGoodsDetail, goodsPay } from '@/api/assets'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const showPopup = ref(false)
const quantity = ref(1)
const detail = ref({})
const submitting = ref(false)

// 优先使用用户在地址管理中选择的地址，否则使用详情接口返回的默认地址
const currentAddress = computed(() => {
  return userStore.selectedAddress || detail.value.consumerAddress
})

const normalizeUrl = (url) => {
  if (!url) return ''
  return String(url).replace(/`/g, '').trim()
}

const detailImages = computed(() => {
  if (!detail.value.detailImg) return []
  // Handle comma separated list with potential backticks
  const cleanStr = normalizeUrl(detail.value.detailImg)
  if (!cleanStr) return []
  return cleanStr.split(',').map(url => url.trim()).filter(url => url)
})

const totalPoints = computed(() => {
  return quantity.value * (detail.value.score || 0)
})

const loadDetail = async () => {
  const id = route.params.id
  if (!id) {
    showToast('参数错误')
    return
  }
  
  try {
    const res = await getGoodsDetail(id)
    if (res.code === 200 && res.data) {
      const data = res.data
      // Normalize cover image
      data.coverImg = normalizeUrl(data.coverImg)
      detail.value = data
    } else {
      showToast(res.msg || '获取详情失败')
    }
  } catch (error) {
    console.error(error)
    showToast('获取详情失败')
  }
}

const selectAddress = () => {
  // 跳转到地址管理页面，并标记来源为 exchange
  // 同时传递当前已选地址的 ID，用于回显高亮
  // 还要传递 popup=1 标记，以便返回时知道要自动打开弹框
  const currentId = currentAddress.value?.id || ''
  console.log('Navigating to AddressManage with selectedId:', currentId) // Debug log
  router.push({
    name: 'address-manage',
    query: { 
      source: 'exchange',
      selectedId: String(currentId), // Ensure string for consistent comparison
      popup: '1'
    }
  })
}

const handleRedeem = async () => {
  if (!currentAddress.value) {
    showToast('请选择收货地址')
    router.push({ name: 'address-manage' })
    return
  }

  const cost = totalPoints.value
  const current = userStore.userInfo?.score || 0
  
  if (current < cost) {
    showToast('积分不足')
    return
  }
  
  submitting.value = true
  try {
    const res = await goodsPay({
      addressId: currentAddress.value.id,
      goodsId: detail.value.id,
      qty: quantity.value
    })
    
    if (res.code === 200) {
      showToast('兑换成功')
      showPopup.value = false
      userStore.setSelectedAddress(null) // 清除选择的地址
      // 刷新详情页（更新库存、积分等信息）
      loadDetail()
      // 主动刷新用户信息（特别是积分）
      userStore.refreshUserInfo()
    } else {
      showToast(res.msg || '兑换失败')
    }
  } catch (error) {
    console.error('Redeem failed:', error)
    showToast('兑换失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadDetail()
  userStore.refreshUserInfo()
  
  // 检查 URL 参数中是否有 popup=1，如果有则自动打开弹框
  if (route.query.popup === '1' || userStore.selectedAddress) {
    showPopup.value = true
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
  position: relative;
}

/* Custom Nav Bar */
:deep(.van-nav-bar) {
  background-color: transparent;
}
:deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
  font-size: var(--font-size-large);
}
:deep(.van-nav-bar__arrow) {
  color: #fff;
  font-size: 20px;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
  padding-bottom: 80px;
}

.product-hero {
  width: 100%;
  aspect-ratio: 16/9; /* Or square as per design? Screenshot looks square-ish or 4:3 */
  height: 250px;
  background: #d9d9d9;
}

.product-info-card {
  background: #fff;
  padding: 16px;
  margin-bottom: 12px;
}

.info-row {
  margin-bottom: 8px;
}

.p-name {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.p-score {
  color: #ff4d4f;
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 8px;
}

.p-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.p-tag {
  border: 1px solid #1890ff;
  background: #e6f7ff;
  color: #1890ff;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.p-stock {
  font-size: var(--font-size-xs);
  color: #666;
}

.product-desc-card {
  background: #fff;
  padding: 16px;
  min-height: 200px;
}

.desc-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

.desc-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.desc-placeholder {
  font-size: 14px;
  color: #999;
}

/* Bottom Action Bar */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  padding-bottom: calc(10px + constant(safe-area-inset-bottom));
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 99;
}

.price-display {
  display: flex;
  flex-direction: column;
}

.price-display .label {
  font-size: var(--font-size-xs);
}
.price-display .points-label {
  color: #ff4d4f;
  font-size: var(--font-size-base);
  font-weight: bold;
}

.redeem-btn {
  width: 120px;
  height: var(--button-normal-height);
  border-radius: 4px;
  font-size: var(--font-size-base);
  background: linear-gradient(to right, #ff6034, #ee0a24);
  border: none;
}

/* Popup Styles */
.redeem-popup {
  /* min-height: 400px; */
  overflow: visible;
}

.popup-header-banner {
  background: var(--blue-gradient);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.ph-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-circle {
  width: 24px;
  height: 24px;
  background: yellow; /* As per screenshot logo color seems reddish/yellow */
  border-radius: 50%;
  background: url('https://img.icons8.com/color/48/china-emblem.png') no-repeat center/contain; /* Mock emblem */
}

.ph-text {
  font-weight: bold;
  font-size: var(--font-size-small);
}

.ph-slogan {
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

.popup-content {
  padding: 16px;
}

.popup-product {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 16px;
}

.pp-img {
  width: 80px;
  height: 80px;
  background: #d9d9d9;
  border-radius: 4px;
}

.pp-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pp-name {
  font-size: var(--font-size-small);
  color: #333;
}

.pp-price {
  color: #ff4d4f;
  font-weight: bold;
}

.pp-tag {
  border: 1px solid #ff4d4f;
  font-size: var(--font-size-xs);
  padding: 0 4px;
  border-radius: 2px;
  margin-left: 4px;
  font-weight: normal;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.row-label {
  font-size: var(--font-size-small);
  color: #333;
  font-weight: bold;
}

.my-points {
  font-size: var(--font-size-xs);
  color: #666;
}

.stepper-row {
  display: flex;
  align-items: center;
  justify-content: space-between; /* To push stepper left or center? Screenshot shows stepper on left/center with label */
  /* Actually screenshot shows stepper is separate or integrated. 
     Let's put stepper on left.
  */
  margin-bottom: 20px;
}

.stepper-label {
  margin-left: 12px;
  font-size: var(--font-size-small);
  font-weight: bold;
}

.total-row {
  margin-bottom: 20px;
  font-size: var(--font-size-small);
}

.total-label {
  color: #ff4d4f;
  font-weight: bold;
}

.total-value {
  color: #ff4d4f;
  font-size: var(--font-size-base);
  font-weight: bold;
}

.address-row {
  background: #fff;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.addr-text {
  color: #999;
  font-size: var(--font-size-small);
}

.popup-footer {
  padding-bottom: 10px;
}

.confirm-btn {
  height: var(--button-normal-height);
  border-radius: 6px;
  font-size: var(--font-size-base);
  background: var(--blue-gradient);
  border: none;
}

.rich-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
}

.detail-images {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-img-item {
  width: 100%;
  height: auto;
  display: block;
}

.addr-info {
  flex: 1;
}

.addr-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.addr-name {
  font-weight: bold;
  font-size: var(--font-size-small);
  color: #333;
}

.addr-phone {
  font-size: var(--font-size-small);
  color: #666;
}

.addr-detail {
  font-size: var(--font-size-xs);
  color: #666;
  line-height: 1.4;
}
</style>